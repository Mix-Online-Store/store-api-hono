import { sendEmail } from "./send-mail";

export async function sendPasswordResetMail({
  name,
  email,
  token,
  origin,
}: {
  name: string;
  email: string;
  token: string;
  origin: string;
}) {
  const resetUrl = `${origin}/user/reset-password?token=${token}&email=${email}`;

  return sendEmail({
    to: email,
    subject: "Reset Password",
    html: `
            <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            width: 100%;
            max-width: 600px;
            margin: auto;
            background: #ffffff;
            padding: 20px;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            padding: 10px 0;
            border-bottom: 1px solid #eaeaea;
        }
        .header h1 {
            margin: 0;
            color: #333;
        }
        .content {
            padding: 20px;
        }
        .content p {
            font-size: 16px;
            line-height: 1.5;
            color: #555;
        }
        .button {
            display: inline-block;
            padding: 10px 20px;
            margin: 20px 0;
            background-color: #007bff;
            color: #ffffff;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
        }
        .footer {
            text-align: center;
            padding: 10px 0;
            font-size: 12px;
            color: #999;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Password Reset</h1>
        </div>
        <div class="content">
            <p>Hi ${name},</p>
            <p>We received a request to reset your password. You can reset it by clicking the button below:</p>
            <a href="${resetUrl}" class="button">Reset Password</a>
            <p>If you did not request this, please ignore this email.</p>
            <p>Best regards,<br>The Mix OS Team</p>
        </div>
        <div class="footer">
            <p>&copy; 2024 Mix Online Store. All rights reserved.</p>
            <p><a href="#" style="color: #555;">Privacy Policy</a> | <a href="#" style="color: #555;">Unsubscribe</a></p>
        </div>
    </div>
</body>
</html>

        `,
  });
}
