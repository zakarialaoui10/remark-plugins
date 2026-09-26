import { visit } from 'unist-util-visit'

const rehypeElixirMind = ({
  useCdn = true,
} = {}) => {
  return function transformer(tree) {
    let hasElixirMind = false

    visit(tree, 'elixirMind', (node, index, parent) => {
      hasElixirMind = true

      const serializedBody = JSON.stringify(
        node.body,
        (key, value) => {
          if (key === 'parent') return undefined
          return value
        }
      )

      const serializedConfig = JSON.stringify(node.config)

      const encodedBody = escapeHtmlAttribute(serializedBody)
      const encodedConfig = escapeHtmlAttribute(serializedConfig)

      parent.children[index] = {
        type: 'element',
        tagName: 'div',
        properties: {
          'data-mind-elixir': true,
          'data-xmind-body': encodedBody,
          'data-xmind-config': encodedConfig,
        },
        children: [],
      }
    })

    if (!hasElixirMind || !useCdn) return

    tree.children.push({
      type: 'element',
      tagName: 'script',
      properties: {
        type: 'module',
      },
      children: [
        {
          type: 'text',
          value: `
import { MindMap } from 'https://esm.sh/@zikojs/mind-elixir@latest/src/mind/main.js'

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-mind-elixir]').forEach((element) => {
    const body = element.dataset.xmindBody
    const config = element.dataset.xmindConfig

    if (!body) return

    const nodeData = JSON.parse(body)
    const nodeConfig = JSON.parse(config || '{}')

    const map = MindMap(
      { height: '400px', ...nodeConfig },
      nodeData
    )

    map.mount(element)
  })
})
`,
        },
      ],
    })
  }
}

export default rehypeElixirMind