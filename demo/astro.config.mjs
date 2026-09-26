// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import { unified } from '@astrojs/markdown-remark';
import rehypeElixirMind from 'rehype-mind-elixir'


// https://astro.build/config
export default defineConfig({
	markdown:{
		processor: unified({
			rehypePlugins: [
				rehypeElixirMind
			],
		}),
	},
	integrations: [
		starlight({
			
			title: 'Remark plugins',
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/zakarialaoui10/remark-plugins' }],
			sidebar: [
				{
					label: 'Guides',
					items: [
						{ label: 'Example Guide', slug: 'guides/example' },
					],
				},
				{
					label: 'Reference',
					items: [{ autogenerate: { directory: 'reference' } }],
				},
			],
		}),
	],
});
