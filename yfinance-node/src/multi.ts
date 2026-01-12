/**
 * yfinance - market data downloader
 * Multi-ticker download functionality
 */

import { Ticker } from './ticker';
import { DownloadOptions, DownloadResult, HistoryData } from './types';

/**
 * Download historical data for multiple tickers
 */
export async function download(
  tickers: string | string[],
  options: DownloadOptions = {}
): Promise<DownloadResult> {
  // Normalize tickers to array
  const tickerList = Array.isArray(tickers)
    ? tickers
    : tickers.split(/[,\s]+/).filter(t => t.trim());

  // Download data for each ticker in parallel
  const results = await Promise.allSettled(
    tickerList.map(async (symbol) => {
      const ticker = new Ticker(symbol);
      const data = await ticker.history({
        period: options.period,
        interval: options.interval,
        start: options.start,
        end: options.end,
        actions: options.actions
      });
      return { symbol: symbol.toUpperCase(), data };
    })
  );

  // Collect results
  const result: DownloadResult = {};
  for (const r of results) {
    if (r.status === 'fulfilled') {
      result[r.value.symbol] = r.value.data;
    }
  }

  return result;
}

export default download;
