import nodemailer from "nodemailer";

import { nodemailerConfig } from "./nodemailer-config";

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  const transporter = nodemailer.createTransport(nodemailerConfig);

  const info = await transporter.sendMail({
    from: "Mix OS <kyawzayartun.dev@gmail.com>",
    to,
    subject,
    html,
  });
  // eslint-disable-next-line no-console
  console.log({ info });
}
