import nodemailer from "nodemailer";

// Create transporter - will be configured with user's credentials via env vars
let transporter: nodemailer.Transporter | null = null;

export function initializeEmailTransporter() {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const secure = process.env.SMTP_SECURE === "true";

  if (!host || !port || !user || !pass) {
    console.warn(
      "Email configuration missing. Login will not work until credentials are provided.",
    );
    return;
  }

  transporter = nodemailer.createTransport({
    host,
    port: parseInt(port),
    secure,
    auth: {
      user,
      pass,
    },
  });

  console.log(`Email transporter initialized successfully (secure: ${secure})`);
}

export async function sendOtpEmail(
  email: string,
  otp: string,
): Promise<boolean> {
  if (!transporter) {
    throw new Error(
      "Email transporter not initialized. Please configure email credentials.",
    );
  }

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your ResuMake Login Code",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2563eb; margin: 0;">ResuMake</h1>
          </div>
          
          <div style="background: #f8fafc; border-radius: 8px; padding: 30px; margin-bottom: 20px;">
            <h2 style="color: #1e293b; margin-top: 0;">Your Login Code</h2>
            <p style="color: #64748b; font-size: 16px; line-height: 1.5;">
              Use the code below to log in to your ResuMake account:
            </p>
            
            <div style="background: white; border: 2px solid #e2e8f0; border-radius: 8px; padding: 20px; text-align: center; margin: 25px 0;">
              <div style="font-size: 36px; font-weight: bold; color: #2563eb; letter-spacing: 8px; font-family: monospace;">
                ${otp}
              </div>
            </div>
            
            <p style="color: #64748b; font-size: 14px; margin-bottom: 0;">
              This code will expire in <strong>10 minutes</strong>.
            </p>
          </div>
          
          <p style="color: #94a3b8; font-size: 12px; text-align: center; margin-top: 30px;">
            If you didn't request this code, you can safely ignore this email.
          </p>
        </div>
      `,
      text: `Your ResuMake login code is: ${otp}\n\nThis code will expire in 10 minutes.\n\nIf you didn't request this code, you can safely ignore this email.`,
    });

    return true;
  } catch (error) {
    console.error("Error sending OTP email:", error);
    return false;
  }
}

export function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
