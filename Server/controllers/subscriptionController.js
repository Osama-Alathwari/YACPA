// Server/controllers/subscriptionController.js
import pool from '../db.js';

const getExpiringSubscriptions = async (req, res) => {
    try {
        // Get days parameter from query string (default to 90 days)
        const days = parseInt(req.query.days) || 365;

        const query = `
            SELECT 
                s.id as subscription_id,
                m.id as member_id,
                m.fullname || COALESCE(' ' || m.surname, '') as member_name,
                m.businessname,
                s.enddate,
                CURRENT_DATE - s.enddate as days_past_expiry,
                s.enddate - CURRENT_DATE as days_remaining,
                CASE 
                    WHEN s.enddate >= CURRENT_DATE AND s.isactive = true THEN 'active'
                    WHEN s.enddate < CURRENT_DATE THEN 'expired'
                    ELSE 'inactive'
                END as status,
                p.referencedate as last_payment_date,
                p.amount as last_payment_amount
            FROM subscriptions s
            INNER JOIN members m ON s.memberid = m.id
            LEFT JOIN payments p ON s.paymentid = p.id
            WHERE s.isactive = true 
                AND s.enddate BETWEEN CURRENT_DATE AND (CURRENT_DATE + INTERVAL '${days} days')
            ORDER BY s.enddate ASC, m.fullname ASC
        `;

        const result = await pool.query(query);

        const expiringSubscriptions = result.rows.map(row => ({
            id: `SUB${row.subscription_id.toString().padStart(4, '0')}`,
            memberId: `M${row.member_id.toString().padStart(4, '0')}`,
            memberName: row.member_name,
            businessName: row.businessname,
            endDate: row.enddate ? new Date(row.enddate).toLocaleDateString('sv-SE') : null,
            daysRemaining: parseInt(row.days_remaining) || 0,
            status: row.status,
            lastPaymentDate: row.last_payment_date ? new Date(row.last_payment_date).toLocaleDateString('sv-SE') : null,
            lastPaymentAmount: parseFloat(row.last_payment_amount) || 0
        }));

        res.json({
            success: true,
            data: expiringSubscriptions
        });

    } catch (error) {
        console.error('Error fetching expiring subscriptions:', error);
        res.status(500).json({
            success: false,
            message: 'خطأ في استرجاع الاشتراكات المنتهية الصلاحية',
            error: process.env.NODE_ENV === 'development' ? error.message : 'خطأ داخلي في الخادم'
        });
    }
};

