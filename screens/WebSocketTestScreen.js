import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Text, TextInput, Button, ScrollView } from 'react-native';

const MAX_MESSAGES = 10; // 最大消息数量

export default function WebSocketTest() {
  const [messages, setMessages] = useState([]); // 用于存储多个消息的数组
  const [input, setInput] = useState('');
  const [webSocket, setWebSocket] = useState(null);
  const [wsAddress, setWsAddress] = useState('ws://112.31.63.232:1880/yaqi2');
  const [connected, setConnected] = useState(false);
  const [autoSend, setAutoSend] = useState(false); // 自动发送状态
  const [messageQueue, setMessageQueue] = useState([]); // 消息队列
  const [autoScroll, setAutoScroll] = useState(true); // 自动滚动状态
  const scrollViewRef = useRef(null); // 用于滚动到最新消息的引用
  const autoSendIntervalRef = useRef(null); // 自动发送的定时器引用

  useEffect(() => {
    if (messageQueue.length > 0) {
      const timer = setTimeout(() => {
        if (autoScroll) {
          setMessageQueue(prevQueue => prevQueue.slice(1)); // 移除已显示的消息
          if (scrollViewRef.current) {
            scrollViewRef.current.scrollToEnd({ animated: true });
          }
        }
      }, 1000); // 每秒显示一条消息

      return () => clearTimeout(timer); // 清除定时器
    }
  }, [messageQueue, autoScroll]);

  useEffect(() => {
    if (autoSend) {
      autoSendIntervalRef.current = setInterval(() => {
        if (webSocket && webSocket.readyState === WebSocket.OPEN) {
          webSocket.send(input);
          console.log('自动发送消息:', input);
        }
      }, 1000); // 每秒发送一次消息
    } else {
      clearInterval(autoSendIntervalRef.current); // 关闭定时器
    }

    return () => {
      clearInterval(autoSendIntervalRef.current); // 清除定时器
    };
  }, [autoSend, input, webSocket]);

  useEffect(() => {
    return () => {
      if (webSocket) {
        webSocket.close();
      }
    };
  }, [webSocket]);

  const connectWebSocket = () => {
    console.log('Attempting to connect to:', wsAddress);
    const ws = new WebSocket(wsAddress);

    ws.onopen = () => {
      console.log('WebSocket 连接已打开。');
      setConnected(true);
    };

    ws.onmessage = (event) => {
      console.log('收到消息:', event.data);
      const timestamp = new Date().toLocaleTimeString(); // 获取当前时间
      setMessageQueue(prevQueue => {
        const newQueue = [...prevQueue, `${timestamp} - ${event.data}`];
        if (newQueue.length > MAX_MESSAGES) {
          newQueue.shift(); // 超过最大数量时移除最旧的消息
        }
        return newQueue;
      });
    };

    ws.onerror = (error) => {
      console.error('WebSocket 错误:', error.message);
      const timestamp = new Date().toLocaleTimeString(); // 获取当前时间
      setMessageQueue(prevQueue => {
        const newQueue = [...prevQueue, `${timestamp} - 发生错误，请检查控制台。`];
        if (newQueue.length > MAX_MESSAGES) {
          newQueue.shift(); // 超过最大数量时移除最旧的消息
        }
        return newQueue;
      });
    };

    ws.onclose = () => {
      console.log('WebSocket 连接已关闭。');
      setConnected(false);
      const timestamp = new Date().toLocaleTimeString(); // 获取当前时间
      setMessageQueue(prevQueue => {
        const newQueue = [...prevQueue, `${timestamp} - WebSocket 连接已关闭。`];
        if (newQueue.length > MAX_MESSAGES) {
          newQueue.shift(); // 超过最大数量时移除最旧的消息
        }
        return newQueue;
      });
    };

    setWebSocket(ws);
  };

  const disconnectWebSocket = () => {
    if (webSocket) {
      webSocket.close();
      setWebSocket(null);
    }
  };

  const sendMessage = () => {
    if (webSocket && webSocket.readyState === WebSocket.OPEN) {
      webSocket.send(input);
      console.log('发送消息:', input);
      setInput('');
    } else {
      console.error('WebSocket 未连接。');
    }
  };

  const clearMessages = () => {
    setMessageQueue([]); // 清空消息队列
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: 0, animated: true }); // 滚动到顶部
    }
  };

  const handleScroll = () => {
    setAutoScroll(false); // 用户滚动时停止自动滚动
  };

  const handleClick = () => {
    setAutoScroll(true); // 用户点击时重新启用自动滚动
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="请输入 WebSocket 地址"
        value={wsAddress}
        onChangeText={setWsAddress}
      />
      <View style={styles.buttonContainer}>
        <Button title="连接" onPress={connectWebSocket} disabled={connected} />
        <Button title="断开" onPress={disconnectWebSocket} disabled={!connected} />
        <Button title="清除消息" onPress={clearMessages} disabled={messageQueue.length === 0} />
      </View>
      <ScrollView
        style={styles.messageContainer}
        ref={scrollViewRef} // 设置滚动视图的引用
        onScroll={handleScroll} // 用户滚动时停止自动滚动
        onTouchStart={handleClick} // 用户点击时重新启用自动滚动
      >
        {messageQueue.map((msg, index) => (
          <Text key={index} style={styles.messageText}>{msg}</Text>
        ))}
      </ScrollView>
      <TextInput
        style={styles.input}
        placeholder="请输入消息"
        value={input}
        onChangeText={setInput}
      />
      <View style={styles.buttonContainer}>
        <Button title="发送消息" onPress={sendMessage} disabled={!connected} />
        <Button
          title={autoSend ? '停止自动发送' : '自动发送'}
          onPress={() => setAutoSend(prev => !prev)}
          disabled={!connected}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    flexWrap: 'wrap', // 如果按钮过多，自动换行
    justifyContent: 'space-around',
  },
  messageContainer: {
    width: '100%',
    height: '60%',
    marginBottom: 20,
    borderColor: '#ddd',
    borderWidth: 1,
    padding: 10,
  },
  messageText: {
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 10,
    width: '100%',
    paddingHorizontal: 10,
  },
});



