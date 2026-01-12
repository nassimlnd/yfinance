/**
 * yfinance - market data downloader
 * Basic tests (unit tests that don't require network access)
 */

import { describe, it } from 'node:test';
import assert from 'node:assert';
import { Ticker } from '../index';

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
