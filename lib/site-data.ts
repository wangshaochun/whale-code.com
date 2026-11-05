export type Locale = 'zh' | 'en';

export type LocalizedText = Record<Locale, string>;

export type CaseCategory = 'enterprise' | 'ai-data' | 'industry';

export interface CaseMetric {
  value: string;
  valueEn?: string;
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
  { id: 'all', label: { zh: '全部案例', en: 'All work' } },
  { id: 'enterprise', label: { zh: '企业数字化', en: 'Enterprise' } },
  { id: 'ai-data', label: { zh: 'AI 与数据', en: 'AI & Data' } },
  { id: 'industry', label: { zh: '行业平台', en: 'Industry platforms' } },
];

export const caseStudies: CaseStudy[] = [
  {
    id: 'shipping-supervision',
    title: { zh: '航运监管与审批平台', en: 'Shipping Supervision Platform' },
    subtitle: { zh: '某航运企业 · 企业数字化', en: 'Shipping company · Enterprise' },
    summary: {
      zh: '覆盖船舶、人员、审批、考核与动态监控的一体化监管平台，让船岸协同有据可查。',
      en: 'An integrated supervision platform connecting vessels, crews, approvals, assessments and live fleet monitoring.',
    },
    challenge: {
      zh: '审批流程分散在多个系统，船舶与人员资料多头维护，SMS 考核依赖线下表单，船岸信息不同步，管理动作难以留痕。',
      en: 'Approvals were spread across systems, vessel and crew records were duplicated, SMS assessments ran on paper, and shore-side teams lacked a live view of the fleet.',
    },
    solution: {
      zh: '建设 80+ 可配置审批流，统一组织、船舶与人员档案；接入电子海图与 AIS 船位，支持电子围栏、轨迹回放与视频监控；将 SMS 考核表、AI 材料审核与动态看板纳入同一平台。',
      en: 'We delivered 80+ configurable approval flows, unified organisation, vessel and crew records, and connected electronic charts, AIS positions, geo-fences, track playback and video monitoring. SMS assessments, AI-assisted document review and live dashboards now live in one platform.',
    },
    results: [
      { zh: '80+ 审批流程线上化，覆盖组织、船舶、人员与证书审核', en: '80+ approval flows moved online across organisation, vessel, crew and certificate reviews' },
      { zh: 'AI 辅助审核申报材料，减少人工逐项核对', en: 'AI-assisted document review reduces manual cross-checking' },
      { zh: '电子海图 + AIS + 视频监控，一屏掌握船队动态', en: 'Charts, AIS and video monitoring provide one-screen fleet visibility' },
    ],
    metrics: [
      { value: '80+', label: { zh: '审批流程', en: 'approval flows' } },
      { value: '7×24', label: { zh: '船岸协同', en: 'shore–ship collaboration' } },
      { value: '1', label: { zh: '张图看全船队', en: 'view of the fleet' } },
    ],
    tags: ['工作流引擎', '电子海图', 'AIS', 'AI 审核', '视频监控'],
    tech: ['Spring Boot', 'Flowable', 'Vue', 'Elasticsearch', 'WebSocket'],
    cover: '/images/cases/shipping-map.jpg',
    images: [
      { src: '/images/cases/shipping-map.jpg', caption: { zh: '电子海图、AIS 船位与电子围栏', en: 'Electronic chart, AIS positions and geo-fencing' } },
      { src: '/images/cases/shipping-dashboard.jpg', caption: { zh: '审批流程与组织架构管理', en: 'Approval flows and organisation management' } },
      { src: '/images/cases/shipping-ai-audit.jpg', caption: { zh: 'AI 辅助材料审核', en: 'AI-assisted document review' } },
      { src: '/images/cases/shipping-approval.jpg', caption: { zh: '统一制式考核表单与电子签名', en: 'Standardised assessment forms with e-signature' } },
    ],
    category: 'enterprise',
    year: '2025',
    featured: true,
  },
  {
    id: 'data-middle-platform',
    title: { zh: '自研数据中台', en: 'Data Middle Platform' },
    subtitle: { zh: '自研产品 · 数据平台', en: 'In-house product · Data platform' },
    summary: {
      zh: '以标签为基础的数据中台，统一数据标准、指标口径与服务出口，支撑精细化运营。',
      en: 'A tag-driven data platform that unifies data standards, metrics and service APIs for precision operations.',
    },
    challenge: {
      zh: '数据散落在多个业务系统，口径不一致，标签重复建设，业务取数依赖人工，难以形成可复用的数据资产。',
      en: 'Data was scattered across business systems with inconsistent definitions, duplicated tags and manual extraction, making reusable data assets hard to build.',
    },
    solution: {
      zh: '建立数据标准、标签体系与数据分级；提供标签配置、数据检索、客群圈选与 API 服务化能力，让数据从「存起来」走向「用起来」。',
      en: 'We established data standards, a tag system and data classification, then added visual tag configuration, search, audience selection and service APIs so data could be used, not just stored.',
    },
    results: [
      { zh: '统一客户与业务数据口径，减少重复取数', en: 'Unified customer and business definitions, reducing duplicate extraction' },
      { zh: '标签可视化配置，业务人员可自助圈选', en: 'Visual tag configuration lets business users build audiences themselves' },
      { zh: '数据服务 API 化，支撑营销与分析场景', en: 'Data-as-a-service APIs support marketing and analytics scenarios' },
    ],
    metrics: [
      { value: '1', label: { zh: '套统一数据口径', en: 'unified data definition' } },
      { value: '多', valueEn: 'Many', label: { zh: '个可复用标签', en: 'reusable tags' } },
      { value: 'API', label: { zh: '服务化输出', en: 'service output' } },
    ],
    tags: ['CDP', '标签体系', '数据治理', 'API 服务'],
    tech: ['Java', 'Spring Cloud', 'MySQL', 'Elasticsearch', 'ClickHouse'],
    cover: '/images/cases/data-platform-tags.jpg',
    images: [
      { src: '/images/cases/data-platform-tags.jpg', caption: { zh: '标签分类与数据分级配置', en: 'Tag categories and data classification' } },
      { src: '/images/cases/data-platform-search.jpg', caption: { zh: '标签检索与统一数据视图', en: 'Tag search and a unified data view' } },
      { src: '/images/cases/data-platform-view.jpg', caption: { zh: '数据资产与服务管理', en: 'Data asset and service management' } },
    ],
    category: 'ai-data',
    year: '2024',
    featured: true,
  },
  {
    id: 'textbook-selection',
    title: { zh: '高校教材选用平台', en: 'Textbook Selection Platform' },
    subtitle: { zh: '某大学 · 教育行业', en: 'University · Education' },
    summary: {
      zh: '从任务创建、学院填报到专家评审与审定，全流程线上化、规范化、可追溯。',
      en: 'An end-to-end online workflow from task creation and faculty submission to expert review and final approval.',
    },
    challenge: {
      zh: '教材选用涉及教务处、学院、教研室、教师与专家多类角色，线下表格流转慢，评审意见与审定过程难以留痕。',
      en: 'Textbook selection involves academic affairs, faculties, teaching offices, teachers and external experts. Paper-based circulation was slow and decisions were hard to trace.',
    },
    solution: {
      zh: '按学校管理制度设计多角色工作流，覆盖教材信息填报、选用理由、专家评审、审定与结果公示，流程节点与意见全程留痕。',
      en: 'We modelled the university’s policy as a multi-role workflow covering textbook submission, selection rationale, expert review, approval and publication, with every step and comment recorded.',
    },
    results: [
      { zh: '多角色协同，任务进度实时可见', en: 'Multi-role collaboration with real-time task visibility' },
      { zh: '评审意见与审定结果全程留痕', en: 'Review comments and approval decisions fully traceable' },
      { zh: '规范教材选用流程，降低沟通成本', en: 'A standardised process that reduces communication overhead' },
    ],
    metrics: [
      { value: '5', label: { zh: '类角色协同', en: 'role groups' } },
      { value: '100%', label: { zh: '流程线上留痕', en: 'online traceability' } },
      { value: '全程', valueEn: 'Full', label: { zh: '可追溯', en: 'traceable' } },
    ],
    tags: ['工作流', '多角色权限', '在线评审', '表单引擎'],
    tech: ['Spring Boot', 'Flowable', 'MySQL', 'Vue', 'ECharts'],
    cover: '/images/cases/textbook-workflow.jpg',
    images: [
      { src: '/images/cases/textbook-workflow.jpg', caption: { zh: '教材选用任务与流程进度', en: 'Selection tasks and workflow progress' } },
      { src: '/images/cases/textbook-system.jpg', caption: { zh: '教材信息与选用理由填报', en: 'Textbook information and selection rationale' } },
      { src: '/images/cases/textbook-role.jpg', caption: { zh: '多角色任务与权限管理', en: 'Multi-role tasks and permissions' } },
    ],
    category: 'industry',
    year: '2024',
    featured: true,
  },
  {
    id: 'audit-knowledge-base',
    title: { zh: '审计知识库与 AI 助手', en: 'Audit Knowledge Base & AI Assistant' },
    subtitle: { zh: '某审计机构 · AI + 知识库', en: 'Audit institution · AI + Knowledge' },
    summary: {
      zh: '汇聚审计问题、法律法规、案例与方法的专业知识库，配套 AI 助手与微信小程序。',
      en: 'A professional knowledge base for audit issues, regulations, cases and methods, with an AI assistant and WeChat mini program.',
    },
    challenge: {
      zh: '审计依据分散在法规、案例与内部制度中，检索耗时；一线人员需要随时查、快速答，并保证引用的依据准确。',
      en: 'Audit references were scattered across regulations, cases and internal policies. Field staff needed fast, accurate answers and reliable citations at any time.',
    },
    solution: {
      zh: '构建审计知识库与法规标签体系，覆盖审计问题、法律法规、审计案例、审计方法与行业风险，提供全文检索、关联推荐与 AI 问答；同步上线小程序，支持移动端查询、收藏与分享。',
      en: 'We built an audit knowledge base covering issues, regulations, cases, methods and industry risks, with regulation tagging, full-text search, related recommendations and AI Q&A, plus a mini program for mobile search, favourites and sharing.',
    },
    results: [
      { zh: '审计问题、法规、案例、方法与行业风险统一沉淀', en: 'Audit issues, regulations, cases, methods and industry risks consolidated in one place' },
      { zh: 'AI 助手结合知识库给出定性依据与处理处罚依据', en: 'The AI assistant cites qualification and penalty references from the knowledge base' },
      { zh: '小程序随时检索，现场办公更方便', en: 'Mini program search makes field work more convenient' },
    ],
    metrics: [
      { value: '5', label: { zh: '大知识域', en: 'knowledge domains' } },
      { value: 'AI', label: { zh: '知识库问答', en: 'knowledge Q&A' } },
      { value: '移动', valueEn: 'Mobile', label: { zh: '小程序随时查', en: 'mini program access' } },
    ],
    tags: ['RAG', '知识库', '智能问答', '小程序'],
    tech: ['LLM', 'RAG', 'Vector Search', 'Elasticsearch', 'WeChat Mini Program'],
    cover: '/images/cases/audit-home.jpg',
    images: [
      { src: '/images/cases/audit-home.jpg', caption: { zh: '审计知识库首页与分类检索', en: 'Knowledge base home and category search' } },
      { src: '/images/cases/audit-assistant.jpg', caption: { zh: 'AI 审计助手与依据引用', en: 'AI audit assistant with cited references' } },
      { src: '/images/cases/audit-miniprogram.jpg', caption: { zh: '微信小程序移动端', en: 'WeChat mini program experience' } },
    ],
    category: 'ai-data',
    year: '2025',
    featured: true,
  },
  {
    id: 'campus-monitoring',
    title: { zh: '校园智能监控平台', en: 'Campus Intelligent Monitoring' },
    subtitle: { zh: '某学校 · AI 视觉', en: 'School · AI vision' },
    summary: {
      zh: '接入校园视频与智能识别能力，实现实时监控、异常预警与事件闭环处理。',
      en: 'Campus video and AI recognition combined for live monitoring, anomaly alerts and closed-loop incident handling.',
    },
    challenge: {
      zh: '摄像头数量多、人工盯屏效率低，异常事件发现滞后，处置过程缺少记录，安全管理工作难以量化。',
      en: 'Too many cameras and too little manual attention meant delayed anomaly detection and no reliable record of incident handling.',
    },
    solution: {
      zh: '统一接入视频流，配置识别规则与预警策略；支持实时画面、抓拍记录、人员名单与处置流程，让安全管理从「看得见」到「管得住」。',
      en: 'We unified video streams, configured recognition and alert rules, and added live views, snapshots, roster management and handling workflows, turning visibility into control.',
    },
    results: [
      { zh: '视频统一接入，实时画面集中查看', en: 'Unified video access and centralised live views' },
      { zh: '识别规则可配置，异常自动预警', en: 'Configurable recognition rules trigger automatic alerts' },
      { zh: '事件抓拍与处置记录可追溯', en: 'Snapshots and handling records are fully traceable' },
    ],
    metrics: [
      { value: '实时', valueEn: 'Live', label: { zh: '视频监控', en: 'video monitoring' } },
      { value: '智能', valueEn: 'Smart', label: { zh: '异常预警', en: 'anomaly alerts' } },
      { value: '闭环', valueEn: 'Closed loop', label: { zh: '事件处置', en: 'incident handling' } },
    ],
    tags: ['视频接入', '智能识别', '预警规则', '事件处置'],
    tech: ['Python', 'OpenCV', 'RTSP', 'WebSocket', 'Vue'],
    cover: '/images/cases/campus-monitor.jpg',
    images: [
      { src: '/images/cases/campus-monitor.jpg', caption: { zh: '实时视频画面与抓拍记录', en: 'Live video and snapshot records' } },
      { src: '/images/cases/campus-roster.jpg', caption: { zh: '人员名单与识别状态', en: 'Roster and recognition status' } },
      { src: '/images/cases/campus-rule.jpg', caption: { zh: '预警规则与识别区域配置', en: 'Alert rules and recognition zones' } },
    ],
    category: 'ai-data',
    year: '2024',
  },
  {
    id: 'sports-assessment',
    title: { zh: '运动技能评估系统', en: 'Sports Skill Assessment System' },
    subtitle: { zh: '某医院 · 医疗健康', en: 'Hospital · Healthcare' },
    summary: {
      zh: '面向运动医学场景的评估与训练管理平台，覆盖预约、评估、报告与随访。',
      en: 'An assessment and training platform for sports medicine, covering appointments, evaluations, reports and follow-up.',
    },
    challenge: {
      zh: '评估项目多、指标口径不一，纸质记录难汇总，患者改善趋势不直观，复诊随访缺少连续数据。',
      en: 'Many assessment items and inconsistent metrics made paper records hard to aggregate, while progress and follow-up lacked continuous data.',
    },
    solution: {
      zh: '将体适能、运动处方与专项评估数字化，支持多维度指标录入、报告生成、历史对比与随访管理。',
      en: 'We digitised fitness, exercise prescription and specialist assessments with multi-dimensional data entry, report generation, historical comparison and follow-up management.',
    },
    results: [
      { zh: '评估流程标准化，减少手工记录', en: 'Standardised assessments with less manual recording' },
      { zh: '指标趋势可视化，训练效果可对比', en: 'Visual trends make training outcomes comparable' },
      { zh: '报告与随访在线管理，方便复诊追踪', en: 'Online reports and follow-up support continuity of care' },
    ],
    metrics: [
      { value: '多维', valueEn: 'Multi', label: { zh: '评估指标', en: 'assessment metrics' } },
      { value: '数字', valueEn: 'Digital', label: { zh: '评估报告', en: 'assessment reports' } },
      { value: '趋势', valueEn: 'Trends', label: { zh: '训练追踪', en: 'training tracking' } },
    ],
    tags: ['医疗信息化', '评估量表', '数据可视化', '随访'],
    tech: ['Spring Boot', 'MySQL', 'Vue', 'ECharts'],
    cover: '/images/cases/hospital-dashboard.jpg',
    images: [
      { src: '/images/cases/hospital-dashboard.jpg', caption: { zh: '评估工作台与今日数据', en: 'Assessment dashboard and daily metrics' } },
      { src: '/images/cases/hospital-assessment.jpg', caption: { zh: '评估项目与训练方案配置', en: 'Assessment items and training plan configuration' } },
      { src: '/images/cases/hospital-record.jpg', caption: { zh: '患者评估记录与指标详情', en: 'Patient assessment records and metric details' } },
    ],
    category: 'industry',
    year: '2024',
  },
  {
    id: 'ecommerce-platform',
    title: { zh: '电商平台与小程序', en: 'E-commerce Platform & Mini Program' },
    subtitle: { zh: '某零售品牌 · 电商', en: 'Retail brand · E-commerce' },
    summary: {
      zh: '商品展示、活动营销、话费充值、订单与分销佣金一体化的小程序商城。',
      en: 'A mini program mall integrating products, campaigns, mobile top-ups, orders and distribution commissions.',
    },
    challenge: {
      zh: '线上渠道分散，活动页制作依赖开发，订单与佣金结算人工统计，运营动作难以快速上线。',
      en: 'Online channels were fragmented, campaign pages required developers, and order and commission settlement was manual, slowing every campaign.',
    },
    solution: {
      zh: '搭建小程序商城与运营后台，支持商品/活动配置、充值下单、订单履约、佣金与提现管理，前后台数据打通。',
      en: 'We built a mini program mall and operations back office with product and campaign configuration, top-up ordering, fulfilment, commission and withdrawal management on shared data.',
    },
    results: [
      { zh: '小程序商城 + 运营后台一体化', en: 'Mini program mall and back office in one system' },
      { zh: '活动页与商品配置可视化，运营更灵活', en: 'Visual campaign and product configuration for faster operations' },
      { zh: '订单、佣金与结算数据统一管理', en: 'Orders, commissions and settlements managed in one place' },
    ],
    metrics: [
      { value: '1', label: { zh: '个小程序商城', en: 'mini program mall' } },
      { value: '多', valueEn: 'Multiple', label: { zh: '种营销活动', en: 'campaign types' } },
      { value: '统一', valueEn: 'Unified', label: { zh: '佣金结算', en: 'commission settlement' } },
    ],
    tags: ['微信小程序', '商城', '支付', '分销', '运营后台'],
    tech: ['WeChat Mini Program', 'Node.js', 'MySQL', 'Redis', 'WeChat Pay'],
    cover: '/images/cases/ecommerce-admin.jpg',
    images: [
      { src: '/images/cases/ecommerce-admin.jpg', caption: { zh: '商品、订单与用户管理后台', en: 'Product, order and user back office' } },
      { src: '/images/cases/ecommerce-app.jpg', caption: { zh: '小程序商城首页与活动', en: 'Mini program mall home and campaigns' } },
      { src: '/images/cases/ecommerce-product.jpg', caption: { zh: '商品详情与营销转化', en: 'Product detail and conversion' } },
    ],
    category: 'enterprise',
    year: '2024',
  },
];

