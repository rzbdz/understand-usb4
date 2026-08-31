import { esc } from './escape.js';
import { figureVisual } from './figure-visual.js';
import { introVisual } from './intro-visual.js';
import { kernelDetectVisual, kernelMuxVisual } from './kernel-visual.js';
import { flows } from '../data/flows.js';

// ── packet rendering ─────────────────────────────────────────────
function seg(text, tone) {
  return `<span class="seg tone-${tone}">${esc(text)}</span>`;
}

function pktHead(p) {
  return `<div class="pkt-head"><span class="pkt-title">${esc(p.title)}</span><span class="pkt-caption">${esc(p.caption)}</span></div>`;
}

function packetHTML(p) {
  if (!p) return '';
  if (p.kind === 'stream') {
    const cells = p.chips.map(([t, tone]) => seg(t, tone)).join('');
    return `${pktHead(p)}<div class="env"><div class="env-row">${cells}<span class="stream-tail">…</span></div></div>`;
  }
  if (p.kind === 'signal') {
    const lanes = p.lanes.map(([t, tone]) =>
      `<div class="lane"><span class="lane-name">${esc(t)}</span><span class="lane-wave"></span></div>`
    ).join('');
    return `${pktHead(p)}<div class="env"><div class="signal">${lanes}</div></div>`;
  }
  if (p.outer) {
    const outer = p.outer.map((s) => seg(s.label, s.tone)).join('');
    const payload = p.payload.map((s) => seg(s.label, s.tone)).join('');
    const tone = p.tone || (p.payload[0] && p.payload[0].tone) || 'usb4';
    return `${pktHead(p)}<div class="env">
      <div class="env-row">${outer}</div>
      <div class="env-payload" style="--ptone:var(--${tone});--ptone-soft:var(--${tone}-soft)">
        <span class="env-tag">${esc(p.payloadLabel)}</span>
        <div class="env-row">${payload}</div>
      </div>
    </div>`;
  }
  const segs = p.segments.map((s) => seg(s.label, s.tone)).join('');
  return `${pktHead(p)}<div class="env"><div class="env-row">${segs}</div></div>`;
}

// ── tunnel flow state helpers ────────────────────────────────────
function layerState(layerId, stages, step, stack) {
  let cur = false, seen = false;
  for (let i = 0; i <= step; i++) {
    const act = stages[i].active[stack] || [];
    if (act.includes(layerId)) {
      if (i === step) cur = true; else seen = true;
    }
  }
  return cur ? 'active' : seen ? 'done' : 'idle';
}

function adapterList(stage) {
  const a = stage.active.adapter;
  return Array.isArray(a) ? a : a ? [a] : [];
}

function adapterState(key, stages, step) {
  let cur = false, seen = false;
  for (let i = 0; i <= step; i++) {
    if (adapterList(stages[i]).includes(key)) {
      if (i === step) cur = true; else seen = true;
    }
  }
  return cur ? 'active' : seen ? 'done' : 'idle';
}

function setLayer(el, state) {
  el.classList.remove('active', 'done');
  if (state === 'active') el.classList.add('active');
  else if (state === 'done') el.classList.add('done');
}

// ── tunnel flow markup ───────────────────────────────────────────
function topologyHTML(flow) {
  const midClass = flow.midKind === 'e2e' ? 'e2e' : flow.midKind === 'native' ? 'mid' : '';
  return `<div class="topology">
    <span class="topo-node now">${esc(flow.srcLabel)}</span>
    <span class="topo-arrow">→</span>
    <span class="topo-node ${midClass}">${esc(flow.midLabel)}</span>
    <span class="topo-arrow">→</span>
    <span class="topo-node">${esc(flow.dstLabel)}</span>
  </div>`;
}

