import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import * as SecureStore from 'expo-secure-store';

import { Ionicons } from '@expo/vector-icons';
import TransferPost from './TransferPost';

const TransferMenu = ( token ) => {
  const [transfers, setTransfers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchTransfers = async () => {
      const token = await SecureStore.getItemAsync('apiKey');
      try {
        const response = await fetch('https://app.kamiidea.com/api/rfid/transfers', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        });
        const data = await response.json();
        setTransfers(data.data);
        //console.log(data);
      } catch (error) {
        console.error('Error fetching transfers:', error);
      }
    };

    fetchTransfers();
  }, []);

  const [showTransferPost, setShowTransferPost] = useState(false); // State to control TransferPost visibility

  const handleTransferPost = () => {
    setShowTransferPost(true); // Show TransferPost component
  };

  const handleBackToMenu = () => {
    setShowTransferPost(false); // Hide TransferPost component
  };

  const filteredTransfers = transfers.filter(transfer =>
    transfer.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderTransferItem = ({ item }) => (
    <View style={styles.transferItem}>
      <Text>{item.name}</Text>
      <Text>{item.description}</Text>
      <Text>Status: {item.status}</Text>
    </View>
  );

  const renderTransferMenu = () => {
    // Render TransferMenu content
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Transfers</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleTransferPost}>
          <Ionicons name="add-circle-outline" size={20} color="black" />
          <Text style={styles.buttonText}>Add</Text>
        </TouchableOpacity>
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          value={searchQuery}
          onChangeText={text => setSearchQuery(text)}
        />
        <FlatList
          data={filteredTransfers}
          renderItem={renderTransferItem}
          keyExtractor={item => item.id.toString()}
        />
      </View>
    );
  };

  return showTransferPost ? (
    // If showTransferPost is true, render TransferPost
    <TransferPost handleBackToMenu={handleBackToMenu} />
  ) : (
    // If showTransferPost is false, render TransferMenu
    renderTransferMenu()
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  searchInput: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  transferItem: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    marginLeft: 5,
  },
});

export default TransferMenu;
