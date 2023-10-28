import React, {useState, useEffect} from 'react';
import {View, Text, TextInput, Button} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Table, Row, Cell} from 'react-native-table-component';
import XLSX from 'xlsx';
import {PermissionsAndroid} from 'react-native';
import RNFS from 'react-native-fs';
import RNFetchBlob from 'rn-fetch-blob';
const NUM_ROWS = 10;
const NUM_COLUMNS = 5;

export default function App() {
  async function requestStoragePermission() {
    console.log('====================================');
    console.log('dsfsdf');
    console.log('====================================');
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission',
          message: 'App needs access to storage for file download.',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        // Permission granted, you can proceed with the file operation
        handleDownload();
      } else {
        handleDownload();
        // Permission denied, handle it gracefully
        console.log('====================================');
        console.log('dsfdsfsf');
        console.log('====================================');
      }
    } catch (err) {
      console.log('uyety');
      console.warn(err);
    }
  }

  const [data, setData] = useState('');
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
    try {
      const targetFilePath = RNFS.DownloadDirectoryPath + `/TextFile.txt`;
      await RNFS.writeFile(targetFilePath, data, 'utf8');
      console.log('Text file saved successfully');
    } catch (error) {
      console.error('Error saving text file:', error);
    }
  };

  return (
    <View>
      <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
        <Row
          data={['A', 'B', 'C', 'D', 'E']}
          style={styles.head}
          textStyle={{color: 'black', margin: 6}}
        />

        {Array.from({length: NUM_ROWS}).map((_, rowIndex) => (
          <Row
            key={rowIndex}
            data={Array.from({length: NUM_COLUMNS}).map((_, colIndex) => (
              <View key={colIndex}>
                <TextInput
                  style={styles.text}
                  value={data[rowIndex] ? data[rowIndex][colIndex] : ''}
                  onChangeText={text =>
                    handleCellChange(rowIndex, colIndex, text)
                  }
                />
              </View>
            ))}
            style={styles.row}
            textStyle={{color: 'black', margin: 6}}></Row>
        ))}
      </Table>
      <Button title="Download" onPress={requestStoragePermission} />
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
    color: 'black',
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
