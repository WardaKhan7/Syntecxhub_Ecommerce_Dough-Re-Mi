const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendVerificationEmail = async (email, token) => {
  const url = `${process.env.CLIENT_URL || 'http://localhost:5173'}/verify/${token}`;
  
  const mailOptions = {
    from: `"Dough-Re-Mi Bakery" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Verify your sweet account 🥯',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #800000; text-align: center;">Welcome to Dough-Re-Mi!</h2>
        <p>Thank you for joining our sweet family. Please click the button below to verify your email address and start your journey.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${url}" style="background-color: #800000; color: white; padding: 15px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Verify Email</a>
        </div>
        <p style="font-size: 12px; color: #666;">If the button doesn't work, copy and paste this link: <br/> ${url}</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 40px 0 20px;" />
        <p style="text-align: center; color: #999; font-size: 11px;">&copy; 2026 Dough-Re-Mi Bakery</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendVerificationEmail };
