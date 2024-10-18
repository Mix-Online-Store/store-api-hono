import env from "@/env";

export const nodemailerConfig = {
  service: "gmail",
  auth: {
    user: "kyawzayartun.dev@gmail.com",
    pass: env.GOOGLE_APP_PASSWORD,
  },
};

// export const nodemailerConfig = {
//   host: "smtp.ethereal.email",
//   port: 587,
//   auth: {
//     user: env.ETHEREAL_USER,
//     pass: env.ETHEREAL_PASS,
//   },
// };
