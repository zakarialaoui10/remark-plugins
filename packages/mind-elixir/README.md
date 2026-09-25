# remark-mind-elixir

A [remark](https://github.com/remarkjs/remark) plugin for embedding interactive [Mind Elixir](https://docs.mind-elixir.com/) mind maps in Markdown.

It lets you define mind maps using YAML inside `elixir-mind` fenced code blocks and transforms them into interactive Mind Elixir maps.

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

\`\`\`elixir-mind
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

## Markdown Syntax

Use an `elixir-mind` fenced code block:

````markdown
```elixir-mind
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
```elixir-mind
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

A Markdown document can contain multiple `elixir-mind` blocks:

````markdown
# Frontend

```elixir-mind
root:
  topic: Frontend
  children:
    - topic: HTML
    - topic: CSS
    - topic: JavaScript
```

# Backend

```elixir-mind
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

The generated Markdown contains a container similar to:

```html
<div
  data-elixir-mind
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
   ├── Find `elixir-mind` blocks
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

MIT
