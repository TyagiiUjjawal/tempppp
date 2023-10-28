import React, {useState} from 'react';
import {View, Text, TextInput, Button} from 'react-native';
import axios from 'axios';
const SignUp = ({navigation}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async () => {
    try {
      await axios.post('http://192.168.1.107:4000/signup', {
        username,
        password,
      });

      navigation.navigate('SignIn');
    } catch (error) {
      console.log('eror', error);
    }
  };

  return (
    <View>
      <Text>Sign Up</Text>
      <TextInput placeholder="Username" onChangeText={setUsername} />
      <TextInput
        placeholder="Password"
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Sign Up" onPress={handleSignUp} />
    </View>
  );
};

export default SignUp;
