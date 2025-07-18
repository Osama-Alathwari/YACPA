// Server/controllers/memberController.js
import pool from '../db.js';
import { getRelativeFilePath, getAttachmentTypeId } from '../utils/memberHelpers.js';

const addMember = async (req, res) => {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const {
            fullNameArabic, fullNameEnglish, surname, idType, idNumber, qualification,
            businessName, businessType, headOfficeAddress, localBranchAddress,
            licenseNumber, licenseIssueDate, phone1, phone2, mobile, whatsapp, email,
            paymentMethod, referenceNumber, referenceDate, registrationFee,
            subscriptionFee, totalAmount, subscriptionYears, notes
        } = req.body;

        // Validate required fields
        const requiredFields = {
            fullNameArabic, fullNameEnglish, idType, idNumber, qualification,
            businessName, businessType, headOfficeAddress, licenseNumber,
            phone1, email, paymentMethod, referenceNumber, referenceDate, totalAmount
        };

        const missingFields = Object.entries(requiredFields)
            .filter(([key, value]) => !value)
            .map(([key]) => key);

        if (missingFields.length > 0) {
            await client.query('ROLLBACK');
            return res.status(400).json({
                success: false,
                message: 'حقول مطلوبة مفقودة',
                missingFields
            });
        }

        const fullname = fullNameArabic;
        const parsedLicenseDate = licenseIssueDate ? new Date(licenseIssueDate) : null;
        const parsedReferenceDate = new Date(referenceDate);

        const profileImagePath = req.files?.profileImage?.[0] ? getRelativeFilePath(req.files.profileImage[0].path) : null;
        const idImagePath = req.files?.idImage?.[0] ? getRelativeFilePath(req.files.idImage[0].path) : null;

        // 1. Insert member
        const memberQuery = `
            INSERT INTO members (
                fullname, surname, businessname, businesstypeid, headofficeaddress,
                localbranchaddress, email, licensenumber, licenseissuedate,
                idtypeid, idnumber, idimagepath, qualificationid, status,
                profileimagepath, createdbyuserid, createdat
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, CURRENT_TIMESTAMP)
            RETURNING id
        `;

        const memberValues = [
            fullname, surname || null, businessName, parseInt(businessType),
            headOfficeAddress, localBranchAddress || null, email, licenseNumber,
            parsedLicenseDate, parseInt(idType), idNumber, idImagePath,
            parseInt(qualification), 'Active', profileImagePath, req.user.userId
        ];

        const memberResult = await client.query(memberQuery, memberValues);
        const memberId = memberResult.rows[0].id;

        // 2. Insert contact information
        // Replace the existing contact query with multiple inserts for each contact type
        const contactTypes = [
            { type: 'Phone1', value: phone1, isPrimary: true },
            { type: 'Phone2', value: phone2, isPrimary: false },
            { type: 'Mobile', value: mobile, isPrimary: false },
            { type: 'WhatsApp', value: whatsapp, isPrimary: false },
            { type: 'Email', value: email, isPrimary: false }
        ];

        const contactQuery = `
            INSERT INTO contactinformation (memberid, contacttype, contactvalue, isprimary)
            VALUES ($1, $2, $3, $4)
        `;

        for (const contact of contactTypes) {
            if (contact.value) {
                await client.query(contactQuery, [
                    memberId,
                    contact.type,
                    contact.value,
                    contact.isPrimary
                ]);
            }
        }

        // 3. Insert payment
        const paymentQuery = `
            INSERT INTO payments (memberid, paymenttypeid, paymentpurposeid, amount, referencenumber, referencedate, notes, createdbyuserid)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING id
        `;
        const paymentValues = [memberId, parseInt(paymentMethod), 1, parseFloat(totalAmount), referenceNumber, parsedReferenceDate, notes || null, req.user.userId];
        const paymentResult = await client.query(paymentQuery, paymentValues);
        const paymentId = paymentResult.rows[0].id;

        // 4. Insert subscriptions
        if (subscriptionYears) {
            const years = Array.isArray(subscriptionYears) ? subscriptionYears : JSON.parse(subscriptionYears);
            for (const year of years) {
                const subscriptionQuery = `
                    INSERT INTO subscriptions (memberid, paymentid, subscriptionyear, startdate, enddate, isactive)
                    VALUES ($1, $2, $3, $4, $5, $6)
                `;
                const startDate = new Date(year, 0, 1);
                const endDate = new Date(year, 11, 31);
                await client.query(subscriptionQuery, [memberId, paymentId, year, startDate, endDate, true]);
            }
        }

        // 5. Insert attachments
        const fileFields = ['licenseImage', 'degreeImage', 'signatureImage', 'paymentReceipt'];
        for (const fieldName of fileFields) {
            if (req.files?.[fieldName]?.[0]) {
                const file = req.files[fieldName][0];
                const attachmentTypeId = getAttachmentTypeId(fieldName);
                if (attachmentTypeId) {
                    const attachmentQuery = `
                        INSERT INTO attachments (memberid, attachmenttypeid, filepath, uploadedbyuserid)
                        VALUES ($1, $2, $3, $4)
                    `;
                    await client.query(attachmentQuery, [memberId, attachmentTypeId, getRelativeFilePath(file.path), req.user.userId]);
                }
            }
        }

        await client.query('COMMIT');

        res.status(201).json({
            success: true,
            message: 'تم إنشاء العضو بنجاح',
            data: {
                memberId,
                paymentId,
                fullname,
                businessName,
                email,
                status: 'Active',
                subscriptionYears: subscriptionYears ? (Array.isArray(subscriptionYears) ? subscriptionYears : JSON.parse(subscriptionYears)) : [],
                totalAmount: parseFloat(totalAmount)
            }
        });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Add Member Error:', error);

        res.status(500).json({
            success: false,
            message: 'خطأ في إنشاء العضو',
            error: process.env.NODE_ENV === 'development' ? error.message : 'خطأ داخلي في الخادم'
        });
    } finally {
        client.release();
    }
};

export default { addMember };