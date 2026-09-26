# remark-mind-elixir

A [remark](https://github.com/remarkjs/remark) plugin for embedding interactive [Mind Elixir](https://docs.mind-elixir.com/) mind maps in Markdown.

It lets you define mind maps using YAML inside `mind-elixir` fenced code blocks and transforms them into interactive Mind Elixir maps.

## Features

* 📝 Define mind maps directly in Markdown
* 🌳 YAML-based mind map structure
* ⚙️ Optional YAML configuration
* ⚡ Automatic client-side rendering
* 🌐 Optional CDN-based runtime
* 🔌 Works with remark and the unified ecosystem
* 🧩 Built on top of [ZikoJS](https://github.com/zikojs)

## Installation

```bash
npm install remark-mind-elixir
```

## Usage

```js
import { remark } from 'remark'
import remarkMindElixir from 'remark-mind-elixir'

const markdown = `
# My Mind Map

\`\`\`mind-elixir
root:
  topic: JavaScript
  children:
    - topic: Browser
    - topic: Node.js
\`\`\`
`

const file = await remark()
  .use(remarkMindElixir)
  .process(markdown)

console.log(String(file))
```

## Usage with Astro

Install the plugin in your Astro project:

```bash
npm install remark-mind-elixir
```

Then add it to the `markdown.remarkPlugins` configuration in `astro.config.mjs`:

```js
// @ts-check
import { defineConfig } from 'astro/config'
import remarkMindElixir from 'remark-mind-elixir'

export default defineConfig({
  markdown: {
    remarkPlugins: [remarkMindElixir()],
  },
})
```

You can then use `mind-elixir` blocks directly in your Markdown or MDX pages:

````markdown
# JavaScript

```mind-elixir
root:
  topic: JavaScript
  children:
    - topic: Browser
      children:
        - topic: DOM
        - topic: Web APIs
    - topic: Node.js
    - topic: Deno
```
````

The plugin transforms the block during Astro's Markdown processing and injects the client-side Mind Elixir runtime automatically.

### Astro with CDN disabled

By default, `remark-mind-elixir` loads the client runtime from `esm.sh`.

You can disable this behavior:

```js
import { defineConfig } from 'astro/config'
import remarkMindElixir from 'remark-mind-elixir'

export default defineConfig({
  markdown: {
    remarkPlugins: [
      remarkMindElixir({
        useCdn: false,
      }),
    ],
  },
})
```

When `useCdn` is disabled, your application must provide the Mind Elixir client runtime itself.

## Markdown Syntax

Use an `mind-elixir` fenced code block:

````markdown
```mind-elixir
root:
  topic: JavaScript
  children:
    - topic: Browser
    - topic: Node.js
    - topic: Deno
```
````

The YAML is converted into the data structure expected by Mind Elixir.

## Configuration

A configuration document can optionally be placed before the mind-map data.

Separate the configuration and data using `---`:

````markdown
```mind-elixir
---
direction: right
---

root:
  topic: JavaScript
  children:
    - topic: Browser
    - topic: Node.js
```
````

The first YAML document is interpreted as plugin configuration, while the second document contains the mind-map data.

## Multiple Mind Maps

A Markdown document can contain multiple `mind-elixir` blocks:

````markdown
# Frontend

```mind-elixir
root:
  topic: Frontend
  children:
    - topic: HTML
    - topic: CSS
    - topic: JavaScript
```

# Backend

```mind-elixir
root:
  topic: Backend
  children:
    - topic: Node.js
    - topic: Python
    - topic: Rust
```
````

The client runtime is injected once when at least one mind map is present.

## Options

```js
remarkMindElixir({
  useCdn: true,
})
```

### `useCdn`

Controls whether the plugin injects the Mind Elixir browser runtime from a CDN.

**Type:** `boolean`

**Default:** `true`

```js
remarkMindElixir({
  useCdn: false,
})
```

When disabled, the plugin does not inject the CDN runtime. Your application must provide the client-side Mind Elixir runtime.

## Client Runtime

By default, the plugin injects the Mind Elixir runtime using `esm.sh`.

The generated HTML contains a container similar to:

```html
<div
  data-mind-elixir
  data-xmind-body="..."
  data-xmind-config="..."
></div>
```

The client runtime finds these containers and mounts a Mind Elixir map into each one.

## How It Works

```text
Markdown
   │
   ▼
remark
   │
   ▼
remark-mind-elixir
   │
   ├── Find `mind-elixir` blocks
   │
   ├── Parse YAML
   │
   ├── Convert YAML to Mind Elixir data
   │
   └── Generate HTML container
           │
           ▼
      Client runtime
           │
           ▼
      Mind Elixir map
```

## Ecosystem

`remark-mind-elixir` is designed to work with remark-compatible Markdown pipelines, including:

* [Remark](https://github.com/remarkjs/remark)
* [Unified](https://unifiedjs.com/)
* [MDX](https://mdxjs.com/)
* [Astro](https://astro.build/)
* [Vite](https://vite.dev/)

It is built on top of ZikoJS utilities while remaining a remark plugin rather than a ZikoJS-specific Markdown processor.

## Related Projects

* [ZikoJS](https://github.com/zikojs)
* [Mind Elixir](https://docs.mind-elixir.com/)
* [Remark](https://github.com/remarkjs/remark)
* [Unified](https://unifiedjs.com/)

## License

MIT + Mind Elixir License 