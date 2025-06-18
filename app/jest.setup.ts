import '@testing-library/jest-dom'
// jest.setup.ts
global.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};
