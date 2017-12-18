/**
 * Copyright 2017 David Bolcsfoldi <david@bolcsfoldi.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 * @flow
 */

import ExternalAccessoryBrowser from '../index';

const nativeEvents = [
  'didFindUnconfiguredAccessories',
  'didRemoveUnconfiguredAccessories',
  'didFinishConfiguringAccessory',
  'didUpdateState',
];

var listeners = [];

test('Add valid event listeners', () => {
  nativeEvents.forEach((name) => {
    listeners.push(ExternalAccessoryBrowser.addEventListener(name, () => {}));
  });

  expect(ExternalAccessoryBrowser.eventListeners.size).toBe(nativeEvents.length);
});

test('Remove all event listeners', () => {
  listeners.forEach((listener) => listener.remove());
  expect(ExternalAccessoryBrowser.eventListeners.size).toBe(0);
});

test('Add invalid event listener', () => {
  ExternalAccessoryBrowser.addEventListener('INVALID', () => {});
  expect(ExternalAccessoryBrowser.eventListeners.size).toBe(0);
});

test('Remove invalid event listener', () => {
  function handler () {}
  function handler2 () {}
  ExternalAccessoryBrowser.addEventListener(nativeEvents[0], handler);
  ExternalAccessoryBrowser.removeEventListener('INVALID', handler2);
  expect(ExternalAccessoryBrowser.eventListeners.size).toBe(1);
  ExternalAccessoryBrowser.removeEventListener(nativeEvents[0], handler);
  expect(ExternalAccessoryBrowser.eventListeners.size).toBe(0);
});

test('Start search', () => {
  ExternalAccessoryBrowser.startSearch();
});

test('Stop search', () => {
  ExternalAccessoryBrowser.stopSearch();
});

test('Unconfigured Accessories', async () => {
  await expect(ExternalAccessoryBrowser.unconfiguredAccessories()).resolves.toHaveLength(0);
});

test('Configure Accessory', async () => {
  await expect(ExternalAccessoryBrowser.configureAccessory({})).resolves.toBeTruthy();
});