const getExpiredSubscriptions = async (req, res) => {
    try {
        const query = `
            SELECT 
                s.id as subscription_id,
                m.id as member_id,
                m.fullname || COALESCE(' ' || m.surname, '') as member_name,
                m.businessname,
                m.email,
                c.contactvalue as phone,
                'inactive' as status,
                s.enddate as subscription_end_date,
                CURRENT_DATE - s.enddate as expired_days,
                p.referencedate as last_payment_date,
                p.amount as last_payment_amount,
                CAST(ss.settingvalue AS NUMERIC) * GREATEST(1, CEIL((CURRENT_DATE - s.enddate)::numeric / 365)) as total_owed,
                s.enddate + INTERVAL '30 days' as grace_period_ended,
                CASE 
                    WHEN CURRENT_DATE - s.enddate <= 30 THEN 1
                    WHEN CURRENT_DATE - s.enddate <= 60 THEN 2
                    WHEN CURRENT_DATE - s.enddate <= 90 THEN 3
                    WHEN CURRENT_DATE - s.enddate <= 180 THEN 4
                    WHEN CURRENT_DATE - s.enddate <= 365 THEN 6
                    ELSE 8
                END as notifications_sent,
                CASE 
                    WHEN CURRENT_DATE - s.enddate < 1095 THEN true  -- Less than 3 years
                    ELSE false
                END as can_renew
            FROM subscriptions s
            INNER JOIN members m ON s.memberid = m.id
            LEFT JOIN payments p ON s.paymentid = p.id
            LEFT JOIN contactinformation c ON m.id = c.memberid 
                AND c.contacttype = 'Mobile'
            CROSS JOIN systemsettings ss
            WHERE s.enddate < CURRENT_DATE
                AND ss.settingkey = 'AnnualSubscriptionFee'
                AND m.id NOT IN (
                    SELECT DISTINCT memberid 
                    FROM subscriptions 
                    WHERE enddate >= CURRENT_DATE AND isactive = true
                )
            ORDER BY s.enddate DESC, m.fullname ASC
        `;

        const result = await pool.query(query);

        const expiredSubscriptions = result.rows.map(row => ({
            id: `SUB${row.subscription_id.toString().padStart(4, '0')}`,
            member: {
                id: `M${row.member_id.toString().padStart(4, '0')}`,
                name: row.member_name,
                businessName: row.businessname || '',
                email: row.email || '',
                phone: row.phone || '',
                status: row.status
            },
            subscriptionEndDate: row.subscription_end_date ?
                new Date(row.subscription_end_date).toLocaleDateString('sv-SE') : null,
            expiredDays: parseInt(row.expired_days) || 0,
            lastPaymentDate: row.last_payment_date ?
                new Date(row.last_payment_date).toLocaleDateString('sv-SE') : null,
            lastPaymentAmount: parseFloat(row.last_payment_amount) || 0,
            totalOwed: parseFloat(row.total_owed) || 0,
            gracePeriodEnded: row.grace_period_ended ?
                new Date(row.grace_period_ended).toLocaleDateString('sv-SE') : null,
            notificationsSent: parseInt(row.notifications_sent) || 0,
            canRenew: row.can_renew
        }));

        res.json({
            success: true,
            data: expiredSubscriptions
        });

    } catch (error) {
        console.error('Error fetching expired subscriptions:', error);
        res.status(500).json({
            success: false,
            message: 'خطأ في استرجاع الاشتراكات المنتهية الصلاحية',
            error: process.env.NODE_ENV === 'development' ? error.message : 'خطأ داخلي في الخادم'
        });
    }
};

const getMembersForRenewal = async (req, res) => {
    try {
        const query = `
            SELECT 
                m.id,
                m.fullname || COALESCE(' ' || m.surname, '') as name,
                m.businessname as business,
                s.enddate as subscription_end,
                CAST(ss.settingvalue AS NUMERIC) as annual_subscription_fee,
                CASE 
                    WHEN s.enddate >= CURRENT_DATE AND s.isactive = true THEN 'active'
                    WHEN s.enddate < CURRENT_DATE THEN 'expired'
                    ELSE 'inactive'
                END as status,
                m.profileimagepath as profile_image,
                m.email,
                -- Contact Information
                phone1.contactvalue as phone1,
                phone2.contactvalue as phone2,
                mobile.contactvalue as mobile,
                whatsapp.contactvalue as whatsapp
            FROM members m
            LEFT JOIN (
                SELECT DISTINCT ON (memberid) *
                FROM subscriptions
                ORDER BY memberid, enddate DESC
            ) s ON m.id = s.memberid
            -- Contact Information JOINs
            LEFT JOIN contactinformation phone1 ON m.id = phone1.memberid AND phone1.contacttype = 'Phone1'
            LEFT JOIN contactinformation phone2 ON m.id = phone2.memberid AND phone2.contacttype = 'Phone2'
            LEFT JOIN contactinformation mobile ON m.id = mobile.memberid AND mobile.contacttype = 'Mobile'
            LEFT JOIN contactinformation whatsapp ON m.id = whatsapp.memberid AND whatsapp.contacttype = 'WhatsApp'
            CROSS JOIN systemsettings ss
            WHERE ss.settingkey = 'AnnualSubscriptionFee'
            ORDER BY m.fullname ASC
        `;

        const result = await pool.query(query);

        // Format the data to match frontend expectations
        const members = result.rows.map(member => ({
            id: member.id,
            name: member.name,
            business: member.business,
            email: member.email,
            phone1: member.phone1,
            phone2: member.phone2,
            mobile: member.mobile,
            whatsapp: member.whatsapp,
            subscriptionEnd: member.subscription_end ?
                new Date(member.subscription_end).toISOString().split('T')[0] : null,
            status: member.status,
            annualFee: parseFloat(member.annual_subscription_fee) || 0,
            profileImage: member.profile_image
        }));

        res.json({
            success: true,
            data: members,
            annualFee: members.length > 0 ? parseFloat(members[0].annual_subscription_fee) || 0 : 0
        });

    } catch (error) {
        console.error('Error fetching members for renewal:', error);
        res.status(500).json({
            success: false,
            message: 'خطأ في استرجاع بيانات الأعضاء للتجديد',
            error: process.env.NODE_ENV === 'development' ? error.message : 'خطأ داخلي في الخادم'
        });
    }
};

