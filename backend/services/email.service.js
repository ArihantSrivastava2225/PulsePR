import nodemailer from 'nodemailer';

// Create a test account if no env vars are present (for development)
// In production, use real credentials from .env
const createTransporter = async () => {
    // For this demo, we'll use Ethereal for testing if no real SMTP is provided

    // Fallback to Ethereal
    const testAccount = await nodemailer.createTestAccount();
    console.log('Using Ethereal Mail for testing');
    console.log('User:', testAccount.user);
    console.log('Pass:', testAccount.pass);

    return nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
            user: testAccount.user,
            pass: testAccount.pass,
        },
    });
};

export const sendMassEmail = async (recipients, subject, htmlContent) => {
    try {
        const transporter = await createTransporter();

        // Send mail
        const info = await transporter.sendMail({
            from: '"PulsePR Team" <no-reply@pulsepr.com>',
            to: recipients.join(', '), // Comma separated list
            subject: subject,
            html: htmlContent,
        });

        console.log("Message sent: %s", info.messageId);
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

        return { success: true, messageId: info.messageId, preview: nodemailer.getTestMessageUrl(info) };
    } catch (error) {
        console.error("Error sending email:", error);
        return { success: false, error: error.message };
    }
};
