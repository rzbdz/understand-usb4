import './styles.css';
import { slides } from './data/slides.js';
import { createState } from './state/presentation-state.js';
import { mount } from './render/render.js';

function parseHash() {
  const m = (location.hash || '').match(/^#(\d+)(?:-(\d+))?$/);
  if (!m) return { slideIndex: 0, step: 0 };
  return { slideIndex: parseInt(m[1], 10), step: parseInt(m[2] || '0', 10) };
}

mount(document.querySelector('#app'), createState(slides, parseHash()));
