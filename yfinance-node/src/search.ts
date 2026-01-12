/**
 * yfinance - market data downloader
 * Search functionality
 */

import { get } from './data';
import { BASE_URL } from './const';
import { SearchResult, SearchResponse } from './types';

interface YahooSearchResponse {
  quotes: Array<{
    symbol: string;
    shortname?: string;
    longname?: string;
    quoteType?: string;
    exchange?: string;
    exchDisp?: string;
    [key: string]: unknown;
  }>;
  news: Array<{
    title: string;
    link: string;
    publisher: string;
    providerPublishTime: number;
    [key: string]: unknown;
  }>;
  [key: string]: unknown;
}

export interface SearchOptions {
  maxResults?: number;
  newsCount?: number;
}

/**
 * Search for quotes and news on Yahoo Finance
 */
export async function search(
  query: string,
  options: SearchOptions = {}
): Promise<SearchResponse> {
  const { maxResults = 8, newsCount = 8 } = options;

  const url = `${BASE_URL}/v1/finance/search`;
  const params = {
    q: query,
    quotesCount: maxResults,
    newsCount,
    enableFuzzyQuery: 'false',
    quotesQueryId: 'tss_match_phrase_query',
    newsQueryId: 'news_cie_vespa'
  };

  const response = await get<YahooSearchResponse>(url, params);

  const quotes: SearchResult[] = (response.quotes || [])
    .filter(q => q.symbol)
    .map(q => ({
      symbol: q.symbol,
      shortname: q.shortname,
      longname: q.longname,
      quoteType: q.quoteType,
      exchange: q.exchange,
      exchDisp: q.exchDisp
    }));

  const news = (response.news || []).map(n => ({
    title: n.title,
    link: n.link,
    publisher: n.publisher,
    providerPublishTime: n.providerPublishTime
  }));

  return { quotes, news };
}

export default search;
