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

export default { getExpiringSubscriptions };