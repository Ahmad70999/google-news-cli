#!/usr/bin/env node

import { Command } from 'commander';
import pc from 'picocolors';
import { fetchNews, TOPICS } from '../src/news.js';
import { renderNews } from '../src/formatter.js';

const program = new Command();

program
  .name('gnews')
  .description('A command-line tool to get the latest news from Google')
  .version('1.0.0')
  .option('-s, --search <query>', 'search news for a specific query')
  .option('-t, --topic <topic>', 'filter by topic (world, tech, business, sports, science, health, entertainment)')
  .option('-l, --limit <number>', 'number of articles to show (default: 10)', '10')
  .option('-d, --detailed', 'display article snippets/summaries', false)
  .option('-j, --json', 'output raw JSON data', false)
  .option('--lang <language>', 'language code (default: en-US)', 'en-US')
  .option('--region <country>', 'country code (default: US)', 'US')
  .option('--list-topics', 'list all available topics')
  .action(async (options) => {
    if (options.listTopics) {
      console.log(pc.bold('\nAvailable Topics:'));
      console.log(
        Object.keys(TOPICS)
          .map((t) => `  - ${pc.cyan(t)}`)
          .join('\n') + '\n'
      );
      return;
    }

    try {
      const limit = parseInt(options.limit, 10) || 10;

      const data = await fetchNews({
        query: options.search,
        topic: options.topic,
        limit,
        language: options.lang,
        region: options.region,
      });

      if (options.json) {
        console.log(JSON.stringify(data, null, 2));
      } else {
        renderNews(data, { detailed: options.detailed });
      }
    } catch (error) {
      console.error(pc.red(`\nError: ${error.message}\n`));
      process.exit(1);
    }
  });

program.parse(process.argv);
