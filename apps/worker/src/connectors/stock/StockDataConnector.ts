/**
 * Stock Data Connector - fetches stock market data including short interest, float, etc.
 *
 * Supports multiple providers:
 * - Fintel API (requires API key)
 * - Alpha Vantage (free tier available)
 * - Yahoo Finance (via public endpoints)
 * - Custom HTTP endpoints
 */

export interface StockData {
  ticker: string;
  shortInterest?: number; // Short interest as percentage
  float?: number; // Shares outstanding
  sharesOutstanding?: number;
  marketCap?: number;
  borrowFee?: number; // Borrow fee percentage
  utilization?: number; // Utilization percentage
  price?: number;
  volume?: number;
  lastUpdated?: string;
}

export interface StockDataOptions {
  ticker: string;
  provider?: "fintel" | "alphavantage" | "yahoo" | "custom";
  apiKey?: string;
  customEndpoint?: string;
  useSampleData?: boolean; // Use sample data instead of real API
}

export class StockDataConnector {
  /**
   * Fetch stock data for a ticker
   */
  async fetchStockData(options: StockDataOptions): Promise<StockData> {
    const { ticker, provider = "yahoo", apiKey, customEndpoint, useSampleData = false } = options;

    // Use sample data if requested
    if (useSampleData) {
      console.log("Using sample stock data for demo");
      try {
        const { readFileSync } = await import("fs");
        const { fileURLToPath } = await import("url");
        const { dirname, join } = await import("path");
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = dirname(__filename);

        const sampleFile = join(__dirname, "sample-data", "stocks.json");
        const fileContent = readFileSync(sampleFile, "utf-8");
        const sampleData: Record<string, StockData> = JSON.parse(fileContent);

        const tickerUpper = ticker.toUpperCase();
        if (sampleData[tickerUpper]) {
          return sampleData[tickerUpper];
        }

        // If ticker not found in sample data, return a default structure
        console.warn(`Ticker ${tickerUpper} not found in sample data, returning default`);
        return {
          ticker: tickerUpper,
          shortInterest: 15.0,
          float: 100.0,
          sharesOutstanding: 100.0,
          marketCap: 1000000000,
          borrowFee: 5.0,
          utilization: 60.0,
          price: 10.0,
          volume: 1000000,
          lastUpdated: new Date().toISOString(),
        };
      } catch (error) {
        console.error("Failed to load sample stock data:", error);
        throw new Error(`Failed to load sample stock data: ${error instanceof Error ? error.message : "Unknown error"}`);
      }
    }

    switch (provider) {
      case "fintel":
        return this.fetchFromFintel(ticker, apiKey);
      case "alphavantage":
        return this.fetchFromAlphaVantage(ticker, apiKey);
      case "yahoo":
        return this.fetchFromYahoo(ticker);
      case "custom":
        if (!customEndpoint) {
          throw new Error("Custom endpoint is required for custom provider");
        }
        return this.fetchFromCustom(ticker, customEndpoint, apiKey);
      default:
        return this.fetchFromYahoo(ticker);
    }
  }

