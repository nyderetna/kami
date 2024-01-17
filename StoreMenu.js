import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

const StoreMenu = () => {
  const [stores, setStores] = useState([]);

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    try {
      const response = await fetch('https://app.kamiidea.com/api/rfid/stores', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setStores(data);
      } else {
        console.error('Failed to fetch stores');
      }
    } catch (error) {
      console.error('Error fetching stores:', error);
    }
  };

  const renderStoreItem = ({ item }) => {
    const { store_name, store_code, address } = item;

    return (
      <View style={styles.storeItem}>
        <Text style={styles.storeName}>{store_name}</Text>
        <Text>Store Code: {store_code}</Text>
        {address && <Text>Address: {address}</Text>}
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Stores</Text>
      {stores.map((store, index) => (
        <View key={index}>
          {renderStoreItem({ item: store })}
        </View>
      ))}
    </ScrollView>
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
    marginBottom: 10,
  },
  storeItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  storeName: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
});

export default StoreMenu;
