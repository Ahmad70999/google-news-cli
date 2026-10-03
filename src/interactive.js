import { select, input } from '@inquirer/prompts';
import pc from 'picocolors';
import { fetchNews } from './news.js';
import { renderNews } from './formatter.js';

export async function runInteractive() {
  console.log(pc.bold(pc.cyan('\n 🌟 Google News Reader\n')));

  while (true) {
    try {
      const choice = await select({
        message: 'What news would you like to see?',
        choices: [
          { name: '🔥 Top Stories', value: 'top' },
          { name: '💻 Technology', value: 'tech' },
          { name: '💼 Business', value: 'business' },
          { name: '🌍 World News', value: 'world' },
          { name: '⚽ Sports', value: 'sports' },
          { name: '🔬 Science', value: 'science' },
          { name: '🏥 Health', value: 'health' },
          { name: '🎬 Entertainment', value: 'entertainment' },
          { name: '🔍 Search by keyword...', value: 'search' },
          { name: '❌ Exit', value: 'exit' },
        ],
      });

      if (choice === 'exit') {
        console.log(pc.dim('\nHave a great day!\n'));
        break;
      }

      let query = null;
      let topic = null;

      if (choice === 'search') {
        query = await input({
          message: 'Enter keyword to search:',
          validate: (val) => (val.trim().length > 0 ? true : 'Please enter a search query'),
        });
      } else if (choice !== 'top') {
        topic = choice;
      }

      console.log(pc.dim('\nFetching news...'));
      const data = await fetchNews({ query, topic, limit: 5 });
      renderNews(data);

      const nextAction = await select({
        message: 'What would you like to do next?',
        choices: [
          { name: '📰 Read more news', value: 'again' },
          { name: '🚪 Exit', value: 'exit' },
        ],
      });

      if (nextAction === 'exit') {
        console.log(pc.dim('\nHave a great day!\n'));
        break;
      }
    } catch (err) {
      if (err.name === 'ExitPromptError') {
        console.log(pc.dim('\n\nGoodbye!\n'));
        break;
      }
      console.error(pc.red(`\nError: ${err.message}\n`));
      break;
    }
  }
}
