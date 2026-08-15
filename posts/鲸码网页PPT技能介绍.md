--- 
date: '2026-04-25'
---
 

## 这个 Skill 做什么

`jingma-ppt-skill` 由鲸码改造与维护（原作 `guizang-ppt-skill` 来自歸藏），用于生成**单文件 HTML** 的横向翻页 PPT，无需翻页工具，打开即看。它内置三种视觉基调，覆盖人文、科技、轻松三种不同表达场合。

### 风格 A · 电子杂志 × 电子墨水（默认）

- **WebGL 流体 / 等高线 / 色散背景**（hero 页可见）
- **衬线标题（Noto Serif SC + Playfair Display）+ 非衬线正文 + 等宽元数据**
- 适合：人文分享、行业观察、商业发布、需要「杂志感」的演讲
- 美学锚点：像 *Monocle* 杂志贴上了代码

### 风格 B · 瑞士国际主义（Swiss Style）

- **WebGL 极细网格 + 点阵背景**（信息驱动设计）
- **全程无衬线（Inter + Helvetica + Noto Sans SC）+ 极致字号对比**
- **高反差功能色**：克莱因蓝 IKB / 柠檬黄 / 柠檬绿 / 安全橙（四选一）
- 适合：科技产品、数据汇报、设计/工程领域分享、年度总结
- 美学锚点：像 Massimo Vignelli + Helvetica Forever

### 风格 C · 卡通涂鸦（Cartoon Doodle）

- **Canvas 纸张纹理 + 蜡笔颗粒 + 漂浮手绘贴纸背景**（hero 页可见）
- **圆润手写字体（ZCOOL KuaiLe + Patrick Hand + Comic Neue）+ 中等字号高对比**
- **高饱和糖果色**：草莓粉 / 青柠绿 / 蓝莓紫 / 暖橙 / 奶油黄（五选一作 anchor，可配 2 辅色）
- **圆角 + 软投影 + 胶带 / 便利贴 / 票券 / 邮票 / 涂鸦线条装饰**——三种风格里唯一允许「可爱」
- 适合：儿童 / 教育 / 趣味科普 / 品牌周边 / 漫画改编 / Demo Day 轻松场

### 三种风格共享

横向翻页（键盘 ← → 、滚轮、触屏、ESC 总览）、右下角 `P` 演讲者模式、当前/下一页 16:9 预览、内嵌宫格选页、标题/目的/讲稿备注、分组计时、排练记录、可选自动翻页、激光笔/圈选、观众屏黑白屏/冻结、同步状态与断线恢复、演前检查、Lucide 图标、Motion One 入场动效（本地 + CDN 双保险）。

## 何时使用

**合适的场景**：

- 线下分享 / 行业内部讲话 / 私享会
- AI 新产品发布 / demo day
- 带有强烈个人风格的演讲
- 需要「一次做完，不用翻页工具」的网页版 slides

**不合适的场景**：

- 大段表格数据、图表叠加（用常规 PPT）
- 培训课件（信息密度不够）
- 需要多人协作编辑（这是静态 HTML）

## 风格选择参考

| 如果用户说... | 推荐风格 |
|---|---|
| 「杂志感」/「人文」/「Monocle 风」/ 不指定 | **A · 电子杂志风** |
| 「瑞士风」/「Swiss Style」/「Helvetica」/「极简」/「网格」/「信息图」/「数据驱动」 | **B · 瑞士国际主义风** |
| 「卡通风」/「手绘」/「插画」/「涂鸦」/「可爱」/「教育 / 儿童产品」/「Duolingo 风」 | **C · 卡通涂鸦风** |
| 内容是 AI 产品 / 技术 / 工程 / 数据汇报 | B 更合适 |
| 内容是行业观察 / 人文 / 故事 / 文化 | A 更合适 |
| 内容是教育 / 科普 / 个人趣味 / 社群运营 | C 更合适 |

 
## 参考作品

**风格 A**：歸藏「一人公司：被 AI 折叠的组织」（2026-04-22，27 页）、*Monocle* 杂志版式、YC 总裁 Garry Tan「Thin Harness, Fat Skills」博客 demo

**风格 B**：Massimo Vignelli 的 NYC Subway / Unimark 系统、*Helvetica Forever* 字体设计语言、Josef Müller-Brockmann 网格系统经典著作、当代设计 Acne Studios / Off-White / IKEA

**风格 C**：Duolingo 吉祥物宇宙、Notion 涂鸦模板与便利贴墙、Muji 贴纸 / masking tape 美学、Yugo Nakamura 扁平卡通插画师、老式邮票 / 票根 / 拍立得收纳册

可以把它们当作风格锚点。

预览地址： [https://whale-code.com/skill-intro/ppt/index.html](https://whale-code.com/skill-intro/ppt/index.html)
