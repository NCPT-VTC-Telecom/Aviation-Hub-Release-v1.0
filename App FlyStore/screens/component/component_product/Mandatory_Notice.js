import React, {memo, useState} from 'react';
import {
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
import styles from '../../styles';
import json_language from '../../json/language.json';
function Mandatory_Notice({
  open_mandatory_notice,
  set_open_mandatory_notice,
  language,
}) {
  // console.log('re-nh')
  const [show_quyen_loi, set_show_quyen_loi] = useState(false);
  return (
    <Modal
      animationType="slide-up"
      transparent={true}
      visible={open_mandatory_notice}
      onRequestClose={() => {
        set_open_mandatory_notice(false);
      }}>
      <StatusBar backgroundColor="rgba(0, 0, 0, 1)" />
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          flex: 1,
          backgroundColor: 'rgba(0,0,0, 0.4)',
        }}>
        <View
          style={{
            width: '80%',
            backgroundColor: '#ffffff',
            padding: 20,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 10,
          }}>
          <Text style={{color: '#000000', fontSize: 17}}>
            {json_language['Cập nhật thông tin hành trình'][language]}
          </Text>
          <Text style={{color: 'red', paddingTop: 20}}>
            {
              json_language[
                'Vui lòng cập nhật thông tin hành trình trước mỗi chuyến bay. Để tiếp tục thao tác trên app, việc cập nhật thông tin là bắt buộc.\nXin cảm ơn!'
              ][language]
            }
          </Text>
          <TouchableOpacity
            style={{
              marginTop: 20,
              width: '80%',
              backgroundColor: '#00558F',
              padding: 5,
              borderRadius: 10,
            }}
            onPress={() => set_open_mandatory_notice(false)}>
            <Text style={{color: 'white', textAlign: 'center', fontSize: 18}}>
              {json_language['Đóng'][language]}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
export default Mandatory_Notice;
