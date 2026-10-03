import pc from 'picocolors';

export function renderNews(data, { detailed = false } = {}) {
  const { feedTitle, count, items } = data;

  if (count === 0) {
    console.log(pc.yellow('\nNo news articles found.\n'));
    return;
  }

  const border = '='.repeat(60);
  console.log('\n' + pc.bold(pc.cyan(`Google News CLI - ${feedTitle}`)));
  console.log(pc.dim(border));

  items.forEach((item, index) => {
    const num = pc.bold(pc.cyan(`[${index + 1}]`));
    const title = pc.bold(pc.white(item.title));
    const source = pc.green(pc.bold(item.source));
    const time = item.timeAgo ? pc.dim(`(${item.timeAgo})`) : '';

    console.log(`\n${num} ${title}`);
    console.log(`    ${pc.dim('Source:')} ${source}  ${time}`);
    if (item.link) {
      console.log(`    ${pc.dim('Link:')}   ${pc.underline(pc.blue(item.link))}`);
    }

    if (detailed && item.snippet) {
      const cleanSnippet = item.snippet
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean)
        .slice(0, 2)
        .join(' ');
      if (cleanSnippet) {
        console.log(`    ${pc.dim('Summary:')} ${pc.gray(cleanSnippet)}`);
      }
    }
  });

  console.log('\n' + pc.dim(border));
  console.log(pc.dim(`Showing ${count} stories | Updated at ${new Date().toLocaleTimeString()}\n`));
}
