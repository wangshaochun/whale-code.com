export type LocalizedText = string;

export type CaseCategory = 'enterprise' | 'ai-data' | 'industry';

export interface CaseMetric {
  value: string;
  label: LocalizedText;
}

export interface CaseImage {
  src: string;
  caption: LocalizedText;
}

export interface CaseStudy {
  id: string;
  title: LocalizedText;
  subtitle: LocalizedText;
  summary: LocalizedText;
  challenge: LocalizedText;
  solution: LocalizedText;
  results: LocalizedText[];
  metrics: CaseMetric[];
  tags: string[];
  tech: string[];
  cover: string;
  images: CaseImage[];
  category: CaseCategory;
  year: string;
  featured?: boolean;
}

export const caseCategories: { id: 'all' | CaseCategory; label: LocalizedText }[] = [
  { id: 'all', label: '全部案例' },
  { id: 'enterprise', label: '企业数字化' },
  { id: 'ai-data', label: 'AI 与数据' },
  { id: 'industry', label: '行业平台' },
];

export const caseStudies: CaseStudy[] = [
  // {
  //   id: 'shipping-supervision',
  //   title: '航运监管与审批平台',
  //   subtitle: '某航运企业 · 企业数字化',
  //   summary: '覆盖船舶、人员、审批、考核与动态监控的一体化监管平台，让船岸协同有据可查。',
  //   challenge: '审批流程分散在多个系统，船舶与人员资料多头维护，SMS 考核依赖线下表单，船岸信息不同步，管理动作难以留痕。',
  //   solution: '建设 80+ 可配置审批流，统一组织、船舶与人员档案；接入电子海图与 AIS 船位，支持电子围栏、轨迹回放与视频监控；将 SMS 考核表、AI 材料审核与动态看板纳入同一平台。',
  //   results: [
  //     '80+ 审批流程线上化，覆盖组织、船舶、人员与证书审核',
  //     'AI 辅助审核申报材料，减少人工逐项核对',
  //     '电子海图 + AIS + 视频监控，一屏掌握船队动态',
  //   ],
  //   metrics: [
  //     { value: '80+', label: '审批流程' },
  //     { value: '7×24', label: '船岸协同' },
  //     { value: '1', label: '张图看全船队' },
  //   ],
  //   tags: ['工作流引擎', '电子海图', 'AIS', 'AI 审核', '视频监控'],
  //   tech: ['Spring Boot', 'Flowable', 'Vue', 'Elasticsearch', 'WebSocket'],
  //   cover: '/images/cases/shipping-map.jpg',
  //   images: [
  //     { src: '/images/cases/shipping-map.jpg', caption: '电子海图、AIS 船位与电子围栏' },
  //     { src: '/images/cases/shipping-dashboard.jpg', caption: '审批流程与组织架构管理' },
  //     { src: '/images/cases/shipping-ai-audit.jpg', caption: 'AI 辅助材料审核' },
  //     { src: '/images/cases/shipping-approval.jpg', caption: '统一制式考核表单与电子签名' },
  //   ],
  //   category: 'enterprise',
  //   year: '2025',
  //   featured: true,
  // },
  {
    id: 'data-middle-platform',
    title: '自研数据中台',
    subtitle: '自研产品 · 数据平台',
    summary: '以标签为基础的数据中台，统一数据标准、指标口径与服务出口，支撑精细化运营。',
    challenge: '数据散落在多个业务系统，口径不一致，标签重复建设，业务取数依赖人工，难以形成可复用的数据资产。',
    solution: '建立数据标准、标签体系与数据分级；提供标签配置、数据检索、客群圈选与 API 服务化能力，让数据从「存起来」走向「用起来」。',
    results: [
      '统一客户与业务数据口径，减少重复取数',
      '标签可视化配置，业务人员可自助圈选',
      '数据服务 API 化，支撑营销与分析场景',
    ],
    metrics: [
      { value: '1', label: '套统一数据口径' },
      { value: '多', label: '个可复用标签' },
      { value: 'API', label: '服务化输出' },
    ],
    tags: ['CDP', '标签体系', '数据治理', 'API 服务'],
    tech: ['Java', 'Spring Cloud', 'MySQL', 'Elasticsearch', 'ClickHouse'],
    cover: '/images/cases/data-platform-tags.jpg',
    images: [
      { src: '/images/cases/data-platform-tags.jpg', caption: '标签分类与数据分级配置' },
      { src: '/images/cases/data-platform-search.jpg', caption: '标签检索与统一数据视图' },
      { src: '/images/cases/data-platform-view.jpg', caption: '数据资产与服务管理' },
    ],
    category: 'ai-data',
    year: '2024',
    featured: true,
  },
  {
    id: 'textbook-selection',
    title: '高校教材选用平台',
    subtitle: '某大学 · 教育行业',
    summary: '从任务创建、学院填报到专家评审与审定，全流程线上化、规范化、可追溯。',
    challenge: '教材选用涉及教务处、学院、教研室、教师与专家多类角色，线下表格流转慢，评审意见与审定过程难以留痕。',
    solution: '按学校管理制度设计多角色工作流，覆盖教材信息填报、选用理由、专家评审、审定与结果公示，流程节点与意见全程留痕。',
    results: [
      '多角色协同，任务进度实时可见',
      '评审意见与审定结果全程留痕',
      '规范教材选用流程，降低沟通成本',
    ],
    metrics: [
      { value: '5', label: '类角色协同' },
      { value: '100%', label: '流程线上留痕' },
      { value: '全程', label: '可追溯' },
    ],
    tags: ['工作流', '多角色权限', '在线评审', '表单引擎'],
    tech: ['Spring Boot', 'Flowable', 'MySQL', 'Vue', 'ECharts'],
    cover: '/images/cases/textbook-workflow.jpg',
    images: [
      { src: '/images/cases/textbook-workflow.jpg', caption: '教材选用任务与流程进度' },
      { src: '/images/cases/textbook-system.jpg', caption: '教材信息与选用理由填报' },
      { src: '/images/cases/textbook-role.jpg', caption: '多角色任务与权限管理' },
    ],
    category: 'industry',
    year: '2024',
    featured: true,
  },
  {
    id: 'audit-knowledge-base',
    title: '审计知识库与 AI 助手',
    subtitle: '某审计机构 · AI + 知识库',
    summary: '汇聚审计问题、法律法规、案例与方法的专业知识库，配套 AI 助手与微信小程序。',
    challenge: '审计依据分散在法规、案例与内部制度中，检索耗时；一线人员需要随时查、快速答，并保证引用的依据准确。',
    solution: '构建审计知识库与法规标签体系，覆盖审计问题、法律法规、审计案例、审计方法与行业风险，提供全文检索、关联推荐与 AI 问答；同步上线小程序，支持移动端查询、收藏与分享。',
    results: [
      '审计问题、法规、案例、方法与行业风险统一沉淀',
      'AI 助手结合知识库给出定性依据与处理处罚依据',
      '小程序随时检索，现场办公更方便',
    ],
    metrics: [
      { value: '5', label: '大知识域' },
      { value: 'AI', label: '知识库问答' },
      { value: '移动', label: '小程序随时查' },
    ],
    tags: ['RAG', '知识库', '智能问答', '小程序'],
    tech: ['LLM', 'RAG', 'Vector Search', 'Elasticsearch', 'WeChat Mini Program'],
    cover: '/images/cases/audit-home.jpg',
    images: [
      { src: '/images/cases/audit-home.jpg', caption: '审计知识库首页与分类检索' },
      { src: '/images/cases/audit-assistant.jpg', caption: 'AI 审计助手与依据引用' },
      { src: '/images/cases/audit-miniprogram.jpg', caption: '微信小程序移动端' },
    ],
    category: 'ai-data',
    year: '2025',
    featured: true,
  },
  {
    id: 'campus-monitoring',
    title: '校园智能监控平台',
    subtitle: '某学校 · AI 视觉',
    summary: '接入校园视频与智能识别能力，实现实时监控、异常预警与事件闭环处理。',
    challenge: '摄像头数量多、人工盯屏效率低，异常事件发现滞后，处置过程缺少记录，安全管理工作难以量化。',
    solution: '统一接入视频流，配置识别规则与预警策略；支持实时画面、抓拍记录、人员名单与处置流程，让安全管理从「看得见」到「管得住」。',
    results: [
      '视频统一接入，实时画面集中查看',
      '识别规则可配置，异常自动预警',
      '事件抓拍与处置记录可追溯',
    ],
    metrics: [
      { value: '实时', label: '视频监控' },
      { value: '智能', label: '异常预警' },
      { value: '闭环', label: '事件处置' },
    ],
    tags: ['视频接入', '智能识别', '预警规则', '事件处置'],
    tech: ['Python', 'OpenCV', 'RTSP', 'WebSocket', 'Vue'],
    cover: '/images/cases/campus-monitor.jpg',
    images: [
      { src: '/images/cases/campus-monitor.jpg', caption: '实时视频画面与抓拍记录' },
      { src: '/images/cases/campus-roster.jpg', caption: '人员名单与识别状态' },
      { src: '/images/cases/campus-rule.jpg', caption: '预警规则与识别区域配置' },
    ],
    category: 'ai-data',
    year: '2024',
  },
  {
    id: 'sports-assessment',
    title: '运动技能评估系统',
    subtitle: '某医院 · 医疗健康',
    summary: '面向运动医学场景的评估与训练管理平台，覆盖预约、评估、报告与随访。',
    challenge: '评估项目多、指标口径不一，纸质记录难汇总，患者改善趋势不直观，复诊随访缺少连续数据。',
    solution: '将体适能、运动处方与专项评估数字化，支持多维度指标录入、报告生成、历史对比与随访管理。',
    results: [
      '评估流程标准化，减少手工记录',
      '指标趋势可视化，训练效果可对比',
      '报告与随访在线管理，方便复诊追踪',
    ],
    metrics: [
      { value: '多维', label: '评估指标' },
      { value: '数字', label: '评估报告' },
      { value: '趋势', label: '训练追踪' },
    ],
    tags: ['医疗信息化', '评估量表', '数据可视化', '随访'],
    tech: ['Spring Boot', 'MySQL', 'Vue', 'ECharts'],
    cover: '/images/cases/hospital-dashboard.jpg',
    images: [
      { src: '/images/cases/hospital-dashboard.jpg', caption: '评估工作台与今日数据' },
      { src: '/images/cases/hospital-assessment.jpg', caption: '评估项目与训练方案配置' },
      { src: '/images/cases/hospital-record.jpg', caption: '患者评估记录与指标详情' },
    ],
    category: 'industry',
    year: '2024',
  },
  {
    id: 'ecommerce-platform',
    title: '电商平台与小程序',
    subtitle: '某零售品牌 · 电商',
    summary: '商品展示、活动营销、话费充值、订单与分销佣金一体化的小程序商城。',
    challenge: '线上渠道分散，活动页制作依赖开发，订单与佣金结算人工统计，运营动作难以快速上线。',
    solution: '搭建小程序商城与运营后台，支持商品/活动配置、充值下单、订单履约、佣金与提现管理，前后台数据打通。',
    results: [
      '小程序商城 + 运营后台一体化',
      '活动页与商品配置可视化，运营更灵活',
      '订单、佣金与结算数据统一管理',
    ],
    metrics: [
      { value: '1', label: '个小程序商城' },
      { value: '多', label: '种营销活动' },
      { value: '统一', label: '佣金结算' },
    ],
    tags: ['微信小程序', '商城', '支付', '分销', '运营后台'],
    tech: ['WeChat Mini Program', 'Node.js', 'MySQL', 'Redis', 'WeChat Pay'],
    cover: '/images/cases/ecommerce-admin.jpg',
    images: [
      { src: '/images/cases/ecommerce-admin.jpg', caption: '商品、订单与用户管理后台' },
      { src: '/images/cases/ecommerce-app.jpg', caption: '小程序商城首页与活动' },
      { src: '/images/cases/ecommerce-product.jpg', caption: '商品详情与营销转化' },
    ],
    category: 'enterprise',
    year: '2024',
  },
];