function flowGridHTML(flow) {
  const src = flow.source.layers.map((l) =>
    `<div class="layer ${l.ghost ? 'ghost' : ''}" data-stack="source" data-layer="${l.id}"><span class="layer-label">${esc(l.label)}</span><span class="layer-short">${esc(l.short)}</span></div>`
  ).join('');
  const usb4 = flow.usb4.layers.map((l) =>
    `<div class="layer" data-stack="usb4" data-layer="${l.id}"><span class="layer-label">${esc(l.label)}</span><span class="layer-short">${esc(l.short)}</span></div>`
  ).join('');
  return `<div class="flow-grid">
    <div class="flow-col src" data-tone="${flow.tone}"><div class="col-head">${esc(flow.source.name)}</div>${src}</div>
    <div class="connector down" data-conn="down"><span>→</span></div>
    <div class="flow-col adapter">
      <div class="col-head">${esc(flow.adapter.name)}</div>
      <div class="adapter-region egress" data-region="egress"><span>→ USB4 Transport</span></div>
      <div class="adapter-region map" data-region="map"><span>${esc(flow.adapter.mapping)}</span></div>
      <div class="adapter-region ingress" data-region="ingress"><span>${esc(flow.adapter.ingress)}</span></div>
    </div>
    <div class="connector up" data-conn="up"><span>→</span></div>
    <div class="flow-col usb4"><div class="col-head">${esc(flow.usb4.name)}</div>${usb4}</div>
  </div>`;
}

export const tunnelVisual = {
  mount(root, slide) {
    const flow = flows[slide.flow];
    root._flow = flow;
    root.innerHTML = `<div class="tunnel" data-step="0">
      <div class="tunnel-meta">
        <span class="protocol-badge">${esc(flow.protocol)}</span>
        <span class="stage-count">阶段 1 / ${flow.stages.length}</span>
      </div>
      <div class="tunnel-body">
        <div class="tunnel-left">
          ${topologyHTML(flow)}
          ${flowGridHTML(flow)}
          <div class="stage-note"></div>
        </div>
        <div class="tunnel-right">
          <div class="packet-head-static"><span>PACKET / BIT STREAM</span></div>
          <div class="packet-body"></div>
          <p class="diagram-note">机制示意，不是完整线级 header / wire format</p>
        </div>
      </div>
    </div>`;
  },
  update(root, slide, step) {
    const flow = root._flow;
    const stages = flow.stages;
    const current = stages[step];
    const tun = root.querySelector('.tunnel');
    tun.setAttribute('data-step', String(step));
    root.querySelector('.stage-count').textContent = `阶段 ${step + 1} / ${stages.length}`;
    root.querySelector('.stage-note').textContent = current.note;

    root.querySelectorAll('.layer[data-stack="source"]').forEach((el) =>
      setLayer(el, layerState(el.dataset.layer, stages, step, 'source')));
    root.querySelectorAll('.layer[data-stack="usb4"]').forEach((el) =>
      setLayer(el, layerState(el.dataset.layer, stages, step, 'usb4')));
    root.querySelectorAll('.adapter-region').forEach((el) =>
      setLayer(el, adapterState(el.dataset.region, stages, step)));

    const down = (current.active.source && current.active.source.includes(flow.source.phyId)) ||
      adapterList(current).includes('ingress');
    const up = adapterList(current).includes('egress') ||
      (current.active.usb4 && current.active.usb4.includes('transport'));
    root.querySelector('[data-conn="down"]').classList.toggle('active', down);
    root.querySelector('[data-conn="up"]').classList.toggle('active', up);

    root.querySelector('.packet-body').innerHTML = packetHTML(current.packet);
  },
};

// ── simple visuals ───────────────────────────────────────────────
function heroHTML() {
  return `<div class="hero">
    <div class="hero-line"></div>
    <div class="hero-big">统一电气 PHY · <em>多协议隧道</em></div>
    <div class="hero-sub">各协议保留数字层，经 Adapter 数字封装，共享 USB4 的传输层与电气 PHY。</div>
    <div class="proto-chips">
      <span class="proto-chip" style="--tone:var(--usb3)">USB3</span>
      <span class="proto-chip" style="--tone:var(--pcie)">PCIe</span>
      <span class="proto-chip" style="--tone:var(--dp)">DisplayPort</span>
      <span class="proto-chip" style="--tone:var(--usb2)">USB2 直通</span>
    </div>
  </div>`;
}



