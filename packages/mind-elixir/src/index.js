import { visit } from 'unist-util-visit'
import { parse, parseAllDocuments } from "yaml";

import { yaml2MindElixirData } from '@zikojs/mind-elixir/utils'

const remarkElixirMind = ({
  useCdn = true,
} = {}) => () => {
  return function transformer(tree) {
    let hasElixirMind = false

    visit(tree, 'code', (node, index, parent) => {
      if (node.lang !== 'elixir-mind') return

      hasElixirMind = true;
      let config = {}, body = null;

      const documents = splitDocuments(node.value.trim());
      if(documents.length === 1) body = parseMindBody(documents[0])
      else {
        config = parse(documents[0])
        body = parseMindBody(documents[1])
      }

      // parent creates circular references, so serialize a clean copy
      const serialized_body = JSON.stringify(body, (key, value) => {
        if (key === 'parent') return undefined
        return value
      })

      const serialized_config = JSON.stringify(config)

      // Escape the JSON for use inside an HTML attribute
      const encoded_body = escapeHtmlAttribute(serialized_body)
      const encoded_config = escapeHtmlAttribute(serialized_config)

      parent.children[index] = {
        type: 'html',
        value: `
<div
  data-elixir-mind
  data-xmind-body="${encoded_body}"
  data-xmind-config="${encoded_config}"
></div>
`
      }
    })

    if (!hasElixirMind) return

    useCdn && tree.children.push({
      type: 'html',
      value: `
<style>
@import url('https://esm.sh/mind-elixir/style')
</style>

<script type="module" data-engine="zikojs, remark, mind-elixir">
import { MindMap } from 'https://esm.sh/@zikojs/mind-elixir@latest/src/mind/main.js'
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-elixir-mind]').forEach((element) => {
        const body = element.dataset.xmindBody
        const config = element.dataset?.xmindConfig
        if (!body) return
        const nodeData = JSON.parse(body)
        const nodeConfig = JSON.parse(config)
        const map = MindMap({height : '400px', ...nodeConfig}, nodeData)
        map.mount(element)
    })
})

</script>
`
    })
  }
}

function escapeHtmlAttribute(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

export default remarkElixirMind

const splitDocuments = (text) => {
  const documents = []
  let current = ''

  let quote = null
  let escaped = false

  const lines = text.trim().split('\n')

  for (const line of lines) {
    const isSeparator = line.match(/^---[ \t]*$/)

    if (isSeparator && !quote) {
      if (current.trim()) {
        documents.push(current.trim())
      }
      current = ''
      continue
    }

    current += (current ? '\n' : '') + line

    // Track JS string state
    for (let i = 0; i < line.length; i++) {
      const char = line[i]

      if (escaped) {
        escaped = false
        continue
      }

      if (char === '\\') {
        escaped = true
        continue
      }

      if (quote) {
        if (char === quote) {
          quote = null
        }
      } else if (
        char === "'" ||
        char === '"' ||
        char === '`'
      ) {
        quote = char
      }
    }
  }

  if (current.trim()) {
    documents.push(current.trim())
  }

  return documents
}

// const parseMindBody = (text) => {
//   try {
//     return JSON.parse(text)
//   } catch {
//     return yaml2MindElixirData(text)
//   }
// }

const parseMindBody = (text) => {
  const trimmed = text.trim()

  // JSON
  try {
    return JSON.parse(trimmed)
  } catch {}

  // JavaScript object/array
  if (
    trimmed.startsWith('{') ||
    trimmed.startsWith('[')
  ) {
    try {
      return Function(`"use strict"; return (${trimmed})`)()
    } catch {}
  }

  // YAML
  return yaml2MindElixirData(trimmed)
}