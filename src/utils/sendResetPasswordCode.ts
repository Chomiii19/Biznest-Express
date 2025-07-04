import nodemailer from "nodemailer";
import resetPassword from "./emailTemplates/sendCodeTemplate";
import { IUser } from "../@types/interfaces";

const sendResetPasswordCode = async function (receiver: IUser) {
  try {
    const email = process.env.EMAIL;
    const password = process.env.EMAIL_PASSWORD;
    const transport = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: email,
        pass: password,
      },
    });

    const mailOptions = {
      from: {
        name: "Team Biznest",
        address: email,
      },
      to: [receiver.email],
      subject: "Reset Password (Biznest)",
      text: "",
      html: resetPassword(receiver),
    };

    // @ts-expect-error
    const info = await transport.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Failed to send email", error);
  }
};

export default sendResetPasswordCode;
