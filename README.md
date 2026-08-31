# USB4 隧道通路（交互式演示）

面向 BSP / USB 控制器 / 驱动开发者的 USB4 机制演示：用左右双 Panel 逐层拆解 USB2 直通与四种 tunnel（USB3 Gen X / PCIe / DisplayPort / USB3 Gen T）的数据通路。

## 启动

```bash
npm install
npm run dev
```

打开终端输出的本地地址（默认 http://localhost:5173）。

## 演讲操作

- 滚轮 / ← → / PageUp / PageDown / 空格：推进或后退
- R：重播当前页阶段
- Home / End：首尾页
- 点击左侧章节编号跳转章节
- URL 支持深链：`#8-3` 表示第 8 页（从 0 计数）第 3 阶段

## 结构

- src/data/flows.js：四种 tunnel 的分层与阶段数据（单一数据源）
- src/data/slides.js：页面清单
- src/state/presentation-state.js：reducer + 选择器
- src/render/visuals.js：所有视觉组件（含 tunnel 双 Panel）
- src/render/render.js：渲染 + 导航 + hash 深链
- src/styles/：tokens / layout / visuals / tunnel

## 事实边界

第一数据源 usb4v2.pdf；USB4合集.md 仅作线索。claims 见 docs/claims.md，讲稿见 docs/speaker-notes.md。
