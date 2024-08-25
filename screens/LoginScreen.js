import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen({ navigation, setIsLoggedIn }) {
  console.log("LoginScreen props:", { navigation, setIsLoggedIn });

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleLogin = async () => {
    try {
      const checkResponse = await fetch('http://112.31.63.232:1880/check-username1', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      });

      const checkResult = await checkResponse.json();

      if (!checkResult.exists) {
        Alert.alert('登录失败', '用户名不存在');
        return;
      }

      const loginResponse = await fetch('http://112.31.63.232:1880/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const loginResult = await loginResponse.json();

      if (loginResult.success) {
        if (loginResult.status === 'approved') {
          Alert.alert('登录成功', '欢迎回来');
          await AsyncStorage.setItem('userToken', 'dummy-token');
          setIsLoggedIn(true); 
          setUsername('');
          setPassword('');
          navigation.navigate('Home');
        } else {
          Alert.alert('登录失败', '账户审核未通过，请联系管理员');
        }
      } else {
        Alert.alert('登录失败', loginResult.message || '用户名或密码错误');
      }
    } catch (error) {
      console.error('登录失败:', error);
      Alert.alert('登录失败', '发生错误，请重试');
    }
  };

  return (
    <View style={styles.container}>
      {/* 在这里添加Logo */}
      <Image source={require('../images/logo2.png')} style={styles.logo} />

      <Text style={styles.title}>正泽物联系统登录</Text>

      <View style={styles.inputContainer}>
        <Ionicons name="person-outline" size={24} color="#aaa" />
        <TextInput
          style={styles.input}
          placeholder="用户名"
          placeholderTextColor="#aaa"
          value={username}
          onChangeText={setUsername}
        />
      </View>

      <View style={styles.inputContainer}>
        <Ionicons name="lock-closed-outline" size={24} color="#aaa" />
        <TextInput
          style={styles.input}
          placeholder="密码"
          placeholderTextColor="#aaa"
          secureTextEntry={!passwordVisible}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
          <Ionicons name={passwordVisible ? "eye-off-outline" : "eye-outline"} size={24} color="#aaa" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>登录</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.link} onPress={() => navigation.navigate('Register')}>
        <Text style={styles.linkText}>还没有账号？注册</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#25292e',
    padding: 16,
  },
  logo: {
    width: 150, // 设置Logo的宽度
    height: 150, // 设置Logo的高度
    marginBottom: 20, // 设置Logo与标题之间的间距
  },
  title: {
    fontSize: 28,
    color: '#fff',
    marginBottom: 24,
    fontWeight: 'bold',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3b3f47',
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    width: '100%',
    height: 50,
  },
  input: {
    flex: 1,
    color: '#fff',
    marginLeft: 10,
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#1f8ef1',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  link: {
    marginTop: 12,
  },
  linkText: {
    color: '#1f8ef1',
    fontSize: 16,
  },
});
