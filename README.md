# yfinance

Download market data from Yahoo! Finance's API

**yfinance** offers a simple way to fetch financial & market data from [Yahoo!Ⓡ finance](https://finance.yahoo.com).

This repository contains two implementations:

- **[yfinance-py](./yfinance-py/)** - Python implementation (original)
- **[yfinance-node](./yfinance-node/)** - TypeScript/Node.js implementation

---

## Python (yfinance-py)

The original Python implementation with full feature set.

```bash
cd yfinance-py
pip install -e .
```

```python
import yfinance as yf

ticker = yf.Ticker("AAPL")
print(ticker.info)
print(ticker.history(period="1mo"))
```

See [yfinance-py/README.md](./yfinance-py/) for more details.

---

## Node.js / TypeScript (yfinance-node)

A simple TypeScript implementation for Node.js.

```bash
cd yfinance-node
npm install
npm run build
```

```typescript
import { Ticker, download, search } from 'yfinance';

const ticker = new Ticker('AAPL');
const history = await ticker.history({ period: '1mo' });
console.log(history);
```

See [yfinance-node/README.md](./yfinance-node/) for more details.

---

## Main components

Both implementations provide:

- `Ticker`: single ticker data
- `download`: download market data for multiple tickers
- `search`: quotes and news from search

---

> [!IMPORTANT]  
> **Yahoo!, Y!Finance, and Yahoo! finance are registered trademarks of Yahoo, Inc.**
>
> yfinance is **not** affiliated, endorsed, or vetted by Yahoo, Inc. It's an open-source tool that uses Yahoo's publicly available APIs, and is intended for research and educational purposes.
> 
> **You should refer to Yahoo!'s terms of use** ([here](https://policies.yahoo.com/us/en/yahoo/terms/product-atos/apiforydn/index.htm), [here](https://legal.yahoo.com/us/en/yahoo/terms/otos/index.html), and [here](https://policies.yahoo.com/us/en/yahoo/terms/index.htm)) **for details on your rights to use the actual data downloaded.
>
> Remember - the Yahoo! finance API is intended for personal use only.**

---

### Legal Stuff

**yfinance** is distributed under the **Apache Software License**. See
the [LICENSE.txt](./yfinance-py/LICENSE.txt) file for details.

yfinance is **not** affiliated, endorsed, or vetted by Yahoo, Inc. It's
an open-source tool that uses Yahoo's publicly available APIs, and is
intended for research and educational purposes.

---

### P.S.

Please drop me a note with any feedback you have.

**Ran Aroussi**

