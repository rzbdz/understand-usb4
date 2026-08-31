# USB4 隧道通路 · Claim Ledger

> 事实边界，不替代 USB4 / USB Type-C / USB3 / DP / PCIe 规范。页面只保留关键结论，讲稿再展开。

| ID | 页面结论 | 来源 | 状态 |
|---|---|---|---|
| C01 | 隧道模式的前提是对端为复合 USB4 设备：Device Router + 多个 Protocol Adapter + 原生 Hub/Switch | USB4 v2.0 §2.1.1.4 | 规范 |
| C02 | USB2（D+/D−）是独立总线，直通 USB2 控制器，不进 USB4 tunnel | USB4 v2.0 §2.1; USB Type-C Spec | 规范 |
| C03 | USB3 Gen X 保留 USB3 协议层与链路层（LFPS/Ordered Set/Link Command），但 USB3 端口接 Adapter 处不需要 USB3 Physical Layer（§9.2）；中间需 Enhanced SuperSpeed Hub | USB4 v2.0 §2.2.10.1 / §9.1 / §9.2 | 规范 |
| C04 | PCIe 经 PCIe Adapter 把 TLP/DLLP 映射为 Tunneled Packet；internal PCIe Port 实现 Transaction + Data Link + Physical Layer Logical sub-block（无电气 SerDes）；中间需 PCIe Switch | USB4 v2.0 §2.2.10.3 / Fig 2-33; Ch.11 | 规范 |
| C05 | DisplayPort 经 DP IN/OUT Adapter 端到端传输；DP Physical Layer 可选：实现 DP PHY 或其功能等价物（SoC 内 DPRX/DPTX），无 PHY 时仍按“有物理层”生成流（§10.1.3）；中间无 DP 专用 Hub | USB4 v2.0 §2.1 / §10.1 | 规范 |
| C06 | USB3 Gen T 保留 USB3 协议层与修改版链路层（SuperSpeedPlus 修改），去掉独立 USB3 PHY、复用 USB4 链路/PHY；Hub 为 pass-through，不经 Enhanced SuperSpeed Hub；USB4 v2 可选 | USB4 v2.0 §2.2.10.1.2 / §9.4 | 规范 |
| C07 | Protocol Adapter Layer 在 Tunneled Protocol traffic 与 USB4 Transport Layer Packets 之间做 mapping | USB4 v2.0 §2.2.1.5 | 规范 |
| C08 | Transport Layer Packet 携带 HopID / Length / HEC；Router 依 Routing Table 转发，HopID 可逐跳变化 | USB4 v2.0 §5.2.2 | 规范 |
| C09 | USB4 功能栈：Electrical → Logical → Transport → Configuration → Protocol Adapter | USB4 v2.0 §2.2.1 | 规范 |
| C10 | 回退（fallback）：对端非 USB4 时落到双方共同支持的最高总线级别（USB3 / USB2 / DP Alt Mode） | USB4 v2.0 §2.1 / §2.1.6 | 规范 |
| C11 | 页面中的 packet / bit stream 图为机制抽象，非完整线级 header / wire format | USB4 v2.0 §2.2.10 | 解释性抽象 |
| C12 | 8b/10b、128b/132b、128b/130b 等编码为各代协议的典型值，页面标注“示意” | USB3 / PCIe / DP 规范 | 典型值，保守表述 |
| C13 | 一个 USB4 Host 经 USB4 Hub 同时接入 USB3.0 / PCIe / DP / USB2 设备：Hub 内含 Device Router + Enhanced SuperSpeed Hub + PCIe Switch + USB2 Hub | USB4 v2.0 §2.1.1.4 | 规范 |
| C14 | 多种协议可同时在同一 USB4 链路上复用，靠 HopID / Path 区分；USB2 走独立 D+/D− 总线，不进 tunnel | USB4 v2.0 §2.2.3 / §2.2.10 | 规范 |
| C15 | USB4 统一的是电气 PHY 与传输层；Adapter 在数字层封装：USB3 端口接 Adapter 处不需要 USB3 Physical Layer（§9.2），PCIe 只到 Physical Layer Logical sub-block（Fig 2-33），DP 的 PHY 可选：实现 DP PHY 或功能等价物（§10.1.3） | USB4 v2.0 §9.2 / Fig 2-33 / §10.1.3 | 规范 |

## 对旧笔记的保守修正

- 不写 40bps、20GGbps 等笔误；速率组合不脱离版本/方向/lane 条件单独承诺。
- 不把 USB2 画进 tunnel；不把 USB3 Gen X 与 Gen T 混写；不把 PCIe Switch 与 USB3 Hub 混写；不把 DP tunnel 与 DP Alt Mode 混写。
- 不宣称原协议 header 原样嵌套进 USB4 header；只说 Adapter 做 mapping。
| C16 | Gen X 拓扑：Hub 内 UP Adapter → Enhanced SS Hub → DN Adapter，每段 USB3 Hub 重新建立 tunnel；Gen T 拓扑：Hub Router 按 USB4 route 直接转发，不进 SS Hub（用户提供的结构化拓扑 + §2.2.10.1/§9.2/§9.4） | USB4 v2.0 §2.2.10.1; §9.2; §9.4 | 规范+用户材料 |
| C17 | Linux 实做：USB3 tunnel = hop 表路径（tb_path_alloc/tb_tunnel_discover_usb3），激活 = ADP_USB3_CS_0 PE 等 adapter 寄存器；不可隧道时 ROUTER_CS_5_HCO 启用内部 xHCI；xhci_port_is_tunneled 用 Intel TUNEN 区分隧道/原生；内核无 Gen T 命名 | linux-torvalds drivers/thunderbolt/{tunnel,tb,usb4,switch}.c; drivers/usb/host/xhci-hub.c | 内核源码 |
| C18 | 支持矩阵：USB3.2 GenX 10G 与 DP1.4a tunneling 与 USB4 PHY≥10G 为必选；Gen2x2 20G、Gen T、PCIe tunneling 为可选（雷电3 PCIe 必选） | USB4合集.md; USB4 v2.0 | 用户提供材料+规范 |
| C19 | Lane：Type-C 最多 2 对 Tx/Rx（与 Gen2x2 同引脚）；v2 非对称 120G/40G = TX3+RX1；Gen T 速率跟随 USB4 链路 10G Sym ~ 120G/40G Asym；tunneling 重组包不受原协议 lane 限制 | USB4合集.md | 用户提供材料 |
| C20 | Linux 内核管理范围：NHI 驱动 + CM 控制面（tb.c 建隧道）+ adapter 寄存器编程；隧道数据面转发由 Router 硬件 hop 表完成，内核不经手；xHCI 对隧道无感知，仅 TUNEN 位探测 | linux-torvalds drivers/thunderbolt; drivers/usb/host/xhci-hub.c | 内核源码 |
