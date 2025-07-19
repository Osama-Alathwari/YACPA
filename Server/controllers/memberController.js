// Server/controllers/memberController.js
import pool from '../db.js';
import { getAttachmentTypeId } from '../utils/memberHelpers.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
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

        // 1. Insert member first (without file paths)
        const memberQuery = `
            INSERT INTO members (
                fullname, surname, businessname, businesstypeid, headofficeaddress,
                localbranchaddress, email, licensenumber, licenseissuedate,
                idtypeid, idnumber, qualificationid, status,
                createdbyuserid, createdat
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, CURRENT_TIMESTAMP)
            RETURNING id
        `;

        const memberValues = [
            fullname, surname || null, businessName, parseInt(businessType),
            headOfficeAddress, localBranchAddress || null, email, licenseNumber,
            parsedLicenseDate, parseInt(idType), idNumber,
            parseInt(qualification), 'Active', req.user.userId
        ];

        const memberResult = await client.query(memberQuery, memberValues);
        const memberId = memberResult.rows[0].id;

        // 2. Handle file uploads with member ID
        let profileImagePath = null;
        let idImagePath = null;

        if (req.files) {
            // Create member directory
            const memberUploadPath = path.join(__dirname, `../uploads/${memberId}`);
            fs.mkdirSync(memberUploadPath, { recursive: true });

            // Move and rename files to member directory
            const filePromises = [];

            Object.entries(req.files).forEach(([fieldName, files]) => {
                if (files && files[0]) {
                    const file = files[0];
                    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                    const ext = path.extname(file.originalname);
                    const newFileName = `${fieldName}-${uniqueSuffix}${ext}`;
                    const newFilePath = path.join(memberUploadPath, newFileName);

                    // Move file from temp location to member directory
                    const movePromise = fs.promises.rename(file.path, newFilePath).then(() => {
                        const relativePath = `uploads/${memberId}/${newFileName}`;

                        // Store paths for database update
                        if (fieldName === 'profileImage') {
                            profileImagePath = relativePath;
                        } else if (fieldName === 'idImage') {
                            idImagePath = relativePath;
                        }

                        return { fieldName, relativePath, file };
                    });

                    filePromises.push(movePromise);
                }
            });

            // Wait for all files to be moved
            const movedFiles = await Promise.all(filePromises);

            // 3. Update member with file paths
            if (profileImagePath || idImagePath) {
                const updateMemberQuery = `
                    UPDATE members SET 
                        profileimagepath = COALESCE($1, profileimagepath),
                        idimagepath = COALESCE($2, idimagepath)
                    WHERE id = $3
                `;
                await client.query(updateMemberQuery, [profileImagePath, idImagePath, memberId]);
            }

            // 4. Insert attachments for other files
            const attachmentPromises = movedFiles
                .filter(({ fieldName }) => !['profileImage', 'idImage'].includes(fieldName))
                .map(({ fieldName, relativePath }) => {
                    const attachmentTypeId = getAttachmentTypeId(fieldName);
                    if (attachmentTypeId) {
                        const attachmentQuery = `
                            INSERT INTO attachments (memberid, attachmenttypeid, filepath, uploadedbyuserid)
                            VALUES ($1, $2, $3, $4)
                        `;
                        return client.query(attachmentQuery, [memberId, attachmentTypeId, relativePath, req.user.userId]);
                    }
                });

            await Promise.all(attachmentPromises.filter(Boolean));
        }

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
                let startDate = null;
                let endDate = null;
                let isactive = false;
                if (year === 2024) {
                    startDate = new Date(year, 0, 1);
                    endDate = new Date(year, 11, 31);
                } else {
                    const today = new Date();              // Today's date: 18/7/2025
                    startDate = today;
                    endDate = new Date(today);
                    endDate.setFullYear(endDate.getFullYear() + 1);
                    endDate.setDate(endDate.getDate() - 1); // Make it exactly one year minus 1 day: 17/7/2026
                    isactive = true;
                }
                await client.query(subscriptionQuery, [memberId, paymentId, year, startDate, endDate, isactive]);
            }
        }

        // 5. Insert attachments
        // const fileFields = ['licenseImage', 'degreeImage', 'signatureImage', 'paymentReceipt'];
        // for (const fieldName of fileFields) {
        //     if (req.files?.[fieldName]?.[0]) {
        //         const file = req.files[fieldName][0];
        //         const attachmentTypeId = getAttachmentTypeId(fieldName);
        //         if (attachmentTypeId) {
        //             const attachmentQuery = `
        //                 INSERT INTO attachments (memberid, attachmenttypeid, filepath, uploadedbyuserid)
        //                 VALUES ($1, $2, $3, $4)
        //             `;
        //             await client.query(attachmentQuery, [memberId, attachmentTypeId, getRelativeFilePath(file.path), req.user.userId]);
        //         }
        //     }
        // }

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