function usb2HTML() {
  return `<div class="usb2">
    <div class="usb2-panel">
      <div class="panel-title">通路 · 独立总线</div>
      <div class="usb2-path">
        <div class="usb2-hop">USB2 设备</div>
        <div class="usb2-arrow">↓</div>
        <div class="usb2-hop bus">D+ / D− 半双工差分对</div>
        <div class="usb2-arrow">↓</div>
        <div class="usb2-hop">USB2 Hub · EHCI / OHCI</div>
        <div class="usb2-arrow">↓</div>
        <div class="usb2-hop">USB2 控制器（不经 USB4）</div>
      </div>
    </div>
    <div class="usb2-panel">
      <div class="panel-title">PACKET / SIGNAL</div>
      <div class="packet-body">
        <div class="pkt-head"><span class="pkt-title">USB2 Packet</span><span class="pkt-caption">NRZI 编码 · bit stuffing</span></div>
        <div class="env"><div class="env-row">
          <span class="seg tone-usb2">SYNC</span><span class="seg tone-usb2">PID</span><span class="seg tone-usb2">ADDR/ENDP</span><span class="seg tone-usb2">DATA</span><span class="seg tone-usb2">CRC16</span>
        </div></div>
      </div>
      <p class="diagram-note">USB2 是独立总线，不进 USB4 tunnel</p>
    </div>
  </div>`;
}


function scenarioHTML() {
  const host = [
    ['USB3 Adapter', 'xHCI 控制器', 'var(--usb3)'],
    ['PCIe Adapter', 'Root Complex', 'var(--pcie)'],
    ['DP OUT Adapter', '显示管线', 'var(--dp)'],
    ['USB2 控制器', '键鼠直通', 'var(--usb2)'],
  ];
  const hub = [
    ['Enhanced SuperSpeed Hub', 'USB3.0 U盘', 'var(--usb3)'],
    ['PCIe Switch', 'PCIe 显卡', 'var(--pcie)'],
    ['DP OUT Adapter', 'DP 显示器', 'var(--dp)'],
    ['USB2 Hub', 'USB2.0 键鼠', 'var(--usb2)'],
  ];
  const row = (a, b, t) => `<div class="scene-row" style="--tone:${t}"><span class="scene-a">${a}</span><i>→</i><span class="scene-b">${b}</span></div>`;
  return `<div class="scenario">
    <div class="scene-endpoint">
      <div class="scene-head">USB4 Host</div>
      <div class="scene-router">Host Router</div>
      <div class="scene-rows">${host.map(([a, b, t]) => row(a, b, t)).join('')}</div>
    </div>
    <div class="scene-link">
      <div class="scene-cable"><span>USB4 链路</span><small>Lane 0 / Lane 1</small></div>
      <div class="scene-usb2"><span>D+ / D−</span><small>USB2 独立</small></div>
    </div>
    <div class="scene-endpoint">
      <div class="scene-head">USB4 Hub</div>
      <div class="scene-router">Device Router</div>
      <div class="scene-rows">${hub.map(([a, b, t]) => row(a, b, t)).join('')}</div>
    </div>
  </div>`;
}

function multiplexHTML() {
  const pkt = (tag, payload, tone) => `<div class="mux-pkt"><span class="mux-tl">TL · ${tag}</span><span class="mux-payload tone-${tone}">${payload}</span></div>`;
  const group = pkt('HopID 5', 'USB3 packet', 'usb3') + pkt('HopID 7', 'PCIe TLP', 'pcie') + pkt('HopID 9', 'DP stream', 'dp');
  return `<div class="mux">
    <div class="mux-link">
      <span class="mux-end">USB4 Host</span>
      <div class="mux-pipe"><div class="mux-stream">${group}${group}${group}</div></div>
      <span class="mux-end">USB4 Hub</span>
    </div>
    <div class="mux-legend">
      <span class="tone-usb3">■ USB3</span><span class="tone-pcie">■ PCIe</span><span class="tone-dp">■ DisplayPort</span><span class="tone-usb4">■ USB4 wrapper（TL · HopID）</span>
    </div>
    <div class="mux-usb2">
      <span class="mux-usb2-label">USB2 · D+ / D−</span>
      <span class="mux-usb2-line"></span>
      <span class="mux-usb2-end">USB2.0 键鼠（独立，不进 tunnel）</span>
    </div>
    <p class="mux-note">HopID 区分 Path · 三种协议在一条 USB4 链路上按需分时复用；USB2 走独立差分对</p>
  </div>`;
}

