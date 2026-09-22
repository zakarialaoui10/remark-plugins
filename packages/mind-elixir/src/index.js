import { visit } from 'unist-util-visit'
import { parse } from 'yaml'

const remarkElixirMind = () => {
  return function transformer(tree) {
    let hasElixirMind = false

    visit(tree, 'code', (node, index, parent) => {
      if (node.lang !== 'elixir-mind') return

      hasElixirMind = true

      const { config, body } = parseElixirMind(node.value)

      const configJSON = escapeAttribute(JSON.stringify(config))
      const bodyJSON = escapeAttribute(JSON.stringify(body))

      parent.children[index] = {
        type: 'html',
        value: `
<div
  data-elixir-mind
  data-xmind-config="${configJSON}"
  data-xmind-body="${bodyJSON}"
></div>
`
      }
    })

    if (!hasElixirMind) return

    // Inject exactly once
    tree.children.push({
      type: 'html',
      value: `
<script type="module">
  import { tags } from 'https://esm.sh/ziko/src/dom/tags/index.js'

  console.log(tags.p('Hello world'))
  console.log('Hello world ...')
</script>
`
    })
  }
}

function parseElixirMind(source) {
  const lines = source.replace(/\r\n/g, '\n').split('\n')

  let config = {}
  let bodyLines = lines

  // Optional frontmatter
  if (lines[0]?.trim() === '---') {
    const end = lines.findIndex(
      (line, index) =>
        index > 0 && line.trim() === '---'
    )

    if (end !== -1) {
      const frontmatter = lines
        .slice(1, end)
        .join('\n')
        .trim()

      config = frontmatter
        ? parse(frontmatter) ?? {}
        : {}

      bodyLines = lines.slice(end + 1)
    }
  }

  const bodySource = bodyLines
    .join('\n')
    .trim()

  const body = parseMindBody(bodySource)

  return {
    config,
    body
  }
}

/**
 * Converts:
 *
 * Root
 *   Child 1
 *     Child 11
 *     Child 12
 *   Child 2
 *     Child 21
 *     Child 22
 *
 * into:
 *
 * {
 *   topic: 'Root',
 *   children: [
 *     {
 *       topic: 'Child 1',
 *       children: [...]
 *     }
 *   ]
 * }
 */
function parseMindBody(source) {
  if (!source) return null

  const lines = source
    .split('\n')
    .filter(line => line.trim())

  const root = {
    topic: lines[0].trim(),
    children: []
  }

  const stack = [
    {
      indent: getIndent(lines[0]),
      node: root
    }
  ]

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i]

    const indent = getIndent(line)
    const topic = line.trim()

    const node = {
      topic,
      children: []
    }

    while (
      stack.length &&
      indent <= stack.at(-1).indent
    ) {
      stack.pop()
    }

    if (!stack.length) {
      // Multiple root-level nodes
      root.children.push(node)
    } else {
      stack.at(-1).node.children.push(node)
    }

    stack.push({
      indent,
      node
    })
  }

  return cleanupTree(root)
}

function cleanupTree(node) {
  if (!node.children.length) {
    delete node.children
  } else {
    node.children.forEach(cleanupTree)
  }

  return node
}

function getIndent(line) {
  return line.match(/^\s*/)[0].replace(/\t/g, '  ').length
}

function escapeAttribute(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}

export default remarkElixirMind