// Disable jest-expo's strict module scope checking for tests
if (global.__ExpoImportMetaRegistry === undefined) {
  global.__ExpoImportMetaRegistry = {
    __proto__: null,
  };
}

// Mock console warnings/errors that might occur
const originalWarn = console.warn;
const originalError = console.error;

console.warn = (...args) => {
  if (typeof args[0] === 'string' && args[0].includes('Require cycle')) {
    return;
  }
  originalWarn.apply(console, args);
};

console.error = (...args) => {
  if (typeof args[0] === 'string' && args[0].includes('You are trying to `import` a file outside of the scope')) {
    return;
  }
  originalError.apply(console, args);
};
