import nodemailer from "nodemailer";

export const sendMail = (
  email: string,
  TaskName: string,
  TaskDetails: string,
  otp: number
) => {
  console.log(email, TaskName, TaskDetails);

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.NODEMAILER_EMAIL,
      pass: process.env.NODEMAILER_PASSWORD,
    },
  });

  const mailOptions = (email: string) => ({
    from: process.env.NODEMAILER_EMAIL,
    to: email,
    subject: `New Task Assigned: ${TaskName}`,
    html: `
            <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">
              <h2 style="color: #4CAF50;">New Project Assigned</h2>
              <p>Dear user,</p>
              <p>We are pleased to inform you that a new task has been assigned to you.</p>
              <p><strong>Task Name:</strong> ${TaskName}</p>
              <p><strong>Task Details:</strong></p>
              <h1>This is your onetime password:  ${otp}</h1>
              <p>${TaskDetails}</p>
              <p>Please review the task details and get started at your earliest convenience.</p>
              <p>If you have any questions, please feel free to reach out.</p>
              <p>Best regards,</p>
              <p>TeamSync</p>
            </div>
        `,
  });

  transporter.sendMail(mailOptions(email), (error, info) => {
    if (error) {
      console.error(`Error sending email to ${email}:`, error);
    } else {
      console.log(`Email sent to ${email}:`, info.response);
    }
  });
};
