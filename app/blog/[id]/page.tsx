import { getAllPostIds, getPostData } from '@/lib/posts';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';
import { Metadata } from 'next';
import remarkGfm from 'remark-gfm';
// 强制动态渲染以确保元数据正确更新
export const dynamic = 'force-dynamic';

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
    const post = getPostData(resolvedParams.id); 

    return (
      <div className="container mx-auto px-4 py-10 md:py-14">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
        >
          ← 返回博客列表
        </Link>

        <article className="mx-auto mt-8 max-w-3xl">
          <header className="border-b pb-7">
            <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
              {post.title}
            </h1>
            {post.date && (
              <time className="mt-3 block text-sm text-muted-foreground">
                发布时间：{post.date}
              </time>
            )}
          </header>

          <div className="markdown-body mt-8">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
          </div>

          <div className="mt-12 flex flex-col gap-4 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
            <Link
              href="/blog"
              className="text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              ← 继续阅读其他文章
            </Link>
            <Link
              href="/#contact"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:opacity-80"
            >
              有类似的技术需求？聊聊 →
            </Link>
          </div>
        </article>
      </div>
    );
  } catch (error) {
    console.error('Error loading blog post:', error);
    return (
      <div className="container mx-auto px-4 py-10">
        <Link href="/blog" className="text-sm text-primary hover:underline">
          ← 返回博客列表
        </Link>
        <div className="py-20 text-center text-muted-foreground">文章加载失败</div>
      </div>
    );
  }
}
