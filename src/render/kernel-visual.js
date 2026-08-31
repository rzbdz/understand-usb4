import { esc } from './escape.js';
import { kernelMux, kernelSteps, kernelConclusion, kernelDetect, kernelDetectPunch } from '../data/kernel.js';

// Router mux：一个 bit 决定一条数据通路（左图）+ 这个文件/bit 在体系中的作用（右卡）
export const kernelVisual = {
  mount(root) {
    var html = '<div class="kern5">';
    html += '<div class="k-detect">';
    html += '<span class="kd-tag">链接检测链 · 谁决定 USB4 vs fallback</span>';
    html += '<div class="kd-chain">' + kernelDetect.map(function (s, i) {
      return '<div class="kd-node" data-i="' + i + '"><span class="kd-top"><b>' + s.n + '</b><i>' + s.t + '</i></span><small>' + s.d + '</small></div>'
        + (i < kernelDetect.length - 1 ? '<span class="kd-arrow">→</span>' : '');
    }).join('') + '</div>';
    html += '<span class="kd-punch">' + esc(kernelDetectPunch) + '</span>';
    html += '</div>';
    html += '<div class="kern-cols">';

    // left: mux diagram
    html += '<div class="kern-left">';
    html += '<div class="pane-tag">Host Router · mux 接线图 · 一个 bit 决定一条通路</div>';
    html += '<div class="md-frame">';
    html += kernelMux.rows.map(function (r) {
      var gate = r.mux
        ? '<span class="md-bit" data-bit="' + r.mux + '">' + r.mux + '</span>'
        : '<span class="md-arw">→</span>';
      return '<div class="md-row" data-key="' + r.id + '" data-tone="' + r.tone + '">'
        + '<span class="md-node src">' + esc(r.src) + '</span>'
        + gate
        + '<span class="md-node adp">' + esc(r.adp) + '</span>'
        + '<span class="md-arw">→</span>'
        + '<span class="md-node fab">' + esc(r.fab) + '</span>'
        + '</div>';
    }).join('');
    // native branch (USB3 fallback): same 5-col grid, node sits in adapter column
    html += '<div class="md-native" data-tone="usb3">'
      + '<span class="md-node ghost"></span>'
      + '<span class="md-arw">→</span>'
      + '<span class="md-node nat">↳ ' + esc(kernelMux.native) + '</span>'
      + '<span></span><span></span>'
      + '</div>';
    html += '</div>';
    html += '</div>';

    // right: step card
    html += '<div class="kern-right">';
    html += '<div class="pane-tag">这个 bit / 文件 · 在体系中的作用</div>';
    html += '<div class="k-spot" id="k-spot"></div>';
    html += '</div>';

    html += '</div>';
    html += '<div class="k-conc">' + esc(kernelConclusion) + '</div>';
    html += '</div>';
    root.innerHTML = html;
  },
  update(root, slide, step) {
    var s = kernelSteps[Math.min(step, kernelSteps.length - 1)];

    // highlight mux rows per step
    root.querySelectorAll('.md-row').forEach(function (el) {
      var k = el.dataset.key;
      var on = (s.bits === 'uto' && k === 'usb3') || (s.bits === 'hco' && k === 'usb3') ||
               ((s.bits === 'pto' || s.key === 'whypto') && k === 'pcie');
      el.classList.toggle('on', on);
      el.classList.toggle('off', s.bits === 'hco' && k === 'usb3');
      el.classList.toggle('dim', s.key === 'alloc' || s.key === 'end');
    });
    root.querySelector('.md-native').classList.toggle('on', s.bits === 'hco');
    root.querySelectorAll('.md-bit').forEach(function (el) {
      var b = s.bits ? s.bits.toUpperCase() : '';
      el.classList.toggle('on', !!b && el.dataset.bit.toUpperCase().indexOf(b) >= 0);
    });

    var spot = root.querySelector('#k-spot');
    if (spot.dataset.step !== String(step)) {
      spot.dataset.step = String(step);
      spot.innerHTML = '<div class="ks-num">' + (Math.min(step, kernelSteps.length - 1) + 1) + ' / ' + kernelSteps.length + '</div>'
        + '<div class="ks-file" style="--tone:var(--' + s.tone + ')">' + esc(s.file) + '</div>'
        + '<div class="ks-title">' + esc(s.title) + '</div>'
        + '<div class="ks-what">' + esc(s.what) + '</div>';
    }
  },
};