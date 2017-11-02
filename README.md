# ReactNative External Accessory Framework for iOS

Search and configure WiFi Accessories from ReactNative. 

## Installation

Add react-native-external-accessory to your project.

```npm install --save react-native-external-accessory```

Link react-native-external-accessory.

```react-native link react-native-external-accessory```

Update your iOS projects entitlements to support Wireless Accessory Configuration.

```
<?xml version="1.0" encoding="UTF-8"?>
  <!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
  <plist version="1.0">
  <dict>
    ...
    <key>com.apple.external-accessory.wireless-configuration</key>
    <true/>
    ...
  </dict>
  </plist>
```

## TODOs

* Tests!
* Add NSPredicate support to ExternalAccessoryBrowser.startSearch
* Add support for Bluetooth and wired external accessories.

