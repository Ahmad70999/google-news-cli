import Parser from 'rss-parser';

export const TOPICS = {
  world: 'WORLD',
  nation: 'NATION',
  business: 'BUSINESS',
  technology: 'TECHNOLOGY',
  tech: 'TECHNOLOGY',
  entertainment: 'ENTERTAINMENT',
  sports: 'SPORTS',
  science: 'SCIENCE',
  health: 'HEALTH',
};

const parser = new Parser({
  customFields: {
    item: ['source'],
  },
});

export function formatTimeAgo(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (isNaN(diffSeconds)) return dateString;
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
  if (!rawTitle) return { title: '', source: 'Google News' };
  const lastDashIndex = rawTitle.lastIndexOf(' - ');
  if (lastDashIndex !== -1) {
    return {
      title: rawTitle.substring(0, lastDashIndex).trim(),
      source: rawTitle.substring(lastDashIndex + 3).trim(),
    };
  }
  return { title: rawTitle.trim(), source: 'Google News' };
}

export async function fetchNews({
  query,
  topic,
  limit = 10,
  language = 'en-US',
  region = 'US',
} = {}) {
  const langParam = `${language}`;
  const ceid = `${region}:${language.split('-')[0]}`;
  let feedUrl = '';

  if (query) {
    feedUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(
      query
    )}&hl=${langParam}&gl=${region}&ceid=${ceid}`;
  } else if (topic) {
    const normalizedTopic = TOPICS[topic.toLowerCase()];
    if (!normalizedTopic) {
      const valid = Object.keys(TOPICS).join(', ');
      throw new Error(`Unknown topic "${topic}". Available topics: ${valid}`);
    }
    feedUrl = `https://news.google.com/rss/headlines/section/topic/${normalizedTopic}?hl=${langParam}&gl=${region}&ceid=${ceid}`;
  } else {
    feedUrl = `https://news.google.com/rss?hl=${langParam}&gl=${region}&ceid=${ceid}`;
  }

  const feed = await parser.parseURL(feedUrl);

  const items = (feed.items || []).slice(0, limit).map((item) => {
    const { title, source } = parseTitleAndSource(item.title);
    return {
      title,
      source: item.source?._ || source,
      link: item.link,
      pubDate: item.pubDate,
      timeAgo: formatTimeAgo(item.pubDate || item.isoDate),
      snippet: item.contentSnippet || '',
    };
  });

  return {
    feedTitle: feed.title,
    count: items.length,
    items,
  };
}
