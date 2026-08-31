import { esc } from './escape.js';
import { kernelSteps, kernelConclusion } from '../data/kernel.js';

export const kernelVisual = {
  mount(root) {
    var html = '<div class="kern4">';
    html += '<div class="kern-cols">';
    html += '<div class="kern-left">';
    html += '<div class="pane-tag">体系分层 · 一次讲一个文件</div>';
    html += '<div class="k-stack">' + kernelSteps.map(function (s, i) {
      return '<div class="k-band" data-tone="' + s.tone + '" data-i="' + i + '">'
        + '<span class="kb-layer">' + esc(s.layer) + '</span>'
        + '<span class="kb-regs">' + esc(s.regs) + '</span>'
        + '<span class="kb-file">' + esc(s.file) + '</span>'
        + '</div>';
    }).join('') + '</div>';
    html += '</div>';
    html += '<div class="kern-right">';
    html += '<div class="pane-tag">这个文件 · 在整个体系中的作用</div>';
    html += '<div class="k-spot" id="k-spot"></div>';
    html += '</div>';
    html += '</div>';
    html += '<div class="k-conc">' + esc(kernelConclusion) + '</div>';
    html += '</div>';
    root.innerHTML = html;
  },
  update(root, slide, step) {
    var bands = root.querySelectorAll('.k-band');
    bands.forEach(function (el) {
      var i = parseInt(el.dataset.i, 10);
      el.classList.toggle('active', i === step);
      el.classList.toggle('done', i < step);
    });
    var s = kernelSteps[Math.min(step, kernelSteps.length - 1)];
    var spot = root.querySelector('#k-spot');
    if (spot.dataset.step !== String(step)) {
      spot.dataset.step = String(step);
      spot.innerHTML = '<div class="ks-num">' + (Math.min(step, kernelSteps.length - 1) + 1) + ' / ' + kernelSteps.length + '</div>'
        + '<div class="ks-file" style="--tone:var(--' + s.tone + ')">' + esc(s.file) + '</div>'
        + '<div class="ks-action"><b>做什么</b>' + esc(s.action) + '</div>'
        + '<div class="ks-regs"><b>写哪个寄存器块</b>' + esc(s.regs) + '</div>'
        + '<div class="ks-what">' + esc(s.what) + '</div>';
    }
  },
};
