import { select, input } from '@inquirer/prompts';
import pc from 'picocolors';
import { fetchNews } from './news.js';
import { renderNews } from './formatter.js';

export async function runInteractive() {
  console.log(pc.bold(pc.cyan('\nGoogle News CLI\n')));

  try {
    const choice = await select({
      message: 'Select a category:',
      choices: [
        { name: 'Top Stories', value: 'top' },
        { name: 'Technology', value: 'tech' },
        { name: 'Business', value: 'business' },
        { name: 'World', value: 'world' },
        { name: 'Sports', value: 'sports' },
        { name: 'Science', value: 'science' },
        { name: 'Health', value: 'health' },
        { name: 'Entertainment', value: 'entertainment' },
        { name: 'Search by keyword', value: 'search' },
        { name: 'Exit', value: 'exit' },
      ],
      loop: false,
    });

    if (choice === 'exit') {
      return;
    }

    let query = null;
    let topic = null;

    if (choice === 'search') {
      query = await input({
        message: 'Enter search keyword:',
        validate: (val) => (val && val.trim().length > 0 ? true : 'Please enter a search keyword'),
      });
    } else if (choice !== 'top') {
      topic = choice;
    }

    console.log(pc.dim('\nFetching news...'));
    const data = await fetchNews({ query, topic, limit: 5 });
    renderNews(data);
  } catch (err) {
    if (err.name === 'ExitPromptError') {
      return;
    }
    console.error(pc.red(`\nError: ${err.message}\n`));
  }
}
