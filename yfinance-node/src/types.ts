/**
 * yfinance - market data downloader
 * Type definitions
 */

export interface HistoryOptions {
  period?: string;
  interval?: string;
  start?: string | Date;
  end?: string | Date;
  actions?: boolean;
}

export interface QuoteData {
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
}

export interface HistoryData {
  date: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  adjClose: number;
  volume: number;
}

export interface SearchResult {
  symbol: string;
  shortname?: string;
  longname?: string;
  quoteType?: string;
  exchange?: string;
  exchDisp?: string;
}

export interface SearchResponse {
  quotes: SearchResult[];
  news: Array<{
    title: string;
    link: string;
    publisher: string;
    providerPublishTime: number;
  }>;
}

export interface TickerInfo {
  symbol?: string;
  shortName?: string;
  longName?: string;
  currency?: string;
  exchange?: string;
  quoteType?: string;
  marketCap?: number;
  [key: string]: unknown;
}

export interface DownloadOptions {
  period?: string;
  interval?: string;
  start?: string | Date;
  end?: string | Date;
  actions?: boolean;
}

export interface DownloadResult {
  [ticker: string]: HistoryData[];
}
