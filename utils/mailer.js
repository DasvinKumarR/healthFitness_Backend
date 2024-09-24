import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail', // email provider
    auth: {
        user: process.env.EMAIL_USER, // email
        pass: process.env.EMAIL_PASS, // email password
    },
});
// function to send mail
export const sendEmailReminder = async (to, subject, text) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        text,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully to:', to);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};
