import { gql, useMutation } from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Alert, Pressable, Text, TextInput, View } from 'react-native';

const LoginScreen = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const navigation = useNavigation();

  const LOGIN_MUTATION = gql`
    mutation login($email: String!, $password: String!) {
      login(input: { email: $email, password: $password }) {
        token
        user {
          id
          name
          email
        }
      }
    }
  `;

  const [login, { data, error, loading }] = useMutation(LOGIN_MUTATION);

  const onSubmit = () => {
    login({ variables: { email, password } });
  };

  if (data) {
    AsyncStorage.setItem('token', data.login.token).then(() => {
      navigation.navigate('Home');
    });
  }

  useEffect(() => {
    if (error) {
      Alert.alert(error.message, 'please try again');
    }
  }, [error]);

  return (
    <View style={{ padding: 20 }}>
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
        placeholder="*******"
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
        disabled={loading}
        onPress={onSubmit}
        style={{
          backgroundColor: '#e33062',
          height: 50,
          borderRadius: 5,
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 30,
        }}
      >
        <Text
          style={{
            color: '#fff',
            fontSize: 18,
            fontWeight: 'bold',
          }}
        >
          Log In
        </Text>
      </Pressable>

      <Pressable
        onPress={() => navigation.navigate('Register')}
        style={{
          height: 50,
          borderRadius: 5,
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 30,
        }}
      >
        <Text
          style={{
            color: '#e33062',
            fontSize: 15,
            fontWeight: 'bold',
          }}
        >
          New here? Sign up
        </Text>
      </Pressable>
    </View>
  );
};
export default LoginScreen;