export const industries: LocalizedText[] = [
  { zh: '航运物流', en: 'Shipping & Logistics' },
  { zh: '教育', en: 'Education' },
  { zh: '审计财务', en: 'Audit & Finance' },
  { zh: '医疗健康', en: 'Healthcare' },
  { zh: '零售电商', en: 'Retail & E-commerce' },
  { zh: '政企办公', en: 'Public Sector' },
];

export const stats: { value: string; label: LocalizedText }[] = [
  { value: '10+', label: { zh: '年核心团队研发经验', en: 'years of core team R&D' } },
  { value: '10+', label: { zh: '家企业客户成功交付', en: 'enterprise clients delivered' } },
  { value: '80+', label: { zh: '审批流程上线运行', en: 'approval flows in production' } },
  { value: '7×24', label: { zh: '技术支持响应', en: 'technical support' } },
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
    title: { zh: '企业级软件定制', en: 'Custom enterprise software' },
    description: {
      zh: '面向复杂业务流程，提供从需求梳理、原型设计到系统落地的全流程定制开发，交付可长期演进的业务系统。',
      en: 'End-to-end custom development for complex business processes, from requirement discovery and prototyping to systems built to evolve.',
    },
    tags: [{ zh: 'BPM / 工作流', en: 'BPM / Workflow' }, { zh: '多角色权限', en: 'Role-based access' }, { zh: '系统集成', en: 'Integration' }],
  },
  {
    icon: 'brain',
    title: { zh: 'AI 智能体与知识库', en: 'AI agents & knowledge bases' },
    description: {
      zh: '把大模型能力接入真实业务场景，构建企业知识库、智能问答、文档审核与业务助手，让 AI 真正产生价值。',
      en: 'Bring LLMs into real workflows with enterprise knowledge bases, intelligent Q&A, document review and business assistants.',
    },
    tags: [{ zh: 'RAG 知识库', en: 'RAG' }, { zh: '智能审核', en: 'Smart review' }, { zh: '私有化部署', en: 'Private deployment' }],
  },
  {
    icon: 'database',
    title: { zh: '数据中台与数据治理', en: 'Data platform & governance' },
    description: {
      zh: '统一数据标准与口径，建设标签体系、指标体系和数据服务，让分散的数据变成可复用的业务资产。',
      en: 'Unify data standards and definitions, build tag and metric systems and expose data services so scattered data becomes reusable assets.',
    },
    tags: [{ zh: 'CDP', en: 'CDP' }, { zh: '标签体系', en: 'Tagging' }, { zh: '数据服务', en: 'Data services' }],
  },
  {
    icon: 'smartphone',
    title: { zh: '小程序与移动应用', en: 'Mini programs & mobile apps' },
    description: {
      zh: '覆盖微信小程序、H5 与移动端应用，连接用户、门店与后台业务系统，让服务随时在线。',
      en: 'WeChat mini programs, H5 and mobile apps that connect users, stores and back-office systems wherever they are.',
    },
    tags: [{ zh: '微信生态', en: 'WeChat ecosystem' }, { zh: '商城', en: 'Commerce' }, { zh: '会员运营', en: 'Membership' }],
  },
  {
    icon: 'workflow',
    title: { zh: '系统集成与流程自动化', en: 'Integration & automation' },
    description: {
      zh: '打通 ERP、OA、财务、监控等存量系统，用接口与自动化减少重复人工，让数据在系统之间顺畅流动。',
      en: 'Connect ERP, OA, finance and monitoring systems with APIs and automation to remove repetitive work and keep data flowing.',
    },
    tags: [{ zh: 'API 集成', en: 'API integration' }, { zh: '单点登录', en: 'SSO' }, { zh: '定时任务', en: 'Scheduling' }],
  },
  {
    icon: 'shield',
    title: { zh: '运维保障与持续交付', en: 'Operations & continuous delivery' },
    description: {
      zh: '上线不是终点。提供监控告警、备份、安全加固与持续迭代，保障系统长期稳定运行。',
      en: 'Launch is not the finish line. Monitoring, backups, security hardening and continuous iteration keep systems stable for the long run.',
    },
    tags: [{ zh: '7×24 响应', en: '7×24 response' }, { zh: '监控告警', en: 'Monitoring' }, { zh: '安全加固', en: 'Security' }],
  },
];

