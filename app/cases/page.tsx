import type { Metadata } from 'next';
import { CasesListing } from '@/components/cases-listing';

export const metadata: Metadata = {
  title: '项目案例 | 石家庄鲸码互联网科技',
  description:
    '航运监管、数据中台、高校教材选用、审计知识库、校园智能监控、医疗评估与电商小程序等已上线项目案例。',
};

export default function CasesPage() {
  return (
    <div className="flex flex-col">
      <CasesListing />
    </div>
  );
}
