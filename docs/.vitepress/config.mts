import { readFileSync } from 'node:fs'
import { defineConfig } from 'vitepress'

// .bev highlighting uses the same TextMate grammar as the VS Code extension.
const bev = { ...JSON.parse(readFileSync(new URL('./bev.tmLanguage.json', import.meta.url), 'utf8')), name: 'bev', aliases: ['bever'] }

export default defineConfig({
  title: 'Bever',
  titleTemplate: ':title · Bever',
  description: 'Business applications as code. An open-source language and framework for business applications.',
  lang: 'en-US',
  cleanUrls: true,
  // Pages mention the local development URLs of a running app.
  ignoreDeadLinks: 'localhostLinks',
  lastUpdated: true,
  sitemap: { hostname: 'https://bever.dev' },
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/brand/bever-icon.svg' }],
    ['meta', { name: 'theme-color', content: '#12424F' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: 'Bever' }],
    ['meta', { property: 'og:image', content: 'https://bever.dev/og.png' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
  ],
  markdown: {
    languages: [bev],
    theme: { light: 'github-light', dark: 'github-dark' },
  },
  themeConfig: {
    logo: { light: '/brand/bever-logo.svg', dark: '/brand/bever-logo-on-dark.svg', alt: 'Bever' },
    siteTitle: false,
    nav: [
      { text: 'Guide', link: '/guide/what-is-bever', activeMatch: '/guide/' },
      {
        text: 'Reference',
        activeMatch: '/reference/',
        items: [
          { text: 'Language', link: '/reference/language' },
          { text: 'CLI', link: '/reference/cli' },
          { text: 'HTTP API', link: '/reference/http-api' },
          { text: 'JavaScript SDK', link: '/reference/sdk' },
          { text: 'Semantic model', link: '/reference/semantic-model' },
          { text: 'Diagnostics', link: '/reference/diagnostics' },
        ],
      },
      { text: 'Examples', link: '/examples' },
      { text: 'Roadmap', link: '/roadmap' },
    ],
    sidebar: {
      '/guide/': [
        {
          text: 'Introduction',
          items: [
            { text: 'What is Bever?', link: '/guide/what-is-bever' },
            { text: 'Getting started', link: '/guide/getting-started' },
            { text: 'Tutorial: an order desk', link: '/guide/tutorial' },
            { text: 'Project structure', link: '/guide/project-structure' },
          ],
        },
        {
          text: 'Building apps',
          items: [
            { text: 'Entities and fields', link: '/guide/entities-and-fields' },
            { text: 'Relationships', link: '/guide/relationships' },
            { text: 'Actions and permissions', link: '/guide/permissions' },
            { text: 'Sign-in and accounts', link: '/guide/accounts' },
            { text: 'Presentation', link: '/guide/presentation' },
          ],
        },
        {
          text: 'Operating apps',
          items: [
            { text: 'Database migrations', link: '/guide/migrations' },
            { text: 'Customizing', link: '/guide/customizing' },
            { text: 'Deployment', link: '/guide/deployment' },
          ],
        },
      ],
      '/reference/': [
        {
          text: 'Reference',
          items: [
            { text: 'Language', link: '/reference/language' },
            { text: 'CLI', link: '/reference/cli' },
            { text: 'HTTP API', link: '/reference/http-api' },
            { text: 'JavaScript SDK', link: '/reference/sdk' },
            { text: 'Semantic model', link: '/reference/semantic-model' },
            { text: 'Diagnostics', link: '/reference/diagnostics' },
          ],
        },
      ],
    },
    socialLinks: [{ icon: 'github', link: 'https://github.com/bever-team' }],
    editLink: { pattern: 'https://github.com/bever-team/bever.dev/edit/main/docs/:path', text: 'Edit this page on GitHub' },
    search: { provider: 'local' },
    outline: { level: [2, 3] },
    footer: {
      message: 'Released under the Apache License 2.0. Documentation under CC BY 4.0.',
      copyright: 'Copyright © 2026 Ali Abdullah Yılmaz',
    },
  },
})
