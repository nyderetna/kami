import * as SecureStore from 'expo-secure-store';

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, Button,TouchableOpacity } from 'react-native';
import ProcurementPost from './ProcurementPost';
import { Ionicons } from '@expo/vector-icons';

const ProcurementMenu = ({ route,token }) => {
  const [procurements, setProcurements] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchProcurements = async () => {
      // const token = await SecureStore.getItemAsync('apiKey');
      // console.log(token);
      try {
        const response = await fetch('https://app.kamiidea.com/api/rfid/procurements', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        });
        const data = await response.json();
        console.log(data);
        if (data && data.data) {
          setProcurements(data.data); // Set procurements only if data.data exists
        } else {
          console.error('Invalid data structure:', data);
        }
      } catch (error) {
        console.error('Error fetching procurements:', error);
      }
    };

    fetchProcurements();
  }, []);

  const [showProcurementPost, setShowProcurementPost] = useState(false); // State to control ProcurementPost visibility

  const handleProcurementPost = () => {
    setShowProcurementPost(true); // Show ProcurementPost component
  };

  const handleBackToMenu = () => {
    setShowProcurementPost(false); // Hide ProcurementPost component
  };

  const filteredProcurements = procurements.filter(procurement =>
    procurement.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderProcurementItem = ({ item }) => (
    <View style={styles.procurementItem}>
      <Text>{item.name}</Text>
      <Text>{item.description}</Text>
      <Text>Quantity: {item.quantity}</Text>
    </View>
  );

  const renderProcurementMenu = () => {
    // Render ProcurementMenu content
    return (
    <View style={styles.container}>
       <Text style={styles.title}>Procurement</Text>
      <TouchableOpacity style={styles.addButton} onPress={handleProcurementPost}>
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
        data={filteredProcurements}
        renderItem={renderProcurementItem}
        keyExtractor={item => item.id.toString()}
      />
    </View>
  );
    };

  return showProcurementPost ? (
    // If showProcurementPost is true, render ProcurementPost
    <ProcurementPost handleBackToMenu={handleBackToMenu} />
  ) : (
    // If showProcurementPost is false, render ProcurementMenu
    renderProcurementMenu()
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
    width: '100%'
  },
  procurementItem: {
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
    alignItems: 'center'
  }
});

export default ProcurementMenu;
