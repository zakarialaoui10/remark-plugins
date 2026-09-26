# ZikoJS Rehype Plugins

A collection of [rehype](https://github.com/rehypejs/rehype) plugins for embedding interactive and structured content in HTML generated from Markdown, built on top of [ZikoJS](https://github.com/zikojs).

## Plugins

|Plugin|Description|
|-|-|
|`rehype-mind-elixir` | Embed interactive **Mind Elixir** mind maps in Markdown.|

> More plugins are planned for diagrams, visualizations, 3D scenes, and other interactive content.

## Installation

Install the plugin you need:

```bash
npm install rehype-mind-elixir
```

## Usage

Use the plugins with any [unified](https://unifiedjs.com/) / rehype-compatible pipeline.

```js
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeMindElixir from 'rehype-mind-elixir'
import rehypeStringify from 'rehype-stringify'

const file = await unified()
  .use(remarkParse)
  .use(remarkRehype)
  .use(rehypeMindElixir)
  .use(rehypeStringify)
  .process(markdown)

console.log(String(file))
```

## Markdown

Plugins can introduce their own fenced Markdown syntax.

For example, `rehype-mind-elixir` uses the `mind-elixir` code block:

````markdown
```mind-elixir
topic: JavaScript
children:
  - topic: Browser
  - topic: Node.js
```
````

The Markdown is converted to HAST before `rehype-mind-elixir` processes the resulting HTML tree and transforms the code block into an interactive Mind Elixir map.

## Ecosystem

These plugins are designed to work with the broader unified ecosystem, including:

* [Astro](https://astro.build/) — Markdown and content processing
* [MDX](https://mdxjs.com/) — Markdown with JSX
* [Unified](https://unifiedjs.com/) — content transformation ecosystem
* [Vite](https://vite.dev/) — build tooling

ZikoJS provides the components and utilities used by the plugins, while the plugins remain usable in compatible rehype environments.
