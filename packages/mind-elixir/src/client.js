import { MindMap } from '@zikojs/mind-elixir/no-css'

document.querySelectorAll('[data-elixir-mind]').forEach((element) => {
  const raw = element.dataset.xmindBody
  const config = element.dataset?.xmindConfig

  if (!raw) return

  const nodeData = JSON.parse(raw)
  const nodeConfig = JSON.parse(config)

  const map = MindMap(nodeConfig, nodeData)

  map.mount(element)
})