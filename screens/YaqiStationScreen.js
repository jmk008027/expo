import React, { useState, useRef, useCallback, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, AppState } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

export default function YaqiStationScreen() {
  const [status, setStatus] = useState({
    flow: 0,
    totalFlow: 0,
    devices: [
      { name: '风机', running: 0, fault: 0 },
      { name: '水泵', running: 0, fault: 0 },
      { name: '搅拌器', running: 0, fault: 0 },
      { name: '阀门', running: 0, fault: 0 },
      { name: '加热器', running: 0, fault: 0 },
      { name: '冷却器', running: 0, fault: 0 },
      { name: '压缩机', running: 0, fault: 0 },
      { name: '电动机', running: 0, fault: 0 },
    ],
  });

  const wsReceive = useRef(null);
  const wsSend = useRef(null);
  const [appState, setAppState] = useState(AppState.currentState);

  const connectWebSocket = () => {
    wsReceive.current = new WebSocket('ws://112.31.63.232:1880/yaqi2');
    wsReceive.current.onopen = () => console.log('WebSocket连接成功');
    wsReceive.current.onmessage = (event) => { 
      try {
        const data = JSON.parse(event.data);
        const { flow, totalFlow, devices } = data;
        setStatus({ flow, totalFlow, devices });
      } catch (error) {
        console.error('解析WebSocket消息时出错:', error);
      }
    };

    wsReceive.current.onerror = (error) => console.error('WebSocket错误:', error.message);
    wsReceive.current.onclose = () => console.log('WebSocket连接关闭');

    wsSend.current = new WebSocket('ws://112.31.63.232:1880/cotor');
    wsSend.current.onopen = () => console.log('WebSocket发送连接成功');
    wsSend.current.onerror = (error) => console.error('WebSocket发送错误:', error.message);
    wsSend.current.onclose = () => console.log('WebSocket发送连接关闭');
  };

  useFocusEffect(
    useCallback(() => {
      connectWebSocket();
      return () => {
        if (wsReceive.current) wsReceive.current.close();
        if (wsSend.current) wsSend.current.close();
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

  const controlDevice = (deviceName) => {
    if (wsSend.current && wsSend.current.readyState === WebSocket.OPEN) {
      wsSend.current.send(JSON.stringify({ device: deviceName }));
      console.log(`发送命令: ${deviceName}`);
    } else {
      console.error('WebSocket发送未连接');
    }
  };

  const getButtonStyle = (running, fault) => {
    let backgroundColor = 'gray';
    if (running === 1) backgroundColor = 'green';
    if (fault === 1) backgroundColor = 'red';
    return { backgroundColor, ...styles.button };
  };

  return (
    <View style={styles.container}>
      {/* 工艺数据容器 */}
      <View style={styles.dataContainer}>
        <Text style={styles.containerTitle}>运行数据</Text>
        <View style={styles.dataRow}>
          <View style={styles.dataBox}>
            <Text style={styles.dataTitle}>当前流量</Text>
            <Text style={styles.dataText}>{status.flow}m³/h</Text>
          </View>
          <View style={styles.dataBox}>
            <Text style={styles.dataTitle}>累计流量</Text>
            <Text style={styles.dataText}>{status.totalFlow}m³</Text>
          </View>
        </View>
      </View>

      {/* 设备控制容器 */}
      <View style={styles.controlContainer}>
        <Text style={styles.containerTitle}>设备控制</Text>
        <View style={styles.buttonContainer}>
          {status.devices.map((device, index) => (
            <TouchableOpacity
              key={index}
              style={getButtonStyle(device.running, device.fault)}
              onPress={() => controlDevice(device.name)}
            >
              <Text style={styles.buttonText}>{device.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  containerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#333',
  },
  dataContainer: {
    backgroundColor: '#D3D3D3',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  dataBox: {
    flex: 1,
    padding: 10,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  dataTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00796b',
    textAlign: 'center',
  },
  dataText: {
    fontSize: 18,
    color: '#004d40',
    textAlign: 'center',
  },
  controlContainer: {
    backgroundColor: '#D3D3D3',
    padding: 15,
    borderRadius: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  button: {
    width: '48%',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

