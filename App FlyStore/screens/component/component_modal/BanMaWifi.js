import React, {memo, useState} from 'react';
import {
  KeyboardAvoidingView,
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
import styles from '../../styles';
import AntDesign from 'react-native-vector-icons/AntDesign';
// AntDesign.loadFont();
import HeaderClose from '../ShortComponent/HeaderClose';
import Text_MNV_HoTen from '../component_product/Text_MNV_HoTen';
import Flastlist_sanpham from '../component_product/flastlist_sanpham';
import Flastlist_tienTe from '../component_product/flastlist_tienTe';
import {show_message} from '../../menu_function';
import AlertTwoButtom from '../component_product/AlertTwoButtom';
const padding_screens =
  Dimensions.get('window').width > 480 && Dimensions.get('window').height > 480
    ? 10
    : 0;
function ModalBanMaWifi({
  setMNV,
  setHoTen,
  employees,
  screenHeight,
  screenWidth,
  handleInputChange,
  json_language,
  language,
  formMatruycap,
  setFormMatruycap,
  MNV,
  handleMNVChange,
  hoTen,
  wifi_voucher_types,
  sanPhamBam,
  image_source,
  setSanPhamBam,
  openBanMaTCWifi,
  formBanMaTCWifi,
  wifi_voucher_prices,
  layMaBanWifi,
  soLuong,
  setSoLuong,
  tienTe,
  setTienTe,
  prices_san_pham,
  set_prices_sp,
  set_open_find_employee,
  open_find_employee,
}) {
  // console.log('ma wifi')
  const [show_quyen_loi, set_show_quyen_loi] = useState(false);
  const [open_alert, set_open_alert] = useState(false);
  const [color, set_color] = useState('#1589FF');
  const [message, set_message] = useState('');
  const [status, set_status] = useState('');
  const [type, set_type] = useState('thongbao');
  return (
    <Modal
      transparent={false}
      visible={formMatruycap}
      onRequestClose={() => {
        setFormMatruycap(false);
      }}>
      <StatusBar backgroundColor="rgba(0, 0, 0, 1)" />
      <AlertTwoButtom
        open_alert={open_alert}
        set_open_alert={set_open_alert}
        type={type}
        language={language}
        color={color}
        status={status}
        message={message}
        button_message_close={json_language['Hủy'][language]}
        button_message_func={json_language['Tiếp tục'][language]}
        func={layMaBanWifi}
      />

      {formBanMaTCWifi && formBanMaTCWifi.quyenloi && (
        <Modal
          animationType="slide-up"
          transparent={true}
          visible={show_quyen_loi}
          onRequestClose={() => {
            set_show_quyen_loi(false);
          }}>
          <View
            style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
            <View
              style={{
                width: '70%',
                backgroundColor: '#ACD9F5',
                padding: 20,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 10,
              }}>
              <Text style={{color: '#000000'}}>
                {formBanMaTCWifi.quyenloi
                  ? formBanMaTCWifi.quyenloi
                      .replace(/<\/?ul>|<\/li>/g, '')
                      .replace(/<li>/g, '- ')
                  : ''}
              </Text>
              <TouchableOpacity
                style={{
                  marginTop: 20,
                  width: '70%',
                  backgroundColor: '#00558F',
                  padding: 5,
                  borderRadius: 10,
                }}
                onPress={() => set_show_quyen_loi(false)}>
                <Text
                  style={{color: 'white', textAlign: 'center', fontSize: 18}}>
                  {language == 'English' ? 'Close' : 'Đóng'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      <ScrollView keyboardShouldPersistTaps="handled">
        <SafeAreaView
          style={{
            backgroundColor: '#ffffff',
            flexGround: 1,
            height: Dimensions.get('window').height,
          }}>
          <View style={{}}>
            <HeaderClose
              title={json_language['Bán mã truy cập wifi'][language]}
              func={() => setFormMatruycap(false)}
            />
            <Text_MNV_HoTen
              setMNV={setMNV}
              setHoTen={setHoTen}
              employees={employees}
              language={language}
              on_MNV={MNV}
              on_handleMNVChange={handleMNVChange}
              on_hoTen={hoTen}
              set_open_find_employee={set_open_find_employee}
              open_find_employee={open_find_employee}
            />

            <View style={{width: '100%'}}>
              <Text
                style={{
                  marginLeft: 10,
                  marginTop: 20 + padding_screens,
                  color: 'black',
                }}>
                {json_language['Chọn sản phẩm'][language]}
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  width: '100%',
                  marginTop: 0 + padding_screens,
                }}>
                <Flastlist_sanpham
                  screenWidth={screenWidth}
                  screenHeight={screenHeight}
                  onVoucherTypes={wifi_voucher_types}
                  onCodeSanPham={sanPhamBam}
                  onSetSanPham={setSanPhamBam}
                  onGetValueSP={openBanMaTCWifi}
                  onImage_source={image_source}
                />
              </View>
              {true ? (
                <View>
                  {/* <TouchableOpacity style={[styles.Text2_row, { marginTop: 20, maxHeight: 80 }]}
                                        onPress={() => formBanMaTCWifi && formBanMaTCWifi.quyenloi ? set_show_quyen_loi(true) : {}}>
                                        <Text style={{ width: '40%', color: '#000000' }}>{json_language['Quyền lợi'][language]}</Text>
                                        <Text style={{ color: '#000000' }} >{formBanMaTCWifi && formBanMaTCWifi.quyenloi ? formBanMaTCWifi.quyenloi.replace(/<\/?ul>|<\/li>/g, '').replace(/<li>/g, "- ") : ""}</Text>
                                    </TouchableOpacity> */}
                  <View
                    style={[
                      styles.Text2_row,
                      {
                        backgroundColor: 'white',
                        marginTop: 20 + padding_screens,
                        padding: 0,
                      },
                    ]}>
                    <Text
                      style={{
                        width: '40%',
                        alignItems: 'center',
                        color: 'black',
                        paddingLeft: 10,
                      }}>
                      {json_language['Tiền tệ'][language]}
                    </Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        width: '60%',
                        paddingLeft: 1,
                      }}>
                      <Flastlist_tienTe
                        onVoucherPrice={wifi_voucher_prices}
                        onTenSP={sanPhamBam}
                        onTienTe={tienTe}
                        onSetTienTe={setTienTe}
                        onSet_prices_sp={set_prices_sp}
                      />
                    </View>
                  </View>
                  <View style={styles.Text2_row}>
                    <Text
                      style={{
                        width: '40%',
                        color: '#000000',
                        fontWeight: 500,
                        padding: 3,
                        paddingLeft: 0,
                      }}>
                      {json_language['Đơn giá'][language]}
                    </Text>
                    {tienTe == 'vnd' ? (
                      <Text
                        style={{
                          color: '#000000',
                          fontWeight: 500,
                          marginLeft: tienTe == 'vnd' ? 30 : 45,
                        }}>
                        {Number(prices_san_pham).toLocaleString('en-US', {
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        })}
                      </Text>
                    ) : (
                      <Text
                        style={{
                          color: '#000000',
                          fontWeight: 500,
                          marginLeft: tienTe == 'vnd' ? 30 : 45,
                        }}>
                        {Number(prices_san_pham).toLocaleString('en-US', {
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        })}
                      </Text>
                    )}
                  </View>
                  <View
                    style={[
                      styles.Textinput2_row,
                      {marginHorizontal: 5, padding: 0, paddingLeft: 5},
                      Platform.OS == 'ios'
                        ? {marginTop: 10, paddingBottom: 10}
                        : {},
                    ]}>
                    <Text
                      style={{width: '40%', paddingLeft: 0, color: 'black'}}>
                      {json_language['Số lượng'][language]}
                    </Text>
                    <View
                      style={{
                        width: '60%',
                        paddingLeft: 0,
                        flexDirection: 'row',
                      }}>
                      <TouchableOpacity
                        style={{justifyContent: 'center'}}
                        onPress={() => {
                          if (
                            parseInt(soLuong) > 1 &&
                            soLuong != '' &&
                            soLuong != 'NaN'
                          ) {
                            setSoLuong(String(parseInt(soLuong) - 1));
                          }
                        }}>
                        <View
                          style={{
                            width: 30,
                            height: 30,
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor:
                              parseInt(soLuong) > 1 &&
                              soLuong != '' &&
                              soLuong != 'NaN'
                                ? 'rgba(0,0,0,0.1)'
                                : 'rgba(0,0,0,0.03)',
                          }}>
                          <Text style={{fontSize: 16, color: 'black'}}>-</Text>
                        </View>
                      </TouchableOpacity>
                      <TextInput
                        style={{width: 40, textAlign: 'center', color: 'black'}}
                        autoCorrect={false}
                        maxLength={3}
                        autoCapitalized="words"
                        value={soLuong}
                        keyboardType="numeric"
                        onChangeText={handleInputChange}
                        placeholderTextColor="#cfcfcb"
                      />
                      <TouchableOpacity
                        style={{justifyContent: 'center'}}
                        onPress={() =>
                          setSoLuong(
                            soLuong == 'NaN' || soLuong == ''
                              ? '1'
                              : String(parseInt(soLuong) + 1),
                          )
                        }>
                        <View
                          style={{
                            width: 30,
                            height: 30,
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: 'rgba(0,0,0,0.1)',
                          }}>
                          <Text style={{fontSize: 16, color: 'black'}}>+</Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={styles.Text2_row}>
                    <Text
                      style={{
                        width: '40%',
                        color: 'black',
                        fontWeight: 500,
                        padding: 3,
                        paddingLeft: 0,
                      }}>
                      {json_language['Thành tiền'][language]}
                    </Text>
                    {tienTe == 'vnd' ? (
                      <Text
                        style={{
                          color: '#000000',
                          fontWeight: 500,
                          marginLeft: tienTe == 'vnd' ? 30 : 45,
                        }}>
                        {(Number(prices_san_pham) * soLuong).toLocaleString(
                          'en-US',
                          {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                          },
                        )}
                      </Text>
                    ) : (
                      <Text
                        style={{
                          color: '#000000',
                          fontWeight: 500,
                          marginLeft: tienTe == 'vnd' ? 30 : 45,
                        }}>
                        {(Number(prices_san_pham) * soLuong).toLocaleString(
                          'en-US',
                          {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                          },
                        )}
                      </Text>
                    )}
                  </View>
                </View>
              ) : (
                <View />
              )}
            </View>
          </View>
          <View
            style={{
              justifyContent: 'flex-end',
              position: 'absolute',
              top:
                Platform.OS == 'ios'
                  ? Dimensions.get('window').height - 70
                  : Dimensions.get('window').height - 50,
              width: '100%',
              zIndex: 999,
            }}>
            <TouchableOpacity
              style={[
                styles.textAlignCenter,
                {height: 50, backgroundColor: '#4EBDEC'},
              ]}
              onPress={() => {
                if (MNV && hoTen != '') {
                  setTimeout(() => {
                    set_open_alert(true);
                  }, 0);
                  set_type('thuchien');
                  set_status(json_language['Xác nhận'][language]);
                  set_color('#1589FF');
                  set_message(
                    json_language[
                      'Vui lòng xác nhận lại thông tin trước khi lấy mã. Xin cảm ơn!'
                    ][language],
                  );
                  // Alert.alert(
                  //     json_language["Xác nhận"][language],
                  //     json_language["Vui lòng xác nhận lại thông tin trước khi lấy mã. Xin cảm ơn!"][language],
                  //     [
                  //         {
                  //             text: 'Cancel',
                  //             //onPress: () => console.log('Cancel Pressed'),
                  //             style: 'cancel',
                  //         },
                  //         {
                  //             text: 'OK',
                  //             onPress: () => layMaBanWifi()
                  //         },
                  //     ]
                  // );
                } else {
                  setTimeout(() => {
                    set_open_alert(true);
                  }, 0);
                  set_type('thongbao');
                  set_color('#EAC117');
                  set_status(json_language['Lỗi'][language]);
                  set_message(
                    json_language['Mã nhân viên và họ tên không được để trống'][
                      language
                    ],
                  );
                  // show_message(json_language['Lỗi'][language], json_language['Mã nhân viên và họ tên không được để trống'][language])
                }
                // layMaBanWifi()
              }}>
              <Text style={{color: 'white', fontSize: 20, fontWeight: 500}}>
                {json_language['Lấy mã'][language]}
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </ScrollView>
    </Modal>
  );
}
export default memo(ModalBanMaWifi);
