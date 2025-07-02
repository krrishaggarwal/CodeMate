const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

/**
 * Exports a user's profile to a PDF file
 * @param {Object} user - User object with name, email, skills, etc.
 * @param {String} filePath - Path to save the PDF
 * @returns {Promise<String>} - File path of generated PDF
 */
const exportUserProfileToPDF = (user, filePath = 'UserProfile.pdf') => {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument();
            const fullPath = path.join(__dirname, '../exports', filePath);

            // Ensure export folder exists
            if (!fs.existsSync(path.dirname(fullPath))) {
                fs.mkdirSync(path.dirname(fullPath), { recursive: true });
            }

            const writeStream = fs.createWriteStream(fullPath);
            doc.pipe(writeStream);

            // Title
            doc.fontSize(20).text('User Profile', { align: 'center' }).moveDown(1.5);

            // User Details
            doc.fontSize(12);
            doc.text(`Name: ${user.name}`);
            doc.text(`Email: ${user.email}`);
            if (user.bio) doc.text(`Bio: ${user.bio}`);
            if (user.skills && user.skills.length)
                doc.text(`Skills: ${user.skills.join(', ')}`);
            if (user.github) doc.text(`GitHub: ${user.github}`);
            if (user.linkedin) doc.text(`LinkedIn: ${user.linkedin}`);

            doc.end();

            writeStream.on('finish', () => resolve(fullPath));
            writeStream.on('error', (err) => reject(err));
        } catch (err) {
            reject(err);
        }
    });
};

module.exports = { exportUserProfileToPDF };
