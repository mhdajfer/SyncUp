import { Resend } from "resend";

export const sendMail = async (
  email: string,
  taskName: string,
  taskDetails: string,
  otp: number,
  link: string
): Promise<void> => {
  try {
    const resend = new Resend(process.env.EMAIL_API_KEY!);
    const emailData = `
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
    `;

    await resend.emails.send({
      from: "syncUpOnBoarding@mhdajfer.in",
      to: email,
      subject: `New Task Assigned: ${taskName}`,
      html: emailData,
    });
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
};

export const sendTaskAssignedMail = async (
  email: string,
  taskName: string,
  taskDetails: string,
  dueDate: string
): Promise<void> => {
  try {
    const resend = new Resend(process.env.EMAIL_API_KEY!);

    const mailData = `
    <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">
    <h2 style="color: #4CAF50;">New Task Assigned</h2>
    <p>Dear user,</p>
    <p>A new task has been assigned to you. Please find the details below:</p>
    <p><strong>Task Name:</strong> ${taskName}</p>
    <p><strong>Task Details:</strong> ${taskDetails}</p>
    <p><strong>Due Date:</strong> ${dueDate}</p>
    <p>Please review the task and ensure its completion by the due date. If you have any questions, reach out to your manager or the team lead.</p>
    <p>Best regards,</p>
    <p>TeamSync</p>
    </div>
    `;

    await resend.emails.send({
      from: "syncup@mhdajfer.in",
      to: email,
      subject: `New Task Assigned: ${taskName}`,
      html: mailData,
    });

    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
};
