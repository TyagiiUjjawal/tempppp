import React, {useState} from 'react';
import {View, Text, TextInput, Button} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const SignIn = ({navigation}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = async () => {
    try {
      const response = await axios.post('http://192.168.1.107:4000/signin', {
        username,
        password,
      });

      const {token} = response.data;
      console.log('token received', token);
      // Save the token in local storage
      await AsyncStorage.setItem('userToken', token);
      const storedToken = await AsyncStorage.getItem('userToken');
      console.log('token in local', storedToken);
      // Navigate to the protected screen or home screen
      navigation.navigate('Protected');
    } catch (error) {
      // Handle sign-in error
    }
  };

  return (
    <View>
      <Text>Sign In</Text>
      <TextInput placeholder="Username" onChangeText={setUsername} />
      <TextInput
        placeholder="Password"
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Sign In" onPress={handleSignIn} />
    </View>
  );
};

export default SignIn;
