import Link from 'next/link';
import { getAllPosts } from '@/lib/posts';

export default function BlogPage() {
  const posts = getAllPosts();
  
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">博客文章</h1>
      {posts.length === 0 ? (
        <p>暂无文章</p>
      ) : (
        <div className="grid gap-2">
          {posts.map((post) => (
            <article key={post.id} className="p-2 border rounded-lg shadow-sm transition-shadow">
              <Link href={`/blog/${post.id}`} className="block">
                <h2 className="text-xl font-semibold hover:text-blue-600 transition-colors">{post.title}</h2>
                {post.date && (
                  <time className="text-sm text-gray-500 mt-1 block">{post.date}</time>
                )}
              </Link>
            </article>
          ))}
        </div>
      )}
    </div>
  );
} 