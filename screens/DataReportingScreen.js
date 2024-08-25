import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
export default function DataReportingScreen({ navigation }) {
  const [inletData, setInletData] = useState({
    cod: '',
    ammonia: '',
    phosphorus: '',
    nitrogen: '',
    solids: '',
    ph: '',
    temperature: '',
    reporter: '',
  });

  const [outletData, setOutletData] = useState({
    cod: '',
    ammonia: '',
    phosphorus: '',
    nitrogen: '',
    solids: '',
    ph: '',
    temperature: '',
    reporter: '',
  });

  const handleSubmit = async (data, type) => {
    try {
      const response = await fetch('http://112.31.63.232:1880/submit-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type, data }),
      });

      const result = await response.json();

      if (result.success) {
        Alert.alert('提交成功', `${type}数据提交成功`);
        if (type === 'inlet') setInletData({
          cod: '', ammonia: '', phosphorus: '', nitrogen: '', solids: '', ph: '', temperature: '', reporter: '',
        });
        if (type === 'outlet') setOutletData({
          cod: '', ammonia: '', phosphorus: '', nitrogen: '', solids: '', ph: '', temperature: '', reporter: '',
        });
      } else {
        Alert.alert('提交失败', result.message || '数据提交失败，请重试');
      }
    } catch (error) {
      console.error(`${type}数据提交失败:`, error);
      Alert.alert('提交失败', '发生错误，请重试');
    }
  };

  const renderInputField = (label, unit, value, onChangeText) => (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={styles.inputWithUnit}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          keyboardType="numeric"
        />
        <Text style={styles.unitLabel}>{unit}</Text>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>进水数据上报</Text>
        <View style={styles.row}>
          {renderInputField('COD', 'mg/L', inletData.cod, (text) => setInletData({ ...inletData, cod: text }))}
          {renderInputField('氨氮', 'mg/L', inletData.ammonia, (text) => setInletData({ ...inletData, ammonia: text }))}
        </View>
        <View style={styles.row}>
          {renderInputField('总磷', 'mg/L', inletData.phosphorus, (text) => setInletData({ ...inletData, phosphorus: text }))}
          {renderInputField('总氮', 'mg/L', inletData.nitrogen, (text) => setInletData({ ...inletData, nitrogen: text }))}
        </View>
        <View style={styles.row}>
          {renderInputField('悬浮物', 'mg/L', inletData.solids, (text) => setInletData({ ...inletData, solids: text }))}
          {renderInputField('pH', 'PH', inletData.ph, (text) => setInletData({ ...inletData, ph: text }))}
        </View>
        <View style={styles.row}>
          {renderInputField('水温', '°C', inletData.temperature, (text) => setInletData({ ...inletData, temperature: text }))}
          {renderInputField('填报人', '姓名', inletData.reporter, (text) => setInletData({ ...inletData, reporter: text }))}
        </View>

        <TouchableOpacity style={styles.button} onPress={() => handleSubmit(inletData, 'inlet')}>
          <Text style={styles.buttonText}>提交进水数据</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>出水数据上报</Text>
        <View style={styles.row}>
          {renderInputField('COD', 'mg/L', outletData.cod, (text) => setOutletData({ ...outletData, cod: text }))}
          {renderInputField('氨氮', 'mg/L', outletData.ammonia, (text) => setOutletData({ ...outletData, ammonia: text }))}
        </View>
        <View style={styles.row}>
          {renderInputField('总磷', 'mg/L', outletData.phosphorus, (text) => setOutletData({ ...outletData, phosphorus: text }))}
          {renderInputField('总氮', 'mg/L', outletData.nitrogen, (text) => setOutletData({ ...outletData, nitrogen: text }))}
        </View>
        <View style={styles.row}>
          {renderInputField('悬浮物', 'mg/L', outletData.solids, (text) => setOutletData({ ...outletData, solids: text }))}
          {renderInputField('pH', 'PH', outletData.ph, (text) => setOutletData({ ...outletData, ph: text }))}
        </View>
        <View style={styles.row}>
          {renderInputField('水温', '°C', outletData.temperature, (text) => setOutletData({ ...outletData, temperature: text }))}
          {renderInputField('填报人', '姓名', outletData.reporter, (text) => setOutletData({ ...outletData, reporter: text }))}
        </View>

        <TouchableOpacity style={styles.button} onPress={() => handleSubmit(outletData, 'outlet')}>
          <Text style={styles.buttonText}>提交出水数据</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.queryButton}
        onPress={() => navigation.navigate('QueryReport')}
      >
        <Text style={styles.queryButtonText}>进入查询页面</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 16,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f8ef1',
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputContainer: {
    flex: 1,
    marginBottom: 12,
    marginHorizontal: 5,
  },
  inputLabel: {
    fontSize: 16,
    color: '#555',
    marginBottom: 4,
  },
  inputWithUnit: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#fafafa',
  },
  unitLabel: {
    marginLeft: 8,
    fontSize: 16,
    color: '#555',
  },
  button: {
    backgroundColor: '#1f8ef1',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  queryButton: {
    backgroundColor: '#ff5722', // 改为醒目的颜色
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: -5,
  },
  queryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});



