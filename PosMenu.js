import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import BleManagerInstance from '../services/BleManagerInstance';

const PosMenu = (token) => {
  const [isBluetoothOn, setIsBluetoothOn] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [peripherals, setPeripherals] = useState([]);

  useEffect(() => {
    checkBluetoothStatus();
    return () => {
      BleManagerInstance.destroy(); // Use BleManagerInstance instead of new BleManager()
    };
  }, []);

  const checkBluetoothStatus = async () => {
    const state = await BleManagerInstance.state(); // Use BleManagerInstance instead of new BleManager()
    setIsBluetoothOn(state === 'PoweredOn');
  };

  const startScan = async () => {
    if (!isBluetoothOn || scanning) return;

    setScanning(true);
    BleManagerInstance.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.error('Error scanning:', error);
        return;
      }

      if (device) {
        setPeripherals((peripherals) => [...peripherals, device]);
      }
    });
  };

  const connectToDevice = async (deviceId) => {
    if (!isBluetoothOn) return;

    BleManagerInstance.stopDeviceScan(); // Use BleManagerInstance instead of new BleManager()
    setScanning(false);

    try {
      const device = await BleManagerInstance.connectToDevice(deviceId); // Use BleManagerInstance instead of new BleManager()
      // Handle device connection
    } catch (error) {
      console.error('Error connecting to device:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>POS Menu</Text>
      <TouchableOpacity
        style={[styles.button, !isBluetoothOn && styles.disabled]}
        onPress={startScan}
        disabled={!isBluetoothOn}>
        <Text style={styles.buttonText}>
          {scanning ? 'Scanning...' : 'Scan for Devices'}
        </Text>
      </TouchableOpacity>
      <View style={styles.deviceList}>
        {peripherals.map((device) => (
          <TouchableOpacity
            key={device.id}
            style={styles.deviceItem}
            onPress={() => connectToDevice(device.id)}>
            <Text>{device.name || 'Unnamed Device'}</Text>
            <Text>{device.id}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    padding: 10,
    backgroundColor: '#3498db',
    borderRadius: 5,
    marginBottom: 20,
  },
  disabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  deviceList: {
    width: '100%',
  },
  deviceItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
});

export default PosMenu;