export const industries: LocalizedText[] = [
  '航运物流',
  '教育',
  '审计财务',
  '医疗健康',
  '零售电商',
  '政企办公',
];

export const stats: { value: string; label: LocalizedText }[] = [
  { value: '10+', label: '年核心团队研发经验' },
  { value: '10+', label: '家企业客户成功交付' },
  { value: '80+', label: '审批流程上线运行' },
  { value: '7×24', label: '技术支持响应' },
];

export type ServiceIcon = 'code' | 'brain' | 'database' | 'smartphone' | 'workflow' | 'shield';

export interface Service {
  icon: ServiceIcon;
  title: LocalizedText;
  description: LocalizedText;
  tags: LocalizedText[];
}

export const services: Service[] = [
  {
    icon: 'code',
    title: '企业级软件定制',
    description: '面向复杂业务流程，提供从需求梳理、原型设计到系统落地的全流程定制开发，交付可长期演进的业务系统。',
    tags: ['BPM / 工作流', '多角色权限', '系统集成'],
  },
  {
    icon: 'brain',
    title: 'AI 智能体与知识库',
    description: '把大模型能力接入真实业务场景，构建企业知识库、智能问答、文档审核与业务助手，让 AI 真正产生价值。',
    tags: ['RAG 知识库', '智能审核', '私有化部署'],
  },
  {
    icon: 'database',
    title: '数据中台与数据治理',
    description: '统一数据标准与口径，建设标签体系、指标体系和数据服务，让分散的数据变成可复用的业务资产。',
    tags: ['CDP', '标签体系', '数据服务'],
  },
  {
    icon: 'smartphone',
    title: '小程序与移动应用',
    description: '覆盖微信小程序、H5 与移动端应用，连接用户、门店与后台业务系统，让服务随时在线。',
    tags: ['微信生态', '商城', '会员运营'],
  },
  {
    icon: 'workflow',
    title: '系统集成与流程自动化',
    description: '打通 ERP、OA、财务、监控等存量系统，用接口与自动化减少重复人工，让数据在系统之间顺畅流动。',
    tags: ['API 集成', '单点登录', '定时任务'],
  },
  {
    icon: 'shield',
    title: '运维保障与持续交付',
    description: '上线不是终点。提供监控告警、备份、安全加固与持续迭代，保障系统长期稳定运行。',
    tags: ['7×24 响应', '监控告警', '安全加固'],
  },
];

