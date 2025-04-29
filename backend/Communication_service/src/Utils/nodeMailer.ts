import { Resend } from "resend";

interface EmailTemplate {
  subject: string;
  html: string;
}

interface EmailService {
  sendEmail(to: string, template: EmailTemplate): Promise<void>;
}

interface TaskAssignmentTemplateData {
  taskName: string;
  taskDetails: string;
  dueDate?: string;
  otp?: number;
  link?: string;
}

class EmailTemplateGenerator {
  static generateTaskAssignmentTemplate(data: TaskAssignmentTemplateData): EmailTemplate {
    const { taskName, taskDetails, dueDate, otp, link } = data;
    
    const html = `
      <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">
        <h2 style="color: #4CAF50;">New Task Assigned</h2>
        <p>Dear user,</p>
        <p>A new task has been assigned to you. Please find the details below:</p>
        <p><strong>Task Name:</strong> ${taskName}</p>
        <p><strong>Task Details:</strong> ${taskDetails}</p>
        ${dueDate ? `<p><strong>Due Date:</strong> ${dueDate}</p>` : ''}
        ${otp ? `<p><strong>One-Time Password (OTP):</strong> ${otp}</p>` : ''}
        ${link ? `<p><strong>Link:</strong> <a href="${link}">${link}</a></p>` : ''}
        <p>Please review the task and ensure its completion${dueDate ? ' by the due date' : ''}.</p>
        <p>Best regards,</p>
        <p>TeamSync</p>
      </div>
    `;

    return {
      subject: `New Task Assigned: ${taskName}`,
      html
    };
  }
}

class ResendEmailService implements EmailService {
  private resend: Resend;
  private readonly fromEmail: string;

  constructor(apiKey: string, fromEmail: string) {
    if (!apiKey) throw new Error('Resend API key is required');
    this.resend = new Resend(apiKey);
    this.fromEmail = fromEmail;
  }

  async sendEmail(to: string, template: EmailTemplate): Promise<void> {
    try {
      await this.resend.emails.send({
        from: this.fromEmail,
        to,
        subject: template.subject,
        html: template.html,
      });
    } catch (error) {
      console.error('Failed to send email:', error);
      throw new Error('Email sending failed');
    }
  }
}

export const sendMail = async (
  email: string,
  taskName: string,
  taskDetails: string,
  otp: number,
  link: string
): Promise<void> => {
  try {
    const emailService = new ResendEmailService(
      process.env.RESEND_API_KEY!,
      'syncUpOnBoarding@resend.com'
    );

    const template = EmailTemplateGenerator.generateTaskAssignmentTemplate({
      taskName,
      taskDetails,
      otp,
      link
    });

    await emailService.sendEmail(email, template);
  } catch (error) {
    console.error('Error in sendMail:', error);
    throw error;
  }
};

export const sendTaskAssignedMail = async (
  email: string,
  taskName: string,
  taskDetails: string,
  dueDate: string
): Promise<void> => {
  try {
    const emailService = new ResendEmailService(
      process.env.RESEND_API_KEY!,
      'syncup@resend.dev'
    );

    const template = EmailTemplateGenerator.generateTaskAssignmentTemplate({
      taskName,
      taskDetails,
      dueDate
    });

    await emailService.sendEmail(email, template);
  } catch (error) {
    console.error('Error in sendTaskAssignedMail:', error);
    throw error;
  }
};
