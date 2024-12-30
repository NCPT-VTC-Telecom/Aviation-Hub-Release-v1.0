import React, {memo, useState, useEffect} from 'react';
import {
  SafeAreaView,
  StatusBar,
  FlatList,
  Text,
  View,
  Image,
  TouchableOpacity,
  Alert,
  Modal,
  ScrollView,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import styles from '../../styles';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Clipboard from '@react-native-clipboard/clipboard';
import json_language from '../../json/language.json';
import StepIndicator from 'react-native-step-indicator';
import {stepIndicatorStyles} from '../common';
// AntDesign.loadFont();
import {setDataLocal, show_message} from '../../menu_function';
const img = '../../img/';
function ShowDataPackage({
  language,
  openShowDataPackage,
  setOpenShowDataPackage,
  data_a_sim,
  set_open_register_uninternet,
  set_open_fill_info_cccd,
  set_sold,
}) {
  const [showNotification, setShowNotification] = useState(false);
  const handleCopy = t => {
    // console.log(t)
    Clipboard.setString(t);
    setShowNotification(true);

    setTimeout(() => {
      setShowNotification(false);
    }, 1000);
  };
  return (
    <Modal
      // animationType="fade"
      transparent={false}
      visible={openShowDataPackage}
      onRequestClose={() => {
        setOpenShowDataPackage(false);
      }}>
      <StatusBar backgroundColor="rgba(0, 0, 0, 1)" />
      <SafeAreaView style={{backgroundColor: 'white'}}>
        {showNotification && (
          <View
            style={{
              position: 'absolute',
              alignItems: 'center',
              justifyContent: 'center',
              height: screenHeight,
              width: screenWidth,
            }}>
            <View style={{}}>
              <Text
                style={{
                  color: 'white',
                  padding: 15,
                  backgroundColor: 'rgba(0,0,0,0.8)',
                  borderRadius: 10,
                  fontWeight: 400,
                }}>
                Đã sao chép
              </Text>
            </View>
          </View>
        )}
        <View
          style={[
            {
              borderBottomColor: '#6D7B8D',
              borderBottomWidth: 1,
              flexDirection: 'row',
            },
            styles.center,
          ]}>
          <View style={{width: '85%'}}>
            <Text
              style={{
                fontWeight: 500,
                borderRadius: 5,
                padding: 15,
                color: '#151B8D',
                fontSize: 18,
                paddingLeft: 15,
              }}>
              {json_language['Esim bán trong chuyến bay'][language]}
            </Text>
          </View>
          <TouchableOpacity
            style={{width: '10%'}}
            onPress={() => {
              setTimeout(() => {
                set_open_fill_info_cccd(false);
                set_sold(false);
              }, 100);
              setTimeout(() => {
                set_open_register_uninternet(false);
              }, 200);
              setOpenShowDataPackage(false);
            }}>
            <AntDesign name="close" size={22} color="red" />
          </TouchableOpacity>
        </View>
        <View style={styles.stepIndicatorContainer}>
          <StepIndicator
            customStyles={stepIndicatorStyles}
            stepCount={3}
            direction="horizontal"
            currentPosition={2}
            onPress={index => {
              if (index == 1) {
                setTimeout(() => {
                  set_open_fill_info_cccd(true);
                }, 100);
                setOpenShowDataPackage(false);
              }
              // Xử lý logic khi nhấp vào từng bước
            }}
            // labels={dummyData.map((_, index) => '')}
          />
        </View>

        <View style={{paddingLeft: 10}}>
          <View
            style={[
              styles.Text2_row,
              {
                padding: 8,
                color: 'black',
                paddingBottom: 10,
                paddingTop: 10,
                paddingLeft: 0,
                flexDirection: 'row',
              },
            ]}>
            <TouchableOpacity onPress={() => handleCopy(data_a_sim.snCode)}>
              <Text style={{color: 'blue', flexWrap: 'wrap'}}>
                {data_a_sim.snCode}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
}
export default memo(ShowDataPackage);