export interface CapabilityGroup {
  title: LocalizedText;
  description: LocalizedText;
  items: string[];
}

export const capabilityGroups: CapabilityGroup[] = [
  {
    title: '前端与体验',
    description: '复杂后台也能清晰好用，兼顾桌面端与移动端。',
    items: ['React', 'Next.js', 'Vue', 'TypeScript', 'Tailwind CSS', '微信小程序'],
  },
  {
    title: '服务端与架构',
    description: '面向业务的稳定架构，支撑高并发与复杂流程。',
    items: ['Java', 'Spring Boot', 'Spring Cloud', 'Node.js', 'Python', 'MySQL', 'PostgreSQL', 'Redis'],
  },
  {
    title: 'AI 与数据',
    description: '从知识库到智能体，让模型能力落到具体场景。',
    items: ['LLM 应用', 'RAG', '向量检索', 'Elasticsearch', '机器学习', '数据中台'],
  },
  {
    title: '交付与运维',
    description: '标准化部署与监控，保障系统上线后持续稳定。',
    items: ['Docker', 'Kubernetes', 'Linux', 'CI/CD', 'Nginx', '监控告警'],
  },
];

export interface DeliveryStep {
  title: LocalizedText;
  description: LocalizedText;
}

export const deliverySteps: DeliveryStep[] = [
  {
    title: '需求梳理',
    description: '深入了解业务、角色与流程，明确边界与优先级，输出可执行的需求清单。',
  },
  {
    title: '原型与方案',
    description: '用可点击原型对齐体验，确定技术方案、里程碑与报价，先想清楚再动手。',
  },
  {
    title: '迭代开发',
    description: '小步快跑、阶段演示，让每个关键节点可见、可验收、可调整。',
  },
  {
    title: '测试与上线',
    description: '完成功能、性能与安全测试，协助部署、培训与数据迁移，平稳切换。',
  },
  {
    title: '运维与陪伴',
    description: '监控告警、问题响应与持续迭代，做企业长期可依赖的技术伙伴。',
  },
];

