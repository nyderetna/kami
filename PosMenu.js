import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Bluetooth } from 'expo-bluetooth';

const PosMenu = () => {
  const [isBluetoothOn, setIsBluetoothOn] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [peripherals, setPeripherals] = useState([]);

  useEffect(() => {
    checkBluetoothStatus();
    return () => {
      // Clean up any Bluetooth related tasks if needed
    };
  }, []);

  const checkBluetoothStatus = async () => {
    try {
      const status = await Bluetooth.getBluetoothState();
      setIsBluetoothOn(status === 'on');
    } catch (error) {
      console.error('Error checking Bluetooth status:', error);
    }
  };

  const startScan = async () => {
    try {
      const isEnabled = await Bluetooth.requestEnable();
      if (isEnabled) {
        setScanning(true);
        Bluetooth.startScan(null, null, (error, device) => {
          if (error) {
            console.error('Error scanning:', error);
            return;
          }

          if (device) {
            setPeripherals((prevPeripherals) => [...prevPeripherals, device]);
          }
        });
      } else {
        console.warn('Bluetooth is not enabled.');
      }
    } catch (error) {
      console.error('Error starting scan:', error);
    }
  };

  // ... rest of your component code

  return (
    <View style={styles.container}>
      <Text style={styles.title}>POS Menu</Text>
      <TouchableOpacity
        style={[styles.button, !isBluetoothOn && styles.disabled]}
        onPress={startScan}
        disabled={!isBluetoothOn}>
        <Text style={styles.buttonText}>{scanning ? 'Scanning...' : 'Scan for Devices'}</Text>
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
