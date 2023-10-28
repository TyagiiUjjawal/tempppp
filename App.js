import React, {useState, useEffect} from 'react';
import {View, Text, TextInput, Button} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Table, Row, Cell} from 'react-native-table-component';
import XLSX from 'xlsx';
import RNFS from 'react-native-fs';

const NUM_ROWS = 10;
const NUM_COLUMNS = 5;

export default function App() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDataFromAsyncStorage();
  }, []);

  const loadDataFromAsyncStorage = async () => {
    try {
      const storedData = await AsyncStorage.getItem('googleSheetsData');
      if (storedData) {
        setData(JSON.parse(storedData));
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading data from AsyncStorage:', error);
      setIsLoading(false);
    }
  };

  const handleCellChange = (rowIndex, colIndex, value) => {
    if (!data[rowIndex]) {
      data[rowIndex] = [];
    }
    data[rowIndex][colIndex] = value;
    setData([...data]);
    saveDataToAsyncStorage(data);
  };

  const saveDataToAsyncStorage = async dataToSave => {
    try {
      await AsyncStorage.setItem(
        'googleSheetsData',
        JSON.stringify(dataToSave),
      );
    } catch (error) {
      console.error('Error saving data to AsyncStorage:', error);
    }
  };
  const handleDownload = async () => {
    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    const wbout = XLSX.write(wb, {bookType: 'xlsx', type: 'binary'});

    const filePath = RNFS.DocumentDirectoryPath + '/ExcelFile.xlsx';
    await RNFS.writeFile(filePath, wbout, 'ascii');

    try {
      const url = `file://${filePath}`;
      await RNFS.downloadFile({
        fromUrl: url,
        toFile: RNFS.ExternalStorageDirectoryPath + '/ExcelFile.xlsx',
      });
    } catch (error) {
      console.error('Error opening the file:', error);
    }
  };
  return (
    <View>
      <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
        <Row
          data={Array(NUM_COLUMNS)
            .fill(0)
            .map((_, colIndex) => `Column ${colIndex + 1}`)}
          style={styles.head}
          textStyle={styles.text}
        />
        {Array.from({length: NUM_ROWS}).map((_, rowIndex) => (
          <Row
            key={rowIndex}
            data={Array.from({length: NUM_COLUMNS}).map((_, colIndex) => (
              <TextInput
                key={colIndex}
                value={data[rowIndex] ? data[rowIndex][colIndex] : ''}
                onChangeText={text =>
                  handleCellChange(rowIndex, colIndex, text)
                }
              />
            ))}
            style={styles.row}
            textStyle={styles.text}
          />
        ))}
      </Table>
      <Button title="Download" onPress={handleDownload} />
    </View>
  );
}

const styles = {
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#ffffff',
  },
  head: {
    height: 40,
    backgroundColor: '#f1f8ff',
  },
  text: {
    margin: 6,
  },
  row: {
    flexDirection: 'row',
    backgroundColor: '#FFF1C1',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#C1C0B9',
    padding: 8,
    margin: 2,
    backgroundColor: '#FFF1C1',
  },
  button: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#007AFF',
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
};
