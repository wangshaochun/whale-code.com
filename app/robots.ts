import type { MetadataRoute } from 'next';

// 显式放行主流搜索引擎与 AI 抓取器，避免后续新增规则时误伤
const aiAndSearchBots = [
  'Googlebot',
  'Bingbot',
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-User',
  'anthropic-ai',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
  'Applebot',
  'Applebot-Extended',
  'CCBot',
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/' },
      ...aiAndSearchBots.map((userAgent) => ({ userAgent, allow: '/' })),
    ],
    sitemap: 'https://whale-code.com/sitemap.xml',
    host: 'https://whale-code.com',
  };
}
