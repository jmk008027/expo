import { View, Text, StyleSheet, TouchableOpacity, ScrollView, AppState } from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';

export default function HomeScreen({ navigation }) {
  const [equipmentStatus, setEquipmentStatus] = useState({
    yaqiStation: { online: true, alarm: false },
    xidiStation: { online: false, alarm: true },
    yinzhuangStation: { online: true, alarm: false },
    fiveThousandTonStation: { online: false, alarm: true },
  });

  const [appState, setAppState] = useState(AppState.currentState);

  const connectWebSocket = () => {
    const ws = new WebSocket('ws://112.31.63.232:1880/online');

    ws.onopen = () => {
      console.log('WebSocket连接成功');
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const { stationName, online, alarm } = data;

        setEquipmentStatus(prevStatus => ({
          ...prevStatus,
          [stationName]: {
            online: online,
            alarm: alarm,
          },
        }));
      } catch (error) {
        console.error('解析WebSocket消息时出错:', error);
      }
    };

    ws.onclose = () => {
      console.log('WebSocket连接关闭');
    };

    ws.onerror = (error) => {
      console.error('WebSocket错误: ', error);
    };

    return ws;
  };

  useFocusEffect(
    useCallback(() => {
      const ws = connectWebSocket();

      return () => {
        if (ws) {
          ws.close();
        }
      };
    }, [])
  );

  useEffect(() => {
    const handleAppStateChange = (nextAppState) => {
      if (appState.match(/inactive|background/) && nextAppState === 'active') {
        console.log('应用程序从后台恢复');
        connectWebSocket(); // 应用程序从后台恢复时重新连接WebSocket
      }
      setAppState(nextAppState);
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove();
    };
  }, [appState]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>项目列表</Text>

      {/* 亚琦处理站容器 */}
      <TouchableOpacity
        style={styles.stationContainer}
        onPress={() => navigation.navigate('YaqiStation')}
      >
        <Text style={styles.stationTitle}>亚琦处理站</Text>
        <View style={styles.statusRow}>
          <View style={styles.statusBox}>
            <Text style={styles.statusLabel}>设备通讯状态</Text>
            <Text
              style={[
                styles.status,
                { color: equipmentStatus.yaqiStation.online ? '#4CAF50' : '#f44336' },
              ]}
            >
              {equipmentStatus.yaqiStation.online ? '在线' : '离线'}
            </Text>
          </View>
          <View style={styles.alarmBox}>
            <Text style={styles.statusLabel}>报警信息</Text>
            <Text
              style={[
                styles.alarm,
                { color: equipmentStatus.yaqiStation.alarm ? '#f44336' : '#4CAF50' },
              ]}
            >
              {equipmentStatus.yaqiStation.alarm ? '有报警信息' : '无报警信息'}
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* 西地亚处理站容器 */}
      <TouchableOpacity
        style={styles.stationContainer}
        onPress={() => navigation.navigate('XidiStation')}
      >
        <Text style={styles.stationTitle}>西地亚处理站</Text>
        <View style={styles.statusRow}>
          <View style={styles.statusBox}>
            <Text style={styles.statusLabel}>设备通讯状态</Text>
            <Text
              style={[
                styles.status,
                { color: equipmentStatus.xidiStation.online ? '#4CAF50' : '#f44336' },
              ]}
            >
              {equipmentStatus.xidiStation.online ? '在线' : '离线'}
            </Text>
          </View>
          <View style={styles.alarmBox}>
            <Text style={styles.statusLabel}>报警信息</Text>
            <Text
              style={[
                styles.alarm,
                { color: equipmentStatus.xidiStation.alarm ? '#f44336' : '#4CAF50' },
              ]}
            >
              {equipmentStatus.xidiStation.alarm ? '有报警信息' : '无报警信息'}
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* 殷庄处理站容器 */}
      <TouchableOpacity
        style={styles.stationContainer}
        onPress={() => navigation.navigate('YinzhuangStation')}
      >
        <Text style={styles.stationTitle}>殷庄处理站</Text>
        <View style={styles.statusRow}>
          <View style={styles.statusBox}>
            <Text style={styles.statusLabel}>设备通讯状态</Text>
            <Text
              style={[
                styles.status,
                { color: equipmentStatus.yinzhuangStation.online ? '#4CAF50' : '#f44336' },
              ]}
            >
              {equipmentStatus.yinzhuangStation.online ? '在线' : '离线'}
            </Text>
          </View>
          <View style={styles.alarmBox}>
            <Text style={styles.statusLabel}>报警信息</Text>
            <Text
              style={[
                styles.alarm,
                { color: equipmentStatus.yinzhuangStation.alarm ? '#f44336' : '#4CAF50' },
              ]}
            >
              {equipmentStatus.yinzhuangStation.alarm ? '有报警信息' : '无报警信息'}
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* 5000吨处理站容器 */}
      <TouchableOpacity
        style={styles.stationContainer}
        onPress={() => navigation.navigate('FiveThousandTonStation')}
      >
        <Text style={styles.stationTitle}>5000吨处理站</Text>
        <View style={styles.statusRow}>
          <View style={styles.statusBox}>
            <Text style={styles.statusLabel}>设备通讯状态</Text>
            <Text
              style={[
                styles.status,
                { color: equipmentStatus.fiveThousandTonStation.online ? '#4CAF50' : '#f44336' },
              ]}
            >
              {equipmentStatus.fiveThousandTonStation.online ? '在线' : '离线'}
            </Text>
          </View>
          <View style={styles.alarmBox}>
            <Text style={styles.statusLabel}>报警信息</Text>
            <Text
              style={[
                styles.alarm,
                { color: equipmentStatus.fiveThousandTonStation.alarm ? '#f44336' : '#4CAF50' },
              ]}
            >
              {equipmentStatus.fiveThousandTonStation.alarm ? '有报警信息' : '无报警信息'}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  stationContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  stationTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  statusBox: {
    flex: 1,
    marginRight: 10,
  },
  alarmBox: {
    flex: 1,
    marginLeft: 10,
  },
  statusLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
    marginBottom: 5,
  },
  status: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  alarm: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