  /**
   * Fetch from Fintel API
   * Note: This is a placeholder - actual Fintel API structure may vary
   */
  private async fetchFromFintel(ticker: string, apiKey?: string): Promise<StockData> {
    if (!apiKey) {
      throw new Error("Fintel API key is required");
    }

    // Fintel API endpoint (example - actual endpoint may differ)
    const url = `https://api.fintel.io/v1/stock/${ticker}/short-interest`;

    try {
      const response = await fetch(url, {
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "User-Agent": "SqueezeWeasel/1.0",
        },
      });

      if (!response.ok) {
        throw new Error(`Fintel API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      return {
        ticker,
        shortInterest: data.shortInterest,
        float: data.float,
        sharesOutstanding: data.sharesOutstanding,
        borrowFee: data.borrowFee,
        utilization: data.utilization,
        lastUpdated: new Date().toISOString(),
      };
    } catch (error) {
      throw new Error(`Failed to fetch from Fintel: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }

  /**
   * Fetch from Alpha Vantage
   * Note: Alpha Vantage has rate limits on free tier
   */
  private async fetchFromAlphaVantage(ticker: string, apiKey?: string): Promise<StockData> {
    if (!apiKey) {
      throw new Error("Alpha Vantage API key is required");
    }

    // Alpha Vantage doesn't provide short interest directly, but we can get overview
    const url = `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${ticker}&apikey=${apiKey}`;

    try {
      const response = await fetch(url, {
        headers: {
          "User-Agent": "SqueezeWeasel/1.0",
        },
      });

      if (!response.ok) {
        throw new Error(`Alpha Vantage API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      return {
        ticker,
        sharesOutstanding: data.SharesOutstanding ? parseInt(data.SharesOutstanding) : undefined,
        marketCap: data.MarketCapitalization ? parseInt(data.MarketCapitalization) : undefined,
        lastUpdated: new Date().toISOString(),
      };
    } catch (error) {
      throw new Error(`Failed to fetch from Alpha Vantage: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }

  /**
   * Fetch from Yahoo Finance (public, no API key required)
   * Note: This uses Yahoo Finance's public endpoints which may change
   */
  private async fetchFromYahoo(ticker: string): Promise<StockData> {
    // Yahoo Finance API endpoint (public, no auth required)
    // Note: This is a simplified implementation - actual Yahoo Finance API may require different endpoints
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}`;

    try {
      const response = await fetch(url, {
        headers: {
          "User-Agent": "SqueezeWeasel/1.0",
        },
      });

      if (!response.ok) {
        throw new Error(`Yahoo Finance API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const result = data.chart?.result?.[0];

      if (!result) {
        throw new Error("Invalid response from Yahoo Finance");
      }

      const meta = result.meta || {};
      const quote = result.indicators?.quote?.[0] || {};

      return {
        ticker,
        price: meta.regularMarketPrice,
        volume: meta.regularMarketVolume,
        marketCap: meta.marketCap,
        sharesOutstanding: meta.sharesOutstanding,
        lastUpdated: new Date().toISOString(),
      };
    } catch (error) {
      throw new Error(`Failed to fetch from Yahoo Finance: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }

  /**
   * Fetch from custom HTTP endpoint
   */
  private async fetchFromCustom(
    ticker: string,
    endpoint: string,
    apiKey?: string
  ): Promise<StockData> {
    // Replace {ticker} placeholder in endpoint URL
    const url = endpoint.replace("{ticker}", ticker);

    try {
      const headers: Record<string, string> = {
        "User-Agent": "SqueezeWeasel/1.0",
      };

      if (apiKey) {
        headers["Authorization"] = `Bearer ${apiKey}`;
      }

      const response = await fetch(url, { headers });

      if (!response.ok) {
        throw new Error(`Custom API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      // Map common field names
      return {
        ticker,
        shortInterest: data.shortInterest || data.short_interest || data.shortInterestPercent,
        float: data.float || data.sharesFloat,
        sharesOutstanding: data.sharesOutstanding || data.shares_outstanding,
        marketCap: data.marketCap || data.market_cap,
        borrowFee: data.borrowFee || data.borrow_fee,
        utilization: data.utilization,
        price: data.price || data.currentPrice,
        volume: data.volume,
        lastUpdated: data.lastUpdated || data.last_updated || new Date().toISOString(),
      };
    } catch (error) {
      throw new Error(`Failed to fetch from custom endpoint: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }

  /**
   * Fetch data for multiple tickers
   */
  async fetchMultipleTickers(
    tickers: string[],
    options: Omit<StockDataOptions, "ticker">
  ): Promise<StockData[]> {
    const results = await Promise.allSettled(
      tickers.map((ticker) => this.fetchStockData({ ...options, ticker }))
    );

    return results
      .filter((result): result is PromiseFulfilledResult<StockData> => result.status === "fulfilled")
      .map((result) => result.value);
  }
}