export interface CapabilityGroup {
  title: LocalizedText;
  description: LocalizedText;
  items: string[];
}

export const capabilityGroups: CapabilityGroup[] = [
  {
    title: { zh: '前端与体验', en: 'Frontend & experience' },
    description: { zh: '复杂后台也能清晰好用，兼顾桌面端与移动端。', en: 'Complex back offices made clear and usable across desktop and mobile.' },
    items: ['React', 'Next.js', 'Vue', 'TypeScript', 'Tailwind CSS', '微信小程序'],
  },
  {
    title: { zh: '服务端与架构', en: 'Backend & architecture' },
    description: { zh: '面向业务的稳定架构，支撑高并发与复杂流程。', en: 'Business-oriented architecture built for concurrency and complex workflows.' },
    items: ['Java', 'Spring Boot', 'Spring Cloud', 'Node.js', 'Python', 'MySQL', 'PostgreSQL', 'Redis'],
  },
  {
    title: { zh: 'AI 与数据', en: 'AI & data' },
    description: { zh: '从知识库到智能体，让模型能力落到具体场景。', en: 'From knowledge bases to agents, putting model capabilities into real scenarios.' },
    items: ['LLM 应用', 'RAG', '向量检索', 'Elasticsearch', '机器学习', '数据中台'],
  },
  {
    title: { zh: '交付与运维', en: 'Delivery & operations' },
    description: { zh: '标准化部署与监控，保障系统上线后持续稳定。', en: 'Standardised deployment and monitoring for stability after launch.' },
    items: ['Docker', 'Kubernetes', 'Linux', 'CI/CD', 'Nginx', '监控告警'],
  },
];

