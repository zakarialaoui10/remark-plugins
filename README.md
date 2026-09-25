# ZikoJS Remark Plugins

A collection of [remark](https://github.com/remarkjs/remark) plugins for embedding interactive and structured content in Markdown, built on top of [ZikoJS](https://github.com/zikojs).

## Plugins

|Plugin|Description|
|-|-|
|`remark-mind-elixir`| Embed interactive **MindElixir** mind maps in Markdown. |

> More plugins are planned for diagrams, visualizations, 3D scenes, and other interactive content.

## Installation

Install the plugin you need:

```bash
npm install remark-mind-elixir
```

## Usage

Use the plugins with any [unified](https://unifiedjs.com/) / remark-compatible pipeline.

```js
import { remark } from 'remark'
import remarkMindElixir from 'remark-mind-elixir'

const file = await remark()
  .use(remarkMindElixir)
  .process(markdown)

console.log(String(file))
```

## Markdown

Plugins can introduce their own fenced Markdown syntax.

For example, `remark-mind-elixir` uses the `elixir-mind` code block:

````markdown
```elixir-mind
root:
  topic: JavaScript
  children:
    - topic: Browser
    - topic: Node.js
```
````

The plugin transforms the block into an interactive MindElixir mind map.

## Ecosystem

These plugins are designed to work with the broader Markdown ecosystem:

* [Remark](https://github.com/remarkjs/remark)
* [Unified](https://unifiedjs.com/)
* [MDX](https://mdxjs.com/)
* [Astro](https://astro.build/)
* [Vite](https://vite.dev/)

ZikoJS provides the underlying components and utilities used by the plugins, while the remark plugins themselves are designed to remain usable in any compatible remark environment.

## Documentation

Full documentation is available at:

**[ZikoJS Remark Plugins Documentation](https://remark.zikojs.org/)**

## Development

Clone the repository and install dependencies:

```bash
git clone https://github.com/zikojs/remark-plugins.git
cd remark-plugins
npm install
```

Start the documentation site:

```bash
npm run dev
```

Build the documentation:

```bash
npm run build
```

## Contributing

Contributions, issues, and plugin ideas are welcome.

When adding a new plugin, keep the remark transformer independent from any specific application framework and document its Markdown syntax and configuration.

## License

MIT