export interface Faq {
  question: LocalizedText;
  answer: LocalizedText;
}

export const faqs: Faq[] = [
  {
    question: '你们主要承接哪些类型的项目？',
    answer: '企业级管理系统、行业平台、数据中台、AI 知识库与智能体、小程序与电商系统，也支持存量系统的二次开发、接口集成与运维。',
  },
  {
    question: '一个项目大概需要多久？',
    answer: '简单小程序或工具通常 2–4 周，中型业务系统 6–12 周，复杂平台按模块分阶段交付。具体周期取决于需求范围、接口数量与排期，我们会在评估后给出里程碑计划。',
  },
  {
    question: '如何保障交付质量？',
    answer: '需求、原型、开发、测试、上线分阶段验收，关键节点提供演示；交付源码、部署文档与使用说明，并设置质保期，问题可追踪闭环。',
  },
  {
    question: '是否支持私有化部署与数据安全要求？',
    answer: '支持私有化与内网部署、权限分级、数据脱敏、日志审计和备份策略，可按客户的安全规范实施；AI 场景也可选择本地模型或专属实例。',
  },
  {
    question: '已有系统可以对接吗？',
    answer: '可以。我们做过 OA、ERP、财务、监控、支付、短信、地图、微信生态等多类系统的接口集成，也可以承接历史数据迁移与系统改造。',
  },
  {
    question: '售后运维怎么合作？',
    answer: '可选择按次、包月或年度运维，提供远程支持、现场支持、监控告警、版本迭代与安全加固。合作方式会写进合同，响应时间清晰可考核。',
  },
];

export const contactInfo = {
  phones: ['156-1439-2011', '137-8020-0356'],
  address: '石家庄市桥西区鸿锐大厦 2 号楼 1105 室',
  company: '石家庄鲸码互联网科技有限责任公司',
};
