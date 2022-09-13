import { gql, useMutation } from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';

const RegisterScreen = () => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const navigation = useNavigation();

  const REGISTER_MUTATION = gql`
    mutation register($name: String!, $email: String!, $password: String!) {
      register(input: { email: $email, password: $password, name: $name }) {
        token
        user {
          id
          name
          email
        }
      }
    }
  `;

  const [register, { data, error, loading }] = useMutation(REGISTER_MUTATION);

  const onSubmit = () => {
    register({ variables: { name, email, password } });
  };

  if (error) {
    Alert.alert(error.message, 'please try again');
  }

  if (data) {
    AsyncStorage.setItem('token', data.register.token).then(() => {
      navigation.navigate('Home');
    });
  }

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        placeholder="bob"
        value={name}
        onChangeText={setName}
        style={{
          color: '#000',
          fontSize: 18,
          width: '100%',
          marginVertical: 25,
        }}
      />

      <TextInput
        placeholder="tim@apple.com"
        value={email}
        onChangeText={setEmail}
        style={{
          color: '#000',
          fontSize: 18,
          width: '100%',
          marginVertical: 25,
        }}
      />
      <TextInput
        placeholder="******"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{
          color: '#000',
          fontSize: 18,
          width: '100%',
          marginVertical: 25,
        }}
      />
      <Pressable
        onPress={onSubmit}
        style={{
          backgroundColor: '#e33062',
          height: 50,
          borderRadius: 5,
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
          marginTop: 30,
        }}
      >
        <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>
          Register
        </Text>
      </Pressable>

      {loading && <ActivityIndicator />}

      <Pressable
        disabled={loading}
        onPress={() => navigation.navigate('Login')}
        style={{
          height: 50,
          borderRadius: 5,
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 30,
        }}
      >
        <Text style={{ color: '#e33062', fontSize: 15, fontWeight: 'bold' }}>
          Already have an account? Login
        </Text>
      </Pressable>
    </View>
  );
};
export default RegisterScreen;
