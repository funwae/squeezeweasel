/**
 * Tool node handlers
 */

import type { BaseNode } from "@squeezeweasel/shared-types";
import type { RunContext } from "../engine/ContextStore.js";
import { prisma } from "../db/client.js";
import { RedditConnector } from "../connectors/reddit/RedditConnector.js";
import { StockDataConnector } from "../connectors/stock/StockDataConnector.js";
import { EmailConnector } from "../connectors/email/EmailConnector.js";
import { SMSConnector } from "../connectors/sms/SMSConnector.js";
import { config } from "../config/index.js";
// Secrets decryption will be handled via API when needed

export const toolNodes = {
  http: {
    async execute(
      node: BaseNode,
      input: Record<string, unknown>,
      context: RunContext
    ): Promise<Record<string, unknown>> {
      const url = (node.config?.url as string) || "";
      const method = (node.config?.method as string) || "GET";
      const headers = (node.config?.headers as Record<string, string>) || {};
      const body = node.config?.body as string | undefined;

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
        body: body ? JSON.stringify(body) : undefined,
      });

      const responseData = await response.json().catch(() => response.text());

      return {
        status: response.status,
        statusText: response.statusText,
        data: responseData,
      };
    },
  },

  email: {
    async execute(
      node: BaseNode,
      input: Record<string, unknown>,
      context: RunContext
    ): Promise<Record<string, unknown>> {
      const connector = new EmailConnector();

      // Get email options from node config or input
      const to = (node.config?.to as string) || (input.to as string) || "";
      const subject = (node.config?.subject as string) || (input.subject as string) || "";
      const body = (node.config?.body as string) || (input.body as string) || "";
      const html = (node.config?.html as boolean) || false;
      const from = (node.config?.from as string) || (input.from as string) || undefined;

      if (!to || !subject || !body) {
        throw new Error("Email requires: to, subject, and body");
      }

      // Get email configuration from workspace secrets/connectors
      // For now, use node config
      const provider = (node.config?.provider as string) || "smtp";
      const emailConfig = {
        provider: provider as "smtp" | "gmail" | "outlook",
        smtpHost: node.config?.smtpHost as string | undefined,
        smtpPort: node.config?.smtpPort as number | undefined,
        smtpUser: node.config?.smtpUser as string | undefined,
        smtpPassword: node.config?.smtpPassword as string | undefined,
        oauthToken: node.config?.oauthToken as string | undefined,
        oauthRefreshToken: node.config?.oauthRefreshToken as string | undefined,
        fromEmail: from,
        fromName: node.config?.fromName as string | undefined,
      };

      const result = await connector.sendEmail(
        {
          to,
          subject,
          body,
          html,
          from,
          cc: node.config?.cc as string | string[] | undefined,
          bcc: node.config?.bcc as string | string[] | undefined,
        },
        emailConfig
      );

      return result;
    },
  },

  sms: {
    async execute(
      node: BaseNode,
      input: Record<string, unknown>,
      context: RunContext
    ): Promise<Record<string, unknown>> {
      const connector = new SMSConnector();

      // Get SMS options from node config or input
      const to = (node.config?.to as string) || (input.to as string) || "";
      const message = (node.config?.message as string) || (input.message as string) || "";
      const from = (node.config?.from as string) || (input.from as string) || undefined;

      if (!to || !message) {
        throw new Error("SMS requires: to and message");
      }

      // Get SMS configuration from workspace secrets/connectors
      // For now, use node config
      const provider = (node.config?.provider as string) || "twilio";
      const smsConfig = {
        provider: provider as "twilio" | "custom",
        twilioAccountSid: node.config?.twilioAccountSid as string | undefined,
        twilioAuthToken: node.config?.twilioAuthToken as string | undefined,
        twilioFromNumber: from || (node.config?.twilioFromNumber as string | undefined),
        customEndpoint: node.config?.customEndpoint as string | undefined,
        customApiKey: node.config?.customApiKey as string | undefined,
      };

      const result = await connector.sendSMS(
        {
          to,
          message,
          from,
        },
        smsConfig
      );

      return result;
    },
  },

  db: {
    async execute(
      node: BaseNode,
      input: Record<string, unknown>,
      context: RunContext
    ): Promise<Record<string, unknown>> {
      const query = (node.config?.query as string) || "";
      const operation = (node.config?.operation as string) || "query";

      // Use Prisma client for database operations
      // Note: This is a simplified implementation
      // In production, you'd want to use a proper SQL client with parameterized queries

      if (operation === "query") {
        // For now, return empty result
        // Full implementation would execute SQL query
        return {
          rows: [],
          count: 0,
        };
      }

      return {
        success: false,
        message: "Database operation not yet fully implemented",
      };
    },
  },

  webhook: {
    async execute(
      node: BaseNode,
      input: Record<string, unknown>,
      context: RunContext
    ): Promise<Record<string, unknown>> {
      const url = (node.config?.url as string) || "";
      const payload = input.payload || input;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      return {
        status: response.status,
        sent: response.ok,
      };
    },
  },

  reddit: {
    async execute(
      node: BaseNode,
      input: Record<string, unknown>,
      context: RunContext
    ): Promise<Record<string, unknown>> {
      const connector = new RedditConnector();
      const operation = (node.config?.operation as string) || "fetchPosts";

      if (operation === "fetchPosts") {
        const subreddit = (node.config?.subreddit as string) || (input.subreddit as string) || "";
        const sort = (node.config?.sort as string) || "hot";
        const limit = (node.config?.limit as number) || 25;
        const timeFilter = (node.config?.timeFilter as string) || "day";

        if (!subreddit) {
          throw new Error("Subreddit is required for Reddit fetchPosts operation");
        }

        const result = await connector.fetchPosts({
          subreddit,
          sort: sort as "hot" | "new" | "top" | "rising",
          limit,
          timeFilter: timeFilter as "hour" | "day" | "week" | "month" | "year" | "all",
          useSampleData: config.demo.enabled,
        });

        return {
          posts: result.posts,
          after: result.after,
          count: result.posts.length,
        };
      }

      if (operation === "fetchComments") {
        const permalink = (node.config?.permalink as string) || (input.permalink as string) || "";

        if (!permalink) {
          throw new Error("Permalink is required for Reddit fetchComments operation");
        }

        const comments = await connector.fetchComments(permalink);

        return {
          comments,
          count: comments.length,
        };
      }

      if (operation === "searchPosts") {
        const subreddit = (node.config?.subreddit as string) || (input.subreddit as string) || "";
        const query = (node.config?.query as string) || (input.query as string) || "";
        const limit = (node.config?.limit as number) || 25;

        if (!subreddit || !query) {
          throw new Error("Subreddit and query are required for Reddit searchPosts operation");
        }

        const posts = await connector.searchPosts(subreddit, query, limit);

        return {
          posts,
          count: posts.length,
        };
      }

      throw new Error(`Unknown Reddit operation: ${operation}`);
    },
  },

  stock: {
    async execute(
      node: BaseNode,
      input: Record<string, unknown>,
      context: RunContext
    ): Promise<Record<string, unknown>> {
      const connector = new StockDataConnector();
      const ticker = (node.config?.ticker as string) || (input.ticker as string) || "";

      if (!ticker) {
        throw new Error("Ticker is required for stock data operation");
      }

      // Get provider configuration
      const provider = (node.config?.provider as string) || "yahoo";
      const apiKey = (node.config?.apiKey as string) || undefined;
      const customEndpoint = (node.config?.customEndpoint as string) || undefined;

      // Check if we need to fetch multiple tickers
      const tickers = Array.isArray(input.tickers)
        ? (input.tickers as string[])
        : ticker.split(",").map((t) => t.trim());

      if (tickers.length === 1) {
        // Single ticker
        const data = await connector.fetchStockData({
          ticker: tickers[0],
          provider: provider as "fintel" | "alphavantage" | "yahoo" | "custom",
          apiKey,
          customEndpoint,
          useSampleData: config.demo.enabled,
        });

        return {
          ticker: data.ticker,
          data,
        };
      } else {
        // Multiple tickers
        const results = await connector.fetchMultipleTickers(tickers, {
          provider: provider as "fintel" | "alphavantage" | "yahoo" | "custom",
          apiKey,
          customEndpoint,
          useSampleData: config.demo.enabled,
        });

        return {
          tickers,
          data: results,
          count: results.length,
        };
      }
    },
  },
};

