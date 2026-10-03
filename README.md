# Google News CLI (`gnews`)

A fast, lightweight Node.js command-line tool to fetch the latest headlines, topic feeds, and custom search results directly from Google News in your terminal. No API key required!

## Features

- ⚡ **Zero API Keys**: Uses public Google News RSS feeds.
- 🔍 **Search & Filter**: Search news by keyword, or filter by topic (`tech`, `world`, `business`, `sports`, etc.).
- 🌐 **Localization**: Supports language and region/country flags.
- 🎨 **Clean Terminal Output**: Formatted with colored source tags, time ago timestamps, and clickable article links.
- 📋 **JSON Output**: Easily pipe news to `jq`, scripts, or other CLI tools.

## Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd my-first-project

# Install dependencies
npm install

# (Optional) Link globally so you can use 'gnews' anywhere
npm link
```

## Usage

### Top Stories
```bash
node ./bin/cli.js
# Or if linked globally:
gnews
```

### Options

| Flag | Description | Example |
|------|-------------|---------|
| `-l, --limit <num>` | Number of articles to retrieve (default: 10) | `gnews -l 5` |
| `-t, --topic <name>` | News topic (`tech`, `business`, `world`, `sports`, `science`, `health`, `entertainment`) | `gnews -t tech` |
| `-s, --search <query>` | Search query for specific topics/events | `gnews -s "AI models"` |
| `-d, --detailed` | Display article summaries/snippets | `gnews -d` |
| `-j, --json` | Output raw JSON data | `gnews -s "Apple" --json` |
| `--lang <code>` | Language code (default: `en-US`) | `gnews --lang en-US` |
| `--region <code>` | Region/country code (default: `US`) | `gnews --region US` |
| `--list-topics` | List available topic categories | `gnews --list-topics` |

## License

MIT