export interface DeliveryStep {
  title: LocalizedText;
  description: LocalizedText;
}

export const deliverySteps: DeliveryStep[] = [
  {
    title: { zh: '需求梳理', en: 'Discovery' },
    description: { zh: '深入了解业务、角色与流程，明确边界与优先级，输出可执行的需求清单。', en: 'We dig into the business, roles and processes, define scope and priorities, and produce an actionable requirement list.' },
  },
  {
    title: { zh: '原型与方案', en: 'Prototype & plan' },
    description: { zh: '用可点击原型对齐体验，确定技术方案、里程碑与报价，先想清楚再动手。', en: 'Clickable prototypes align the experience before we lock the technical approach, milestones and quote.' },
  },
  {
    title: { zh: '迭代开发', en: 'Iterative build' },
    description: { zh: '小步快跑、阶段演示，让每个关键节点可见、可验收、可调整。', en: 'Short cycles and staged demos keep every milestone visible, reviewable and adjustable.' },
  },
  {
    title: { zh: '测试与上线', en: 'Test & launch' },
    description: { zh: '完成功能、性能与安全测试，协助部署、培训与数据迁移，平稳切换。', en: 'Functional, performance and security testing, plus deployment, training and data migration for a smooth switch-over.' },
  },
  {
    title: { zh: '运维与陪伴', en: 'Operate & evolve' },
    description: { zh: '监控告警、问题响应与持续迭代，做企业长期可依赖的技术伙伴。', en: 'Monitoring, response and continuous iteration as a long-term technology partner.' },
  },
];

