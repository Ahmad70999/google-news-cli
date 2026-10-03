import Parser from 'rss-parser';

export const TOPICS = Object.freeze({
  world: 'WORLD',
  nation: 'NATION',
  business: 'BUSINESS',
  technology: 'TECHNOLOGY',
  tech: 'TECHNOLOGY',
  entertainment: 'ENTERTAINMENT',
  sports: 'SPORTS',
  science: 'SCIENCE',
  health: 'HEALTH',
});

const LANG_REGEX = /^[a-z]{2}(-[A-Z]{2})?$/;
const REGION_REGEX = /^[A-Z]{2}$/;

const parser = new Parser({
  timeout: 10000,
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'application/rss+xml, application/xml, text/xml;q=0.9, */*;q=0.8',
  },
  customFields: {
    item: ['source'],
  },
});

export function formatTimeAgo(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (isNaN(diffSeconds) || diffSeconds < 0) return '';
  if (diffSeconds < 60) return `${diffSeconds}s ago`;
  const diffMinutes = Math.floor(diffSeconds / 60);
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 30) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

export function parseTitleAndSource(rawTitle) {
  if (!rawTitle || typeof rawTitle !== 'string') {
    return { title: '', source: 'Google News' };
  }
  const sanitized = rawTitle.replace(/[\u0000-\u001F\u007F-\u009F]/g, '').trim();
  const lastDashIndex = sanitized.lastIndexOf(' - ');
  if (lastDashIndex !== -1) {
    return {
      title: sanitized.substring(0, lastDashIndex).trim(),
      source: sanitized.substring(lastDashIndex + 3).trim(),
    };
  }
  return { title: sanitized, source: 'Google News' };
}

export function sanitizeUrl(url) {
  if (!url || typeof url !== 'string') return '';
  try {
    const parsed = new URL(url);
    if (parsed.protocol === 'https:' || parsed.protocol === 'http:') {
      return parsed.href;
    }
  } catch {
  }
  return '';
}

export async function fetchNews({
  query,
  topic,
  limit = 5,
  language = 'en-US',
  region = 'US',
} = {}) {
  const safeLang = LANG_REGEX.test(language) ? language : 'en-US';
  const safeRegion = REGION_REGEX.test(region) ? region : 'US';
  const ceidLang = safeLang.split('-')[0];
  const ceid = `${safeRegion}:${ceidLang}`;

  const safeLimit = Math.max(1, Math.min(Number.isInteger(limit) ? limit : 5, 50));

  let feedUrl = '';

  if (query && typeof query === 'string') {
    const sanitizedQuery = query.slice(0, 200).trim();
    if (!sanitizedQuery) {
      throw new Error('Search query cannot be empty.');
    }
    const params = new URLSearchParams({
      q: sanitizedQuery,
      hl: safeLang,
      gl: safeRegion,
      ceid: ceid,
    });
    feedUrl = `https://news.google.com/rss/search?${params.toString()}`;
  } else if (topic && typeof topic === 'string') {
    const normalizedKey = topic.toLowerCase().trim();
    const normalizedTopic = Object.prototype.hasOwnProperty.call(TOPICS, normalizedKey)
      ? TOPICS[normalizedKey]
      : null;

    if (!normalizedTopic) {
      const valid = Object.keys(TOPICS).join(', ');
      throw new Error(`Unknown topic "${topic}". Available topics: ${valid}`);
    }
    const params = new URLSearchParams({
      hl: safeLang,
      gl: safeRegion,
      ceid: ceid,
    });
    feedUrl = `https://news.google.com/rss/headlines/section/topic/${normalizedTopic}?${params.toString()}`;
  } else {
    const params = new URLSearchParams({
      hl: safeLang,
      gl: safeRegion,
      ceid: ceid,
    });
    feedUrl = `https://news.google.com/rss?${params.toString()}`;
  }

  const feed = await parser.parseURL(feedUrl);

  const items = (feed.items || []).slice(0, safeLimit).map((item) => {
    const { title, source } = parseTitleAndSource(item.title);
    return {
      title,
      source: item.source?._ || source,
      link: sanitizeUrl(item.link),
      pubDate: item.pubDate,
      timeAgo: formatTimeAgo(item.pubDate || item.isoDate),
      snippet: typeof item.contentSnippet === 'string'
        ? item.contentSnippet.replace(/[\u0000-\u001F\u007F-\u009F]/g, '').trim()
        : '',
    };
  });

  return {
    feedTitle: typeof feed.title === 'string' ? feed.title.replace(/[\u0000-\u001F\u007F-\u009F]/g, '').trim() : 'Google News',
    count: items.length,
    items,
  };
}
