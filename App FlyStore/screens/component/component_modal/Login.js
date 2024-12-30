import React, {useState, memo} from 'react';
import {
  Text,
  View,
  TextInput,
  Image,
  TouchableOpacity,
  Dimensions,
  Alert,
  ImageBackground,
  Modal,
  Pressable,
  StatusBar,
  ScrollView,
  Platform,
} from 'react-native';
import styles from '../../styles';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import Loading_animation from './Loading_animation';
// FontAwesome.loadFont();
// Entypo.loadFont();
import AlertTwoButtom from '../component_product/AlertTwoButtom';
const img = '../../img/';
function modalLogin({
  messgae_Loading_animation,
  loading,
  user_login,
  set_user_login,
  language,
  json_language,
  isLogin,
  setIsLogin,
  sendValues,
  screenHeight,
  screenWidth,
  isConnected,
}) {
  const [is_validate, set_is_validate] = useState(false);
  const [hide, sethide] = useState(true);
  function validate_username(text) {
    set_user_login({...user_login, username: text});
    if (text.length >= 8 && user_login.password.length >= 8) {
      set_is_validate(true);
    } else {
      set_is_validate(false);
    }
  }
  function validate_password(text) {
    set_user_login({...user_login, password: text});
    if (text.length >= 8 && user_login.username.length >= 8) {
      set_is_validate(true);
    } else {
      set_is_validate(false);
    }
  }
  const [open_alert, set_open_alert] = useState(false);
  const [color, set_color] = useState('#1589FF');
  const [message, set_message] = useState('');
  const [status, set_status] = useState('');
  const [type_alert, set_type_alert] = useState('thongbao');
  const [open_StatusBar, set_open_StatusBar] = useState(false);
  return (
    <Modal
      transparent={false}
      visible={!isLogin}
      // onRequestClose={() => {
      //     Alert.alert('Modal has been closed.');
      //     setIsLogin(true);
      // }}
    >
      <StatusBar translucent={true} backgroundColor="rgba(0, 0, 0, 1)" />
      {loading && (
        <Loading_animation
          onLoading={loading}
          onAction={messgae_Loading_animation}
        />
      )}
      {open_alert && (
        <AlertTwoButtom
          open_statusBar={true}
          open_alert={open_alert}
          set_open_alert={set_open_alert}
          type={'thongbao'}
          language={language}
          color={color}
          status={status}
          message={message}
        />
      )}
      <ScrollView keyboardShouldPersistTaps="handled">
        <ImageBackground
          source={require(img + 'background_flywifi.jpg')}
          style={{
            minHeight:
              screenHeight - (screenHeight > 480 && screenWidth > 480 ? 70 : 0),
          }}>
          <View
            style={{
              height:
                screenHeight -
                (screenHeight > 480 && screenWidth > 480
                  ? Platform.OS != 'ios'
                    ? 110
                    : 25
                  : screenWidth > screenHeight
                  ? 40
                  : Platform.OS == 'ios'
                  ? 30
                  : 20),
            }}>
            <View style={styles.image}>
              <Image
                source={require(img + 'logo2.png')}
                style={{
                  height:
                    screenHeight < screenWidth
                      ? 0.155 * screenWidth
                      : 0.19 * 0.9 * screenWidth,
                  width: '90%',
                  marginHorizontal: '5%',
                  marginBottom: 10,
                  marginTop: screenWidth > screenHeight ? 0 : 100,
                }}
              />
            </View>
            <View style={{marginTop: screenHeight > screenWidth ? 50 : 0}}>
              <View
                style={[
                  styles.border_input,
                  {
                    padding: Platform.OS === 'ios' ? 10 : 5,
                    marginTop: screenHeight > 480 && screenWidth > 480 ? 80 : 0,
                    flexDirection: 'row',
                    backgroundColor: 'rgba(255,255,255,0.8)',
                  },
                ]}>
                <TextInput
                  style={[
                    styles.TextInput,
                    {
                      width:
                        screenHeight < screenWidth
                          ? '93%'
                          : screenHeight > 480 && screenWidth > 480
                          ? '93%'
                          : '90%',
                    },
                  ]}
                  placeholder={json_language['Tài khoản'][language]}
                  autoCorrect={false}
                  maxLength={100}
                  autoCapitalized="words"
                  backgroundColor="rgba(255,255,255,0.01)"
                  placeholderTextColor="#777"
                  value={user_login.username}
                  onChangeText={text => validate_username(text)}
                />
                <View style={{justifyContent: 'center'}}>
                  <FontAwesome name="user" size={20} color="#000000" />
                </View>
              </View>
              <Pressable
                style={[
                  styles.border_input,
                  {
                    padding: Platform.OS === 'ios' ? 10 : 5,
                    marginTop: 10,
                    flexDirection: 'row',
                    backgroundColor: 'rgba(255,255,255,0.8)',
                  },
                ]}
                onPress={() => sethide(!hide)}>
                <TextInput
                  style={[
                    styles.TextInput,
                    {
                      width:
                        screenHeight < screenWidth
                          ? '93%'
                          : screenHeight > 480 && screenWidth > 480
                          ? '92%'
                          : '89%',
                      marginLeft: 0,
                    },
                  ]}
                  placeholder={json_language['Mật khẩu'][language]}
                  secureTextEntry={hide}
                  autoCorrect={false}
                  maxLength={100}
                  autoCapitalized="words"
                  backgroundColor="rgba(255,255,255,0.01)"
                  placeholderTextColor="#777"
                  value={user_login.password}
                  onChangeText={text => validate_password(text)}
                />
                <View style={{justifyContent: 'center', paddingLeft: 3}}>
                  <Entypo
                    name="eye"
                    size={22}
                    color={hide ? 'black' : 'green'}
                  />
                </View>
              </Pressable>

              {is_validate ? (
                <TouchableOpacity
                  style={[
                    styles.button_login,
                    {padding: Platform.OS === 'ios' ? 15 : 12, marginTop: 30},
                  ]}
                  onPress={async () => {
                    if (isConnected != true && isConnected != 'true') {
                      setTimeout(() => {
                        set_open_alert(true);
                      }, 0);
                      set_type_alert('thongbao');
                      set_color('#EAC117');
                      set_status(json_language['Đăng nhập thất bại'][language]);
                      set_message(
                        json_language[
                          'Không có kết nối. Vui lòng kết nối mạng và thử lại'
                        ][language],
                      );
                      // show_message(json_language["Đăng nhập thất bại"][language], json_language["Không có kết nối. Vui lòng kết nối mạng và thử lại"][language])
                      return;
                    }
                    await sendValues(user_login.username, user_login.password);
                  }}>
                  <Text style={{color: '#ffffff', fontSize: 15}}>
                    {json_language['Đăng nhập'][language]}
                  </Text>
                </TouchableOpacity>
              ) : (
                <View
                  style={[
                    styles.button_login,
                    {
                      backgroundColor: '#ADD8E6',
                      padding: Platform.OS === 'ios' ? 15 : 12,
                      marginTop: 30,
                    },
                  ]}
                  onPress={async () => {
                    await sendValues(user_login.username, user_login.password);
                  }}>
                  <Text style={{color: '#ffffff', fontSize: 15}}>
                    {json_language['Đăng nhập'][language]}
                  </Text>
                </View>
              )}
            </View>
          </View>
          <View
            style={{height: screenHeight > 480 && screenWidth > 480 ? 40 : 20}}>
            <Text style={{textAlign: 'center', fontSize: 12, color: 'white'}}>
              @2023 VTC&BAV
            </Text>
          </View>
        </ImageBackground>
      </ScrollView>
    </Modal>
  );
}
export default memo(modalLogin);
