import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import StoreMenu from './StoreMenu';
import ProcurementMenu from './ProcurementMenu';
import TransferMenu from './TransferMenu';
import ShippingMenu from './ShippingMenu';
import PosMenu from './PosMenu';
import * as SecureStore from 'expo-secure-store';

const LandingPage = ({ route, navigation }) => {
  const [showSidebar, setShowSidebar] = useState(false);
  const { userData } = route.params;
  const { token } = userData;

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  console.log(token);

  useEffect(() => {
    navigation.setOptions({
      title: 'Kami WMS',
      headerLeft: () => (
        <TouchableOpacity onPress={toggleSidebar} style={styles.hamburgerIcon}>
          <Ionicons name={showSidebar ? 'md-close' : 'md-menu'} size={32} color="black" />
        </TouchableOpacity>
      ),
      // ... (rest of your options)
    });
  }, [navigation, showSidebar]);

  const sidebarStyles = [styles.sidebar, showSidebar ? styles.sidebarExpanded : styles.sidebarCollapsed];

  const menuItems = [
    { name: 'Stores', icon: 'pin' },
    { name: 'Procurements', icon: 'basket' },
    { name: 'Transfers', icon: 'swap-horizontal' },
    { name: 'Shipping', icon: 'boat' },
    { name: 'Pos', icon: 'cash' },
  ];

  const storeApiKey = async () => {
    try {
      await SecureStore.setItemAsync('apiKey', token);
      console.log('API Key stored successfully');
    } catch (error) {
      console.log('Error storing API Key: ', error);
    }
  };

  const [selectedMenu, setSelectedMenu] = useState(null);

  const handleMenuClick = (menuName) => {
    setSelectedMenu(menuName);
  };

  const renderMenuContent = (selectedMenu) => {
    switch (selectedMenu) {
      case 'Stores':
        return <StoreMenu />;
      case 'Procurements':
        return <ProcurementMenu token={token} />;
      case 'Transfers':
        return <TransferMenu token={token} />;
      case 'Shipping':
        return <ShippingMenu token={token} />;
      case 'Pos':
        return <PosMenu token={token} />;
      default:
        return null;
    }
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
      <View style={sidebarStyles}>
        <ScrollView contentContainerStyle={styles.menu}>
          {menuItems.map((menuItem, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleMenuClick(menuItem.name)}
              style={styles.menuItem}
            >
              <Ionicons name={menuItem.icon} size={24} color="black" style={styles.menuIcon} />
              <Text>{menuItem.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <TouchableOpacity onPress={handleLogout} style={styles.logout}>
          <Text style={styles.menuItem}>Logout</Text>
        </TouchableOpacity>
      </View>
      <View>
        {/* Main Content */}
        {renderMenuContent(selectedMenu)}
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
    flexDirection: 'row',
    alignItems: 'center',
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
    padding: 10,
  },
  sidebarCollapsed: {
    width: 0,
    paddingTop: 0,
  },
  sidebarExpanded: {
    width: 200,
    paddingTop: 50,
  },
  hamburgerIcon: {
    padding: 10,
  },
  menuIcon: {
    marginRight: 10,
  },
});

export default LandingPage;
