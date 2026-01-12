/**
 * yfinance - market data downloader
 * Data fetching module
 */

import https from 'https';
import http from 'http';
import { URL } from 'url';
import { USER_AGENTS } from './const';

/**
 * Get a random user agent
 */
function getRandomUserAgent(): string {
  return USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
}

/**
 * Make an HTTP GET request
 */
export async function get<T = unknown>(
  url: string,
  params: Record<string, string | number | boolean | undefined> = {},
  timeout = 30000
): Promise<T> {
  const urlObj = new URL(url);

  // Add query parameters
  Object.keys(params).forEach(key => {
    const value = params[key];
    if (value !== undefined && value !== null) {
      urlObj.searchParams.append(key, String(value));
    }
  });

  const options: https.RequestOptions = {
    method: 'GET',
    headers: {
      'User-Agent': getRandomUserAgent(),
      'Accept': 'application/json',
      'Accept-Language': 'en-US,en;q=0.9'
    },
    timeout
  };

  return new Promise((resolve, reject) => {
    const protocol = urlObj.protocol === 'https:' ? https : http;
    const req = protocol.request(urlObj, options, (res) => {
      let data = '';

      res.on('data', (chunk: Buffer) => {
        data += chunk.toString();
      });

      res.on('end', () => {
        if (res.statusCode && res.statusCode >= 400) {
          reject(new Error(`HTTP ${res.statusCode}: ${res.statusMessage}`));
          return;
        }

        try {
          const jsonData = JSON.parse(data) as T;
          resolve(jsonData);
        } catch {
          resolve(data as T);
        }
      });
    });

    req.on('error', (err: Error) => {
      reject(err);
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timed out'));
    });

    req.end();
  });
}

/**
 * Make an HTTP POST request
 */
export async function post<T = unknown>(
  url: string,
  body: Record<string, unknown> = {},
  params: Record<string, string | number | boolean | undefined> = {},
  timeout = 30000
): Promise<T> {
  const urlObj = new URL(url);

  // Add query parameters
  Object.keys(params).forEach(key => {
    const value = params[key];
    if (value !== undefined && value !== null) {
      urlObj.searchParams.append(key, String(value));
    }
  });

  const postData = JSON.stringify(body);

  const options: https.RequestOptions = {
    method: 'POST',
    headers: {
      'User-Agent': getRandomUserAgent(),
      'Accept': 'application/json',
      'Accept-Language': 'en-US,en;q=0.9',
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    },
    timeout
  };

  return new Promise((resolve, reject) => {
    const protocol = urlObj.protocol === 'https:' ? https : http;
    const req = protocol.request(urlObj, options, (res) => {
      let data = '';

      res.on('data', (chunk: Buffer) => {
        data += chunk.toString();
      });

      res.on('end', () => {
        if (res.statusCode && res.statusCode >= 400) {
          reject(new Error(`HTTP ${res.statusCode}: ${res.statusMessage}`));
          return;
        }

        try {
          const jsonData = JSON.parse(data) as T;
          resolve(jsonData);
        } catch {
          resolve(data as T);
        }
      });
    });

    req.on('error', (err: Error) => {
      reject(err);
    });

    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timed out'));
    });

    req.write(postData);
    req.end();
  });
}
