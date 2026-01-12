# yfinance-node

Download market data from Yahoo! Finance API - TypeScript/Node.js implementation.

## Installation

```bash
npm install
npm run build
```

## Usage

### Ticker

```typescript
import { Ticker } from 'yfinance';

// Create a ticker
const ticker = new Ticker('AAPL');

// Get historical data
const history = await ticker.history({ period: '1mo', interval: '1d' });
console.log(history);

// Get ticker info
const info = await ticker.getInfo();
console.log(info);
```

### Download multiple tickers

```typescript
import { download } from 'yfinance';

// Download data for multiple tickers
const data = await download(['AAPL', 'MSFT', 'GOOGL'], { period: '1mo' });
console.log(data);
```

### Search

```typescript
import { search } from 'yfinance';

// Search for quotes
const results = await search('Apple');
console.log(results.quotes);
console.log(results.news);
```

## API Reference

### Ticker

- `new Ticker(symbol: string)` - Create a new ticker instance
- `ticker.history(options)` - Get historical market data
  - `options.period` - Period to download (e.g., '1d', '5d', '1mo', '1y', 'max')
  - `options.interval` - Data interval (e.g., '1m', '5m', '1h', '1d', '1wk', '1mo')
  - `options.start` - Start date (string or Date)
  - `options.end` - End date (string or Date)
- `ticker.getInfo()` - Get ticker information

### download

- `download(tickers, options)` - Download data for one or more tickers
  - `tickers` - String or array of ticker symbols
  - `options` - Same as `ticker.history()`

### search

- `search(query, options)` - Search Yahoo Finance
  - `query` - Search query
  - `options.maxResults` - Maximum number of results (default: 8)
  - `options.newsCount` - Number of news items (default: 8)

## License

Apache-2.0
