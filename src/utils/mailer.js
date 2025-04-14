require("dotenv").config();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


const sendForgotPasswordEmail = async (email, resetLink) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Reset Your Password",
      html: `
        <p>Click the button below to reset your password:</p>
        <a href="${resetLink}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">
          Reset Password
        </a>
      `,
    });
    console.log("Reset email sent:", info.response);
  } catch (error) {
    console.error("Failed to send reset email:", error);
  }
};


const sendSuccesPasswordEmail = async (email) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Berhasil Reset Password",
      html: "Sukses reset password.",
    });
    console.log("Success reset email sent:", info.response);
  } catch (error) {
    console.error("Failed to send success email:", error);
  }
};


const sendWelcomeEmail = async (email) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Welcome to Our Platform!",
      text: "Thank you for joining our platform. We are glad to have you!",
    });
    console.log("Welcome email sent:", info.response);
  } catch (error) {
    console.error("Failed to send welcome email:", error);
  }
};

module.exports = {
  sendSuccesPasswordEmail,
  sendForgotPasswordEmail,
  sendWelcomeEmail,
};
