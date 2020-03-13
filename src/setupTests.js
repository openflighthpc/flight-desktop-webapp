// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom/extend-expect';
import { enableFetchMocks } from 'jest-fetch-mock';

// The lightest possible MutationObserver shim.  We may need to upgrade this
// to `import "mutationobserver-shim"` at some point.
global.MutationObserver = class {
    // constructor(callback) {}
    disconnect() {}
    observe(element, initObject) {}
};

enableFetchMocks();
