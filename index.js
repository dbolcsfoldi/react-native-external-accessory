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

import { 
  NativeEventEmitter,
  NativeModules
} from 'react-native';

const EAMExternalAccessoryBrowser = NativeModules.EAMExternalAccessoryBrowser;
const ExternalAccessoryEventEmitter = new NativeEventEmitter(EAMExternalAccessoryBrowser);

const nativeEvents = [
  'didFindUnconfiguredAccessories',
  'didRemoveUnconfiguredAccessories',
  'didFinishConfiguringAccessory',
  'didUpdateState',
];

export default class ExternalAccessoryBrowser
{
  static eventListeners = new Map();

  static addEventListener(name, handler) {
    if (nativeEvents.some((n) => name === n)) {
      let listener = ExternalAccessoryEventEmitter.addListener(name, handler);
      ExternalAccessoryBrowser.eventListeners.set(handler, listener);
      return { remove: () => ExternalAccessoryBrowser.removeEventListener(name, handler) }
    } else {
      console.warn(`Trying to subscribe to unknown event: ${name}`);
      return { remove: () => {} };
    }
  }

  static removeEventListener(name, handler) {
    let listener = ExternalAccessoryBrowser.eventListeners.get(handler);
  
    if (!listener) {
      return;
    }

    listener.remove();
    ExternalAccessoryBrowser.eventListeners.delete(handler);
  }

  static startSearch() {
    EAMExternalAccessoryBrowser.startSearch();
  }

  static stopSearch() {
    EAMExternalAccessoryBrowser.stopSearch();
  }

  static unconfiguredAccessories() {
    return EAMExternalAccessoryBrowser.unconfiguredAccessories();
  }

  static configureAccessory(accessory) {
    return EAMExternalAccessoryBrowser.configureAccessory(accessory);
  }
}

