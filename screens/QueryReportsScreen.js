import React, { useState } from 'react';
import {
  View,
  TextInput,
  Button,
  FlatList,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Platform
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import RNFS from 'react-native-fs';

const QueryPage = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [data, setData] = useState([]);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [reportType, setReportType] = useState('');
  const [codRange, setCodRange] = useState({ min: '', max: '' });

  const handleStartDateChange = (event, selectedDate) => {
    setShowStartPicker(Platform.OS === 'ios');
    if (selectedDate) setStartDate(selectedDate);
  };

  const handleEndDateChange = (event, selectedDate) => {
    setShowEndPicker(Platform.OS === 'ios');
    if (selectedDate) setEndDate(selectedDate);
  };

  const queryData = () => {
    setLoading(true);
    fetch('http://112.31.63.232:1880/query-reports', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        reportType,
        codRange,
        page
      }),
    })
    .then(response => response.json())
    .then(result => {
      setData(result);
      setLoading(false);
    })
    .catch(error => {
      console.error('Error:', error);
      setLoading(false);
    });
  };

  const exportToCSV = () => {
    const csvContent = data.map(item =>
      `${item.cod},${item.ammonia},${item.phosphorus},${item.nitrogen},${item.solids},${item.ph},${item.temperature},${item.reporter}`
    ).join('\n');
    const path = `${RNFS.DocumentDirectoryPath}/report.csv`;
    RNFS.writeFile(path, csvContent, 'utf8')
      .then(() => {
        Alert.alert('导出成功', `文件保存至 ${path}`);
      })
      .catch(error => {
        console.error('Error writing file:', error);
      });
  };

  const viewDetails = (item) => {
    Alert.alert('详细信息', `COD: ${item.cod}\nAmmonia: ${item.ammonia}\nPhosphorus: ${item.phosphorus}\n...`); // 显示详细信息
  };

  const loadMoreData = () => {
    if (loading) return;
    setLoading(true);
    fetch(`http://112.31.63.232:1880/query-reports?page=${page + 1}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ startDate, endDate, reportType, codRange }),
    })
    .then(response => response.json())
    .then(result => {
      setData(prevData => [...prevData, ...result]);
      setPage(prevPage => prevPage + 1);
      setLoading(false);
    })
    .catch(error => {
      console.error('Error:', error);
      setLoading(false);
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setShowStartPicker(true)} style={styles.datePicker}>
        <Text style={styles.dateText}>开始日期: {startDate.toDateString()}</Text>
      </TouchableOpacity>
      {showStartPicker && (
        <DateTimePicker
          value={startDate}
          mode="date"
          display="default"
          onChange={handleStartDateChange}
        />
      )}

      <TouchableOpacity onPress={() => setShowEndPicker(true)} style={styles.datePicker}>
        <Text style={styles.dateText}>结束日期: {endDate.toDateString()}</Text>
      </TouchableOpacity>
      {showEndPicker && (
        <DateTimePicker
          value={endDate}
          mode="date"
          display="default"
          onChange={handleEndDateChange}
        />
      )}

      <TextInput
        placeholder="报告类型"
        value={reportType}
        onChangeText={setReportType}
        style={styles.input}
      />

      <View style={styles.rangeContainer}>
        <TextInput
          placeholder="COD 最小值"
          value={codRange.min}
          onChangeText={min => setCodRange(prev => ({ ...prev, min }))}
          style={styles.input}
        />
        <TextInput
          placeholder="COD 最大值"
          value={codRange.max}
          onChangeText={max => setCodRange(prev => ({ ...prev, max }))}
          style={styles.input}
        />
      </View>

      <Button title="查询" onPress={queryData} />

      <Button title="导出 CSV" onPress={exportToCSV} color="#1f8ef1" />

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => viewDetails(item)} style={styles.item}>
              <Text style={styles.itemText}>COD: {item.cod}</Text>
              <Text style={styles.itemText}>Ammonia: {item.ammonia}</Text>
              {/* 显示其他数据 */}
            </TouchableOpacity>
          )}
          ListFooterComponent={
            <Button title="加载更多" onPress={loadMoreData} />
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  datePicker: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    marginBottom: 10,
  },
  dateText: {
    fontSize: 16,
    color: '#333',
  },
  input: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  rangeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  item: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  itemText: {
    fontSize: 16,
    color: '#333',
  },
});

export default QueryPage;





