/**
 * yfinance - market data downloader
 * Ticker class - main interface for fetching stock data
 */

import { get } from './data';
import { BASE_URL } from './const';
import { HistoryOptions, HistoryData, TickerInfo, QuoteData } from './types';

interface ChartResponse {
  chart: {
    result: Array<{
      meta: {
        currency: string;
        symbol: string;
        exchangeName: string;
        instrumentType: string;
        firstTradeDate: number;
        regularMarketTime: number;
        gmtoffset: number;
        timezone: string;
        exchangeTimezoneName: string;
        regularMarketPrice: number;
        chartPreviousClose: number;
        previousClose: number;
        [key: string]: unknown;
      };
      timestamp: number[];
      indicators: {
        quote: Array<{
          open: number[];
          high: number[];
          low: number[];
          close: number[];
          volume: number[];
        }>;
        adjclose?: Array<{
          adjclose: number[];
        }>;
      };
      events?: {
        dividends?: Record<string, { date: number; amount: number }>;
        splits?: Record<string, { date: number; numerator: number; denominator: number }>;
      };
    }>;
    error: null | { code: string; description: string };
  };
}

interface QuoteSummaryResponse {
  quoteSummary: {
    result: Array<{
      summaryProfile?: Record<string, unknown>;
      summaryDetail?: Record<string, unknown>;
      price?: Record<string, unknown>;
      [key: string]: unknown;
    }>;
    error: null | { code: string; description: string };
  };
}

/**
 * Parse period string to start/end timestamps
 */
function parsePeriod(period: string): { period1: number; period2: number } {
  const now = Math.floor(Date.now() / 1000);
  let period1: number;

  const match = period.match(/^(\d+)(d|wk|mo|y)$/);
  if (!match) {
    // Default to 1 month if invalid period
    period1 = now - 30 * 24 * 60 * 60;
  } else {
    const [, num, unit] = match;
    const n = parseInt(num, 10);
    switch (unit) {
      case 'd':
        period1 = now - n * 24 * 60 * 60;
        break;
      case 'wk':
        period1 = now - n * 7 * 24 * 60 * 60;
        break;
      case 'mo':
        period1 = now - n * 30 * 24 * 60 * 60;
        break;
      case 'y':
        period1 = now - n * 365 * 24 * 60 * 60;
        break;
      default:
        period1 = now - 30 * 24 * 60 * 60;
    }
  }

  if (period === 'max') {
    period1 = 0;
  }

  return { period1, period2: now };
}

/**
 * Parse date to timestamp
 */
function parseDate(date: string | Date): number {
  if (date instanceof Date) {
    return Math.floor(date.getTime() / 1000);
  }
  return Math.floor(new Date(date).getTime() / 1000);
}

/**
 * Ticker class for fetching stock data from Yahoo Finance
 */
export class Ticker {
  public readonly symbol: string;
  private _info: TickerInfo | null = null;

  constructor(symbol: string) {
    this.symbol = symbol.toUpperCase();
  }

  /**
   * Get historical market data
   */
  async history(options: HistoryOptions = {}): Promise<HistoryData[]> {
    const {
      period = '1mo',
      interval = '1d',
      start,
      end,
    } = options;

    let period1: number;
    let period2: number;

    if (start && end) {
      period1 = parseDate(start);
      period2 = parseDate(end);
    } else if (start) {
      period1 = parseDate(start);
      period2 = Math.floor(Date.now() / 1000);
    } else {
      const parsed = parsePeriod(period);
      period1 = parsed.period1;
      period2 = parsed.period2;
    }

    const url = `${BASE_URL}/v8/finance/chart/${encodeURIComponent(this.symbol)}`;
    const params = {
      period1: period1.toString(),
      period2: period2.toString(),
      interval,
      includePrePost: 'false',
      events: 'div,splits'
    };

    const response = await get<ChartResponse>(url, params);

    if (response.chart.error) {
      throw new Error(`Yahoo Finance API error: ${response.chart.error.description}`);
    }

    const result = response.chart.result?.[0];
    if (!result || !result.timestamp) {
      return [];
    }

    const { timestamp, indicators } = result;
    const quote = indicators.quote[0];
    const adjclose = indicators.adjclose?.[0]?.adjclose || quote.close;

    const data: HistoryData[] = [];
    for (let i = 0; i < timestamp.length; i++) {
      if (quote.open[i] !== null && quote.close[i] !== null) {
        data.push({
          date: new Date(timestamp[i] * 1000),
          open: quote.open[i],
          high: quote.high[i],
          low: quote.low[i],
          close: quote.close[i],
          adjClose: adjclose[i],
          volume: quote.volume[i]
        });
      }
    }

    return data;
  }

  /**
   * Get ticker info
   */
  async getInfo(): Promise<TickerInfo> {
    if (this._info) {
      return this._info;
    }

    const url = `${BASE_URL}/v10/finance/quoteSummary/${encodeURIComponent(this.symbol)}`;
    const params = {
      modules: 'summaryProfile,summaryDetail,price,quoteType'
    };

    const response = await get<QuoteSummaryResponse>(url, params);

    if (response.quoteSummary.error) {
      throw new Error(`Yahoo Finance API error: ${response.quoteSummary.error.description}`);
    }

    const result = response.quoteSummary.result?.[0];
    if (!result) {
      return { symbol: this.symbol };
    }

    // Merge all modules into a single info object
    const info: TickerInfo = {
      symbol: this.symbol,
      ...result.summaryProfile,
      ...result.summaryDetail,
      ...result.price
    };

    this._info = info;
    return info;
  }

  /**
   * Get ticker info (property-like access)
   */
  get info(): Promise<TickerInfo> {
    return this.getInfo();
  }

  /**
   * String representation
   */
  toString(): string {
    return `Ticker(${this.symbol})`;
  }
}

export default Ticker;
