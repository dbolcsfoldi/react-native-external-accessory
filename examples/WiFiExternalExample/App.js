/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { 
  Component,
  PureComponent
} from 'react';

import {
  Button,
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import ExternalAccessoryBrowser from 'react-native-external-accessory';

class AccessoryItem extends PureComponent {
  _onPress = () => {
    this.props.onPressItem(this.props.accessory);
  }

  render() {
    let header = `${this.props.accessory.name}@${this.props.accessory.ssid}`;
    let airplay = this.props.accessory.supportsAirPlay ? 'AirPlay' : ' ';
    let airprint = this.props.accessory.supportsAirPrint ? 'AirPrint' : ' ';
    let homekit = this.props.accessory.supportsHomeKit ? 'HomeKit' : ' ';

    return (
      <View style={styles.accessoryItem}>
        <TouchableOpacity onPress={this._onPress}>
          <Text style={styles.itemHeader}>{header}</Text>
          <View style={styles.accessoryItemBody}>
            <Text style={styles.itemText}>{this.props.accessory.model}</Text>
            <Text style={styles.itemText}>{this.props.accessory.manufacturer}</Text>
            <Text style={styles.itemText}>{this.props.accessory.macAddress}</Text>
            <Text style={styles.itemText}>{airplay}</Text>
            <Text style={styles.itemText}>{airprint}</Text>
            <Text style={styles.itemText}>{homekit}</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

export default class App extends Component<{}> {
  constructor(props) {
    super(props);
    this.state = {
      scanStatus: 'Stopped',
      accessories: [ ]
    };
  
    this.didFindUnconfiguredAccessories = ExternalAccessoryBrowser.addEventListener('didFindUnconfiguredAccessories', this.onDidFindUnconfiguredAccessories.bind(this));
    this.didRemoveUnconfiguredAccessories = ExternalAccessoryBrowser.addEventListener('didRemoveUnconfiguredAccessories', this.onDidRemoveUnconfiguredAccessories.bind(this));
    this.didFinishConfiguringAccessory = ExternalAccessoryBrowser.addEventListener('didFinishConfiguringAccessory', this.onDidFinishConfiguringAccessory.bind(this));
    this.didUpdateState = ExternalAccessoryBrowser.addEventListener('didUpdateState', this.onDidUpdateState.bind(this));
  }

  async updateAccessories() {
    try {
      let accessories = await ExternalAccessoryBrowser.unconfiguredAccessories();
      this.setState({ accessories: accessories });
    } catch (error) {
      console.log(error);
    }
  }

  componentDidMount() {
    this.updateAccessories();
  }

  componentWillUnmount() {
    this.didFindUnconfiguredAccessories.remove()
    this.didRemoveUnconfiguredAccessories.remove()
    this.didFinishConfiguringAccessory.remove()
    this.didUpdateState.remove()
  }

  onDidFindUnconfiguredAccessories(accessories) {
    console.log(`Found Accessories: ${accessories}`)
    this.updateAccessories();
  }

  onDidRemoveUnconfiguredAccessories(accessories) {
    console.log(`Remove Accessories: ${accessories}`);
    this.updateAccessories();
  }
  
  onDidFinishConfiguringAccessory(accessory) {
    console.log(`Configured Accessory: ${accessory}`);
  }

  onDidUpdateState(newState) {
    console.log(`Update State: ${newState}`);
    this.setState({ scanStatus: newState.state });
  }

  onScanPress() {
    if (this.state.scanStatus === 'Searching') {
      ExternalAccessoryBrowser.stopSearch();
    } else {
      ExternalAccessoryBrowser.startSearch();
    }
  }

  async configureAccessory(accessory) {
    try {
      let configuring = await ExternalAccessoryBrowser.configureAccessory(accessory);
    } catch (error) {
      console.error(error);
    }
  }

  _itemPress = (accessory) => {
    console.log(`${accessory.name} selected`);
    this.configureAccessory(accessory);
  }

  onKeyExtractor(item, index) {
    return item.macAddress;
  }

  onRenderItem({item}) {
    return (<AccessoryItem accessory={item} onPressItem={this._itemPress}/>);
  }

  render() {
    let scanTitle = this.state.scanStatus === 'Searching' ? 'Stop Scanning' : 'Start Scanning';
    let scanStatus = `Scan Status: ${this.state.scanStatus}`;

    return (
      <View style={styles.container}>
        <Text style={styles.statusText}>{scanStatus}</Text>
        <FlatList
          style={styles.list}
          data={this.state.accessories}
          extraData={this.state}
          keyExtractor={this.onKeyExtractor}
          renderItem={this.onRenderItem.bind(this)}
        />
        <Button title={scanTitle} onPress={this.onScanPress.bind(this)} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: '#F5FCFF',
    margin: 8,
  },

  statusText: {
    marginTop: 60,
    textAlign: 'center'
  },

  list: {
    borderWidth: 1,
    borderColor: '#0f0f0f',
  },

  accessoryItem: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'stretch',
    borderBottomWidth: 1,
    borderBottomColor: '#00A000',
  },

  accessoryItemBody: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    margin: 2
  },

  itemHeader: {
    margin: 4,
    fontSize: 20,
    fontWeight: 'bold'
  },

  itemText: {
    fontSize: 10,
    marginRight: 2,
    marginLeft: 2
  },
});
