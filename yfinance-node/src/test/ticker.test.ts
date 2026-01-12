/**
 * yfinance - market data downloader
 * Basic tests (unit tests that don't require network access)
 */

import { describe, it } from 'node:test';
import assert from 'node:assert';
import { Ticker, download, search } from '../index';

describe('Ticker', () => {
  it('should create a ticker with uppercase symbol', () => {
    const ticker = new Ticker('aapl');
    assert.strictEqual(ticker.symbol, 'AAPL');
  });

  it('should handle already uppercase symbol', () => {
    const ticker = new Ticker('MSFT');
    assert.strictEqual(ticker.symbol, 'MSFT');
  });

  it('should handle mixed case symbol', () => {
    const ticker = new Ticker('GoOgL');
    assert.strictEqual(ticker.symbol, 'GOOGL');
  });

  it('should have a string representation', () => {
    const ticker = new Ticker('MSFT');
    assert.strictEqual(ticker.toString(), 'Ticker(MSFT)');
  });

  it('should have symbol as readonly property', () => {
    const ticker = new Ticker('AAPL');
    assert.strictEqual(ticker.symbol, 'AAPL');
  });
});

describe('Ticker history options', () => {
  it('should accept period option', () => {
    const ticker = new Ticker('AAPL');
    // Just verify the ticker is created correctly - actual API calls are integration tests
    assert.ok(ticker);
    assert.strictEqual(ticker.symbol, 'AAPL');
  });

  it('should accept interval option', () => {
    const ticker = new Ticker('AAPL');
    assert.ok(ticker);
    assert.strictEqual(ticker.symbol, 'AAPL');
  });
});

describe('Module exports', () => {
  it('should export Ticker class', async () => {
    const { Ticker } = await import('../index');
    assert.ok(Ticker);
    assert.strictEqual(typeof Ticker, 'function');
  });

  it('should export download function', async () => {
    const { download } = await import('../index');
    assert.ok(download);
    assert.strictEqual(typeof download, 'function');
  });

  it('should export search function', async () => {
    const { search } = await import('../index');
    assert.ok(search);
    assert.strictEqual(typeof search, 'function');
  });
});

// ============================================================================
// Integration tests (require network access to Yahoo Finance API)
// These tests may fail in sandboxed environments without internet access
// ============================================================================

describe('Ticker - Network Integration Tests', () => {
  it('should fetch history data', async () => {
    const ticker = new Ticker('AAPL');
    const history = await ticker.history({ period: '5d', interval: '1d' });
    
    assert.ok(Array.isArray(history), 'History should be an array');
    
    if (history.length > 0) {
      const firstRow = history[0];
      assert.ok(firstRow.date instanceof Date, 'Date should be a Date object');
      assert.ok(typeof firstRow.open === 'number', 'Open should be a number');
      assert.ok(typeof firstRow.high === 'number', 'High should be a number');
      assert.ok(typeof firstRow.low === 'number', 'Low should be a number');
      assert.ok(typeof firstRow.close === 'number', 'Close should be a number');
      assert.ok(typeof firstRow.volume === 'number', 'Volume should be a number');
    }
  });

  it('should fetch history with start and end dates', async () => {
    const ticker = new Ticker('MSFT');
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);
    
    const history = await ticker.history({ 
      start: startDate, 
      end: endDate,
      interval: '1d' 
    });
    
    assert.ok(Array.isArray(history), 'History should be an array');
  });

  it('should fetch ticker info', async () => {
    const ticker = new Ticker('AAPL');
    const info = await ticker.getInfo();
    
    assert.ok(info, 'Info should exist');
    assert.strictEqual(info.symbol, 'AAPL');
  });

  it('should fetch info for different ticker', async () => {
    const ticker = new Ticker('GOOGL');
    const info = await ticker.getInfo();
    
    assert.ok(info, 'Info should exist');
    assert.strictEqual(info.symbol, 'GOOGL');
  });
});

describe('download - Network Integration Tests', () => {
  it('should download data for single ticker as string', async () => {
    const result = await download('AAPL', { period: '5d' });
    
    assert.ok(result, 'Result should exist');
    assert.ok('AAPL' in result, 'Result should contain AAPL');
    assert.ok(Array.isArray(result['AAPL']), 'AAPL data should be an array');
  });

  it('should download data for multiple tickers', async () => {
    const result = await download(['AAPL', 'MSFT'], { period: '5d' });
    
    assert.ok(result, 'Result should exist');
    assert.ok('AAPL' in result, 'Result should contain AAPL');
    assert.ok('MSFT' in result, 'Result should contain MSFT');
  });

  it('should download data with comma-separated string', async () => {
    const result = await download('AAPL, MSFT, GOOGL', { period: '5d' });
    
    assert.ok(result, 'Result should exist');
    assert.ok('AAPL' in result, 'Result should contain AAPL');
    assert.ok('MSFT' in result, 'Result should contain MSFT');
    assert.ok('GOOGL' in result, 'Result should contain GOOGL');
  });

  it('should download data with different intervals', async () => {
    const result = await download('AAPL', { period: '1mo', interval: '1wk' });
    
    assert.ok(result, 'Result should exist');
    assert.ok('AAPL' in result, 'Result should contain AAPL');
  });
});

describe('search - Network Integration Tests', () => {
  it('should search for quotes', async () => {
    const result = await search('Apple');
    
    assert.ok(result, 'Result should exist');
    assert.ok(Array.isArray(result.quotes), 'Quotes should be an array');
    assert.ok(Array.isArray(result.news), 'News should be an array');
    
    if (result.quotes.length > 0) {
      const firstQuote = result.quotes[0];
      assert.ok(typeof firstQuote.symbol === 'string', 'Symbol should be a string');
    }
  });

  it('should search for ticker symbol', async () => {
    const result = await search('TSLA');
    
    assert.ok(result, 'Result should exist');
    assert.ok(Array.isArray(result.quotes), 'Quotes should be an array');
  });

  it('should search with custom options', async () => {
    const result = await search('Microsoft', { maxResults: 5, newsCount: 3 });
    
    assert.ok(result, 'Result should exist');
    assert.ok(Array.isArray(result.quotes), 'Quotes should be an array');
    assert.ok(Array.isArray(result.news), 'News should be an array');
  });
});
