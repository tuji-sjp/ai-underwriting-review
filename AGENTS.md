# AGENTS.md

This file provides guidance to AI coding agents when working with code in this repository.

<!-- AUTO-MANAGED: project-description -->
## Overview

**新契约核保审核-后端管理系统** — AI 核保审核结果审查工具，用于对比 AI 与人工核保结论的差异。

- 由 `ai-underwriting-review-v5.html` 一比一还原为 React + Ant Design 项目
- 展示 10 个保险核保任务（分支 1-7/R/D）的完整审核链路
- 核心功能：任务列表筛选、表格分页导出、AI 核保评估展示、结论比对、流程节点可视化、影像预览
- 所有数据均为 mock，通过 `src/data/mockData.ts` 管理

<!-- END AUTO-MANAGED -->

<!-- AUTO-MANAGED: build-commands -->
## Build & Development Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | 启动 Vite 开发服务器（端口 3025） |
| `npm run build` | TypeScript 编译 + Vite 生产构建 |
| `npm run preview` | 预览生产构建产物 |

依赖：Vite 6, React 18, Ant Design 5, TypeScript ~5.6

<!-- END AUTO-MANAGED -->

<!-- AUTO-MANAGED: architecture -->
## Architecture

```
src/
├── main.tsx                     # 入口，渲染 App 到 #root
├── index.css                    # 全局样式（按钮、分页、滚动条、流程节点、动画）
├── App.tsx                      # 根组件：侧边栏 + TopTabs + 内容区
├── types/
│   └── index.ts                 # TypeScript 类型定义
├── data/
│   └── mockData.ts              # 全部 mock 数据（任务列表、疾病映射、AI分析、人工结论、EM评分）
├── components/
│   ├── Layout/
│   │   ├── Sidebar.tsx          # 左侧面板：筛选条件 + 任务列表
│   │   └── TopTabs.tsx          # 顶部 Tab 导航
│   ├── Filter/
│   │   └── FilterBar.tsx        # 筛选区：日期范围、执行状态、自核原因
│   ├── Table/
│   │   └── DataTable.tsx        # 数据表格 + 分页 + 结果导出按钮
│   └── Modals/
│       ├── ExportModal.tsx      # 导出弹窗
│       └── ImagePreview.tsx     # 影像预览
└── pages/
    └── DetailPanel/
        ├── DetailPanel.tsx      # 详情面板主组件
        ├── AiResult.tsx         # AI核保评估（中间结果/结论比对）
        ├── FlowDiagram.tsx      # 审核流程可视化
        └── ImageGallery.tsx     # 影像缩略图网格
```

数据流：`Sidebar.tsx` 选中任务 → `DetailPanel.tsx` 根据 TopTabs 当前激活 Tab 加载对应子组件 → `AiResult.tsx` 从 `mockData.ts` 读取 AI/人工数据并渲染。

<!-- END AUTO-MANAGED -->

<!-- AUTO-MANAGED: conventions -->
## Code Conventions

- **TypeScript**：严格模式，所有组件使用 `.tsx` 扩展名
- **组件风格**：函数式组件 + `React.FC<Props>` 类型标注
- **状态管理**：全部使用 React `useState`，无外部状态管理库
- **样式策略**：以内联 `style` 为主，全局样式仅放 `index.css`（按钮 `.btn/.btn-primary`、分页、流程节点、动画）
- **命名规范**：组件 PascalCase，变量/函数 camelCase，常量 UPPER_SNAKE_CASE
- **Mock 数据**：所有业务数据集中在 `mockData.ts`，不使用外部 API

<!-- END AUTO-MANAGED -->

<!-- AUTO-MANAGED: patterns -->
## Detected Patterns

- **条件渲染**：`{tabId === 'aiUnderwriting' && (!showOnly || showOnly === 'conclusionCompare')}` — 通过 tabId + showOnly 控制子模块显隐
- **数据查找**：按 taskId 从 Record 类型 mock 数据中查找对应记录，使用 `|| null` 处理空值
- **一致性判断**：核保结论比对使用 `normalizedConclusion()` 函数将"大概率标准体"归一化为"标准体"、"大概率除外"归一化为"除外"后再比较
- **不一致原因录入**：当 AI 与人工核保结论不一致时，在"一致/不一致"标签旁显示输入框 + 保存按钮，用户填写后点击保存，已保存内容以绿色"已保存：xxx"文字确认；状态通过 `diffReasons`（草稿）和 `savedReasons`（已保存）两个 Record 管理
- **条件字段渲染**："结论依据"列人工侧仅在 `productConclusion === '拒保'` 时显示 `basis`，否则显示"—"
- **可收展文本**：`CollapsibleText` 组件通过创建隐藏测量 div，根据 scrollHeight/lineHeight 精确计算行数，超过阈值显示展开/收起按钮
- **卡片+表格布局**：结论比对、疾病识别使用 `background: #fff` + `border: 1px solid #e8e8e8` + `borderRadius: 8` 卡片包裹 `<table>` 展示

<!-- END AUTO-MANAGED -->

<!-- AUTO-MANAGED: git-insights -->
## Git Insights

<!-- END AUTO-MANAGED -->

<!-- MANUAL -->
## Custom Notes

- 优化任务记录见 `Optimization-tasks.md`，共 13 轮迭代
- 开发服务器端口固定为 3025
- 项目不使用 git，所有变更为本地文件修改

<!-- END MANUAL -->
