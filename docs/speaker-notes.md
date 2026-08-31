# USB4 隧道通路 · 逐页讲稿

讲稿为页面之外的可扩展文本；页面只保留标题、术语与结构图。

## 01 USB4 隧道通路
USB4 的核心不是某一种更快的 USB，而是一套统一传输与物理层：USB3、PCIe、DP、Host Interface 经各自 Adapter 接入。记住“多协议共用一套运输基础设施”。

## 02 Type-C / USB3 / USB4 不是同一层
Type-C 是物理接口（CC 协商方向/角色），USB3 是协议（Transaction/Link/PHY），USB4 是传输架构（Router+Adapter+Path）。三者层面不同，不能混写。

## 03 USB4 功能栈
Electrical 处理信号，Logical 处理链路与流控，Transport 在 Router 之间运包，Configuration 提供配置与管理，Protocol Adapter 对接具体协议。排障先定位层级。

## Adapter 在数字层封装，不在电气层
这是 USB4 的第一性原理：USB4 统一的是电气 PHY 与传输层。USB3 只保留协议层+链路层（端口接 Adapter 处不需要 USB3 PHY），PCIe 只到 PHY 逻辑子块（无电气 SerDes），DP 例外保留 DP Physical Layer。Adapter 在数字层把各协议构造封装成 Tunneled Packet，不做电平转换。

## 04 Router · Adapter · Path
Router 是节点，按 Routing Table 逐跳转发；Adapter 是协议接入/离开 Fabric 的接口；Path 是 CM 建立的端到端通路。三者职责不同。

## 05 隧道模式的前提
能走隧道，是因为对端也是复合 USB4 设备：一个 Device Router 挂多个 Adapter，内部还带原生 Hub/Switch 做兼容。对端不是复合 USB4 设备就退回兼容路径。

## 06 回退：直连旧设备
对端不是 USB4 时，退回双方共同支持的最高总线：USB2 走 D+/D−，USB3 走原生链路，DP 走 Alt Mode。USB4 不会把旧设备“变”成隧道设备。

## 07 回退如何协商
CC 检测方向/角色 → 双方交换能力 → 选最高共同总线级别 → 走原生路径直通。回退不是失败，是按能力协商出共同路径。

## 08 USB2 直通
USB2 是独立总线，D+/D− 半双工差分对直接连到 USB2 控制器/Hub，自始至终不进 USB4 tunnel。

## 09 USB3 Gen X 如何隧道（6 阶段）
1) USB3 协议层生成 TP/DP；2) USB3 Link 层输出 LFPS/Ordered Set/Link Command（训练与流控构造，无 USB3 PHY）；3) USB3 Adapter 把链路层构造封装为 tunneled packet；4) Transport 补齐 HopID/Length/HEC；5) Logical/Link 加 framing/流控；6) Electrical/PHY 变差分信号送出。中间节点仍需 Enhanced SuperSpeed Hub 做 USB3 协议路由。

## 10 PCIe 如何隧道（6 阶段）
PCIe：Transaction/Data Link 生成 TLP，PHY Logical sub-block 输出 TS Ordered Set/编码符号（无电气 SerDes），PCIe Adapter 封装 TLP/DLLP，中间经 PCIe Switch。PCIe tunneling 是条件能力。

## 11 DisplayPort 如何隧道（6 阶段）
DP IN Adapter 把 Main Link 流 + AUX 映射为 tunneled packet，经 USB4 传输到 DP OUT Adapter 恢复。DP Adapter 可选实现 DP Physical Layer 或功能等价物（SoC 内直连 DPRX/DPTX）；无论哪种，都按“有物理层”生成 Main-Link 流。中间无 DP 专用 Hub（端到端），并区分于 Type-C DP Alt Mode。

## 12 USB3 Gen T 端到端（5 阶段）
Gen T 保留 USB3 协议层与修改版链路层，去掉独立 USB3 PHY、直接复用 USB4 链路/PHY；无 LFPS/Ordered Set（Gen T 链路层精简）；Hub 对 Gen T 是 pass-through，不经 Enhanced SuperSpeed Hub。端到端，整条链路都要支持（USB4 v2 可选）。

## 五条通路一张图
按「电气 PHY」对照：USB2 独立 D+/D−；USB3 Gen X / PCIe / Gen T 统一用 USB4 PHY；DP 保留自己的 PHY。中间节点：Gen X 经原生 USB3 Hub、PCIe 经 PCIe Switch，DP / Gen T 端到端。

## 演示场景：一个口，四种功能
先给一个具体例子：一个 USB4 Host 接一个 USB4 Hub。Hub 内部是 Device Router + Enhanced SuperSpeed Hub + PCIe Switch + USB2 Hub；对外挂 USB3.0 U盘、PCIe 显卡、DP 显示器、USB2.0 键鼠。后面每一页 tunnel，都是从这个场景里取一条通路放大看。

## 三条包，同时进隧道
收尾：把前面讲过的三条通路并到同一根线里。USB3 包、PCIe TLP、DP 流各自打成 USB4 Tunneled Packet，靠 HopID 区分 Path，在同一条 USB4 链路上按需分时复用；USB2 键鼠走独立的 D+/D− 差分对，不进 tunnel。这就是 tunnel 的“复用”效果：一个物理口，同时承载多协议。
## Gen X / Gen T 整拓扑对标
Gen X：SS Host → Host Router（封装）→ Hub Router UP Adapter → 解封装 → Enhanced SS Hub（传统 USB3 路由）→ DN Adapter 再封装 → Device Router → SS Function。每过一个 USB3 Hub 就下隧道再上隧道。
Gen T：Gen T DFP → Host Router 封装 → Hub Router 纯转发（不进 SS Hub）→ Device Router → Gen T UFP，一段 tunnel 到底。
对比记忆：Gen X 的 Hub 是"tunnel 端点 + 新 tunnel 起点"；Gen T 的 Hub 是"中间 packet router"。

## Linux 内核实做
CM（tb.c）：枚举 router 树（depth=tb_route_length）→ 平台门控（tb_acpi_may_tunnel_*）→ 建 path/hop 表（tb_path_alloc）→ 带宽管理（USB3 占 2 份权重、90% 上限、USB4v2 最小预留 1.5Gb/s）。
激活：写 adapter 寄存器 ADP_USB3_CS_0（PE 使能）、CS_2（CMR）、CS_4（MSLR 10/20G）。
回退：不可隧道时 ROUTER_CS_5_HCO 启用内部 xHCI；xhci_port_is_tunneled 用 Intel TUNEN 位区分隧道/原生。
内核没有 "Gen T" 命名 —— USB3 tunnel 就是一条 hop 表路径，中间 router 只转发，佐证 Gen T 直通语义。