export interface Faq {
  question: LocalizedText;
  answer: LocalizedText;
}

export const faqs: Faq[] = [
  {
    question: { zh: '你们主要承接哪些类型的项目？', en: 'What kinds of projects do you take on?' },
    answer: {
      zh: '企业级管理系统、行业平台、数据中台、AI 知识库与智能体、小程序与电商系统，也支持存量系统的二次开发、接口集成与运维。',
      en: 'Enterprise management systems, industry platforms, data platforms, AI knowledge bases and agents, mini programs and e-commerce systems, plus second-phase development, integration and operations for existing systems.',
    },
  },
  {
    question: { zh: '一个项目大概需要多久？', en: 'How long does a project usually take?' },
    answer: {
      zh: '简单小程序或工具通常 2–4 周，中型业务系统 6–12 周，复杂平台按模块分阶段交付。具体周期取决于需求范围、接口数量与排期，我们会在评估后给出里程碑计划。',
      en: 'A simple mini program or tool usually takes 2–4 weeks, a mid-sized business system 6–12 weeks, and complex platforms are delivered in stages. The exact timeline depends on scope, integrations and scheduling; we provide a milestone plan after assessment.',
    },
  },
  {
    question: { zh: '如何保障交付质量？', en: 'How do you ensure delivery quality?' },
    answer: {
      zh: '需求、原型、开发、测试、上线分阶段验收，关键节点提供演示；交付源码、部署文档与使用说明，并设置质保期，问题可追踪闭环。',
      en: 'We review requirements, prototypes, development, testing and launch in stages, demo at key milestones, and hand over source code, deployment docs and user guides with a warranty period and traceable issue resolution.',
    },
  },
  {
    question: { zh: '是否支持私有化部署与数据安全要求？', en: 'Do you support private deployment and data security requirements?' },
    answer: {
      zh: '支持私有化与内网部署、权限分级、数据脱敏、日志审计和备份策略，可按客户的安全规范实施；AI 场景也可选择本地模型或专属实例。',
      en: 'We support private and intranet deployment, role-based access, data masking, audit logging and backup policies according to your security standards. AI scenarios can use local models or dedicated instances.',
    },
  },
  {
    question: { zh: '已有系统可以对接吗？', en: 'Can you integrate with our existing systems?' },
    answer: {
      zh: '可以。我们做过 OA、ERP、财务、监控、支付、短信、地图、微信生态等多类系统的接口集成，也可以承接历史数据迁移与系统改造。',
      en: 'Yes. We have integrated OA, ERP, finance, monitoring, payment, SMS, maps and the WeChat ecosystem, and can also handle legacy data migration and system modernisation.',
    },
  },
  {
    question: { zh: '售后运维怎么合作？', en: 'How does post-launch support work?' },
    answer: {
      zh: '可选择按次、包月或年度运维，提供远程支持、现场支持、监控告警、版本迭代与安全加固。合作方式会写进合同，响应时间清晰可考核。',
      en: 'Choose per-incident, monthly or annual support with remote and on-site assistance, monitoring, releases and security hardening. Terms and response times are written into the contract.',
    },
  },
];

export const contactInfo = {
  phones: ['156-1439-2011', '137-8020-0356'],
  address: {
    zh: '石家庄市桥西区鸿锐大厦 2 号楼 1105 室',
    en: 'Room 1105, Building 2, Hongrui Mansion, Qiaoxi District, Shijiazhuang',
  },
  company: {
    zh: '石家庄鲸码互联网科技有限责任公司',
    en: 'Shijiazhuang Whale Code Internet Technology Co., Ltd.',
  },
};
