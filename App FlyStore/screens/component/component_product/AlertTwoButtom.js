import React, {useState, memo} from 'react';
import {
  Alert,
  SafeAreaView,
  StatusBar,
  ScrollView,
  FlatList,
  Text,
  View,
  TextInput,
  Image,
  TouchableOpacity,
  Dimensions,
  Modal,
} from 'react-native';
import json_language from '../../json/language.json';
function AlertTwoButtom({
  open_alert,
  set_open_alert,
  status,
  message,
  color,
  func,
  type,
  button_message_close,
  button_message_func,
  language,
  open_statusBar,
}) {
  return (
    <Modal
      animationType=""
      transparent={true}
      visible={open_alert}
      onRequestClose={() => {
        set_open_alert(false);
      }}>
      <StatusBar
        translucent={open_statusBar ? true : false}
        backgroundColor={
          open_statusBar ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 1)'
        }
      />
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0,0,0,0.3)',
        }}>
        <View
          style={{
            width: '80%',
            backgroundColor: 'rgba(255,255,255,0.95)',
            borderColor: '#DDDFE1',
            borderWidth: 1,
            borderRadius: 10,
          }}>
          <View
            style={{
              borderBottomWidth: 1,
              borderColor: '#DDDFE1',
              marginBottom: 10,
            }}>
            <Text
              style={{
                padding: 10,
                textAlign: 'center',
                fontSize: 17,
                fontWeight: 600,
                color: 'black',
                paddingLeft: 20,
                paddingRight: 20,
              }}>
              {status}
            </Text>
          </View>
          <Text
            style={{
              padding: 20,
              fontSize: 15,
              paddingTop: 10,
              textAlign: 'left',
              color: 'black',
            }}>
            {message}
          </Text>
          <View
            style={{
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center',
              padding: 20,
              paddingHorizontal: 10,
              paddingTop: 10,
              flexDirection: 'row',
            }}>
            {type == 'thongbao' ? (
              <TouchableOpacity
                style={{
                  width: '90%',
                  backgroundColor: color,
                  borderWidth: 1,
                  borderColor: '#DDDFE1',
                }}
                onPress={() => set_open_alert(false)}>
                <Text
                  style={{
                    textAlign: 'center',
                    padding: 8,
                    fontSize: 18,
                    fontWeight: 400,
                    color: 'white',
                  }}>
                  {json_language['Đóng'][language]}
                </Text>
              </TouchableOpacity>
            ) : (
              <View style={{width: '100%', flexDirection: 'row'}}>
                <TouchableOpacity
                  style={{
                    width: '45%',
                    backgroundColor: '#fff',
                    marginRight: 5,
                  }}
                  onPress={() => set_open_alert(false)}>
                  <Text
                    style={{
                      textAlign: 'center',
                      padding: 8,
                      fontSize: 18,
                      fontWeight: 400,
                      color: 'black',
                    }}>
                    {button_message_close}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    width: '45%',
                    backgroundColor: '#1589FF',
                    borderWidth: 1,
                    borderColor: '#DDDFE1',
                  }}
                  onPress={() => {
                    setTimeout(() => {
                      func();
                    }, 0);
                    set_open_alert(false);
                  }}>
                  <Text
                    style={{
                      textAlign: 'center',
                      padding: 8,
                      fontSize: 18,
                      fontWeight: 400,
                      color: 'white',
                    }}>
                    {button_message_func}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default memo(AlertTwoButtom);
