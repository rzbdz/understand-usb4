import { currentSlide, reduce, stepCount } from '../state/presentation-state.js';
import { esc } from './escape.js';
import { visuals } from './visuals.js';

const pad = (n) => String(n).padStart(2, '0');

function copyHTML(slide) {
  if (slide.layout === 'wide') {
    return `<header class="wide-copy"><span class="eyebrow">${esc(slide.eyebrow)}</span><h1>${esc(slide.title)}</h1><p class="kicker">${esc(slide.kicker)}</p></header>`;
  }
  return `<div class="slide-copy"><div class="eyebrow">${esc(slide.eyebrow)}</div><h1>${esc(slide.title)}</h1><p class="kicker">${esc(slide.kicker)}</p></div>`;
}

function slideHTML(slide, step) {
  const cls = slide.layout === 'wide' ? 'slide-wide' : 'slide-split';
  return `<article class="slide ${cls}" data-slide="${slide.id}" data-step="${step}">${copyHTML(slide)}<div class="visual-root"></div></article>`;
}

function shellHTML(state) {
  const chapters = [...new Set(state.slides.map((s) => s.chapter))];
  return `<div class="app-shell">
    <div class="deck-grid">
      <nav class="rail" aria-label="章节导航">
        <div class="brand">USB4</div>
        <div class="rail-list">${chapters.map((c, i) => `<button class="rail-dot" data-chapter-index="${i}" aria-label="${esc(c)}">${pad(i + 1)}</button>`).join('')}</div>
      </nav>
      <div class="stage" aria-label="演示舞台"></div>
      <aside class="aside">
        <div class="chapter"></div>
        <div class="aside-main"><h2>讲稿 · takeaway</h2><p class="takeaway"></p></div>
        <div class="source"></div>
      </aside>
    </div>
    <footer class="controls">
      <span class="hint"><b>← →</b> 导航 · <b>滚轮</b> 推进 · <b>R</b> 重播</span>
      <span class="counter"></span>
      <div class="progress"><i></i></div>
      <span class="stage-count">—</span>
      <span class="actions"><button class="theme-btn" data-action="theme" aria-label="切换主题" title="亮色/暗色">☀</button><button data-action="prev" aria-label="上一页">←</button><button data-action="next" aria-label="下一页">→</button></span>
    </footer>
  </div>`;
}

export function mount(app, state) {
  let current = state;
  let lock = false;
  let wheelTimer = 0;

  app.innerHTML = shellHTML(state);
  const shell = app.querySelector('.app-shell');
  const chapters = [...new Set(state.slides.map((s) => s.chapter))];

  function render(prev) {
    const slide = currentSlide(current);
    const isNewSlide = !prev || prev.slideIndex !== current.slideIndex;
    if (isNewSlide) {
      const stage = shell.querySelector('.stage');
      stage.innerHTML = slideHTML(slide, current.step);
      visuals[slide.visual].mount(stage.querySelector('.visual-root'), slide);
    }
    const root = shell.querySelector('.visual-root');
    const frame = slide.frame !== undefined ? slide.frame : current.step;
    visuals[slide.visual].update(root, slide, frame);
    shell.querySelector('.slide').dataset.step = String(frame);

    shell.querySelector('.aside .chapter').textContent = slide.chapter;
    shell.querySelector('.aside .takeaway').textContent = slide.takeaway;
    shell.querySelector('.aside .source').textContent = slide.source;
    shell.querySelector('.counter').textContent = `${pad(current.slideIndex + 1)} / ${pad(current.slides.length)}`;
    const sc = stepCount(slide);
    shell.querySelector('.stage-count').textContent = sc > 1 ? `阶段 ${current.step + 1} / ${sc}` : '—';
    shell.querySelector('.progress i').style.width = `${((current.slideIndex + 1) / current.slides.length) * 100}%`;
    const activeChapter = chapters.indexOf(slide.chapter);
    shell.querySelectorAll('.rail-dot').forEach((b, i) => b.classList.toggle('active', i === activeChapter));
  }

  function writeHash(s) {
    const h = s.step > 0 ? `${s.slideIndex}-${s.step}` : `${s.slideIndex}`;
    if (location.hash !== '#' + h) history.replaceState(null, '', '#' + h);
  }

  function update(action) {
    if (lock) return;
    const next = reduce(current, action);
    if (next === current) return;
    lock = true;
    const prev = current;
    current = next;
    render(prev);
    writeHash(current);
    setTimeout(() => { lock = false; }, 320);
  }

  function firstSlideOf(chapter) {
    return current.slides.findIndex((s) => s.chapter === chapter);
  }

  function theme() {
    const saved = localStorage.getItem('usb4-theme');
    return saved || (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
  }
  function applyTheme(t) {
    document.documentElement.dataset.theme = t;
    const btn = app.querySelector('.theme-btn');
    if (btn) btn.textContent = t === 'light' ? '☀' : '☾';
  }
  applyTheme(theme());

  render(null);

  app.addEventListener('click', (e) => {
    const chapter = e.target.closest('[data-chapter-index]');
    if (chapter) {
      const target = firstSlideOf(chapters[+chapter.dataset.chapterIndex]);
      if (target >= 0) update({ type: 'GOTO', index: target });
      return;
    }
    const action = e.target.closest('[data-action]');
    if (action) {
      if (action.dataset.action === 'theme') {
        const next = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
        localStorage.setItem('usb4-theme', next);
        applyTheme(next);
        return;
      }
      update({ type: action.dataset.action === 'next' ? 'NEXT' : 'PREV' }); return;
    }
    if (e.target.closest('.rail,.aside,.controls')) return;
    const stage = e.target.closest('.stage');
    if (stage) {
      const rect = stage.getBoundingClientRect();
      update({ type: e.clientX > rect.left + rect.width / 2 ? 'NEXT' : 'PREV' });
    }
  });

  app.addEventListener('wheel', (e) => {
    if (!e.target.closest('.stage')) return;
    if (Date.now() < wheelTimer || Math.abs(e.deltaY) < 8) return;
    wheelTimer = Date.now() + 420;
    update({ type: e.deltaY > 0 ? 'NEXT' : 'PREV' });
  }, { passive: true });

  window.addEventListener('keydown', (e) => {
    if (e.target.matches('input,textarea,[contenteditable]')) return;
    const k = e.key;
    if (k.toLowerCase() === 'r') { e.preventDefault(); update({ type: 'RESET' }); return; }
    const map = { ArrowRight: 'NEXT', PageDown: 'NEXT', ' ': 'NEXT', ArrowLeft: 'PREV', PageUp: 'PREV', Backspace: 'PREV', Home: 'HOME', End: 'END' };
    if (!(k in map)) return;
    e.preventDefault();
    if (map[k] === 'HOME') update({ type: 'GOTO', index: 0 });
    else if (map[k] === 'END') update({ type: 'GOTO', index: current.slides.length - 1 });
    else update({ type: map[k] });
  });
}