const renewSubscription = async (req, res) => {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const {
            memberId,
            subscriptionPeriod,
            paymentMethod,
            amount,
            referenceNumber,
            referenceDate,
            notes
        } = req.body;

        // Validate required fields
        if (!memberId || !subscriptionPeriod || !paymentMethod || !amount) {
            return res.status(400).json({
                success: false,
                message: 'البيانات المطلوبة غير مكتملة'
            });
        }

        // Get current member subscription end date
        const memberQuery = 'SELECT enddate FROM subscriptions WHERE memberid = $1 ORDER BY enddate DESC LIMIT 1';
        const memberResult = await client.query(memberQuery, [memberId]);

        if (memberResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'العضو غير موجود'
            });
        }

        const currentEndDate = new Date(memberResult.rows[0].enddate);
        const today = new Date();

        // Calculate new subscription end date
        // If current subscription is still active, extend from current end date
        // If expired, extend from today
        const baseDate = currentEndDate > today ? currentEndDate : today;
        const newEndDate = new Date(baseDate);
        newEndDate.setFullYear(newEndDate.getFullYear() + subscriptionPeriod);

        // First insert payment record
        const paymentQuery = `
            INSERT INTO payments (
                memberid, 
                amount,
                referencenumber,
                referencedate,
                paymenttypeid,
                paymentpurposeid,
                notes
            ) VALUES ($1, $2, $3, $4, 
                (SELECT id FROM paymenttypes WHERE name = $5),
                (SELECT id FROM paymentpurposes WHERE name = 'تجديد'),
                $6)
            RETURNING id
        `;

        const paymentValues = [
            memberId,
            amount,
            referenceNumber,
            referenceDate || new Date(),
            paymentMethod,
            notes
        ];

        const paymentResult = await client.query(paymentQuery, paymentValues);

        // Insert subscription renewal record
        const renewalQuery = `
            INSERT INTO subscriptions (
                memberid, 
                startdate,
                enddate,
                paymentid,
                isactive
            ) VALUES ($1, $2, $3, $4, true)
            RETURNING id
        `;

        const renewalValues = [
            memberId,
            baseDate,
            newEndDate,
            paymentResult.rows[0].id
        ];

        const renewalResult = await client.query(renewalQuery, renewalValues);

        await client.query('COMMIT');

        res.json({
            success: true,
            message: 'تم تجديد الاشتراك بنجاح',
            data: {
                renewalId: renewalResult.rows[0].id,
                newEndDate: newEndDate
            }
        });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error processing subscription renewal:', error);
        res.status(500).json({
            success: false,
            message: 'خطأ في تجديد الاشتراك'
        });
    } finally {
        client.release();
    }
};


export default {
    getExpiringSubscriptions,
    getExpiredSubscriptions,
    getMembersForRenewal,
    renewSubscription
};