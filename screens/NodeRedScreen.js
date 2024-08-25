import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { WebView } from 'react-native-webview';

export default function NodeRedScreen() {
  const webViewRef = useRef(null);
  const [webViewUri, setWebViewUri] = useState('http://112.31.63.232:1880/dashboard/page2');
  const [receivedMessage, setReceivedMessage] = useState('');

  useEffect(() => {
    const ws = new WebSocket('ws://112.31.63.232:1880/expo');

    ws.onmessage = (event) => {
      // 直接使用 event.data 更新 webViewUri
      setWebViewUri(event.data);
      setReceivedMessage(event.data);
    };

    return () => {
      ws.close();
    };
  }, []);

  const handleMessage = (event) => {
    console.log('Received message from WebView:', event.nativeEvent.data);
    setReceivedMessage(event.nativeEvent.data);
  };

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        source={{ uri: webViewUri }}
        javaScriptEnabled={true}
        mixedContentMode="always"
        originWhitelist={['*']}
        onMessage={handleMessage}
        style={styles.webview}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  webview: {
    flex: 1,
  },

});





