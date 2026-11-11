import { NextResponse, type NextRequest } from 'next/server';

// 旧文章 → 新文章/案例页的永久跳转。
// 旧 URL 已经产生过索引和外链，直接 404 会丢权重，所以统一做 301。
const blogRedirects: Record<string, string> = {
  // 已合并为信创部署 pillar
  '麒麟V10-aarch64架构安装mysql8.0': '/blog/kylin-v10-arm-offline-deploy',
  '麒麟v10-ARM架构安装Redis': '/blog/kylin-v10-arm-offline-deploy',
  '麒麟V10-arm架构离线安装nginx': '/blog/kylin-v10-arm-offline-deploy',
  'Centos7-yum安装redis': '/blog/kylin-v10-arm-offline-deploy',
  'Centos7.9安装mysql8.0': '/blog/kylin-v10-arm-offline-deploy',
  'Docker安装MySql8.4': '/blog/kylin-v10-arm-offline-deploy',
  'Docker安装MySql5.7': '/blog/kylin-v10-arm-offline-deploy',

  // 已合并为 Elasticsearch 迁移 / 运维 pillar
  '使用Elasticsearch快照实现跨集群索引迁移': '/blog/elasticsearch-cross-cluster-migration',
  'elasticsearch-Reindex-API-跨集群索引迁移数据': '/blog/elasticsearch-cross-cluster-migration',
  'Logstash配置Elasticsearch集群之间增量同步': '/blog/elasticsearch-cross-cluster-migration',
  'logstash同步postgres数据到Elasticsearch': '/blog/elasticsearch-cross-cluster-migration',
  'linux部署ElasticSearch集群': '/blog/elasticsearch-cluster-ops',
  'ElasticSearch磁盘占用资源大小评估': '/blog/elasticsearch-cluster-ops',
  'Elasticsearch中的nested字段类型用法与示例': '/blog/elasticsearch-cluster-ops',
  'ELK使用ElastAlert配置邮件报警': '/blog/elasticsearch-cluster-ops',

  // 项目介绍转为案例页
  'AI校园安全监控系统': '/cases/campus-monitoring',
  'CDP客户画像系统': '/cases/data-middle-platform',
  '营销画布平台-流程自动化系统': '/cases/data-middle-platform',

  // AI 主题合并
  'transformer模型进行语义搜索和语言生成': '/blog/private-rag-knowledge-base',

  // 通用/过时/第三方内容，回到博客首页
  'Linux安装JDK17': '/blog',
  'spring-cloud使用ktctl本地程序连接k8s集群调试': '/blog',
  '使用IDEA进行K8S远程调试': '/blog',
  '轻量级企业知识分享与团队协同软件': '/blog',
  '图片剪切网站收藏-iloveimg': '/blog',
  '设计师的创意资源站收藏-Dribbble': '/blog',
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 已隐藏的航运案例，避免 llms.txt / 旧外链继续落到 404
  if (pathname === '/cases/shipping-supervision') {
    return NextResponse.redirect(new URL('/cases', request.url), 301);
  }

  if (pathname.startsWith('/blog/')) {
    const raw = pathname.slice('/blog/'.length).replace(/\/+$/, '');
    let id = raw;

    try {
      id = decodeURIComponent(raw);
    } catch {
      // 保留原始路径，交给后续路由处理
    }

    const target = blogRedirects[id];
    if (target) {
      return NextResponse.redirect(new URL(target, request.url), 301);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/blog/:path*', '/cases/shipping-supervision'],
};
