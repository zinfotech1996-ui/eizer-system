/**
 * Email notification service for Eizer
 * Handles sending notifications to admins and fundraisers
 */

interface EmailOptions {
  to: string;
  subject: string;
  htmlContent: string;
}

/**
 * Send email notification
 * In production, this would integrate with a real email service like SendGrid, Mailgun, etc.
 */
export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    // Log email for development/testing
    console.log(`[EMAIL] Sending to: ${options.to}`);
    console.log(`[EMAIL] Subject: ${options.subject}`);
    console.log(`[EMAIL] Content: ${options.htmlContent.substring(0, 100)}...`);

    // In a production environment, you would integrate with:
    // - SendGrid: await sgMail.send(msg)
    // - Mailgun: await mailgun.messages().send(msg)
    // - AWS SES: await ses.sendEmail(params).promise()
    // - Nodemailer: await transporter.sendMail(mailOptions)

    return true;
  } catch (error) {
    console.error("[EMAIL] Failed to send email:", error);
    return false;
  }
}

/**
 * Send notification to admin when a new redemption request is submitted
 */
export async function notifyAdminNewRedemption(
  adminEmail: string,
  fundraiserName: string,
  amount: string,
  requestId: number
): Promise<boolean> {
  const htmlContent = `
    <h2>New Redemption Request</h2>
    <p>A new redemption request has been submitted:</p>
    <ul>
      <li><strong>Fundraiser:</strong> ${fundraiserName}</li>
      <li><strong>Amount:</strong> $${amount}</li>
      <li><strong>Request ID:</strong> ${requestId}</li>
    </ul>
    <p>Please log in to the admin portal to review and process this request.</p>
  `;

  return sendEmail({
    to: adminEmail,
    subject: `New Redemption Request from ${fundraiserName}`,
    htmlContent,
  });
}

/**
 * Send notification to fundraiser when their request status changes
 */
export async function notifyFundraiserStatusChange(
  fundraiserEmail: string,
  fundraiserName: string,
  status: "approved" | "released" | "rejected",
  amount: string,
  requestId: number
): Promise<boolean> {
  const statusMessages = {
    approved: "Your redemption request has been approved and is being processed.",
    released: "Your check has been released! You should receive it shortly.",
    rejected: "Unfortunately, your redemption request has been rejected.",
  };

  const htmlContent = `
    <h2>Redemption Request Status Update</h2>
    <p>Hi ${fundraiserName},</p>
    <p>${statusMessages[status]}</p>
    <ul>
      <li><strong>Amount:</strong> $${amount}</li>
      <li><strong>Status:</strong> ${status.charAt(0).toUpperCase() + status.slice(1)}</li>
      <li><strong>Request ID:</strong> ${requestId}</li>
    </ul>
    <p>Log in to your fundraiser portal to view more details.</p>
  `;

  return sendEmail({
    to: fundraiserEmail,
    subject: `Redemption Request ${status.charAt(0).toUpperCase() + status.slice(1)} - Request #${requestId}`,
    htmlContent,
  });
}

/**
 * Send notification to admin when a machine is returned
 */
export async function notifyAdminMachineReturned(
  adminEmail: string,
  fundraiserName: string,
  machineName: string,
  batchNumber: string
): Promise<boolean> {
  const htmlContent = `
    <h2>Credit Card Machine Returned</h2>
    <p>A credit card machine has been returned:</p>
    <ul>
      <li><strong>Fundraiser:</strong> ${fundraiserName}</li>
      <li><strong>Machine:</strong> ${machineName}</li>
      <li><strong>Batch Number:</strong> ${batchNumber}</li>
    </ul>
    <p>Please log in to the admin portal to process this return.</p>
  `;

  return sendEmail({
    to: adminEmail,
    subject: `Machine Returned - ${machineName}`,
    htmlContent,
  });
}
