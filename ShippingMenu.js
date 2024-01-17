// ShippingMenu.js
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import * as SecureStore from 'expo-secure-store';


const ShippingMenu = ( token ) => {
  const [shippingItems, setShippingItems] = useState('');

  const handleShippingPost = async () => {
    const token = await SecureStore.getItemAsync('apiKey');
    try {
      const response = await fetch('https://app.kamiidea.com/api/rfid/shipping', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ items: shippingItems }),
      });

      if (response.ok) {
        console.log('Shipping posted successfully');
        // Handle success response as needed
      } else {
        console.error('Failed to post shipping');
        // Handle failure response
      }
    } catch (error) {
      console.error('Error posting shipping:', error);
      // Handle error case
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter items"
        value={shippingItems}
        onChangeText={text => setShippingItems(text)}
      />
      <Button title="Submit" onPress={handleShippingPost} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    width: '80%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
});

export default ShippingMenu;
