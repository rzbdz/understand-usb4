// Tunneled packet composition per hop — 讲清 TP/DP 是什么、包长什么样。
// 协议主题色：usb3(蓝) usb4(中性) usb2(橙) adapter(玫红)
// Gen X: 每个 USB3 构造独立封装（§9.1 Table 9-1）；Gen T: 精简链路层直封（§9.4）。

export const gentPackets = [
  { cap:'Gen T 原生构造（无 LFPS / Ordered Set）', segs:[['TP HDR','usb3'],['DATA','usb3'],['EPF/END','usb3']], tone:'usb3' },
  { cap:'Adapter 封装：USB3 构造 → tunneled payload', segs:[['Tunneled HDR','adapter'],['TP HDR','usb3'],['DATA','usb3']], tone:'usb3' },
  { cap:'USB4 Link：电气传输（USB4 中性色）', segs:[['Lane 0','usb4'],['Lane 1','usb4']], tone:'usb4' },
  { cap:'Hub Router：仅查路由表，payload 原样转发', segs:[['TL HDR','usb4'],['HopID→HopID','usb4'],['payload 原样','usb3']], tone:'usb3' },
  { cap:'USB4 Link：同一条 tunnel 继续', segs:[['Lane 0','usb4'],['Lane 1','usb4']], tone:'usb4' },
  { cap:'Device UP Adapter：解封装还原 Gen T', segs:[['TL HDR','usb4'],['TP HDR','usb3'],['DATA','usb3']], tone:'usb3' },
  { cap:'端到端到达：Peripheral · Gen T UFP 收到原生 USB3', segs:[['TP HDR','usb3'],['DATA','usb3'],['UFP','usb2']], tone:'usb3' },
];

export const genxPackets = [
  { cap:'Gen X 原生构造：LFPS/TS 全保留', segs:[['LFPS','usb3'],['TS1/TS2','usb3'],['LCRD','usb3'],['TP/DP','usb3']], tone:'usb3' },
  { cap:'DN Adapter 封装：每个构造单独成包', segs:[['Tunneled HDR','adapter'],['LFPS','usb3'],['TS1','usb3']], tone:'usb3' },
  { cap:'USB4 Link：电气传输', segs:[['Lane 0','usb4'],['Lane 1','usb4']], tone:'usb4' },
  { cap:'Hub UP Adapter：tunnel 终止，还原 USB3 构造', segs:[['TL HDR','usb4'],['LFPS 还原','usb3'],['TS1 还原','usb3']], tone:'usb3' },
  { cap:'Enhanced SS Hub：传统 USB3 交换（枚举/转发）', segs:[['SS Hub 路由','usb3'],['下行口选择','usb3']], tone:'usb3' },
  { cap:'DN Adapter：重新封装新 tunnel', segs:[['DN Adapter','adapter'],['TL HDR','usb4'],['TP/DP','usb3']], tone:'usb3' },
  { cap:'Hub 底部 Port：新 tunnel 段上路', segs:[['HopID','usb4'],['Gen X','usb3']], tone:'usb3' },
  { cap:'USB4 Link：第二段 tunnel', segs:[['Lane 0','usb4'],['Lane 1','usb4']], tone:'usb4' },
  { cap:'Device UP Adapter：解封装', segs:[['TL HDR','usb4'],['TP/DP','usb3']], tone:'usb3' },
  { cap:'到达 SS Function：收到原生 USB3', segs:[['TP HDR','usb3'],['DP HDR','usb3']], tone:'usb3' },
];