const getMembers = async (req, res) => {
    try {
        const query = `
            SELECT 
                m.id,
                m.fullname,
                m.surname,
                m.businessname,
                bt.name as businesstype,
                m.email,
                ci.contactvalue as phone,
                s.enddate as subscriptionenddate,
                CASE 
                    WHEN s.enddate >= CURRENT_DATE AND s.isactive = true THEN 'active'
                    WHEN s.enddate < CURRENT_DATE THEN 'inactive'
                    ELSE 'pending'
                END as status
            FROM members m
            LEFT JOIN businesstypes bt ON m.businesstypeid = bt.id
            LEFT JOIN contactinformation ci ON m.id = ci.memberid AND ci.isprimary = true
            LEFT JOIN subscriptions s ON m.id = s.memberid AND s.isactive = true
            ORDER BY m.id DESC
        `;

        const result = await pool.query(query);

        const formattedMembers = result.rows.map(row => ({
            id: `M${row.id.toString().padStart(4, '0')}`,
            fullName: row.fullname + ' ' + row.surname,
            businessName: row.businessname,
            businessType: row.businesstype,
            email: row.email,
            phone: row.phone || '',
            subscriptionEndDate: row.subscriptionenddate ?
                new Date(row.subscriptionenddate).toLocaleDateString('sv-SE').split('T')[0] : null,
            status: row.status
        }));

        res.json({
            success: true,
            data: formattedMembers
        });

    } catch (error) {
        console.error('Error fetching members:', error);
        res.status(500).json({
            success: false,
            message: 'خطأ في استرجاع بيانات الأعضاء',
            error: error.message
        });
    }
};

// Add this to Server/controllers/memberController.js

