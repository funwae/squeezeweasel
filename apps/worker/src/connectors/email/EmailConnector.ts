/**
 * Email Connector - sends emails via SMTP or OAuth providers (Gmail, Outlook)
 *
 * Supports:
 * - SMTP (generic email servers)
 * - Gmail OAuth (via Google API)
 * - Outlook/Microsoft 365 OAuth (via Microsoft Graph API)
 */

export interface EmailOptions {
  to: string | string[];
  subject: string;
  body: string;
  html?: boolean;
  from?: string;
  cc?: string | string[];
  bcc?: string | string[];
  attachments?: Array<{
    filename: string;
    content: string | Buffer;
    contentType?: string;
  }>;
}

export interface EmailConfig {
  provider: "smtp" | "gmail" | "outlook";
  smtpHost?: string;
  smtpPort?: number;
  smtpUser?: string;
  smtpPassword?: string;
  oauthToken?: string; // For Gmail/Outlook OAuth
  oauthRefreshToken?: string;
  fromEmail?: string;
  fromName?: string;
}

export class EmailConnector {
  /**
   * Send email
   */
  async sendEmail(options: EmailOptions, config: EmailConfig): Promise<{
    success: boolean;
    messageId?: string;
    error?: string;
  }> {
    switch (config.provider) {
      case "smtp":
        return this.sendViaSMTP(options, config);
      case "gmail":
        return this.sendViaGmail(options, config);
      case "outlook":
        return this.sendViaOutlook(options, config);
      default:
        throw new Error(`Unsupported email provider: ${config.provider}`);
    }
  }

  /**
   * Send via SMTP
   */
  private async sendViaSMTP(
    options: EmailOptions,
    config: EmailConfig
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    if (!config.smtpHost || !config.smtpUser || !config.smtpPassword) {
      throw new Error("SMTP configuration incomplete: host, user, and password are required");
    }

    // For a full implementation, you would use a library like nodemailer
    // This is a placeholder that shows the structure
    try {
      // Example using nodemailer (would need to be installed):
      // const nodemailer = require('nodemailer');
      // const transporter = nodemailer.createTransport({
      //   host: config.smtpHost,
      //   port: config.smtpPort || 587,
      //   secure: config.smtpPort === 465,
      //   auth: {
      //     user: config.smtpUser,
      //     pass: config.smtpPassword,
      //   },
      // });
      //
      // const info = await transporter.sendMail({
      //   from: options.from || config.fromEmail,
      //   to: Array.isArray(options.to) ? options.to.join(',') : options.to,
      //   subject: options.subject,
      //   text: options.html ? undefined : options.body,
      //   html: options.html ? options.body : undefined,
      //   cc: options.cc ? (Array.isArray(options.cc) ? options.cc.join(',') : options.cc) : undefined,
      //   bcc: options.bcc ? (Array.isArray(options.bcc) ? options.bcc.join(',') : options.bcc) : undefined,
      // });
      //
      // return { success: true, messageId: info.messageId };

      // Placeholder implementation
      return {
        success: false,
        error: "SMTP email sending requires nodemailer package. Install it to enable this feature.",
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  /**
   * Send via Gmail OAuth
   */
  private async sendViaGmail(
    options: EmailOptions,
    config: EmailConfig
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    if (!config.oauthToken) {
      throw new Error("Gmail OAuth token is required");
    }

    // Gmail API endpoint
    const url = "https://gmail.googleapis.com/gmail/v1/users/me/messages/send";

    try {
      // Create email message in RFC 2822 format
      const to = Array.isArray(options.to) ? options.to.join(", ") : options.to;
      const from = options.from || config.fromEmail || "me";
      const cc = options.cc ? (Array.isArray(options.cc) ? options.cc.join(", ") : options.cc) : "";
      const bcc = options.bcc ? (Array.isArray(options.bcc) ? options.bcc.join(", ") : options.bcc) : "";

      const emailBody = [
        `To: ${to}`,
        cc ? `Cc: ${cc}` : "",
        bcc ? `Bcc: ${bcc}` : "",
        `From: ${from}`,
        `Subject: ${options.subject}`,
        options.html ? "Content-Type: text/html; charset=utf-8" : "Content-Type: text/plain; charset=utf-8",
        "",
        options.body,
      ]
        .filter(Boolean)
        .join("\r\n");

      // Base64 encode the email
      const encodedEmail = Buffer.from(emailBody).toString("base64url");

      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${config.oauthToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          raw: encodedEmail,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Gmail API error: ${response.status} ${JSON.stringify(errorData)}`);
      }

      const data = await response.json();

      return {
        success: true,
        messageId: data.id,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  /**
   * Send via Outlook/Microsoft 365 OAuth
   */
  private async sendViaOutlook(
    options: EmailOptions,
    config: EmailConfig
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    if (!config.oauthToken) {
      throw new Error("Outlook OAuth token is required");
    }

    // Microsoft Graph API endpoint
    const url = "https://graph.microsoft.com/v1.0/me/sendMail";

    try {
      const toRecipients = (Array.isArray(options.to) ? options.to : [options.to]).map((email) => ({
        emailAddress: { address: email },
      }));

      const ccRecipients = options.cc
        ? (Array.isArray(options.cc) ? options.cc : [options.cc]).map((email) => ({
            emailAddress: { address: email },
          }))
        : [];

      const bccRecipients = options.bcc
        ? (Array.isArray(options.bcc) ? options.bcc : [options.bcc]).map((email) => ({
            emailAddress: { address: email },
          }))
        : [];

      const message = {
        message: {
          subject: options.subject,
          body: {
            contentType: options.html ? "html" : "text",
            content: options.body,
          },
          toRecipients,
          ...(ccRecipients.length > 0 && { ccRecipients }),
          ...(bccRecipients.length > 0 && { bccRecipients }),
        },
      };

      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${config.oauthToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(message),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Microsoft Graph API error: ${response.status} ${JSON.stringify(errorData)}`);
      }

      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }
}

