/**
 * SMS Connector - sends SMS messages via Twilio or other providers
 *
 * Supports:
 * - Twilio (primary provider)
 * - Custom HTTP endpoints (for other SMS gateways)
 */

export interface SMSOptions {
  to: string;
  message: string;
  from?: string; // Phone number or sender ID
}

export interface SMSConfig {
  provider: "twilio" | "custom";
  twilioAccountSid?: string;
  twilioAuthToken?: string;
  twilioFromNumber?: string;
  customEndpoint?: string;
  customApiKey?: string;
}

export class SMSConnector {
  /**
   * Send SMS
   */
  async sendSMS(options: SMSOptions, config: SMSConfig): Promise<{
    success: boolean;
    messageId?: string;
    sid?: string; // Twilio SID
    error?: string;
  }> {
    switch (config.provider) {
      case "twilio":
        return this.sendViaTwilio(options, config);
      case "custom":
        return this.sendViaCustom(options, config);
      default:
        throw new Error(`Unsupported SMS provider: ${config.provider}`);
    }
  }

  /**
   * Send via Twilio
   */
  private async sendViaTwilio(
    options: SMSOptions,
    config: SMSConfig
  ): Promise<{ success: boolean; messageId?: string; sid?: string; error?: string }> {
    if (!config.twilioAccountSid || !config.twilioAuthToken) {
      throw new Error("Twilio Account SID and Auth Token are required");
    }

    const from = options.from || config.twilioFromNumber;
    if (!from) {
      throw new Error("From phone number is required");
    }

    // Twilio API endpoint
    const url = `https://api.twilio.com/2010-04-01/Accounts/${config.twilioAccountSid}/Messages.json`;

    try {
      // Create form data
      const formData = new URLSearchParams();
      formData.append("From", from);
      formData.append("To", options.to);
      formData.append("Body", options.message);

      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Basic ${Buffer.from(`${config.twilioAccountSid}:${config.twilioAuthToken}`).toString("base64")}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Twilio API error: ${response.status} ${JSON.stringify(errorData)}`);
      }

      const data = await response.json();

      return {
        success: true,
        messageId: data.sid,
        sid: data.sid,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  /**
   * Send via custom HTTP endpoint
   */
  private async sendViaCustom(
    options: SMSOptions,
    config: SMSConfig
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    if (!config.customEndpoint) {
      throw new Error("Custom endpoint is required for custom SMS provider");
    }

    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (config.customApiKey) {
        headers["Authorization"] = `Bearer ${config.customApiKey}`;
      }

      const response = await fetch(config.customEndpoint, {
        method: "POST",
        headers,
        body: JSON.stringify({
          to: options.to,
          message: options.message,
          from: options.from,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Custom SMS API error: ${response.status} ${JSON.stringify(errorData)}`);
      }

      const data = await response.json();

      return {
        success: true,
        messageId: data.messageId || data.id || undefined,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }
}

