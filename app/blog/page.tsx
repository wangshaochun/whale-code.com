import type { Metadata } from 'next';
import { BlogListing } from '@/components/blog-listing';
import { getAllPosts } from '@/lib/posts';

export const metadata: Metadata = {
  title: '技术博客 | 石家庄鲸码互联网科技',
  description:
    '鲸码研发团队的技术文章，涵盖 AI 应用、数据平台、后端架构、Elasticsearch、云原生与效率工具。',
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="flex flex-col">
      <BlogListing posts={posts} />
    </div>
  );
}
