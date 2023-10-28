import React, {useState} from 'react';
import {
  View,
  Button,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
} from 'react-native';
import SendIntentAndroid from 'react-native-send-intent';
import CallLogs from 'react-native-call-log';
import {request, PERMISSIONS, RESULTS} from 'react-native-permissions';

const MakePhone = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [callHistory, setCallHistory] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const makePhoneCall = async () => {
    const permissionStatus = await request(PERMISSIONS.ANDROID.CALL_PHONE);

    if (permissionStatus === RESULTS.GRANTED) {
      SendIntentAndroid.sendPhoneCall(phoneNumber);
    } else {
      console.error('Permission denied for making phone calls');
    }
  };

  const fetchCallHistory = async () => {
    const permissionStatus = await request(PERMISSIONS.ANDROID.READ_CALL_LOG);

    if (permissionStatus === RESULTS.GRANTED) {
      CallLogs.load(5) // Load the last 5 call logs
        .then(callLogs => {
          setCallHistory(callLogs);
          setIsModalVisible(true);
        })
        .catch(error => {
          console.error('Error loading call history:', error);
        });
    } else {
      console.error('Permission denied for reading call logs');
    }
  };

  const handleButtonPress = number => {
    // Only allow numbers, '*', and '#'
    if (/^[0-9*#]+$/.test(number)) {
      setPhoneNumber(phoneNumber + number);
    }
  };

  const handleClear = () => {
    setPhoneNumber('');
  };

  const renderDialpadButton = number => (
    <TouchableOpacity
      style={styles.dialpadButton}
      onPress={() => handleButtonPress(number)}>
      <Text style={styles.dialpadButtonText}>{number}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.phoneNumberInput}
        placeholder="Enter Phone Number"
        value={phoneNumber}
        onChangeText={text => setPhoneNumber(text)}
        editable={false} // Disable input from the keyboard
      />
      <View style={styles.dialpad}>
        <View style={styles.dialpadRow}>
          {renderDialpadButton('1')}
          {renderDialpadButton('2')}
          {renderDialpadButton('3')}
        </View>
        <View style={styles.dialpadRow}>
          {renderDialpadButton('4')}
          {renderDialpadButton('5')}
          {renderDialpadButton('6')}
        </View>
        <View style={styles.dialpadRow}>
          {renderDialpadButton('7')}
          {renderDialpadButton('8')}
          {renderDialpadButton('9')}
        </View>
        <View style={styles.dialpadRow}>
          {renderDialpadButton('*')}
          {renderDialpadButton('0')}
          {renderDialpadButton('#')}
        </View>
      </View>
      <View style={styles.viewBTn}>
        <Button
          style={styles.actionButton}
          title="Clear"
          onPress={handleClear}
        />
        <Button
          style={styles.actionButton}
          title="Make Phone Call"
          onPress={makePhoneCall}
        />
        <Button
          style={styles.actionButton}
          title="Check Call History"
          onPress={fetchCallHistory}
        />
      </View>

      <Modal visible={isModalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <ScrollView style={styles.modalContent}>
            {callHistory.map((call, index) => (
              <Text key={index} style={styles.callLogItem}>
                {`Number: ${call.name}, Type: ${call.phoneNumber}, Date: ${call.duration}`}
              </Text>
            ))}
          </ScrollView>
          <Button title="Close" onPress={() => setIsModalVisible(false)} />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  viewBTn: {marginVertical: 20, paddingVertical: 23},
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  phoneNumberInput: {
    borderWidth: 1,
    borderColor: 'gray',
    marginBottom: 20,
    padding: 10,
    width: '80%',
    color: 'black',
    fontSize: 16,
  },
  dialpad: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialpadRow: {
    flexDirection: 'row',
  },
  dialpadButton: {
    width: 60,
    height: 60,
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 30,
    backgroundColor: 'lightblue', // Add a background color
  },
  dialpadButtonText: {
    color: 'black',
    fontSize: 20,
  },
  actionButton: {
    width: '90%',
    marginVertical: 22,
    backgroundColor: 'blue', // Add a background color
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    maxHeight: '80%',
  },
  callLogItem: {
    fontSize: 16,
    color: 'black',
    marginBottom: 10,
  },
});

export default MakePhone;
