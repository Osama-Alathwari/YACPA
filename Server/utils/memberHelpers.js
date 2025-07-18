// Server/utils/memberHelpers.js
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let uploadPath = '';

        switch (file.fieldname) {
            case 'profileImage':
                uploadPath = path.join(__dirname, `../uploads/users/${req.user.userId}/profile`);
                break;
            case 'idImage':
                uploadPath = path.join(__dirname, `../uploads/users/${req.user.userId}/documents/ids`);
                break;
            case 'licenseImage':
                uploadPath = path.join(__dirname, `../uploads/users/${req.user.userId}/documents/licenses`);
                break;
            case 'degreeImage':
                uploadPath = path.join(__dirname, `../uploads/users/${req.user.userId}/documents/degrees`);
                break;
            case 'signatureImage':
                uploadPath = path.join(__dirname, `../uploads/users/${req.user.userId}/documents/signatures`);
                break;
            case 'paymentReceipt':
                uploadPath = path.join(__dirname, `../uploads/users/${req.user.userId}/receipts`);
                break;
            default:
                uploadPath = path.join(__dirname, `../uploads/users/${req.user.userId}/misc`);
        }

        fs.mkdirSync(uploadPath, { recursive: true });
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = {
        profileImage: /jpeg|jpg|png|gif/,
        idImage: /jpeg|jpg|png|pdf/,
        licenseImage: /jpeg|jpg|png|pdf/,
        degreeImage: /jpeg|jpg|png|pdf/,
        signatureImage: /jpeg|jpg|png|pdf/,
        paymentReceipt: /jpeg|jpg|png|pdf/
    };

    const fileExt = path.extname(file.originalname).toLowerCase();
    const isAllowed = allowedTypes[file.fieldname]?.test(fileExt.slice(1));

    if (isAllowed) {
        cb(null, true);
    } else {
        cb(new Error(`Invalid file type for ${file.fieldname}`));
    }
};

export const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
        files: 6
    }
});

export const uploadFields = upload.fields([
    { name: 'profileImage', maxCount: 1 },
    { name: 'idImage', maxCount: 1 },
    { name: 'licenseImage', maxCount: 1 },
    { name: 'degreeImage', maxCount: 1 },
    { name: 'signatureImage', maxCount: 1 },
    { name: 'paymentReceipt', maxCount: 1 }
]);

export const getRelativeFilePath = (filePath) => {
    const uploadsIndex = filePath.indexOf('uploads');
    return uploadsIndex !== -1 ? filePath.substring(uploadsIndex) : filePath;
};

export const getAttachmentTypeId = (fieldName) => {
    const attachmentTypes = {
        licenseImage: 1,
        degreeImage: 2,
        signatureImage: 3,
        profileImage: 4,
        paymentReceipt: 5,
        idImage: 6
    };
    return attachmentTypes[fieldName] || null;
};