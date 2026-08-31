export function createState(slides, initial = { slideIndex: 0, step: 0 }) {
  return { slideIndex: initial.slideIndex, step: initial.step, slides };
}

export function currentSlide(state) {
  return state.slides[state.slideIndex];
}

function clampSlide(state, index) {
  return Math.max(0, Math.min(state.slides.length - 1, index));
}

export function stepCount(slide) {
  return slide.steps ? slide.steps : 1;
}

export function maxStepOf(state, slideIndex) {
  const s = state.slides[slideIndex];
  return stepCount(s) - 1;
}

export function maxStep(state) {
  return maxStepOf(state, state.slideIndex);
}

export function reduce(state, action) {
  switch (action.type) {
    case 'RESET':
      return { ...state, step: 0 };
    case 'GOTO':
      return { ...state, slideIndex: clampSlide(state, action.index), step: 0 };
    case 'SET': {
      const idx = clampSlide(state, action.slideIndex);
      const m = maxStepOf(state, idx);
      return { ...state, slideIndex: idx, step: Math.max(0, Math.min(m, action.step || 0)) };
    }
    case 'NEXT': {
      if (state.step < maxStep(state)) return { ...state, step: state.step + 1 };
      return { ...state, slideIndex: Math.min(state.slides.length - 1, state.slideIndex + 1), step: 0 };
    }
    case 'PREV': {
      if (state.step > 0) return { ...state, step: state.step - 1 };
      return { ...state, slideIndex: Math.max(0, state.slideIndex - 1), step: 0 };
    }
    default:
      return state;
  }
}
