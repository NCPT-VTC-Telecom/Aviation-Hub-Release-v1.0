import React, {memo, useCallback, useState} from 'react';
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
  Platform,
} from 'react-native';
import styles from '../../styles';
import HeaderGoBack from '../ShortComponent/HeaderGoBack';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// AntDesign.loadFont();
// Feather.loadFont();
// MaterialCommunityIcons.loadFont();
import Language from './Language';
const img = '../../img/';
import ShowTT from './VerifyCCCD';
import ViewInfo from './ViewInfo';
import HomePrinter from '../esim/HomePrinter';
import Change_password from './Change_password';
import AlertTwoButtom from '../component_product/AlertTwoButtom';
import {check} from 'react-native-permissions';
function CaiDat({
  wifi_vouchers,
  upgrade_tickets_vouchers,
  token,
  user,
  open_setting,
  set_open_setting,
  set_language,
  json_language,
  language,
  setIsLogin,
  setDataLocal,
  cccd_info,
  set_cccd_info,
  getDataLocal,
  printer,
  setPrinter,
  isConnected,
  checkSync,
}) {
  const [open_select, set_open_select] = useState(false);
  const [open_show_cccd, set_open_show_cccd] = useState(false);
  const [show_view_info, set_show_view_info] = useState(false);
  const [open_change_password, set_open_change_password] = useState(false);

  const [open_alert, set_open_alert] = useState(false);
  const [color, set_color] = useState('#EAC117');
  const [message, set_message] = useState(
    json_language['Vui lòng đồng bộ thông tin trước khi đăng xuất'][language],
  );
  const [status, set_status] = useState(json_language['Thất bại'][language]);
  const [type, set_type] = useState('thongbao');
  const logout = useCallback(() => {
    if (checkSync == true) {
      setTimeout(() => {
        set_open_alert(true);
      }, 0);
      set_status(json_language['Thất bại'][language]);
      set_message(
        json_language['Vui lòng đồng bộ thông tin trước khi đăng xuất'][
          language
        ],
      );
      set_color('#EAC117');
      set_type('thongbao');
      return;
    }
    setIsLogin(false);
    setDataLocal('false', 'islogin');
    set_open_setting(false);
  });
  const [open_alert_ok, set_open_alert_ok] = useState(false);
  const [openHomePrinter, set_openHomePrinter] = useState(false);
  return (
    <View>
      <Modal
        // animationType="slide-down"
        transparent={true}
        visible={open_setting}
        onRequestClose={() => {
          set_open_setting(false);
        }}>
        <StatusBar backgroundColor="rgba(0, 0, 0, 1)" />

        {openHomePrinter && (
          <HomePrinter
            language={language}
            printer={printer}
            setPrinter={setPrinter}
            openHomePrinter={openHomePrinter}
            set_openHomePrinter={set_openHomePrinter}
          />
        )}
        <ScrollView style={{backgroundColor: 'white', minHeight: '100%'}}>
          <SafeAreaView
            style={{
              backgroundColor: 'white',
              minHeight: Dimensions.get('window').height,
            }}>
            {open_alert && (
              <AlertTwoButtom
                open_alert={open_alert}
                set_open_alert={set_open_alert}
                open_alert_ok={open_alert_ok}
                set_open_alert_ok={set_open_alert_ok}
                type={type}
                language={language}
                color={color}
                status={status}
                message={message}
                button_message_close={json_language['Hủy'][language]}
                button_message_func={json_language['Đăng xuất'][language]}
                func={logout}
              />
            )}

            {/* <ShowTT getDataLocal={getDataLocal} cccd_info={cccd_info} set_cccd_info={set_cccd_info}
                    open_show_cccd={open_show_cccd} set_open_show_cccd={set_open_show_cccd} set_language={set_language} json_language={json_language} language={language} /> */}
            {/* {open_select && (<Language open_select={open_select} set_open_select={set_open_select} set_language={set_language} json_language={json_language} language={language} />)} */}
            {open_change_password && (
              <Change_password
                open_alert={open_alert}
                set_open_alert={set_open_alert}
                open_alert_ok={open_alert_ok}
                set_open_alert_ok={set_open_alert_ok}
                setIsLogin={setIsLogin}
                set_open_setting={set_open_setting}
                checkSync={checkSync}
                token={token}
                language={language}
                open_change_password={open_change_password}
                set_open_change_password={set_open_change_password}
                isConnected={isConnected}
              />
            )}

            <HeaderGoBack
              title={json_language['Cài đặt'][language]}
              func={() => set_open_setting(false)}
            />
            <View
              style={{
                height: 80,
                flexDirection: 'row',
                marginVertical: 30,
                alignItems: 'center',
                marginLeft: 20,
              }}>
              <View
                style={{width: 80, borderRadius: 80, backgroundColor: 'white'}}>
                {!cccd_info.uri_selfies_image ? (
                  <Image
                    source={require('../../assets/images/avatar.jpg')}
                    style={{height: 60, width: 60, borderRadius: 50}}
                  />
                ) : (
                  <Image
                    source={{uri: cccd_info.uri_selfies_image}}
                    style={{height: 60, width: 60, borderRadius: 50}}
                  />
                )}
              </View>
              <View style={{height: 40}}>
                <Text style={{color: 'black', fontSize: 16}}>
                  {user ? user.Fullname : ''}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    //tắt tạm thời do chưa xác minh tt cá nhân
                    // set_show_view_info(true);
                  }}>
                  <Text style={{fontSize: 14, paddingTop: 5, color: '#00558F'}}>
                    {json_language['Xem thông tin'][language]}
                  </Text>
                </TouchableOpacity>

                <ViewInfo
                  show_view_info={show_view_info}
                  set_show_view_info={set_show_view_info}
                  json_language={json_language}
                  language={language}
                  cccd_info={cccd_info}
                />
              </View>
            </View>
            {/* chức năng xác minh thông tin ngừoi dùng app */}
            {/* <View style={{ flexDirection: 'row', width: Dimensions.get('window').width }}>

                            <TouchableOpacity style={[styles.tou_order_function]}
                                onPress={() => {

                                    set_open_show_cccd(true)
                                }}
                            >
                                <View style={{ width: "90%", flexDirection: 'row', alignItems: 'center' }}>
                                    <View style={{ justifyContent: 'center' }}>
                                        <Feather name="info" size={23} color="#747170" />
                                    </View>
                                    <Text style={styles.text_setting}>{json_language["Xác minh thông tin"][language]}</Text>
                                </View>
                                <AntDesign name="right" size={20} />
                            </TouchableOpacity>
                        </View> */}
            <View
              style={{
                flexDirection: 'row',
                width: Dimensions.get('window').width,
                marginTop: 5,
              }}>
              <TouchableOpacity
                style={[styles.tou_order_function]}
                onPress={() => {
                  // setTimeout(() => {
                  //     set_open_alert(true)
                  // }, 0);
                  // set_type('thongbao')
                  // set_status(language == "English" ? "Develop" : "Đang phát triển")
                  // set_message(language == "English" ? "Evolving functionality" : "Chức năng đang phát triển")
                  // return
                  set_openHomePrinter(true);
                }}>
                <View
                  style={{
                    width: '90%',
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <View style={{justifyContent: 'center'}}>
                    <AntDesign name="printer" size={25} color="#357EC7" />
                  </View>
                  <Text style={styles.text_setting}>
                    {language == 'English'
                      ? 'Connecter printer'
                      : 'Kết nối máy in'}{' '}
                  </Text>
                </View>
                <AntDesign name="right" size={20} />
              </TouchableOpacity>
            </View>
            <View
              style={{
                flexDirection: 'row',
                width: Dimensions.get('window').width,
                marginTop: 5,
              }}>
              <TouchableOpacity
                style={[styles.tou_order_function]}
                onPress={() => {
                  set_open_select(true);
                }}>
                <View
                  style={{
                    width: '90%',
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <View style={{justifyContent: 'center'}}>
                    <MaterialCommunityIcons
                      name="google-translate"
                      size={25}
                      color="#357EC7"
                    />
                  </View>
                  <Text style={styles.text_setting}>
                    {json_language['Ngôn ngữ'][language]}{' '}
                  </Text>
                </View>
                <AntDesign name="right" size={20} />
              </TouchableOpacity>
              {open_select && (
                <Language
                  open_select={open_select}
                  set_open_select={set_open_select}
                  set_language={set_language}
                  json_language={json_language}
                  language={language}
                />
              )}
            </View>
            <View
              style={{
                flexDirection: 'row',
                width: Dimensions.get('window').width,
                marginTop: 5,
              }}>
              <TouchableOpacity
                style={[styles.tou_order_function]}
                onPress={() => {
                  set_open_change_password(true);
                }}>
                <View
                  style={{
                    width: '90%',
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <View style={{justifyContent: 'center'}}>
                    <AntDesign name="lock1" size={23} color="black" />
                  </View>
                  <Text style={styles.text_setting}>
                    {json_language['Đổi mật khẩu'][language]}{' '}
                  </Text>
                </View>
                <AntDesign name="right" size={20} />
              </TouchableOpacity>
            </View>
            {/* <View style={{ flexDirection: 'row', width: Dimensions.get('window').width, marginTop: 5 }}>

                            <TouchableOpacity style={[styles.tou_order_function]}
                                onPress={() => {
                                    setTimeout(() => {
                                        set_open_alert(true)
                                    }, 0);
                                    set_type('thuchien')
                                    set_status(json_language['Xác nhận đăng xuất'][language])
                                    set_message(json_language['Bạn có chắc chắn muốn đăng xuất?'][language])
                                }}
                            >
                                <View style={{ width: "90%", flexDirection: 'row', alignItems: 'center' }}>
                                    <View style={{ justifyContent: 'center' }}>
                                        <Feather name="log-out" size={20} color="#E41B17" />
                                    </View>
                                    <Text style={styles.text_setting}>{json_language["Đăng xuất"][language]} </Text>
                                </View>
                                <AntDesign name="right" size={20} />
                            </TouchableOpacity>
                        </View> */}
            <View
              style={{
                position: 'absolute',
                top:
                  Platform.OS == 'ios'
                    ? Dimensions.get('window').height - 40
                    : Dimensions.get('window').height - 20,
                zIndex: 99999,
                alignItems: 'center',
              }}>
              <Text
                style={{
                  color: 'black',
                  textAlign: 'right',
                  width: Dimensions.get('window').width - 20,
                }}>
                V0.0.3
              </Text>
            </View>
          </SafeAreaView>
        </ScrollView>
      </Modal>
    </View>
  );
}
export default memo(CaiDat);
