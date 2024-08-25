import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import YaqiStationScreen from '../screens/YaqiStationScreen';
import WebSocketTestScreen from '../screens/WebSocketTestScreen';
import DataReportingScreen from '../screens/DataReportingScreen';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function AuthStack({ setIsLoggedIn }) {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="用户登录">
        {(props) => <LoginScreen {...props} setIsLoggedIn={setIsLoggedIn} />}
      </Stack.Screen>
      <Stack.Screen name="Register" component={RegisterScreen} options={{ title: '用户注册' }} />
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: '正泽物联平台' }} />
    </Stack.Navigator>
  );
}

function MainDrawer() {
  return (
    <Drawer.Navigator initialRouteName="Home" screenOptions={{
      drawerStyle: {
        width: 180,
      },
    }}
    >
      <Drawer.Screen name="Home" component={HomeScreen} options={{ title: '正泽物联' }} />
      <Drawer.Screen name="YaqiStation" component={YaqiStationScreen} options={{ title: '亚琦处理站' }} />
      <Drawer.Screen name="WebSocket" component={WebSocketTestScreen} options={{ title: 'WebSocket' }} />
      <Drawer.Screen name="DataReporting" component={DataReportingScreen} options={{ title: '化验数据填报' }} />
    </Drawer.Navigator>
  );
}

export default function AppNavigator() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const userToken = await AsyncStorage.getItem('userToken');
        const loginTimestamp = await AsyncStorage.getItem('loginTimestamp');

        if (userToken && loginTimestamp) {
          const currentTime = new Date().getTime();
          const timeElapsed = currentTime - parseInt(loginTimestamp);

          if (timeElapsed < 86400000) {
            setIsLoggedIn(true);
          } else {
            await AsyncStorage.removeItem('userToken');
            await AsyncStorage.removeItem('loginTimestamp');
          }
        }
      } catch (error) {
        console.error('Failed to check login status:', error);
      }
    };

    checkLoginStatus();
  }, []);

  return (
    <NavigationContainer>
      {isLoggedIn ? <MainDrawer /> : <AuthStack setIsLoggedIn={setIsLoggedIn} />}
    </NavigationContainer>
  );
}














