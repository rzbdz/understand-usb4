// USB4 tunnel flows — single source of truth for the dual-panel visual.
// 协议主题色：usb3(蓝) pcie(紫) dp(青) usb2(橙) usb4(中性 slate) adapter(玫红)

const U4 = 'usb4', U3 = 'usb3', PC = 'pcie', DP = 'dp', U2 = 'usb2', AD = 'adapter';

const usb4Stack = {
  name: 'USB4 Fabric',
  layers: [
    { id: 'transport', label: 'Transport', short: 'TL Packet · HopID' },
    { id: 'logical', label: 'Logical / Link', short: '链路 · 流控 · 编码' },
    { id: 'phy', label: 'Electrical / PHY', short: 'SerDes · 差分对' },
  ],
};

function frame(title, caption, segments) {
  return { kind: 'frame', title, caption, segments };
}

function stream(title, caption, chips) {
  return { kind: 'stream', title, caption, chips };
}

function signal(title, caption, lanes) {
  return { kind: 'signal', title, caption, lanes };
}

// 原协议包已被 Adapter 包进 tunneled payload（成形中的 tunneled packet）
function adapterWrapped(protocolLabel, payload, tone) {
  return {
    kind: 'frame',
    title: 'Tunneled Packet（成形中）',
    caption: 'Adapter 映射：原协议包作为 tunneled payload',
    outer: [{ tone: AD, label: 'Tunneled HDR' }],
    payloadLabel: 'Tunneled Payload · ' + protocolLabel,
    payload,
    tone,
  };
}

// USB4 Transport 层：补齐 HopID / Length / HEC
function transportWrapped(protocolLabel, payload, tone) {
  return {
    kind: 'frame',
    title: 'USB4 Tunneled Packet',
    caption: 'Transport 层：加 USB4 运输头（HopID / Length / HEC）',
    outer: [
      { tone: U4, label: 'TL HDR' },
      { tone: U4, label: 'HopID' },
      { tone: U4, label: 'Length' },
      { tone: U4, label: 'HEC' },
    ],
    payloadLabel: 'Tunneled Payload · ' + protocolLabel,
    payload,
    tone,
  };
}

// 三个共享的 USB4 侧阶段：Transport → Link → PHY
function usb4Tail(protocolLabel, payload, tone) {
  return [
    {
      id: 'transport',
      note: 'Transport 层补齐 HopID / Length / HEC，成为 Path 上的运输单元',
      active: { source: [], adapter: ['egress'], usb4: ['transport'] },
      packet: transportWrapped(protocolLabel, payload, tone),
    },
    {
      id: 'logical',
      note: 'Logical / Link 层负责链路 framing、流控与 lane 分发',
      active: { source: [], adapter: [], usb4: ['logical'] },
      packet: stream('USB4 Link 字节流', '链路 framing · FEC/CRC · lane 分发（USB4 中性色）', [
        ['FRM', U4], ['TL', U4], ['FEC', U4], ['TL', U4], ['FRM', U4],
      ]),
    },
    {
      id: 'phy',
      note: 'Electrical / PHY 层把符号变成差分信号，经 USB4 链路送出',
      active: { source: [], adapter: [], usb4: ['phy'] },
      packet: signal('USB4 差分信号', 'SerDes → 差分对 · Lane 0 / Lane 1', [
        ['Lane 0', U4], ['Lane 1', U4],
      ]),
    },
  ];
}

const usb3Payload = [
  { tone: U3, label: 'USB3 HDR' },
  { tone: U3, label: 'TP' },
  { tone: U3, label: 'PAYLOAD' },
];

