import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), 'posts');

export type Post = {
  id: string;  // 文件名作为ID
  title: string;
  date?: string;
};

export type PostWithContent = Post & {
  content: string;
};

// 获取所有文章ID用于静态路径生成
export function getAllPostIds() {
  // 确保posts目录存在
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);
  // 返回正确格式的ID数组，用于generateStaticParams
  return fileNames.map((fileName) => {
    return {
      id: fileName.replace(/\.md$/, '')
    };
  });
}

// 获取所有文章的列表数据
export function getAllPosts(): Post[] {
  // 确保posts目录存在
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames.map((fileName) => {
    // 使用文件名（不含.md扩展名）作为ID
    const id = fileName.replace(/\.md$/, '');

    // 将markdown文件读取为字符串
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    // 使用gray-matter解析元数据
    const matterResult = matter(fileContents);

    // 如果没有title，使用文件名作为标题
    const title = matterResult.data.title || fileName.replace(/\.md$/, '');

    // 合并数据返回文章元数据
    return {
      id,
      title,
      ...(matterResult.data.date && { date: matterResult.data.date }),
    };
  });

  // 按日期排序（如果有日期）或按标题排序
  return allPostsData.sort((a, b) => { 
    if (a.date && b.date) {
      return a.date < b.date ? 1 : -1;
    }
    return a.title.localeCompare(b.title);
  });
}

// 根据ID获取单篇文章的详细内容
export function getPostData(id: string): PostWithContent {
  try {
    // 解码 URL 编码的 id
    const decodedId = decodeURIComponent(id);
    const fullPath = path.join(postsDirectory, `${decodedId}.md`); 
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    // 使用gray-matter解析元数据
    const matterResult = matter(fileContents);

    // 如果没有title，使用ID作为标题
    const title = matterResult.data.title || id;

    // 将数据与内容一起返回
    return {
      id,
      title: decodeURIComponent(title),
      content: matterResult.content,
      ...(matterResult.data.date && { date: matterResult.data.date }),
    };
  } catch (error) {
    throw new Error(`文章 ${id} 无法加载`);
  }
} 