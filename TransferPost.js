import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Text } from 'react-native';
import * as SecureStore from 'expo-secure-store';


const TransferPost = ( token ) => {
  const [items, setItems] = useState('');

  const handleTransfer = async () => {
    try {
      const token = await SecureStore.getItemAsync('apiKey');
      const url = 'https://app.kamiidea.com/api/rfid/transfers/1'; // Update with the correct transfer ID
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      };

      const requestBody = {
        items: items,
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log('Transfer initiated successfully:', responseData);
        // Handle success, update UI, etc.
      } else {
        console.error('Failed to initiate transfer:', response.statusText);
        // Handle failure, display error message, etc.
      }
    } catch (error) {
      console.error('Error initiating transfer:', error);
      // Handle error, display error message, etc.
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={items}
        onChangeText={(text) => setItems(text)}
        placeholder="Items"
      />
      <TouchableOpacity onPress={handleTransfer} style={styles.submitButton}>
        <Text style={styles.submitButtonText}>Initiate Transfer</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    height: 40,
    width: '100%',
  },
  submitButton: {
    backgroundColor: '#100c08',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    width: '50%',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default TransferPost;
