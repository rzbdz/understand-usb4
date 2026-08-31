import { esc } from './escape.js';
import { kernelMux, kernelSteps, kernelDetect, kernelDetectPunch, kernelConclusion } from '../data/kernel.js';

// ── 检测链 slide：谁决定 USB4 vs fallback（一个概念一页） ──
export const kernelDetectVisual = {
  mount(root) {
    var html = '<div class="kd-slide">';
    html += '<div class="kd-flow">' + kernelDetect.map(function (s, i) {
      var cls = i === 2 ? 'judge' : (i === 0 || i === 1) ? 'pre' : 'cfg';
      return '<div class="kdf-step ' + cls + '">'
        + '<span class="kdf-idx">' + (i + 1) + '</span>'
        + '<b>' + esc(s.n) + '</b>'
        + '<i>' + esc(s.t) + '</i>'
        + '<small>' + esc(s.d) + '</small>'
        + (i === 2 ? '<em>判决者</em>' : '')
        + '</div>' + (i < kernelDetect.length - 1 ? '<span class="kdf-arrow">→</span>' : '');
    }).join('') + '</div>';
    html += '<div class="kd-punch">' + esc(kernelDetectPunch) + '</div>';
    html += '</div>';
    root.innerHTML = html;
  },
  update() {},
};

// ── mux 七帧：左 = mux 图（fallback 挂在 USB3 行下），右 = 聚光灯卡 ──
export const kernelMuxVisual = {
  mount(root) {
    var html = '<div class="kmux">';
    html += '<div class="kmux-cols">';

    // left: mux groups
    html += '<div class="kmux-left">';
    html += '<div class="pane-tag">Host Router · mux 接线图（一个 bit 决定一条通路）</div>';
    html += '<div class="km-frame">';
    html += kernelMux.rows.map(function (r) {
      var gate = r.mux ? '<span class="km-gate" data-bit="' + r.mux + '">' + r.mux + '</span>'
                       : '<span class="km-arw">→</span>';
      var html2 = '<div class="km-group" data-key="' + r.id + '" data-tone="' + r.tone + '">';
      html2 += '<div class="km-row">'
        + '<span class="km-node src">' + esc(r.src) + '</span>'
        + gate
        + '<span class="km-node adp">' + esc(r.adp) + '</span>'
        + '<span class="km-arw">→</span>'
        + '<span class="km-node fab">' + esc(r.fab) + '</span>'
        + '</div>';
      if (r.id === 'usb3') {
        html2 += '<div class="km-native">'
          + '<span class="km-arw br">↳</span>'
          + '<span class="km-node nat">' + esc(kernelMux.native) + '</span>'
          + '</div>';
      }
      html2 += '</div>';
      return html2;
    }).join('');
    html += '</div>';
    html += '</div>';

    // right: spotlight card
    html += '<div class="kmux-right">';
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
    root.querySelectorAll('.km-group').forEach(function (el) {
      var k = el.dataset.key;
      var on = (s.bits === 'uto' && k === 'usb3') || (s.bits === 'hco' && k === 'usb3') ||
               ((s.bits === 'pto' || s.key === 'whypto') && k === 'pcie');
      el.classList.toggle('on', on);
      el.classList.toggle('off', s.bits === 'hco' && k === 'usb3');
      el.classList.toggle('dim', s.key === 'alloc' || s.key === 'end');
    });
    var nat = root.querySelector('.km-native');
    if (nat) nat.classList.toggle('on', s.bits === 'hco');
    root.querySelectorAll('.km-gate').forEach(function (el) {
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
