import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';  // 引入图标库

export default function RegisterScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false); // 控制密码可见性

  const validateUsername = (text) => {
    const regex = /^[a-zA-Z0-9_]+$/;
    return regex.test(text);
  };

  const validatePhone = (text) => {
    const regex = /^[0-9]{10,11}$/;
    return regex.test(text);
  };

  const validateEmail = (text) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(text);
  };

  const handleRegister = async () => {
    if (!validateUsername(username)) {
      Alert.alert('无效用户名', '用户名只能包含字母、数字和下划线');
      return;
    }

    if (!validatePhone(phone)) {
      Alert.alert('无效电话', '电话号码应为10到11位数字');
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert('无效邮箱', '请输入有效的邮箱地址');
      return;
    }

    try {
      const checkResponse = await fetch('http://112.31.63.232:1880/check-username', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      });

      const checkResult = await checkResponse.json();

      if (checkResult.exists) {
        Alert.alert('注册失败', '用户名已存在，请选择其他用户名');
        return;
      }

      const userData = {
        username,
        password,
        phone,
        email
      };

      const response = await fetch('http://112.31.63.232:1880/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const result = await response.json();

      if (result.success) {
        Alert.alert('提交成功', '请等待管理员审核');
        setUsername('');
        setPassword('');
        setPhone('');
        setEmail('');
        navigation.navigate('Login');
      } else {
        Alert.alert('提交失败', result.message || '请重试');
      }
    } catch (error) {
      console.error('提交失败:', error);
      Alert.alert('提交失败', '发生错误，请重试');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>正泽物联系统注册</Text>
      
      <View style={styles.inputContainer}>
        <Icon name="person-outline" size={24} color="#aaa" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="用户名"
          placeholderTextColor="#aaa"
          value={username}
          onChangeText={setUsername}
          maxLength={15}
        />
      </View>
      
      <View style={styles.inputContainer}>
        <Icon name="lock-closed-outline" size={24} color="#aaa" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="密码"
          placeholderTextColor="#aaa"
          secureTextEntry={!passwordVisible}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity
          style={styles.iconRight}
          onPress={() => setPasswordVisible(!passwordVisible)}
        >
          <Icon name={passwordVisible ? "eye-off" : "eye"} size={24} color="#aaa" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.inputContainer}>
        <Icon name="call-outline" size={24} color="#aaa" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="电话号码"
          placeholderTextColor="#aaa"
          value={phone}
          onChangeText={(text) => {
            if (/^\d*$/.test(text)) setPhone(text);
          }}
          keyboardType="numeric"
        />
      </View>
      
      <View style={styles.inputContainer}>
        <Icon name="mail-outline" size={24} color="#aaa" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="电子邮件"
          placeholderTextColor="#aaa"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
      </View>
      
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>提交资料</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.link} onPress={() => navigation.navigate('用户登录')}>
        <Text style={styles.linkText}>返回登录系统</Text>
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
  title: {
    fontSize: 28,
    color: '#fff',
    marginBottom: 24,
    fontWeight: 'bold',
  },
  inputContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3b3f47',
    borderRadius: 8,
    marginBottom: 16,
  },
  icon: {
    paddingLeft: 16,
  },
  iconRight: {
    position: 'absolute',
    right: 16,
  },
  input: {
    flex: 1,
    height: 50,
    color: '#fff',
    paddingHorizontal: 16,
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


