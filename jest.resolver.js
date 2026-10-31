// Chains Reanimated's Jest resolver (loads its JS-thread files instead of the native-only ones)
// in front of React Native's resolver that jest-expo uses by default.
const reactNativeResolver = require('@react-native/jest-preset/jest/resolver');
const reanimatedResolver = require('react-native-reanimated/jest/resolver');

module.exports = (request, options) =>
  reanimatedResolver(request, {
    ...options,
    defaultResolver: (path, nextOptions) =>
      reactNativeResolver(path, { ...nextOptions, defaultResolver: options.defaultResolver }),
  });
