import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';

const SplashScreen = () => {
  const navigation = useNavigation();

  const authenticated = async (): Promise<boolean> => {
    const token = await AsyncStorage.getItem('token');
    return !!token;
  };

  useEffect(() => {
    const checkAuth = async () => {
      if (await authenticated()) {
        navigation.navigate('Home');
      } else {
        navigation.navigate('Login');
      }
    };
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center' }}>
      <ActivityIndicator />
    </View>
  );
};
export default SplashScreen;
