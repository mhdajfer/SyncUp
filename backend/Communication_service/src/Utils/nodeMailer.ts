import nodemailer from "nodemailer";

export const sendMail = (
  email: string,
  taskName: string,
  taskDetails: string,
  otp: number,
  link: string
) => {
  console.log(
    email,
    taskName,
    taskDetails,
    "***************************************************************"
  );

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.NODEMAILER_EMAIL,
      pass: process.env.NODEMAILER_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.NODEMAILER_EMAIL,
    to: email,
    subject: `New Task Assigned: ${taskName}`,
    html: `
      <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">
        <h2 style="color: #4CAF50;">New Project Assigned</h2>
        <p>Dear user,</p>
        <p>We are pleased to inform you that a new task has been assigned to you.</p>
        <p><strong>Task Name:</strong> ${taskName}</p>
        <p><strong>Task Details:</strong></p>
        ${
          otp.toString().length > 1
            ? `<p><strong>One-Time Password (OTP):</strong> ${otp}</p>`
            : ""
        }
        ${
          link.length > 1
            ? `<p><strong>Link:</strong> <a href="${link}">${link}</a></p>`
            : ""
        }
        <p>Please review the task details and get started at your earliest convenience.</p>
        <p>If you have any questions, please feel free to reach out.</p>
        <p>Best regards,</p>
        <p>TeamSync</p>
      </div>
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(`Error sending email to ${email}:`, error);
    } else {
      console.log(`Email sent to ${email}:`, info.response);
    }
  });
};
