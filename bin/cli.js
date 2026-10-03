#!/usr/bin/env node

import { Command } from 'commander';
import pc from 'picocolors';
import { fetchNews, TOPICS } from '../src/news.js';
import { renderNews } from '../src/formatter.js';
import { runInteractive } from '../src/interactive.js';

const program = new Command();

program
  .name('gnews')
  .description('Easy command-line tool for Google News')
  .version('1.1.0')
  .argument('[queryOrTopic]', 'Topic (tech, world, sports...) or search keyword')
  .argument('[count]', 'Number of news items to fetch')
  .option('-i, --interactive', 'Run in interactive menu mode')
  .option('-s, --search <query>', 'Search news by keyword')
  .option('-t, --topic <topic>', 'Filter by topic')
  .option('-l, --limit <number>', 'Number of articles to show', '5')
  .option('-d, --detailed', 'Display article snippets', false)
  .option('-j, --json', 'Output raw JSON data', false)
  .option('--lang <language>', 'Language code', 'en-US')
  .option('--region <country>', 'Country code', 'US')
  .option('--list-topics', 'List available topics')
  .action(async (queryOrTopic, count, options) => {
    if (options.listTopics) {
      console.log(pc.bold('\nAvailable Topics:'));
      console.log(
        Object.keys(TOPICS)
          .map((t) => `  - ${pc.cyan(t)}`)
          .join('\n') + '\n'
      );
      return;
    }

    const passedArgs = process.argv.slice(2);
    const hasExplicitArgsOrFlags = passedArgs.length > 0;

    if (options.interactive || (!hasExplicitArgsOrFlags && process.stdin.isTTY)) {
      await runInteractive();
      return;
    }

    let topic = options.topic;
    let query = options.search;
    let limit = parseInt(count || options.limit, 10) || 5;

    if (queryOrTopic) {
      if (/^\d+$/.test(queryOrTopic)) {
        limit = parseInt(queryOrTopic, 10);
      } else {
        const lower = queryOrTopic.toLowerCase();
        if (TOPICS[lower]) {
          topic = lower;
        } else {
          query = queryOrTopic;
        }
      }
    }

    try {
      const data = await fetchNews({
        query,
        topic,
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
