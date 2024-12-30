import React, {memo, useState} from 'react';
import {
  StatusBar,
  Text,
  View,
  Image,
  TouchableOpacity,
  Modal,
  Pressable,
  ScrollView,
  Dimensions,
} from 'react-native';
import styles from '../../styles';
import TextLableRow from '../ShortComponent/Text/TextLableRow';
import LinearGradient from 'react-native-linear-gradient';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import {show_message} from '../../menu_function';
import AlertTwoButtom from '../component_product/AlertTwoButtom';
import moment from 'moment';

const img = '../../img/';
const region = {
  ASIA: {
    Vietnamese: 'Châu Á',
    English: 'Asia',
  },
  EU: {
    Vietnamese: 'Châu Âu',
    English: 'Europe',
  },
  US: {
    Vietnamese: 'Mỹ',
    English: 'United States',
  },
  AUS: {
    Vietnamese: 'Úc',
    English: 'Australia',
  },
  VN: {
    Vietnamese: 'Việt Nam',
    English: 'Vietnam',
  },
};

function XemTTChangBay({
  chuyenbay_tam,
  set_chuyenbay_tam,
  screenWidth,
  screenHeight,
  language,
  json_language,
  modalVisible,
  setmodalVisible,
  chuyenbay,
  setUpdatechuyenbay,
  checkSync,
}) {
  const [open_alert, set_open_alert] = useState(false);
  const [alertInfo, setAlertInfo] = useState({
    color: '#1589FF',
    message: '',
    status: '',
  });
  const checkSyncFunc = () => {
    // console.log(upgrade_tickets_vouchers)
    // console.log(wifi_vouchers)
    // setmodalVisible(false);
    // setUpdatechuyenbay(true);
    // return
    if (checkSync != true) {
      setmodalVisible(false);
      setUpdatechuyenbay(true);
      set_chuyenbay_tam({...chuyenbay});
    } else {
      setTimeout(() => {
        set_open_alert(true);
      }, 0);
      setAlertInfo({
        status: json_language['Thất bại'][language],
        message:
          json_language['Đồng bộ lại để cập nhật chuyến bay mới'][language],
        color: '#EAC117',
      });
      // show_message(json_language['Thất bại'][language], json_language['Đồng bộ lại để cập nhật chuyến bay mới'][language])
    }
  };
  // console.log('in cb')
  // console.log(chuyenbay)
  return (
    <Modal
      animationType="slide-up"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setmodalVisible(false);
      }}>
      {open_alert && (
        <AlertTwoButtom
          open_statusBar={true}
          open_alert={open_alert}
          set_open_alert={set_open_alert}
          type={'thongbao'}
          language={language}
          color={alertInfo.color}
          status={alertInfo.status}
          message={alertInfo.message}
        />
      )}
      <ScrollView>
        <View
          style={[styles.centeredView, {marginTop: '8%', marginBottom: 20}]}>
          <LinearGradient
            colors={['#ACD9F5', '#ACD9F5', '#AAD69F']}
            style={[
              styles.modalView,
              {
                width: '100%',
                height:
                  (screenHeight > screenWidth && screenWidth < 480) ||
                  screenHeight < 480
                    ? 435
                    : 562,
                marginTop:
                  screenWidth > 480 &&
                  screenHeight > 480 &&
                  screenHeight > screenWidth
                    ? '35%'
                    : screenHeight > screenWidth
                    ? 0.5 * screenWidth
                    : 0,
              },
            ]}>
            <View
              style={[
                {
                  width: '100%',
                  alignItems: 'center',
                  marginTop: screenWidth < 480 || screenHeight < 480 ? 5 : 35,
                },
              ]}>
              <TextLableRow
                text1={json_language['Số hiệu'][language]}
                text2={chuyenbay.soHieu_chuyenbay}
              />
              <TextLableRow
                text1={json_language['Chặng bay'][language]}
                text2={chuyenbay.changBay_chuyenbay}
              />
              <TextLableRow
                text1={json_language['Ngày bay'][language]}
                text2={
                  chuyenbay.ngayBay_chuyenbay
                    ? chuyenbay.ngayBay_chuyenbay.toLocaleDateString()
                    : ''
                }
              />
              <TextLableRow
                text1={json_language['Thời gian bay'][language]}
                text2={chuyenbay.gioBay_chuyenbay}
              />
              <TextLableRow
                text1={json_language['Châu lục'][language]}
                text2={
                  !chuyenbay.chauLuc_chuyenbay
                    ? ''
                    : !region[chuyenbay.chauLuc_chuyenbay]
                    ? ''
                    : !region[chuyenbay.chauLuc_chuyenbay][language]
                    ? ''
                    : region[chuyenbay.chauLuc_chuyenbay][language]
                }
              />
              <TouchableOpacity
                style={[
                  styles.button,
                  {
                    width: '93%',
                    marginTop:
                      screenWidth < 480 || screenHeight < 480 ? 10 : 30,
                    backgroundColor: '#00558F',
                    borderRadius: 5,
                    flexDirection: 'row',
                  },
                ]}
                onPress={checkSyncFunc}>
                <Text style={[styles.textStyle, {color: 'white'}]}>
                  {json_language['Cập nhật'][language]}{' '}
                </Text>
                <Feather name="edit" size={20} color="#ffffff" />
              </TouchableOpacity>
              {Platform.OS !== 'ios' ? (
                <TouchableOpacity
                  style={{
                    width: 35,
                    height: 35,
                    marginTop:
                      screenWidth < 480 || screenHeight < 480 ? 38 : 98,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#00558F',
                    borderRadius: 100,
                    borderColor: 'black',
                  }}
                  onPress={() => setmodalVisible(false)}>
                  <AntDesign name="up" size={25} color="#ffffff" />
                </TouchableOpacity>
              ) : (
                <View
                  style={{
                    height: 80,
                    width: 80,
                    backgroundColor: 'white',
                    marginTop:
                      screenWidth < 480 || screenHeight < 480
                        ? 15
                        : Platform.OS == 'ios' &&
                          screenHeight > 480 &&
                          screenWidth > 480
                        ? 78
                        : 108,
                    borderRadius: 100,
                    alignItems: 'center',
                  }}>
                  <TouchableOpacity
                    style={{
                      width: 35,
                      height: 35,
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: '#00558F',
                      borderRadius: 100,
                      borderColor: 'black',
                      marginTop: 18,
                    }}
                    onPress={() => setmodalVisible(false)}>
                    <AntDesign name="up" size={25} color="#ffffff" />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </LinearGradient>
        </View>
      </ScrollView>
    </Modal>
  );
}
export default memo(XemTTChangBay);