const getMember = async (req, res) => {
    try {
        const { id } = req.params;
        // Extract numeric ID from the formatted ID (e.g., "M1001" -> 1001)
        const numericId = parseInt(id.replace('M', ''));

        if (!numericId || isNaN(numericId)) {
            return res.status(400).json({
                success: false,
                message: 'معرف العضو غير صالح'
            });
        }

        // Main member query with joins
        const memberQuery = `
            SELECT 
                m.id,
                m.fullname,
                m.surname,
                m.businessname,
                bt.name as businesstype,
                m.email,
                m.headofficeaddress,
                m.localbranchaddress,
                m.licensenumber,
                m.licenseissuedate,
                it.name as idtype,
                m.idnumber,
                q.name as qualification,
                m.profileimagepath,
                m.idimagepath,
                m.status,
                m.createdat,
                u.username as createdby
            FROM members m
            LEFT JOIN businesstypes bt ON m.businesstypeid = bt.id
            LEFT JOIN idtypes it ON m.idtypeid = it.id
            LEFT JOIN qualifications q ON m.qualificationid = q.id
            LEFT JOIN users u ON m.createdbyuserid = u.id
            WHERE m.id = $1
        `;

        const memberResult = await pool.query(memberQuery, [numericId]);

        if (memberResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'العضو غير موجود'
            });
        }

        const memberData = memberResult.rows[0];

        // Get contact information
        const contactQuery = `
            SELECT contacttype, contactvalue, isprimary
            FROM contactinformation
            WHERE memberid = $1
        `;
        const contactResult = await pool.query(contactQuery, [numericId]);

        // Get attachments
        const attachmentQuery = `
            SELECT 
                at.name as type,
                a.filepath as path,
                a.uploadedat as uploaddate
            FROM attachments a
            LEFT JOIN attachmenttypes at ON a.attachmenttypeid = at.id
            WHERE a.memberid = $1
        `;
        const attachmentResult = await pool.query(attachmentQuery, [numericId]);

        // Get subscriptions with payments
        const subscriptionQuery = `
            SELECT 
                s.id,
                s.startdate,
                s.enddate,
                s.paymentid,
                s.isactive
            FROM subscriptions s
            WHERE s.memberid = $1
            ORDER BY s.startdate DESC
        `;
        const subscriptionResult = await pool.query(subscriptionQuery, [numericId]);

        // Get payments
        const paymentQuery = `
            SELECT 
                p.id,
                p.referencedate as date,
                p.amount,
                pp.name as type,
                p.referencenumber,
                pt.name as paymentmethod,
                p.notes
            FROM payments p
            LEFT JOIN paymentpurposes pp ON p.paymentpurposeid = pp.id
            LEFT JOIN paymenttypes pt ON p.paymenttypeid = pt.id
            WHERE p.memberid = $1
            ORDER BY p.referencedate DESC
        `;
        const paymentResult = await pool.query(paymentQuery, [numericId]);

        // Process contact information
        const contacts = contactResult.rows.reduce((acc, contact) => {
            const type = contact.contacttype.toLowerCase();
            if (type === 'phone1') acc.phone1 = contact.contactvalue;
            else if (type === 'phone2') acc.phone2 = contact.contactvalue;
            else if (type === 'mobile') acc.mobile = contact.contactvalue;
            else if (type === 'whatsapp') acc.whatsapp = contact.contactvalue;
            return acc;
        }, {});

        // Process attachments
        const attachments = attachmentResult.rows.map(att => ({
            type: att.type?.toLowerCase() || 'unknown',
            path: att.path,
            uploadDate: att.uploaddate ? new Date(att.uploaddate).toLocaleDateString('sv-SE').split('T')[0] : null
        }));

        // Process subscriptions
        const subscriptions = subscriptionResult.rows.map(sub => ({
            id: `SUB${sub.id.toString().padStart(4, '0')}`,
            startDate: sub.startdate ? new Date(sub.startdate).toLocaleDateString('sv-SE').split('T')[0] : null,
            endDate: sub.enddate ? new Date(sub.enddate).toLocaleDateString('sv-SE').split('T')[0] : null,
            paymentId: sub.paymentid ? `P${sub.paymentid.toString().padStart(4, '0')}` : null,
            isActive: sub.isactive
        }));

        // Process payments
        const payments = paymentResult.rows.map(payment => ({
            id: `P${payment.id.toString().padStart(4, '0')}`,
            date: payment.date ? new Date(payment.date).toLocaleDateString('sv-SE').split('T')[0] : null,
            amount: parseFloat(payment.amount) || 0,
            type: payment.type || 'unknown',
            referenceNumber: payment.referencenumber,
            paymentMethod: payment.paymentmethod || 'unknown',
            notes: payment.notes
        }));

        // Build the response object matching the required format
        const member = {
            id: `M${memberData.id.toString().padStart(4, '0')}`,
            fullName: `${memberData.fullname}${memberData.surname ? ' ' + memberData.surname : ''}`,
            businessName: memberData.businessname,
            businessType: memberData.businesstype,
            email: memberData.email,
            phone1: contacts.phone1 || null,
            phone2: contacts.phone2 || null,
            mobile: contacts.mobile || null,
            whatsapp: contacts.whatsapp || null,
            idType: memberData.idtype,
            idNumber: memberData.idnumber,
            qualification: memberData.qualification,
            headOfficeAddress: memberData.headofficeaddress,
            localBranchAddress: memberData.localbranchaddress,
            licenseNumber: memberData.licensenumber,
            licenseIssueDate: memberData.licenseissuedate ?
                new Date(memberData.licenseissuedate).toLocaleDateString('sv-SE').split('T')[0] : null,
            profileImagePath: memberData.profileimagepath,
            idImagePath: memberData.idimagepath,
            attachments,
            status: memberData.status?.toLowerCase() || 'pending',
            createdAt: memberData.createdat ?
                new Date(memberData.createdat).toLocaleDateString('sv-SE').split('T')[0] : null,
            createdBy: memberData.createdby,
            subscriptions,
            payments
        };

        res.json({
            success: true,
            data: member
        });

    } catch (error) {
        console.error('Error fetching member:', error);
        res.status(500).json({
            success: false,
            message: 'خطأ في استرجاع بيانات العضو',
            error: error.message
        });
    }
};

export default { addMember, getMembers, getMember };
