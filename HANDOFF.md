# USB4 隧道通路 · 接手说明（重建后）

## 1. 目标

面向 BSP / USB 控制器 / 驱动开发者的交互式演示。核心是左右双 Panel 逐层拆解 USB4 的每一条数据通路：

- 左 Panel：分层 + 硬件路径（三列：源协议栈 → Adapter → USB4 栈，PHY 相接）
- 右 Panel：当前阶段的数据包 / bit 流
- 每推进一个阶段，左 Panel 高亮当前层（前一阶段保留为 dim），右 Panel 同步切换包形态

第一数据源 usb4v2.pdf；USB4合集.md 仅作线索；术语/强制与可选关系以规范为准。

## 2. 页面编排（14 页，4 章）

- 01 全景：封面 / 发展历程 + 支持矩阵（MANDATE/OPTIONAL）+ Lane 划分（intro-matrix.js，素材 USB4合集.md）
- 02 基础：演示场景（设备挂 Hub）/ Adapter 穿在哪一层（stackdiag 层次图）/ Router·Adapter·Path（拓扑图）
- 03 隧道通路：USB2 直通 / Gen X·PCIe·DP·Gen T 双栏流图 / Gen X·Gen T 整拓扑对标（topo 页，左 path 步进高亮 + 右数据）
- 04 实做：Linux 内核（CM 视角 + 文件级证据，drivers/thunderbolt）
- 收尾：三条包同时进隧道（multiplex）

结构化视觉来源：Gen X / Gen T 拓扑 = 用户提供的 spec 风格 SVG（svg.html，对应 Figure 2-24 / 2-19）1:1 移植为 src/data/topo-svg.js，粗线 tunnel path 带 data-seg，随步进高亮（src/render/figure-visual.js）。
内核结论来自 ssh 只读检查 linux-torvalds（drivers/thunderbolt、drivers/usb/host/xhci-hub.c）。


## 3. 目录结构

```text
src/
├── main.js                 # 入口：读 hash 深链，mount
├── data/
│   ├── flows.js            # 四种 tunnel 的分层/阶段数据（单一数据源）
│   └── slides.js           # 页面清单
├── state/presentation-state.js  # createState / reduce / 选择器
├── render/
│   ├── escape.js
│   ├── visuals.js          # 所有视觉组件；tunnelVisual 是双 Panel 核心
│   └── render.js           # 渲染 + 导航 + hash 深链
└── styles/
    ├── tokens.css / layout.css / visuals.css / tunnel.css
    └── styles.css          # 聚合 @import
```

## 4. 如何新增一个 tunnel 协议

1. 在 src/data/flows.js 增加一个 flow：source.layers / adapter / usb4 / stages。
   - source 的 phyId 决定“源 PHY → Adapter”连接器何时点亮；Gen T 无原生 PHY，phyId 置 null。
   - stages 里每阶段给 active: { source[], adapter[], usb4[] } 与 packet。
2. 在 src/data/slides.js 加一条 slide：visual:'tunnel'、layout:'wide'、flow:'<id>'、steps: flows[id].stages.length。
3. 无需改 visual：tunnelVisual 由 flow 数据驱动。

## 5. 已踩过的坑

- 类名冲突：左侧协议栈列原名 class="flow-col source"，与侧栏规范出处 .source 撞车，render 里 querySelector('.source') 把规范文字写进协议栈列，导致三列结构被覆盖。已改名 flow-col src，且 render 一律用 .aside .xxx 精确定位。
- 写文件时模板字符串的转义：用普通模板字符串写含反引号/ ${} 的内容，转义为 \` 与 \${；不要用 String.raw（会保留反斜杠）。

## 6. 构建与视觉验收

```bash
npm run build            # 产物 dist/
npm run preview          # 本地静态服务，base=/usb4/，地址 http://127.0.0.1:4173/usb4/
```

浏览器验收（本机 chromium + puppeteer-core，已 --no-save 安装）：

```text
/root/.cache/ms-playwright/chromium-1217/chrome-linux64/chrome
```

- 深链格式 #slide-step（从 0 计数），如 #8-3。
- 用 headless + page.evaluate 检查 scrollWidth/clientWidth 溢出、.layer 数量、.layer.active/.done 高亮、[data-conn=up/down].active 连接器。
- 已验收尺寸：1920×1080 / 1366×768 / 1280×720 / 1024×768 / 390×844，无横向溢出、无裁切。

## 7. 部署

远端 sw1.dc.com，gateway /opt/sw1-hub/services/usb4/，访问 http://sw1.dc.com/usb4/。vite.config.js base:'/usb4/'。步骤：npm run build → 上传 dist/ 内容 → 远端 curl -fsSI http://127.0.0.1/usb4/ → 检查资源 URL 为 /usb4/assets/...。
## 设计系统（Apple style · 亮/暗主题）
- 主题：\`:root\` 暗色，\`[data-theme=light]\` 亮色；右下角 ☀/☾ 按钮切换，localStorage('usb4-theme') 记忆，默认 prefers-color-scheme。
- 协议主题色（tokens.css）：USB4=中性 slate（神秘中性，wrapper 统一用它），USB3=蓝，PCIe=紫，DP=青，USB2=橙，Adapter=玫红。数据包里协议自身段用协议色、USB4 附加头用中性色，一眼区分。
- 数据包统一「信封」渲染：\`.env\` 矩形边框 + \`.seg\` 分段块（wrap/border/rectangle），外层 USB4 wrapper + 内层 \`.env-payload\`（虚线协议色）承载原协议段。TP=Transaction Packet，DP=Data Packet。
- PPT 原则：舞台元素尽可能大，aside（讲稿/takeaway）保持小号。
