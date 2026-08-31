import { esc } from './escape.js';
import { figures } from '../data/topo-svg.js';
import { compareRows } from '../data/topo-svg.js';
import { genxPackets, gentPackets } from '../data/packets.js';

// Spec-style SVG figure viewer: left = figure with stepped path highlight,
// right = current hop narration + packet composition (TP/DP 讲清楚).

const PK = { genx: genxPackets, gent: gentPackets };

export const figureVisual = {
  mount(root) {
    root.innerHTML = `
      <div class="fig">
        <div class="fig-title" id="fig-title"></div>
        <div class="fig-cols">
          <div class="fig-left">
            <svg id="fig-svg" viewBox="0 0 880 1000" xmlns="http://www.w3.org/2000/svg"></svg>
            <div class="fig-legend">
              <span><i class="lg thick"></i>tunnel path（当前段高亮）</span>
              <span><i class="lg thin"></i>控制 / 其他连接</span>
              <span><i class="lg box"></i>Router 内部</span>
              <span><i class="lg ell"></i>USB4 物理链路</span>
            </div>
          </div>
          <div class="fig-right">
            <div class="pane-tag">当前跳 · 发生了什么</div>
            <div class="fig-hop" id="fig-hop"></div>
            <div class="pane-tag" style="margin-top:10px">数据 · 包的组成（TP = Transaction Packet，DP = Data Packet）</div>
            <div class="fig-data" id="fig-data"></div>
            <div class="fig-note" id="fig-note"></div>
          </div>
        </div>
        <div class="fig-compare" id="fig-compare"></div>
      </div>`;
  },
  update(root, slide, step) {
    const f = figures[slide.flow] || figures.gent;
    const svg = root.querySelector('#fig-svg');
    if (svg.dataset.f !== f.id) {
      svg.innerHTML = f.body;
      svg.dataset.f = f.id;
      root.querySelector('#fig-title').textContent = f.title;
      const cmp = root.querySelector('#fig-compare');
      cmp.innerHTML = compareRows.map(r =>
        `<div class="cmp-row"><span>${esc(r[0])}</span><b>${esc(r[1])}</b><b>${esc(r[2])}</b></div>`).join('');
    }
    const segs = svg.querySelectorAll('.seg');
    segs.forEach(el => {
      const s = parseInt(el.dataset.seg, 10);
      el.classList.toggle('done', s < step);
      el.classList.toggle('active', s === step);
    });
    const i = Math.min(step, f.steps.length - 1);
    const st = f.steps[i];
    const pk = (PK[slide.flow] || PK.gent)[i];
    root.querySelector('#fig-hop').innerHTML = `
      <b>${i + 1}. ${esc(st.hop)}</b>
      <small>${esc(st.note)}</small>`;
    root.querySelector('#fig-data').innerHTML = `
      <div class="pkt-head"><span class="pkt-title">${esc(pk.cap)}</span></div>
      <div class="env" style="--ptone:var(--${pk.tone});--ptone-soft:var(--${pk.tone}-soft)">
        <div class="env-row">
          ${pk.segs.map(([l, t]) => `<span class="seg tone-${t}">${esc(l)}</span>`).join('')}
        </div>
      </div>`;
    const last = step >= f.steps.length - 1;
    root.querySelector('#fig-note').innerHTML = last
      ? (slide.flow === 'gent'
        ? '一条 tunnel 到终点：Hub 只做路由表转发，USB3 构造全程不被打开。'
        : '到达终点：整条路径经过两次封装/解封装（Host 与 Hub 各一次）。')
      : esc(f.punch || '');
  },
};