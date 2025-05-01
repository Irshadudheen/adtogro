import { BadRequestError } from "../errors/bad-request-error";
import nodemailer from "nodemailer";
import { baseStyle, buttonStyle, footer } from "../mail/components";

interface MailOptions {
  to: string;
  type: 'VERIFY_EMAIL' | 'PAYMENT_SUCCESS' | 'AD_CREATED' | 'AD_EXPIRING_SOON'|'RESET PASSWORD';
  data: any;
}

const sendMail = async ({ to, type, data }: MailOptions) => {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: process.env.emailId,
        pass: process.env.password
      }
    });

    let subject = '';
    let html = '';

   

    switch (type) {
      case 'VERIFY_EMAIL':
        subject = 'Verify Your Email';
        const verifyLink = `${process.env.CLIENT_URL}/verify-email/${data.userId}`;
        html = `
          <div style="${baseStyle}">
            <h2>Welcome, ${data.name}!</h2>
            <p>Thank you for signing up. Please verify your email by clicking the button below:</p>
            <a href="${verifyLink}" style="${buttonStyle}">Verify Email</a>
            ${footer}
          </div>
        `;
        break;

        case 'PAYMENT_SUCCESS':
            subject = 'Payment Successful';
            html = `
              <div style="${baseStyle}">
                <h2>Hello ${data.name},</h2>
                <p>🎉 Your payment of <strong>₹${data.amount}</strong> for <strong>${data.plan}</strong> was successful.</p>
                <p style="color: #16a34a; font-weight: bold;">
                  ✅ Thank you for your purchase and support!
                </p>
                ${footer}
              </div>
            `;
            break;
          

      case 'AD_CREATED':
        subject = 'Spot Created Successfully';
        html = `
          <div style="${baseStyle}">
            <h2>Hi ${data.name},</h2>
            <p>The Spot for your logo "<strong>${data.adTitile}</strong>"is now yours and live!</p>
            <p>You can track its performance in your dashboard.</p>
            ${footer}
          </div>
        `;
        break;

      case 'AD_EXPIRING_SOON':
        subject = '⚠️ Your Ad is Expiring Soon - Take Action Now';
        html = `
          <div style="${baseStyle}">
            <h2>Hello ${data.name},</h2>
            <p>Your ad "<strong>${data.adTitle}</strong>" is set to expire on <strong>${new Date(data.expiresAt).toDateString()}</strong>.</p>
            <p style="color:rgb(185, 177, 28); font-weight: bold;">
              ⚠️ Important: If your ad expires, you will lose ownership of it and the click count will reset to <strong>zero</strong>.
            </p>
            <p>To avoid losing your data and exposure, please renew your ad before the expiration date.</p>
            <a href="${data.renewLink}" style="${buttonStyle}">Renew Now</a>
            ${footer}
          </div>
        `;
        break;
      case 'RESET PASSWORD':
        subject = 'Reset Your Password';
        const resetLink = `${process.env.CLIENT_URL}/reset-password/${data.token}`;
        html = `
          <div style="${baseStyle}">
            <h2>Hello ${data.name},</h2>
            <p>We received a request to reset your password. Click the button below to set a new password:</p>
            <a href="${resetLink}" style="${buttonStyle}">New Password</a>
            ${footer}
          </div>
        `;
        break;
      default:
        throw new BadRequestError("Invalid email type");
    }

    const mailOptions = {
      from: process.env.emailId,
      to,
      subject,
      html
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error("Mail error:", err);
      } else {
        console.log("Email sent:", info.response);
      }
    });

  } catch (error) {
    console.error("Email failed:", error);
    throw new BadRequestError('Email not sent');
  }
};

export default sendMail;
