import { esc } from './escape.js';
import { kernelMux, kernelSteps, kernelConclusion } from '../data/kernel.js';

// Router mux：一个 bit 决定一条数据通路（左图）+ 这个文件/bit 在体系中的作用（右卡）
export const kernelVisual = {
  mount(root) {
    var html = '<div class="kern5">';
    html += '<div class="kern-cols">';

    // left: mux diagram
    html += '<div class="kern-left">';
    html += '<div class="pane-tag">Host Router · mux 接线图 · 一个 bit 决定一条通路</div>';
    html += '<div class="md-frame">';
    html += kernelMux.rows.map(function (r) {
      var mux = r.mux ? '<span class="md-mux" data-bit="' + r.mux + '"><i></i><b>' + r.mux + '</b></span>' : '';
      return '<div class="md-row" data-key="' + r.id + '" data-tone="' + r.tone + '">'
        + '<span class="md-node src">' + esc(r.src) + '</span>'
        + '<span class="md-link"></span>'
        + mux
        + '<span class="md-link"></span>'
        + '<span class="md-node adp">' + esc(r.adp) + '</span>'
        + '<span class="md-link"></span>'
        + '<span class="md-node fab">' + esc(r.fab) + '</span>'
        + '</div>';
    }).join('');
    // native branch (USB3 fallback)
    html += '<div class="md-native" data-tone="usb3"><span class="md-link vert"></span><span class="md-node nat">↳ ' + esc(kernelMux.native) + '</span></div>';
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
    root.querySelectorAll('.md-mux').forEach(function (el) {
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