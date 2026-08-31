// USB4 章前概览：发展历程 / 支持矩阵（按类别分组着色）/ Lane 划分
// 素材：USB4合集.md + USB4 v2.0 spec。主题色：usb3 蓝 / pcie 紫 / dp 青 / usb4 中性 / usb2 橙。

export const evolution = [
  { name: 'USB 3.0', year: '2008', what: 'USB2.0 + SuperSpeed（双总线）', phy: '5G · 1 lane' },
  { name: 'USB 3.1', year: '2013', what: 'Enhanced SuperSpeed', phy: '5G / 10G · 1 lane' },
  { name: 'USB 3.2', year: '2017', what: 'Dual-Lane（仅 Type-C）', phy: 'x1/x2 · 最高 20G' },
  { name: 'USB4 v1', year: '2019', what: 'Tunnel 架构 + 新 PHY', phy: '10/20/40G · 1-2 lane + 非对称' },
  { name: 'USB4 v2', year: '2023', what: 'Gen T + 非对称', phy: '80G Sym / 120G+40G Asym' },
];

// 支持矩阵按类别分组：USB / PCIe / DisplayPort / PHY·Lane·Host I/F
// tag: M = MANDATE(必选), O = OPTIONAL(可选), M* = 部分可选
export const supportGroups = [
  { name: 'USB', tone: 'usb3', items: [
    ['USB2.0 直通 D+/D−', 'M'],
    ['USB3.2 Gen X 10G · 必备门槛', 'M'],
    ['USB3.2 Gen X 20G · mac 不支持', 'O'],
    ['USB3.2 Gen T · v2 绕过 Hub', 'O'],
  ]},
  { name: 'PCIe', tone: 'pcie', items: [
    ['PCIe Tunneling · 雷电3 必选', 'O'],
  ]},
  { name: 'DisplayPort', tone: 'dp', items: [
    ['DP 1.4a · Host/Hub 须 ≥1', 'M*'],
    ['Alt Mode · 须兼容', 'M'],
  ]},
  { name: 'PHY · Lane · Host I/F', tone: 'usb4', items: [
    ['USB4 PHY ≥10G · 起步即 Gen2', 'M'],
    ['Host Interface · IP over USB4', 'M'],
  ]},
];

export const laneInfo = {
  sym: [
    ['USB3.0 5G', '1 lane'],
    ['USB3.1 10G', '1 lane'],
    ['USB3.2 20G', '2 lane (Gen2x2)'],
    ['USB4 20G / 40G', '2 lane (Gen2x2 / Gen3x2)'],
  ],
  asym: [
    ['USB4 v2 Sym 80G', '3 lane + 1 lane (Gen4)'],
    ['USB4 v2 Asym 120G/40G', 'TX 3 lane / RX 1 lane'],
    ['Gen T 速率跟随 USB4 链路', '10G Sym ~ 120G/40G Asym'],
  ],
  note: 'Type-C 引脚与 Gen2x2 一致：最多 2 对 Tx/Rx 差分全双工；USB2 D+/D− 独立。tunneling 重组包，不受原协议 lane 数限制。',
};

export const introPunch = 'USB4 ≥40G = USB3.2 ≤20G + DP + PCIe(可选) 同时跑；单设备 >20G 只能靠 PCIe 或 Gen T。Lane：Type-C 最多 2 对 Tx/Rx，v2 非对称 120G/40G = TX3+RX1。';