import React, {memo, useState} from 'react';
import {
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
  Pressable,
} from 'react-native';
import styles from '../../styles';
import HeaderGoBack from '../ShortComponent/HeaderGoBack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import {setDataLocal, show_message} from '../../menu_function';
import json_language from '../../json/language.json';
import {url_api} from '../../../config';
import Loading_animation from '../component_modal/Loading_animation';
const img = '../../img/';
import id, {isCameraPresent} from 'react-native-device-info';
import AlertOkFunc from '../ShortComponent/AlertOkFunc';
import AlertTwoButtom from '../component_product/AlertTwoButtom';
import {typeResponsive} from '../ShortComponent/config';
function Change_password({
  open_alert,
  open_alert_ok,
  set_open_alert,
  set_open_alert_ok,
  open_change_password,
  set_open_change_password,
  language,
  token,
  isConnected,
  checkSync,
  set_open_setting,
  setIsLogin,
}) {
  const [old_pw, set_old_pw] = useState('');
  const [new_pw, set_new_pw] = useState('');
  const [hide, setHide] = useState({
    old_pw: false,
    new_pw: false,
    confirm_new_pw: false,
  });
  const [confirm_new_pw, set_confirm_new_pw] = useState('');
  const [loading, set_loading] = useState(false);
  // const [open_alert, set_open_alert] = useState(false)
  // const [open_alert_ok, set_open_alert_ok] = useState(false)
  const [color, set_color] = useState('#1589FF');
  const [message, set_message] = useState('');
  const [status, set_status] = useState('');
  const change_pw = async () => {
    // if (old_pw.length < 8 || new_pw.length < 8 || confirm_new_pw.length < 😎 {
    //     show_message(json_language["Lỗi"][language], json_language["Mật khẩu tối thiểu 8 ký tự"][language])
    //     return
    // }
    // if (!old_pw || !new_pw || !confirm_new_pw) {
    //     show_message(json_language["Lỗi"][language], json_language["Vui lòng điền đầy đủ thông tin vào thử lại"][language])
    //     return
    // }
    // else if (new_pw != confirm_new_pw) {
    //     show_message(json_language["Lỗi"][language], json_language["Xác nhận mật khẩu không trùng khớp"][language])
    //     return
    // }
    // set_new_pw("")
    // set_confirm_new_pw("")
    // set_old_pw("")
    // set_open_change_password(false)
    // return
    if (checkSync == true) {
      setTimeout(() => {
        set_open_alert(true);
      }, 0);
      set_color('#EAC117');
      set_status(json_language['Thất bại'][language]);
      set_message(
        json_language['Vui lòng đồng bộ thông tin trước khi đổi mật khẩu'][
          language
        ],
      );
      return;
    }
    if (!isConnected) {
      setTimeout(() => {
        set_open_alert(true);
      }, 0);
      set_color('#EAC117');
      set_status(json_language['Thất bại'][language]);
      set_message(
        json_language['Không có kết nối. Vui lòng kết nối mạng và thử lại'][
          language
        ],
      );
      // show_message(json_language["Thất bại"][language], json_language["Đổi mật khẩu thấy bại"][language])
      return;
    } else {
      set_loading(true);
      try {
        const response = await fetch(url_api.api_change_password_fly_store, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
          },
          body: JSON.stringify({
            OldPassword: old_pw,
            Password: new_pw,
            RePassword: confirm_new_pw,
            DeviceId: await id.getUniqueId(),
          }),
        });
        const responseJson = await response.json();
        // console.log(responseJson)
        if (responseJson.result == 1) {
          set_open_alert_ok(true);
          set_new_pw('');
          set_confirm_new_pw('');
          set_old_pw('');
          setDataLocal(false, 'islogin');
          // show_message(json_language["Thành công"][language], json_language["Thay đổi mật khẩu thành công"][language])
          set_loading(false);
        } else {
          set_loading(false);
          setTimeout(() => {
            set_open_alert(true);
          }, 0);
          set_color('#EAC117');
          set_status(json_language['Thất bại'][language]);
          set_message(
            json_language[responseJson.message]
              ? json_language[responseJson.message][language]
              : json_language['Đổi mật khẩu thất bại'][language],
          );
          // show_message(json_language['Thất bại'][language], json_language[responseJson.message] ? json_language[responseJson.message][language] : json_language['Đổi mật khẩu thất bại'][language])
        }
      } catch (error) {
        if (error.message === 'Network request failed') {
          setTimeout(() => {
            set_open_alert(true);
          }, 0);
          set_color('#EAC117');
          set_status(json_language['Thất bại'][language]);
          set_message(json_language['Mất kết nối'][language]);
          // show_message(json_language["Thất bại"][language], json_language["Mất kết nối"][language])
          // xử lý lỗi mất kết nối internet
        } else if (error.message === 'Timeout') {
          // xử lý lỗi timeout
          setTimeout(() => {
            set_open_alert(true);
          }, 0);
          set_color('#EAC117');
          set_status(json_language['Thất bại'][language]);
          set_message('Time out');
          // show_message(json_language["Thất bại"][language], "Time out")
        } else {
          // xử lý các lỗi khác
          setTimeout(() => {
            set_open_alert(true);
          }, 0);
          set_color('#EAC117');
          set_status(json_language['Thất bại'][language]);
          set_message(error.message);
          // show_message(json_language["Thất bại"][language], error.message)
        }
        set_loading(false);
        // show_message('Error', error(error));
      }
      return 0;
    }
    //console.log(res.data.token)
  };
  const changePwSuccess = async () => {
    await set_open_change_password(false);
    setTimeout(() => {
      set_open_setting(false);
    }, 500);
    setTimeout(() => {
      setIsLogin(false);
    }, 1000);
  };
  return (
    <Modal
      animationType="slideInLeft"
      transparent={true}
      visible={open_change_password}
      onRequestClose={() => {
        set_open_change_password(false);
      }}>
      <Loading_animation
        onLoading={loading}
        onAction={json_language['Đang kiểm tra'][language]}
      />
      {open_alert && (
        <AlertTwoButtom
          open_alert={open_alert}
          set_open_alert={set_open_alert}
          type={'thongbao'}
          language={language}
          color={color}
          status={status}
          message={message}
        />
      )}
      {open_alert_ok && (
        <AlertOkFunc
          open_alert={open_alert_ok}
          set_open_alert={set_open_alert_ok}
          func={changePwSuccess}
          language={language}
          color={'#1589FF'}
          status={json_language['Thành công'][language]}
          message={json_language['Thay đổi mật khẩu thành công'][language]}
        />
      )}

      <StatusBar backgroundColor="rgba(0, 0, 0, 1)" />
      <ScrollView
        style={{flex: 1}}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="none">
        <SafeAreaView style={{height: Dimensions.get('window').height}}>
          <View
            style={{
              height: '100%',
              width: '100%',
              flex: 1,
              backgroundColor: '#ffffff',
            }}>
            <HeaderGoBack
              title={json_language['Đổi mật khẩu'][language]}
              func={() => set_open_change_password(false)}
            />
            <View style={{marginTop: 10, marginHorizontal: 20}}>
              <View
                style={[
                  styles.Textinput2_row,
                  {flexDirection: 'column', padding: 0},
                ]}>
                <Text
                  style={[
                    styles.text_lable,
                    {
                      color: '#153E7E',
                      width: '100%',
                      fontSize: 16,
                      paddingBottom: 0,
                      paddingTop: 0,
                    },
                  ]}>
                  {json_language['Mật khẩu hiện tại'][language]}:{' '}
                </Text>
                <View style={{flexDirection: 'row'}}>
                  <TextInput
                    style={{
                      fontSize: 15,
                      width: typeResponsive == 'ipad' ? '95%' : '90%',
                      flexWrap: 'wrap',
                      padding: Platform.OS == 'ios' ? 10 : 0,
                      padding: Platform.OS == 'ios' ? 10 : 0,
                      paddingLeft: Platform.OS == 'ios' ? 5 : 5,
                      color: 'black',
                    }}
                    autoCorrect={false}
                    secureTextEntry={!hide.old_pw}
                    maxLength={30}
                    autoCapitalized="words"
                    value={old_pw}
                    color={'black'}
                    placeholderTextColor="#cfcfcb"
                    placeholder={
                      json_language['Nhập mật khẩu hiện tại'][language]
                    }
                    onChangeText={text => set_old_pw(text)}
                  />
                  <Pressable
                    onPress={() => {
                      setHide({
                        old_pw: !hide.old_pw,
                        new_pw: !hide.new_pw,
                        confirm_new_pw: !hide.confirm_new_pw,
                      });
                    }}
                    style={{
                      justifyContent: 'center',
                      paddingLeft: 3,
                      width: typeResponsive == 'ipad' ? '5%' : '10%',
                    }}>
                    <Entypo
                      name="eye"
                      size={20}
                      color={!hide.old_pw ? 'black' : 'green'}
                    />
                  </Pressable>
                </View>
              </View>
            </View>
            <View style={{marginTop: 10, marginHorizontal: 20}}>
              <View
                style={[
                  styles.Textinput2_row,
                  {flexDirection: 'column', padding: 0},
                ]}>
                <Text
                  style={[
                    styles.text_lable,
                    {
                      color: '#153E7E',
                      width: '100%',
                      fontSize: 16,
                      paddingBottom: 0,
                      paddingTop: 0,
                    },
                  ]}>
                  {json_language['Mật khẩu mới'][language]}:{' '}
                </Text>
                {/* <View style={{ flexDirection: 'row' }}> */}
                <TextInput
                  style={{
                    fontSize: 15,
                    width: '100%',
                    flexWrap: 'wrap',
                    padding: Platform.OS == 'ios' ? 10 : 0,
                    paddingLeft: Platform.OS == 'ios' ? 5 : 5,
                    color: 'black',
                  }}
                  autoCorrect={false}
                  maxLength={30}
                  autoCapitalized="words"
                  secureTextEntry={!hide.new_pw}
                  value={new_pw}
                  color={'black'}
                  placeholder={json_language['Tối thiểu 8 ký tự'][language]}
                  placeholderTextColor="#cfcfcb"
                  onChangeText={text => set_new_pw(text)}
                />
                {/* <Pressable onPress={() => {
                                        setHide({ ...hide, new_pw: !hide.new_pw })
                                    }} style={{ justifyContent: 'center', paddingLeft: 3 }}>
                                        <Entypo name="eye" size={20} color={!hide.new_pw ? 'black' : 'green'} />
                                    </Pressable>
                                </View> */}
              </View>
            </View>
            <View style={{marginTop: 10, marginHorizontal: 20}}>
              <View
                style={[
                  styles.Textinput2_row,
                  {flexDirection: 'column', padding: 0},
                ]}>
                <Text
                  style={[
                    styles.text_lable,
                    {
                      color: '#153E7E',
                      width: '100%',
                      fontSize: 16,
                      paddingBottom: 0,
                      paddingTop: 0,
                    },
                  ]}>
                  {json_language['Xác nhận'][language]}:{' '}
                </Text>
                {/* <View style={{ flexDirection: 'row' }}> */}
                <TextInput
                  style={{
                    fontSize: 15,
                    width: '100%',
                    flexWrap: 'wrap',
                    padding: Platform.OS == 'ios' ? 10 : 0,
                    paddingLeft: Platform.OS == 'ios' ? 5 : 5,
                  }}
                  autoCorrect={false}
                  secureTextEntry={!hide.confirm_new_pw}
                  maxLength={30}
                  autoCapitalized="words"
                  value={confirm_new_pw}
                  color={'black'}
                  placeholder={json_language['Nhập mật khẩu mới'][language]}
                  placeholderTextColor="#cfcfcb"
                  onChangeText={text => set_confirm_new_pw(text)}
                />
                {/* <Pressable onPress={() => {
                                        setHide({ ...hide, confirm_new_pw: !hide.confirm_new_pw })
                                    }} style={{ justifyContent: 'center', paddingLeft: 3 }}>
                                        <Entypo name="eye" size={20} color={!hide.confirm_new_pw ? 'black' : 'green'} />
                                    </Pressable>
                                </View> */}
              </View>
            </View>
            {new_pw == confirm_new_pw &&
            new_pw.length > 7 &&
            old_pw.length > 7 ? (
              <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <TouchableOpacity
                  onPress={() => {
                    change_pw();
                  }}
                  style={{
                    marginTop: 20,
                    width: '90%',
                    backgroundColor:
                      new_pw == confirm_new_pw &&
                      new_pw.length > 7 &&
                      old_pw.length > 7
                        ? '#4EBDEC'
                        : 'rgba(0,128,255,0.4)',
                    borderRadius: 10,
                  }}>
                  <Text
                    style={{
                      padding: 8,
                      color: 'white',
                      fontSize: 18,
                      textAlign: 'center',
                    }}>
                    {json_language['Lưu thay đổi'][language]}
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <View
                  style={{
                    marginTop: 20,
                    width: '90%',
                    backgroundColor:
                      new_pw == confirm_new_pw &&
                      new_pw.length > 7 &&
                      old_pw.length > 7
                        ? '#4EBDEC'
                        : 'rgba(0,128,255,0.4)',
                    borderRadius: 10,
                  }}>
                  <Text
                    style={{
                      padding: 8,
                      color: 'white',
                      fontSize: 18,
                      textAlign: 'center',
                    }}>
                    {json_language['Lưu thay đổi'][language]}
                  </Text>
                </View>
              </View>
            )}
          </View>
        </SafeAreaView>
      </ScrollView>
    </Modal>
  );
}
export default memo(Change_password);