// ── stackdiag: 层次结构图（Adapter 穿在哪一层） ──
function stackdiagHTML() {
  const col = (name, tone, layers) => `<div class="sd-col" style="--tone:var(--${tone})">
    <div class="sd-head">${esc(name)}</div>
    ${layers.map(([label, ghost]) => `<div class="sd-layer${ghost ? ' ghost' : ''}">${esc(label)}</div>`).join('')}
  </div>`;
  return `<div class="stackdiag">
    <div class="sd-protos">
      ${col('USB3', 'usb3', [['Transaction / Protocol'], ['Link'], ['无 USB3 PHY', true]])}
      ${col('PCIe', 'pcie', [['Transaction'], ['Data Link'], ['PHY Logical sub-block'], ['无电气 SerDes', true]])}
      ${col('DisplayPort', 'dp', [['Main Link'], ['Link / Lane'], ['Physical Layer（可选 / 等价物）']])}
    </div>
    <div class="sd-merge"><span>↓ 数字封装</span></div>
    <div class="sd-adapter">Protocol Adapter</div>
    <div class="sd-merge"><span>↓</span></div>
    <div class="sd-usb4">
      <div class="sd-layer u4">Transport</div>
      <div class="sd-layer u4">Logical / Link</div>
      <div class="sd-layer u4 phy">Electrical / PHY · 统一电气 PHY</div>
    </div>
  </div>`;
}

// ── routerpath: 拓扑图 ──
function routerpathHTML() {
  const routerBox = (name, adapters, role) => `<div class="rp-router">
    <div class="rp-name">${esc(name)}</div>
    <div class="rp-adapters">${adapters.map(([a, t]) => `<span class="rp-adapter" style="--tone:var(--${t})">${esc(a)}</span>`).join('')}</div>
    <div class="rp-role">${esc(role)}</div>
  </div>`;
  return `<div class="routerpath">
    <div class="rp-row">
      ${routerBox('Host Router', [['USB3 Adapter', 'usb3'], ['PCIe Adapter', 'pcie'], ['DP OUT Adapter', 'dp']], '转发节点')}
      <div class="rp-path"><span class="rp-path-line"></span><span class="rp-path-tag">Path</span><small>HopID 5 → HopID 7 · 逐跳可变</small></div>
      ${routerBox('Hub Router', [['USB3 Adapter', 'usb3'], ['PCIe Adapter', 'pcie'], ['DP IN Adapter', 'dp']], '转发节点')}
    </div>
    <div class="rp-legend">
      <span><b>Router</b> 节点 · Routing Table</span>
      <span><b>Adapter</b> 协议接入 / 离开</span>
      <span><b>Path</b> 端到端通路</span>
    </div>
  </div>`;
}

// ── registry ─────────────────────────────────────────────────────
const simple = (fn) => ({ mount(root) { root.innerHTML = fn(); }, update() {} });



export const visuals = {
  hero: simple(heroHTML),
  scenario: simple(scenarioHTML),
  usb2: simple(usb2HTML),
  tunnel: tunnelVisual,
  stackdiag: simple(stackdiagHTML),
  routerpath: simple(routerpathHTML),
  topo: figureVisual,
  intro: introVisual,
  kernelDetect: kernelDetectVisual,
  kernelMux: kernelMuxVisual,
  multiplex: simple(multiplexHTML),
};