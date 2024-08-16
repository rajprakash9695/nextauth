import nodemailer from 'nodemailer';
import bcryptjs from 'bcryptjs';
import User from '@/models/userModel';

interface IProps {
  email: string;
  emailType: string;
  userId: string;
}

export const sendEmail = async ({ email, emailType, userId }: any) => {
  try {
    const hashToken = await bcryptjs.hash(userId.toString(), 10);
    if (emailType === 'VERIFY') {
      await User.findByIdAndUpdate(userId, {
        $set: {
          verifyToken: hashToken,
          verifyTokenExpiry: new Date(Date.now() + 3600000),
        },
      });
    }
    if (emailType === 'VERIFIED') {
      await User.findByIdAndUpdate(userId, {
        verifyToken: hashToken,
        verifyTokenExpiry: Date.now() + 3600000,
      });
    } else if (emailType === 'RESET') {
      await User.findByIdAndUpdate(userId, {
        forgotPasswordToken: hashToken,
        forgotPasswordTokenExpiry: Date.now() + 3600000,
      });
    }

    var transport = nodemailer.createTransport({
      //@ts-ignore
      host: process.env.MAIL_HOST_NAME,
      port: process.env.MAIL_PORT,
      auth: {
        user: process.env.MAIL_USERID,
        pass: process.env.MAIL_PASSWORD,
      },
    });
    const mailOptions = {
      from: 'dev.developer9695@gmail.com', // sender address
      to: email, // list of receivers
      subject:
        emailType === 'VERIFY' ? 'Verify your email' : 'Reset your password', // Subject line
      text: 'Hello world?', // plain text body
      html: `<p> Click <a href="${
        process.env.DOMAIN
      }/verifyemail?token=${hashToken}">here</a> to ${
        emailType === 'VERIFY' ? 'verify your email' : 'reset your password'
      } or copy and paste the link below in your browser. <br> ${
        process.env.DOMAIN
      }/verifyemail?token=${hashToken} </p>`,
    };

    const mailResponse = await transport.sendMail(mailOptions);

    return mailResponse;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
