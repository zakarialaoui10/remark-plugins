import { visit } from 'unist-util-visit'
import { parse, parseAllDocuments } from "yaml";
import {
  escapeHtmlAttribute,
  splitDocuments,
  parseMindBody,
} from './utils.js'

const remarkMindElixir = ({
  useCdn = true,
} = {}) => {
  return function transformer(tree) {
    let hasElixirMind = false

    visit(tree, 'code', (node, index, parent) => {
      if (node.lang !== 'mind-elixir') return

      hasElixirMind = true;
      let config = {}, body = null;

      const documents = splitDocuments(node.value.trim());
      if (documents.length === 1) body = parseMindBody(documents[0])
      else {
        config = parse(documents[0])
        body = parseMindBody(documents[1])
      }

      const serialized_body = JSON.stringify(body, (key, value) => {
        if (key === 'parent') return undefined
        return value
      })
      const serialized_config = JSON.stringify(config)

      const encoded_body = escapeHtmlAttribute(serialized_body)
      const encoded_config = escapeHtmlAttribute(serialized_config)

      parent.children[index] = {
        type: 'html',
        value: `
<div
  data-mind-elixir
  data-xmind-body="${encoded_body}"
  data-xmind-config="${encoded_config}"
></div>
`
      }
    })

    if (!hasElixirMind) return

    if (useCdn) {
      tree.children.push({
        type: 'html',
        value: `<style>\n@import url('https://esm.sh/mind-elixir/style')\n</style>`
      })

      tree.children.push({
        type: 'html',
        value: `
<script type="module" data-engine="zikojs, remark, mind-elixir">
import { MindMap } from 'https://esm.sh/@zikojs/mind-elixir@latest/src/mind/main.js'
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-mind-elixir]').forEach((element) => {
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
}

export default remarkMindElixir