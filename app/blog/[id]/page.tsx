import { getAllPostIds, getPostData } from '@/lib/posts';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';
import { Metadata } from 'next';

// 用于静态生成每篇文章页面的路径参数
export async function generateStaticParams() {
  const postIds = getAllPostIds();
  
  // 修改：将ID进行URL编码，确保中文路径参数正确处理
  return postIds.map(params => ({
    id: encodeURIComponent(params.id)
  }));
}

// 生成页面的元数据
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  try {
    const decodedId = decodeURIComponent(params.id);
    const post = getPostData(decodedId);
    
    return {
      title: post.title,
    };
  } catch (error) {
    return {
      title: '文章未找到',
    };
  }
}

export default function PostPage({ params }: { params: { id: string } }) {
  try {
    const decodedId = decodeURIComponent(params.id);
    const post = getPostData(decodedId);
    
    return (
      <div className="container mx-auto py-8 px-4">
        <Link href="/blog" className="text-blue-600 hover:underline mb-6 inline-block">
          ← 返回博客列表
        </Link>
        <article className="prose lg:prose-xl mx-auto">
          <h1 className="text-4xl text-center">{post.title}</h1>
          {post.date && (
            <time className="text-gray-500 block mb-8">{post.date}</time>
          )}
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </article>
      </div>
    );
  } catch (error) {
    // 如果文章不存在，返回404
    return notFound();
  }
} 