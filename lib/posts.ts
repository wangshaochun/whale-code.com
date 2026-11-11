import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), 'posts');

export type Post = {
  id: string;
  title: string;
  description?: string;
  date?: string;
  updated?: string;
  tags: string[];
  author?: string;
  draft: boolean;
  readingTime: number;
};

export type PostWithContent = Post & {
  content: string;
};

export type PostHeading = {
  level: 2 | 3;
  text: string;
  id: string;
};

type Frontmatter = {
  title?: unknown;
  description?: unknown;
  date?: unknown;
  updated?: unknown;
  tags?: unknown;
  author?: unknown;
  draft?: unknown;
};

function asString(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() ? value.trim() : undefined;
}

function asTags(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map((tag) => String(tag).trim()).filter(Boolean);
}

function buildPost(id: string, data: Frontmatter, content: string): PostWithContent {
  const title = asString(data.title) ?? id;
  const readingTime = Math.max(1, Math.ceil(content.replace(/\s/g, '').length / 400));

  return {
    id,
    title,
    description: asString(data.description),
    date: asString(data.date),
    updated: asString(data.updated),
    tags: asTags(data.tags),
    author: asString(data.author),
    draft: data.draft === true,
    readingTime,
    content,
  };
}

function readPostFile(fileName: string): PostWithContent | null {
  const id = fileName.replace(/\.md$/, '');
  const fullPath = path.join(postsDirectory, fileName);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const matterResult = matter(fileContents);

  return buildPost(id, matterResult.data as Frontmatter, matterResult.content);
}

// 获取所有文章ID用于静态路径生成（草稿不参与构建）
export function getAllPostIds() {
  if (!fs.existsSync(postsDirectory)) return [];
  return getAllPosts().map((post) => ({ id: post.id }));
}

// 获取所有文章的列表数据
export function getAllPosts(): Post[] {
  if (!fs.existsSync(postsDirectory)) return [];

  const fileNames = fs.readdirSync(postsDirectory).filter((fileName) => fileName.endsWith('.md'));

  return fileNames
    .map((fileName) => readPostFile(fileName))
    .filter((post): post is PostWithContent => Boolean(post) && !post!.draft)
    .map(({ content, ...post }) => post)
    .sort((a, b) => {
      const aDate = a.updated ?? a.date ?? '';
      const bDate = b.updated ?? b.date ?? '';
      if (aDate && bDate && aDate !== bDate) return aDate < bDate ? 1 : -1;
      if (aDate && !bDate) return -1;
      if (!aDate && bDate) return 1;
      return a.title.localeCompare(b.title, 'zh-CN');
    });
}

// 去除 Markdown 语法，用于生成摘要与 meta description
export function stripMarkdown(input: string): string {
  return input
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/^\s*\d+[、.]\s*/gm, ' ')
    .replace(/[#>*`_~|]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function getPostDescription(post: Post, content?: string): string {
  if (post.description) return post.description;
  const text = stripMarkdown(content ?? '');
  if (text) return text.slice(0, 160);
  return `${post.title}：鲸码研发团队的技术实践与排障记录。`;
}

// 根据ID获取单篇文章的详细内容
export function getPostData(id: string): PostWithContent {
  try {
    const decodedId = decodeURIComponent(id);
    const fileName = `${decodedId}.md`;
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const matterResult = matter(fileContents);
    const post = buildPost(decodedId, matterResult.data as Frontmatter, matterResult.content);

    if (post.draft) {
      throw new Error('文章尚未发布');
    }

    return post;
  } catch (error) {
    throw new Error(`文章 ${id} 无法加载`);
  }
}

// 生成标题锚点，和页面里的 h2/h3 保持一致
export function slugifyHeading(text: string): string {
  return (
    text
      .toLowerCase()
      .replace(/[`*_~[\]()#!]/g, '')
      .replace(/[^a-zA-Z0-9\u4e00-\u9fa5]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'section'
  );
}

export type PostFaq = {
  question: string;
  answer: string;
};

export function extractFaq(content: string): PostFaq[] {
  const start = content.search(/^##\s+FAQ\s*$/m);
  if (start === -1) return [];

  const rest = content.slice(start).replace(/^##\s+FAQ\s*$/m, '');
  const end = rest.search(/^##\s+/m);
  const section = end === -1 ? rest : rest.slice(0, end);

  const faqs: PostFaq[] = [];
  const regex = /\*\*Q[：:]\s*(.+?)\*\*\s*\n+([\s\S]*?)(?=\n+\*\*Q[：:]|\n*$)/g;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(section))) {
    const question = match[1].trim();
    const answer = match[2]
      .replace(/^A[：:]\s*/, '')
      .replace(/\s+/g, ' ')
      .trim();

    if (question && answer) {
      faqs.push({ question, answer });
    }
  }

  return faqs;
}

export function extractHeadings(content: string): PostHeading[] {
  return content
    .split(/\r?\n/)
    .flatMap((line) => {
      const match = /^(##|###)\s+(.+?)\s*$/.exec(line);
      if (!match) return [];

      const text = match[2].replace(/[`*_~]/g, '').trim();
      if (!text) return [];

      return [
        {
          level: match[1].length as 2 | 3,
          text,
          id: slugifyHeading(text),
        },
      ];
    });
}

// 按标签重合度推荐相关文章，标签不足时回退到最新文章
export function getRelatedPosts(id: string, limit = 3): Post[] {
  const posts = getAllPosts();
  const current = posts.find((post) => post.id === id);

  if (!current) {
    return posts.filter((post) => post.id !== id).slice(0, limit);
  }

  const currentTags = new Set(current.tags);

  return posts
    .filter((post) => post.id !== id)
    .map((post) => ({
      post,
      score: post.tags.filter((tag) => currentTags.has(tag)).length,
    }))
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      const aDate = a.post.updated ?? a.post.date ?? '';
      const bDate = b.post.updated ?? b.post.date ?? '';
      return bDate.localeCompare(aDate);
    })
    .slice(0, limit)
    .map(({ post }) => post);
}
