require("dotenv").config();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
const sendForgotPasswordEmail = (email, resetLink) => {
  transporter.sendMail({
    from: "ahazain56@gmail.com",
    to: email,
    subject: "Reset Your Password",
    html: ` <p>Click the button below to reset your password:</p>
            <a href="${resetLink}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">
                Reset Password
            </a>
           `,
  });
};
const sendSuccesPasswordEmail = (email) => {
  transporter.sendMail({
    from: "ahazain56@gmail.com",
    to: email,
    subject: "Berhasil Reset Password",
    html: `sukses reset password`,
  });
};
const sendWelcomeEmail = (email) => {
  transporter.sendMail(
    {
      from: "ahazain56@gmail.com",
      to: email,
      subject: "Welcome to Our Platform!",
      text: "Thank you for joining our platform. We are glad to have you!",
    },
    (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
      } else {
        console.log("Welcome email sent:", info.response);
      }
    }
  );
};

module.exports = {
  sendSuccesPasswordEmail,
  sendForgotPasswordEmail,
  sendWelcomeEmail,
};
