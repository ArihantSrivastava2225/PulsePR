import { sendMassEmail } from '../services/email.service.js';

export const sendMail = async (req, res) => {
    try {
        const { recipients, subject, body } = req.body;

        if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
            return res.status(400).json({ success: false, message: "Recipients list is required and must be an array." });
        }

        if (!subject || !body) {
            return res.status(400).json({ success: false, message: "Subject and body are required." });
        }

        const result = await sendMassEmail(recipients, subject, body);

        if (result.success) {
            res.status(200).json({
                success: true,
                message: "Emails sent successfully",
                previewUrl: result.preview
            });
        } else {
            res.status(500).json({ success: false, message: "Failed to send emails", error: result.error });
        }
    } catch (error) {
        console.error("Error in sendMail:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};
