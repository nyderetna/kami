import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Text } from 'react-native';
import * as SecureStore from 'expo-secure-store';


const ProcurementPost = () => {
  const [items, setItems] = useState([{ item: '' }]);
  const [status, setStatus] = useState('');

  const addItem = () => {
    setItems([...items, { item: '' }]);
  };

  const handleItemChange = (text, index) => {
    const updatedItems = [...items];
    updatedItems[index].item = text;
    setItems(updatedItems);
  };
  const submitProcurement = async () => {
      const token = await SecureStore.getItemAsync('apiKey');
    const url = 'https://app.kamiidea.com/api/rfid/procurements/1';
    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
  
    const requestBody = {
      items: ['bros1','anting1'],
      status: 'fuga',
    };
  
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(requestBody),
      });
  
      if (response.ok) {
        const responseData = await response.json();
        console.log('Procurement submitted successfully:', responseData);
      } else {
        console.error('Failed to submit procurement:', response.statusText);
      }
    } catch (error) {
      console.error('Error submitting procurement:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.itemsContainer}>
        {items.map((item, index) => (
          <TextInput
            key={index}
            style={styles.input}
            value={item.item}
            onChangeText={(text) => handleItemChange(text, index)}
            placeholder={`Item ${index + 1}`}
          />
        ))}
        <TouchableOpacity onPress={addItem} style={styles.addButton}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>
      <TextInput
        style={styles.input}
        value={status}
        onChangeText={(text) => setStatus(text)}
        placeholder="Status"
      />
<TouchableOpacity onPress={submitProcurement} style={styles.submitButton}>
  <Text style={styles.submitButtonText}>Submit</Text>
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
  itemsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
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
  addButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginLeft: 10,
  },
  addButtonText: {
    fontSize: 20,
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

export default ProcurementPost;