export const flows = {
  'usb3-genx': {
    id: 'usb3-genx',
    protocol: 'USB3 Gen X',
    tone: 'usb3',
    srcLabel: 'USB3 设备',
    midLabel: 'Enhanced SuperSpeed Hub',
    dstLabel: 'xHCI / Host',
    midKind: 'native', // native hub in the middle
    source: {
      name: 'USB3 Gen X',
      phyId: 'link',
      layers: [
        { id: 'protocol', label: 'Transaction / Protocol', short: 'TP · DP 包' },
        { id: 'link', label: 'Link', short: 'LFPS · Ordered Set · Link Cmd' },
        { id: 'nophy', label: '无 USB3 PHY', short: '物理层由 USB4 提供', ghost: true },
      ],
    },
    adapter: {
      name: 'USB3 Protocol Adapter',
      ingress: 'USB3 Link（面向原协议）',
      mapping: 'USB3 链路构造 → USB4 Tunneled Packet',
    },
    usb4: usb4Stack,
    stages: [
      {
        id: 'protocol',
        note: 'USB3 Transaction / Protocol 层生成 TP / DP 包',
        active: { source: ['protocol'], adapter: [], usb4: [] },
        packet: frame('USB3 Packet', '协议自身（蓝）：HDR / TP / PAYLOAD', usb3Payload),
      },
      {
        id: 'link',
        note: 'USB3 Link 层输出 LFPS / Ordered Set / Link Command（训练与流控构造，无 USB3 PHY）',
        active: { source: ['link'], adapter: [], usb4: [] },
        packet: stream('USB3 链路构造', 'LFPS · TS1/TS2 · Link Command（逻辑符号，非电气）', [
          ['LFPS', U3], ['TS1', U3], ['TS2', U3], ['LCRD', U3], ['LGOOD', U3], ['TS2', U3],
        ]),
      },
      {
        id: 'adapter',
        note: 'USB3 Adapter 把链路层构造封装为 USB4 tunneled packet（不经 USB3 PHY）',
        active: { source: [], adapter: ['ingress', 'map'], usb4: [] },
        packet: adapterWrapped('USB3', usb3Payload, U3),
      },
      ...usb4Tail('USB3', usb3Payload, U3),
    ],
  },

  pcie: {
    id: 'pcie',
    protocol: 'PCIe',
    tone: 'pcie',
    srcLabel: 'PCIe 设备',
    midLabel: 'PCIe Switch',
    dstLabel: 'PCIe Root Complex',
    midKind: 'native',
    source: {
      name: 'PCIe',
      phyId: 'phylogical',
      layers: [
        { id: 'transaction', label: 'Transaction', short: 'TLP' },
        { id: 'datalink', label: 'Data Link', short: 'DLLP / Ack' },
        { id: 'phylogical', label: 'PHY Logical sub-block', short: '编码 · Ordered Set' },
        { id: 'nophy', label: '无电气 SerDes', short: '由 USB4 PHY 提供', ghost: true },
      ],
    },
    adapter: {
      name: 'PCIe Adapter',
      ingress: 'PCIe PHY Logical（面向原协议）',
      mapping: 'PCIe TLP / DLLP → USB4 Tunneled Packet',
    },
    usb4: usb4Stack,
    stages: [
      {
        id: 'transaction',
        note: 'PCIe Transaction / Data Link 层生成 TLP',
        active: { source: ['transaction', 'datalink'], adapter: [], usb4: [] },
        packet: frame('PCIe TLP', '协议自身（紫）：TLP HDR / Data / ECRC', [
          { tone: PC, label: 'TLP HDR' }, { tone: PC, label: 'Data' }, { tone: PC, label: 'ECRC' },
        ]),
      },
      {
        id: 'phylogical',
        note: 'PCIe PHY Logical sub-block 输出 TS Ordered Set / 编码符号（无电气 SerDes）',
        active: { source: ['phylogical'], adapter: [], usb4: [] },
        packet: stream('PCIe 逻辑符号', 'PHY Logical sub-block · 8b/10b / 128b/130b（数字，非电气）', [
          ['COM', PC], ['SKP', PC], ['STP', PC], ['TLP', PC], ['END', PC], ['IDL', PC],
        ]),
      },
      {
        id: 'adapter',
        note: 'PCIe Adapter 把 TLP / DLLP 封装为 USB4 tunneled packet（不经电气 SerDes）',
        active: { source: [], adapter: ['ingress', 'map'], usb4: [] },
        packet: adapterWrapped('PCIe', [{ tone: PC, label: 'PCIe TLP' }], PC),
      },
      ...usb4Tail('PCIe', [{ tone: PC, label: 'PCIe TLP' }], PC),
    ],
  },

  dp: {
    id: 'dp',
    protocol: 'DisplayPort',
    tone: 'dp',
    srcLabel: 'DP Source',
    midLabel: '端到端（无 DP Hub）',
    dstLabel: 'DP Sink',
    midKind: 'e2e',
    source: {
      name: 'DisplayPort',
      phyId: 'phy',
      layers: [
        { id: 'mainlink', label: 'Main Link', short: '视频流' },
        { id: 'link', label: 'Link / Lane', short: 'lane 管理' },
        { id: 'phy', label: 'DP Physical Layer（可选）', short: '实现 PHY 或等价物' },
      ],
    },
    adapter: {
      name: 'DP IN Adapter',
      ingress: 'DP PHY（面向原协议）',
      mapping: 'DP Main Link 流 + AUX → USB4 Tunneled Packet',
    },
    usb4: usb4Stack,
    stages: [
      {
        id: 'mainlink',
        note: 'DP Source 输出 Main Link 视频流与 AUX 控制事务',
        active: { source: ['mainlink', 'link'], adapter: [], usb4: [] },
        packet: stream('DP Main Link 流', '协议自身（青）：视频 / 音频流 · MST 分包', [
          ['VB-ID', DP], ['Mvid', DP], ['TU', DP], ['TU', DP], ['TU', DP], ['VB-ID', DP],
        ]),
      },
      {
        id: 'srcphy',
        note: 'DP Physical Layer 输出符号（实现 DP PHY 或其功能等价物，§10.1.3）',
        active: { source: ['phy'], adapter: [], usb4: [] },
        packet: stream('DP 符号', '8b/10b (DP 1.4)', [
          ['K28.5', DP], ['D30.2', DP], ['BE', DP], ['BS', DP], ['D10.0', DP], ['K28.7', DP],
        ]),
      },
      {
        id: 'adapter',
        note: 'DP IN Adapter 把 DP 流与 AUX 映射为 tunneled packet',
        active: { source: ['phy'], adapter: ['ingress', 'map'], usb4: [] },
        packet: adapterWrapped('DP', [{ tone: DP, label: 'DP Stream / AUX' }], DP),
      },
      ...usb4Tail('DP', [{ tone: DP, label: 'DP Stream / AUX' }], DP),
    ],
  },

  gent: {
    id: 'gent',
    protocol: 'USB3 Gen T',
    tone: 'usb3',
    srcLabel: 'USB3 GenT 设备',
    midLabel: '端到端（无 USB3 Hub）',
    dstLabel: 'xHCI / Host',
    midKind: 'e2e',
    source: {
      name: 'USB3 Gen T',
      phyId: 'link', // GenT keeps USB3 protocol+link, no native USB3 PHY
      layers: [
        { id: 'protocol', label: 'Transaction / Protocol', short: 'USB3 协议层' },
        { id: 'link', label: 'Link（修改版）', short: 'SuperSpeedPlus 链路层' },
        { id: 'nophy', label: '无独立 USB3 PHY', short: '物理层由 USB4 提供', ghost: true },
      ],
    },
    adapter: {
      name: 'USB3 Gen T Adapter',
      ingress: 'USB3 链路层（面向原协议）',
      mapping: 'USB3 链路层流量 → USB4 Tunneled Packet',
    },
    usb4: usb4Stack,
    stages: [
      {
        id: 'protocol',
        note: 'USB3 Protocol 层生成 TP / DP 包（Gen T 保留修改版链路层，无独立 PHY）',
        active: { source: ['protocol'], adapter: [], usb4: [] },
        packet: frame('USB3 Packet', '协议自身（蓝）：HDR / TP / PAYLOAD', usb3Payload),
      },
      {
        id: 'adapter',
        note: 'USB3 Gen T Adapter 把修改版链路层流量映射为 tunneled packet（无 LFPS / Ordered Set、无 USB3 PHY）',
        active: { source: ['link'], adapter: ['ingress', 'map'], usb4: [] },
        packet: adapterWrapped('USB3', usb3Payload, U3),
      },
      ...usb4Tail('USB3', usb3Payload, U3),
    ],
  },
};
