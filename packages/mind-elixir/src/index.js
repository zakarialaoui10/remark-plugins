import { visit } from 'unist-util-visit'
import { parse } from 'yaml'

import { yaml2MindElixirData } from '@zikojs/mind-elixir/utils'

const remarkElixirMind = ({
  useCdn = true,
} = {}) => {
  return function transformer(tree) {
    let hasElixirMind = false

    visit(tree, 'code', (node, index, parent) => {
      if (node.lang !== 'elixir-mind') return

      hasElixirMind = true

      const body = yaml2MindElixirData(node.value.trim())

      // parent creates circular references, so serialize a clean copy
      const serialized = JSON.stringify(body, (key, value) => {
        if (key === 'parent') return undefined
        return value
      })

      // Escape the JSON for use inside an HTML attribute
      const encoded = escapeHtmlAttribute(serialized)

      parent.children[index] = {
        type: 'html',
        value: `
<div
  data-elixir-mind
  data-xmind-body="${encoded}"
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

<script type="module">
import { MindMap } from 'https://esm.sh/@zikojs/mind-elixir@latest/src/mind/main.js'

document.querySelectorAll('[data-elixir-mind]').forEach((element) => {
  const raw = element.dataset.xmindBody

  if (!raw) return

  const nodeData = JSON.parse(raw)

  const map = MindMap({
    height: '400px',
    direction: 2
  }, nodeData)

  map.mount(element)
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