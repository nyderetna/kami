import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import StoreMenu from './StoreMenu';
import ProcurementMenu from './ProcurementMenu';
import TransferMenu from './TransferMenu';
import ShippingMenu from './ShippingMenu';
import PosMenu from './PosMenu';
import * as SecureStore from 'expo-secure-store';


const LandingPage = ({ route, navigation }) => {
  
  const { userData } = route.params;

  const { token } = userData;

  //console.log('token landing page: ' + token);

  const storeApiKey = async () => {
    try {
      await SecureStore.setItemAsync('apiKey', token);

      console.log('API Key stored successfully');
    } catch (error) {
      console.log('Error storing API Key: ', error);

    }
  };

  const [showStores, setShowStores] = useState(false); // State to control StoreMenu visibility
  const [showProcurements, setShowProcurements] = useState(false); // State to control Proc visibility
  const [showTransfers, setShowTransfers] = useState(false);
  const [showShipping, setShowShipping] = useState(false);
  const [showPos, setShowPos] = useState(false);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Kami WMS', // Set the title of the screen
      headerLeft: null, // Hide the back button in the header
      headerRight: () => (
        <View style={styles.headerRight}>
            <Text>Store ID: {userData.store_id}</Text>
        </View>
      ),
    });
  }, [navigation]);

  const handleProcurements = () => {
    setShowProcurements(true);
    setShowStores(false);
  };

  const handleStores = () => {
    setShowStores(true);
    setShowProcurements(false);
  };

  const handleTransfers = () => {
    setShowTransfers(true);
    setShowStores(false);
    setShowProcurements(false);
  };

  const handleShipping = () => {
    setShowShipping(true);
    setShowStores(false);
    setShowProcurements(false);
    setShowTransfers(false);
  };

  const handlePos = () => {
    setShowPos(true);
    setShowStores(false);
    setShowProcurements(false);
    setShowTransfers(false);
    setShowShipping(false);

  };

  const handleLogout = async () => {
    try {
      const response = await fetch('https://app.kamiidea.com/api/rfid/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${userData.token}`, // Assuming userData contains the token
        },
      });

      if (response.ok) {
        console.log('Logout successful');
        // Perform any actions necessary upon successful logout
        // Clear userData and navigate to Login screen
        navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
        });
        // For example, navigate back to the login screen
        navigation.navigate('Login'); 
      } else {
        console.error('Logout failed');
        // Handle logout failure
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Handle logout error
    }
  };

  return (
    <View style={styles.container}>
          {/* Sidebar */}
          <View style={styles.sidebar}>
            <ScrollView contentContainerStyle={styles.menu}>
              <TouchableOpacity onPress={handleStores}>
                <Text style={styles.menuItem}>Stores</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleProcurements}>
                <Text style={styles.menuItem}>Procurements</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleTransfers}>
            <Text style={styles.menuItem}>Transfers</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleShipping}> 
            <Text style={styles.menuItem}>Shipping</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handlePos}> 
            <Text style={styles.menuItem}>Pos</Text>
          </TouchableOpacity>
              {/* Other menu items */}
            </ScrollView>
            <TouchableOpacity onPress={handleLogout} style={styles.logout}>
              <Text style={styles.menuItem}>Logout</Text>
            </TouchableOpacity>
          </View>
          <View>
            {/* Main Content */}
            {showStores && <StoreMenu />}
            {showProcurements && <ProcurementMenu token={token} />}
            {showTransfers && <TransferMenu token={token} />}
            {showShipping && <ShippingMenu token={token} />}
            {showPos && <PosMenu token={token} />}
            {/* Other menu components */}
          </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebar: {
    width: 200,
    backgroundColor: '#f0f0f0',
    paddingTop: 50,
    borderRightWidth: 1,
    borderColor: '#ccc',
  },
  menu: {
    paddingBottom: 60,
  },
  menuItem: {
    padding: 10,
  },
  logout: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderColor: '#ccc',
  },
  mainContent: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  headerRight: {
    padding: 10
  }
});

export default LandingPage;
