import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Image, Text, Alert } from 'react-native';

// admin@kami.com
const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: '', // Set the title of the screen
    });
  }, [navigation]);

  React.useEffect(() => {
    if (successMessage) {
      Alert.alert('Success!', data.successMessage);
    }
  }, [successMessage]);
  

  const handleLogin = () => {
    fetch('https://app.kamiidea.com/api/rfid/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Login failed');
        }
      })
      .then(data => {
        setSuccessMessage(data.successMessage);
        Alert.alert('Success!', data.successMessage);
        // Redirect to another page on successful login
        navigation.navigate('LandingPage', { userData: data });
      })
      .catch(error => {
        Alert.alert('Failed!', errorData.errorMessage || 'Login failed');
        console.error('Login failed:', error);
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Image source={require('./assets/appstore.png')} style={styles.appstoreImage} />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={(text) => setEmail(text)}
          placeholder="Enter email"
        />
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={(text) => setPassword(text)}
          placeholder="Enter password"
          secureTextEntry={true}
        />
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}; 

// Your styles here...
const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#fff',
    },
    iconContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 20,
    },
    inputContainer: {
      width: '50%',
    },
    label: {
      marginBottom: 5,
    },
    input: {
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 5,
      paddingHorizontal: 10,
      marginBottom: 15,
      height: 40,
    },
    loginButton: {
      backgroundColor: '#100c08',
      padding: 10,
      borderRadius: 5,
      alignItems: 'center',
    },
    buttonText: {
      color: '#fff',
      fontWeight: 'bold',
    },
    appstoreImage: {
        width: 200, // Adjust the width as needed
        height: 100, // Adjust the height as needed
        resizeMode: 'contain', // Adjust the resizeMode as needed
        marginTop: 20, // Adjust the margin as needed
      },
  });

export default LoginScreen;
