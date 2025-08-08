// @ts-check
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

let site;
let port;

switch (import.meta.env.PUBLIC_RUNTIME_ENVIRONMENT) {
  case 'development':
    port = 4323;
    site = "https://dev.anibookquotes.com";
    break;
  case 'production':
    port = 4324;
    site = "https://anibookquotes.com";
    break;
  default:
    port = 4322;
    site = `http://localhost:${port}`;
}

// https://astro.build/config
export default defineConfig({
	site,
	integrations: [mdx(), sitemap()],
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  server: {
    port
  }
});
