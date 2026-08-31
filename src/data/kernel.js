// Linux 内核实做 — Router mux：一个 bit 决定一条数据通路。
// 左图 = Host Router 的 mux 接线图（3 条协议 lane），每步高亮一条通路 + 对应 bit。

export const kernelMux = {
  rows: [
    { id: 'usb3', tone: 'usb3', src: 'xHCI · USB3 主机', mux: 'UTO/HCO', adp: 'USB3 Adapter', fab: 'USB4 Fabric' },
    { id: 'pcie', tone: 'pcie', src: 'PCIe RC · 根复合体', mux: 'PTO', adp: 'PCIe Adapter', fab: 'USB4 Fabric' },
    { id: 'dp', tone: 'dp', src: 'GPU · iGPU', mux: '', adp: 'DP Adapter', fab: 'USB4 Fabric' },
  ],
  native: '内部 xHCI（原生 / fallback）',
};

export const kernelSteps = [
  { key: 'intro', file: 'pci.c · nhi.c', title: '认识 Host Router', tone: 'usb4', bits: '',
    what: 'NHI 是一个 PCI 设备（class 0x0c0340），是软件进入 USB4 的唯一入口。Host Router 里有 3 个协议 Adapter，各接一个控制器。' },
  { key: 'uto', file: 'usb4.c', title: '写 UTO（bit 25）→ USB3 进 Adapter', tone: 'usb3', bits: 'uto',
    what: 'USB3 流量：xHCI → mux → USB3 Adapter → USB4 Fabric（隧道）。数据面由 hop 表逐跳转发。' },
  { key: 'hco', file: 'usb4.c', title: '写 HCO（bit 26）→ USB3 直通内部 xHCI', tone: 'usb3', bits: 'hco',
    what: 'USB3 流量旁路 Adapter，直达内部 xHCI（原生）。fallback 就是它：USB 隧道不可用（TBT3 上游 / ACPI 禁用）时启用。' },
  { key: 'pto', file: 'usb4.c', title: '写 PTO（bit 24）→ PCIe RC 导通 Adapter', tone: 'pcie', bits: 'pto',
    what: 'PCIe 没有 native fallback，只能隧道：PCIe RC → mux → PCIe Adapter → Fabric。' },
  { key: 'whypto', file: 'usb4.c', title: '为什么 PTO 不是常开？', tone: 'pcie', bits: '',
    what: 'PTO 不是"开 native"，而是"这条 Router 的 PCIe Adapter 是否接入 Fabric"。不能常开：① PCIe 隧道在 USB4 是可选能力；② 要按能力链逐跳配置——上游必须能提供 PCIe 隧道（parent 有 PCIE-DOWN）+ 平台 ACPI 允许；③ 是 CM 枚举拓扑后的配置动作。' },
  { key: 'alloc', file: 'tunnel.c · path.c', title: '为什么隧道要软件 alloc？', tone: 'usb4', bits: '',
    what: 'hop 表 / 带宽 / HopID 是逐 Router 的资源，只有 Host CM 有全局视图（枚举整棵树）；资源要跨设备仲裁（带宽 / hop / DP）；策略（ACPI / 授权 / 热插拔）只有软件知道。硬件只做数据面（hop 转发 fast path），控制面必须软件。' },
  { key: 'end', file: 'xhci-hub.c', title: '终点感知', tone: 'usb3', bits: '',
    what: '终点对隧道无感知，只靠 xHCI 的 SPR 0x8ac4 TUNEN 位知道自己在隧道后面。' },
];

export const kernelConclusion = 'mux 是软件写的：ROUTER_CS_5 的 UTO/HCO/PTO 决定 USB3/PCIe 走 Adapter(隧道) 还是内部 xHCI(原生)；adapter 使能靠 ADP_*_CS_0 的 PE 位；数据面靠 hop 表逐跳转发。';
export const kernelDetect = [
  { n: 'CC/PD 协商', d: 'USB4 模式进入', t: '固件' },
  { n: 'mux 切 lanes', d: '路由到 Fabric', t: '硬件' },
  { n: 'PHY 握手', d: '硬件写 TCM', t: '硬件' },
  { n: '通知 CM', d: '软件读 link_is_usb4', t: '软件' },
  { n: '写 ROUTER_CS_5', d: '配 UTO/HCO/PTO', t: '软件' },
];

export const kernelDetectPunch = '谁决定 USB4 vs fallback：PHY 握手决定链接类型（硬件写 TCM），再通知 CM（软件）据此配置隧道。';