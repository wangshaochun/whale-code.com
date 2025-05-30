import { getAllPostIds, getPostData } from '@/lib/posts';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';
import { Metadata, ResolvingMetadata } from 'next';

export async function generateStaticParams() {
  const postIds = getAllPostIds();
  return postIds.map(params => ({
    id: params.id,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }>  } ): Promise<Metadata> {
  try {
    const {id} = await params; 
    const post = getPostData(id); 
    return {
      title: post.title,
    };
  } catch (error) {
    return {
      title: '文章未找到',
    };
  }
} 

export default async function PostPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  try {
    const resolvedParams = await params; 
    const post = await getPostData(resolvedParams.id); 

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
    console.error('Error loading blog post:', error);
    return (
      <div className="container mx-auto py-8 px-4">
        <Link href="/blog" className="text-blue-600 hover:underline mb-6 inline-block">
          ← 返回博客列表
        </Link>
        <div className="text-center">文章加载失败</div>
      </div>
    );
  }
}