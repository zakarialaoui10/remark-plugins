import { describe, expect, it } from 'vitest'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkMindElixir from 'remark-mind-elixir'

const processMarkdown = (markdown, options = {}) => {
  const processor = unified()
    .use(remarkParse)
    .use(remarkMindElixir, options)

  const tree = processor.parse(markdown)
  processor.runSync(tree)

  return tree
}

const mindElixirMarkdown = `
\`\`\`mind-elixir
topic: Root
children:
  - topic: Child
\`\`\`
`

describe('remarkMindElixir', () => {
  it('transforms a mind-elixir code block into an HTML node', () => {
    const tree = processMarkdown(mindElixirMarkdown)

    const htmlNode = tree.children.find(
      node =>
        node.type === 'html' &&
        node.value.includes('data-mind-elixir')
    )

    expect(htmlNode).toBeDefined()
    expect(htmlNode.value).toContain('data-mind-elixir')
    expect(htmlNode.value).toContain('data-xmind-body')
    expect(htmlNode.value).toContain('data-xmind-config')
  })

  it('does not transform other code blocks', () => {
    const tree = processMarkdown(`
\`\`\`js
console.log('hello')
\`\`\`
`)

    expect(
      tree.children.some(
        node =>
          node.type === 'html' &&
          node.value.includes('data-mind-elixir')
      )
    ).toBe(false)

    expect(
      tree.children.some(
        node =>
          node.type === 'code' &&
          node.lang === 'js'
      )
    ).toBe(true)
  })

  it('supports a mind-elixir block with configuration', () => {
    const tree = processMarkdown(`
\`\`\`mind-elixir
---
direction: 1
height: 600px
---
topic: Root
children:
  - topic: Child
\`\`\`
`)

    const htmlNode = tree.children.find(
      node =>
        node.type === 'html' &&
        node.value.includes('data-mind-elixir')
    )

    expect(htmlNode).toBeDefined()
    expect(htmlNode.value).toContain('data-xmind-body')
    expect(htmlNode.value).toContain('data-xmind-config')
  })

  it('removes parent properties from serialized mind map data', () => {
    const tree = processMarkdown(mindElixirMarkdown)

    const htmlNode = tree.children.find(
      node =>
        node.type === 'html' &&
        node.value.includes('data-mind-elixir')
    )

    expect(htmlNode).toBeDefined()

    const match = htmlNode.value.match(
      /data-xmind-body="([^"]+)"/
    )

    expect(match).toBeTruthy()
    expect(match[1]).not.toContain('parent')
  })

  it('injects CDN assets when useCdn is true', () => {
    const tree = processMarkdown(mindElixirMarkdown, {
      useCdn: true,
    })

    const styleNode = tree.children.find(
      node =>
        node.type === 'html' &&
        node.value.includes('mind-elixir/style')
    )

    const scriptNode = tree.children.find(
      node =>
        node.type === 'html' &&
        node.value.includes('@zikojs/mind-elixir')
    )

    expect(styleNode).toBeDefined()
    expect(scriptNode).toBeDefined()

    expect(scriptNode.value).toContain(
      'data-engine="zikojs, remark, mind-elixir"'
    )
  })

  it('does not inject CDN assets when useCdn is false', () => {
    const tree = processMarkdown(mindElixirMarkdown, {
      useCdn: false,
    })

    expect(
      tree.children.some(
        node =>
          node.type === 'html' &&
          node.value.includes('mind-elixir/style')
      )
    ).toBe(false)

    expect(
      tree.children.some(
        node =>
          node.type === 'html' &&
          node.value.includes('@zikojs/mind-elixir')
      )
    ).toBe(false)
  })

  it('does not modify the tree when no mind-elixir block exists', () => {
    const tree = processMarkdown(`
# Hello

Some text.

\`\`\`js
console.log('hello')
\`\`\`
`)

    expect(
      tree.children.some(
        node =>
          node.type === 'html' &&
          node.value.includes('data-mind-elixir')
      )
    ).toBe(false)

    expect(
      tree.children.some(
        node =>
          node.type === 'html' &&
          node.value.includes('mind-elixir/style')
      )
    ).toBe(false)
  })

  it('can transform multiple mind-elixir blocks', () => {
  const tree = processMarkdown(`
\`\`\`mind-elixir
topic: First
children:
  - topic: Child
\`\`\`

Some text.

\`\`\`mind-elixir
topic: Second
children:
  - topic: Child
\`\`\`
`)

  const mindMaps = tree.children.filter(
    node =>
      node.type === 'html' &&
      node.value.includes('<div') &&
      node.value.includes('data-mind-elixir')
  )

  expect(mindMaps).toHaveLength(2)

  const scripts = tree.children.filter(
    node =>
      node.type === 'html' &&
      node.value.includes('<script') &&
      node.value.includes('@zikojs/mind-elixir')
  )

  expect(scripts).toHaveLength(1)
})
})