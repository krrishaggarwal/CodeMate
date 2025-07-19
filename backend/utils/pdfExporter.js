const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

/**
 * Exports a user's profile to a PDF file
 * @param {Object} user - User object with name, email, skills, bio, etc.
 * @param {String} filePath - Path to save the PDF
 * @returns {Promise<String>} - File path of generated PDF
 */
const exportUserProfileToPDF = (user, filePath = 'UserProfile.pdf') => {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument();
        const fullPath = path.join(__dirname, '../exports', filePath);

        // Ensure the export directory exists
        const exportDir = path.dirname(fullPath);
        if (!fs.existsSync(exportDir)) {
            fs.mkdirSync(exportDir, { recursive: true });
        }

        const writeStream = fs.createWriteStream(fullPath);
        doc.pipe(writeStream);

        // PDF Title
        doc.fontSize(20).text('User Profile', { align: 'center' }).moveDown(1.5);

        // Basic Info
        doc.fontSize(12).text(`Name: ${user.name || 'N/A'}`);
        doc.text(`Email: ${user.email || 'N/A'}`);
        if (user.location) doc.text(`Location: ${user.location}`);
        if (user.website) doc.text(`Website: ${user.website}`);
        if (user.createdAt)
            doc.text(`Joined: ${new Date(user.createdAt).toLocaleDateString()}`);
        if (user.bio) {
            doc.moveDown(0.5).text(`Bio: ${user.bio}`);
        }

        // Skills
        if (user.skills && user.skills.length) {
            doc.moveDown(0.5).text(`Skills: ${user.skills.join(', ')}`);
        }

        // Social Links
        if (user.github) doc.text(`GitHub: ${user.github}`);
        if (user.linkedin) doc.text(`LinkedIn: ${user.linkedin}`);

        // Projects (if any)
        if (user.projects && user.projects.length) {
            doc.moveDown().fontSize(14).text('Projects:', { underline: true });
            user.projects.forEach((project, index) => {
                doc.fontSize(12).moveDown(0.5);
                doc.text(`${index + 1}. ${project.title || 'Untitled'}`);
                if (project.description) doc.text(`   • ${project.description}`);
                if (project.technologies?.length)
                    doc.text(`   • Tech: ${project.technologies.join(', ')}`);
                if (project.github) doc.text(`   • GitHub: ${project.github}`);
                if (project.live) doc.text(`   • Live: ${project.live}`);
            });
        }

        // Finalize PDF
        doc.end();

        writeStream.on('finish', () => resolve(fullPath));
        writeStream.on('error', (err) => reject(err));
    });
};

module.exports = { exportUserProfileToPDF };
