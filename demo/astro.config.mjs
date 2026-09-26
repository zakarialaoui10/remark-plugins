// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import remarkElixirMind from 'remark-mind-elixir'
// import { createMarkdownProcessor } from '@astrojs/markdown-remark'


// https://astro.build/config
export default defineConfig({
	markdown:{
		remarkPlugins: [
          remarkElixirMind,
        ],
        // rehypePlugins: [
        //    remarkElixirMind,
        // ],
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
