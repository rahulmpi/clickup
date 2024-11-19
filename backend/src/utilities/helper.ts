import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config();

const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

export const sendEmail = async (email:string, message:string, subject:string) =>{

  let mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: subject,
    html: message
  };

  await transporter.sendMail(mailOptions);
}