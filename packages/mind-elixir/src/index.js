import { visit } from 'unist-util-visit'
import { parse } from 'yaml'

const remarkElixirMind = () => {
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

    tree.children.push({
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

export function yaml2MindElixirData(source) {
  if (typeof source !== 'string') {
    throw new TypeError('Expected a YAML string')
  }

  const data = parse(source)

  const nodes = Array.isArray(data) ? data : [data]

  if (!nodes.length) {
    return null
  }

  const root = normalizeNode(nodes[0])

  root.root = true

  if (nodes.length > 1) {
    root.children ??= []

    for (const node of nodes.slice(1)) {
      root.children.push(normalizeNode(node, root))
    }
  }

  return root
}

function normalizeNode(node, parent = undefined) {
  if (!node || typeof node !== 'object' || Array.isArray(node)) {
    throw new TypeError('Mind-Elixir node must be an object')
  }

  if (typeof node.topic !== 'string') {
    throw new TypeError('Mind-Elixir node must have a string topic')
  }

  const result = {
    ...node,
    id: node.id ?? globalThis.crypto.randomUUID()
  }

  if (node.children !== undefined) {
    if (!Array.isArray(node.children)) {
      throw new TypeError(
        `"children" must be an array for node "${node.topic}"`
      )
    }

    result.children = node.children.map(child =>
      normalizeNode(child, result)
    )
  }

  if (parent) {
    result.parent = parent
  }

  return result
}

export default remarkElixirMind