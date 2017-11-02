/**
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
      return { remove: () => ExternalAccessoryEventEmitter.removeEventListener(name, handler) }
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
    EAMExternalAccessoryBrowser.configureAccessory(accessory);
  }
}

