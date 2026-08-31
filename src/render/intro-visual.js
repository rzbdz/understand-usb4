import { esc } from './escape.js';
import { evolution, supportGroups, laneInfo, introPunch } from '../data/intro-matrix.js';

// 开篇章节：发展历程 + 分组支持矩阵（着色）+ lane 划分
export const introVisual = {
  mount(root) {
    function tag(t) {
      var cls = t === 'M' ? 'mand' : (t === 'O' ? 'opt' : 'part');
      var label = t === 'M' ? 'MANDATE' : (t === 'O' ? 'OPTIONAL' : 'PARTIAL');
      return '<span class="mx-tag ' + cls + '">' + label + '</span>';
    }
    var html = '<div class="intro">';
    html += '<div class="pane-tag">发展历程 · USB 3.0 → USB4 v2</div>';
    html += '<div class="evo">' + evolution.map(function (e) {
      return '<div class="evo-node"><b>' + esc(e.name) + '</b><small>' + esc(e.year) + '</small><span>' + esc(e.what) + '</span><i>' + esc(e.phy) + '</i></div>';
    }).join('<div class="evo-arrow">→</div>') + '</div>';
    html += '<div class="pane-tag">支持矩阵 · 按类别着色 · M = 必选 / O = 可选 / ✱ = 部分</div>';
    html += '<div class="matrix-groups">' + supportGroups.map(function (g) {
      return '<div class="mg-card" data-tone="' + g.tone + '">'
        + '<div class="mg-head">' + esc(g.name) + '</div>'
        + '<div class="mg-items">' + g.items.map(function (it) {
            return '<div class="mg-item"><span class="mg-f">' + esc(it[0]) + '</span>' + tag(it[1]) + '</div>';
          }).join('') + '</div>'
        + '</div>';
    }).join('') + '</div>';
    html += '<div class="intro-punch">' + esc(introPunch) + '</div>';
    html += '</div>';
    root.innerHTML = html;
  },
  update() {},
};