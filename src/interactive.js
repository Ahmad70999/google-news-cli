import { select, input } from '@inquirer/prompts';
import pc from 'picocolors';
import { fetchNews } from './news.js';
import { renderNews } from './formatter.js';

async function promptCategoryAction(categoryName, topic) {
  while (true) {
    const action = await select({
      message: 'Options:',
      choices: [
        { name: 'Back to categories', value: 'back' },
        { name: `Search by flags in ${categoryName}`, value: 'search' },
        { name: 'Refresh news', value: 'refresh' },
        { name: 'Exit', value: 'exit' },
      ],
      loop: false,
    });

    if (action === 'exit') {
      return 'exit';
    }

    if (action === 'back') {
      return 'back';
    }

    if (action === 'refresh') {
      console.log(pc.dim('\nFetching news...'));
      const data = await fetchNews({ topic, limit: 5 });
      renderNews(data);
      continue;
    }

    if (action === 'search') {
      const keyword = await input({
        message: `Search in ${categoryName} (or enter "back"):`,
      });
      const trimmed = (keyword || '').trim();
      if (!trimmed || trimmed.toLowerCase() === 'back') {
        continue;
      }

      const limitInput = await input({
        message: 'Number of articles (1-50):',
        default: '5',
      });
      const limit = parseInt(limitInput, 10) || 5;

      console.log(pc.dim('\nFetching news...'));
      const query = topic ? `${trimmed} ${categoryName}` : trimmed;
      const data = await fetchNews({ query, limit });
      renderNews(data);
    }
  }
}

async function handleSearchByFlags() {
  while (true) {
    const keyword = await input({
      message: 'Search keyword (or enter "back"):',
    });
    const trimmed = (keyword || '').trim();
    if (!trimmed || trimmed.toLowerCase() === 'back') {
      return 'back';
    }

    const topicChoice = await select({
      message: 'Filter by category (optional):',
      choices: [
        { name: 'All Categories', value: '' },
        { name: 'Technology', value: 'technology' },
        { name: 'Business', value: 'business' },
        { name: 'World', value: 'world' },
        { name: 'Sports', value: 'sports' },
        { name: 'Science', value: 'science' },
        { name: 'Health', value: 'health' },
        { name: 'Entertainment', value: 'entertainment' },
      ],
      loop: false,
    });

    const limitInput = await input({
      message: 'Number of articles (1-50):',
      default: '5',
    });
    const limit = parseInt(limitInput, 10) || 5;

    const regionInput = await input({
      message: 'Country/Region code:',
      default: 'US',
    });
    const region = (regionInput || 'US').trim().toUpperCase();

    const langInput = await input({
      message: 'Language code:',
      default: 'en-US',
    });
    const language = (langInput || 'en-US').trim();

    console.log(pc.dim('\nFetching news...'));
    const finalQuery = topicChoice ? `${trimmed} ${topicChoice}` : trimmed;
    const data = await fetchNews({
      query: finalQuery,
      limit,
      region,
      language,
    });
    renderNews(data);

    const postAction = await select({
      message: 'Options:',
      choices: [
        { name: 'Back to categories', value: 'back' },
        { name: 'Search again by flags', value: 'again' },
        { name: 'Exit', value: 'exit' },
      ],
      loop: false,
    });

    if (postAction === 'exit') {
      return 'exit';
    }
    if (postAction === 'back') {
      return 'back';
    }
  }
}

export async function runInteractive() {
  console.log(pc.bold(pc.cyan('\nGoogle News CLI\n')));

  while (true) {
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
          { name: 'Search by flags (filters)', value: 'flags' },
          { name: 'Exit', value: 'exit' },
        ],
        loop: false,
      });

      if (choice === 'exit') {
        return;
      }

      if (choice === 'flags') {
        const result = await handleSearchByFlags();
        if (result === 'exit') {
          return;
        }
        continue;
      }

      if (choice === 'search') {
        const query = await input({
          message: 'Enter search keyword (or enter "back"):',
        });
        const trimmed = (query || '').trim();
        if (!trimmed || trimmed.toLowerCase() === 'back') {
          continue;
        }

        console.log(pc.dim('\nFetching news...'));
        const data = await fetchNews({ query: trimmed, limit: 5 });
        renderNews(data);

        const postSearch = await select({
          message: 'Options:',
          choices: [
            { name: 'Back to categories', value: 'back' },
            { name: 'Exit', value: 'exit' },
          ],
          loop: false,
        });

        if (postSearch === 'exit') {
          return;
        }
        continue;
      }

      const categoryNames = {
        top: 'Top Stories',
        tech: 'Technology',
        business: 'Business',
        world: 'World',
        sports: 'Sports',
        science: 'Science',
        health: 'Health',
        entertainment: 'Entertainment',
      };

      const topic = choice === 'top' ? null : choice;
      const categoryName = categoryNames[choice] || choice;

      console.log(pc.dim('\nFetching news...'));
      const data = await fetchNews({ topic, limit: 5 });
      renderNews(data);

      const actionResult = await promptCategoryAction(categoryName, topic);
      if (actionResult === 'exit') {
        return;
      }
    } catch (err) {
      if (err.name === 'ExitPromptError') {
        return;
      }
      console.error(pc.red(`\nError: ${err.message}\n`));
      return;
    }
  }
}
