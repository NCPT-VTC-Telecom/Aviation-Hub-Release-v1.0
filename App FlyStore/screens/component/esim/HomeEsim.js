import React, {memo, useEffect, useState} from 'react';
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
import styles from '../../styles';
import HeaderClose from '../ShortComponent/HeaderClose';
// import WebView from 'react-native-webview';
import {Picker} from '@react-native-picker/picker';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
// AntDesign.loadFont();
import Text_MNV_HoTen from '../component_product/Text_MNV_HoTen';
import Flastlist_sanpham from '../component_product/flastlist_sanpham';
import Flastlist_tienTe from '../component_product/flastlist_tienTe';
import {show_message} from '../../menu_function';
import AlertTwoButtom from '../component_product/AlertTwoButtom';
import ModalListEsim from './ModalListEsim';
import json_language from '../../json/language.json';
import HomePrinter from './HomePrinter';
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
const padding_screens =
  Dimensions.get('window').width > 480 && Dimensions.get('window').height > 480
    ? 10
    : 0;
function HomeEsim({
  setMNV,
  setHoTen,
  employees,
  open_find_employee,
  set_open_find_employee,
  handleInputChange,
  language,
  formNanghang,
  setFormNanghang,
  MNV,
  handleMNVChange,
  hoTen,
  sanPham,
  setSanPham,
  upgrade_tickets_voucher_types,
  openNangHang,
  formLayMaNH,
  prices_san_pham,
  set_prices_sp,
  tienTe,
  setTienTe,
  layMaEsim,
  soLuong,
  setSoLuong,
  upgrade_tickets_voucher_prices,
  image_source,
  setTenSanPham,
  tenSanPham,
  set_esim_region,
  esim_region,
  esim_vouchers,
  set_esim_vouchers,
  chuyenbay,
}) {
  // console.log(esim_vouchers)
  // console.log('re-nh')
  // console.log(esim_region)
  const [show_quyen_loi, set_show_quyen_loi] = useState(false);
  const [open_alert, set_open_alert] = useState(false);
  const [color, set_color] = useState('#1589FF');
  const [message, set_message] = useState('');
  const [status, set_status] = useState('');
  const [type, set_type] = useState('thongbao');
  // console.log(upgrade_tickets_voucher_types)
  const test = [
    {
      code: '1',
      name: 'JOY Australia và New Zealand (Úc và New Zealand) 1GB/ngày-30 ngày',
    },
    {
      code: '2',
      name: 'JOY Australia và New Zealand (Úc và New Zealand) 2GB/ngày-30 ngày',
    },
    {
      code: '3',
      name: 'JOY Australia và New Zealand (Úc và New Zealand) 3GB/ngày-30 ngày',
    },
    {
      code: '4',
      name: 'JOY Australia và New Zealand (Úc và New Zealand) 4GB/ngày-30 ngày',
    },
    {
      code: '5',
      name: 'JOY Australia và New Zealand (Úc và New Zealand) 5GB/ngày-30 ngày',
    },
  ];
  const [tempVoucher, setTempVoucher] = useState(esim_vouchers);
  const typeDate = [
    {
      code: 10,
      name: '10 ngày',
    },
    {
      code: 20,
      name: '20 ngày',
    },
    {
      code: 30,
      name: '30 ngày',
    },
  ];
  const [openSelectEsim, setOpenSelectEsim] = useState(false);
  const [selectedValue, setSelectedValue] = useState(
    esim_region && esim_region.length != 0 ? esim_region[0] : '',
  );
  const [selectedValue1, setSelectedValue1] = useState(
    upgrade_tickets_voucher_types && upgrade_tickets_voucher_types.length != 0
      ? upgrade_tickets_voucher_types[0]
      : '',
  );
  const [selectedValue2, setSelectedValue2] = useState(
    upgrade_tickets_voucher_types && upgrade_tickets_voucher_types.length != 0
      ? upgrade_tickets_voucher_types[0]
      : '',
  );
  return (
    <Modal
      transparent={false}
      visible={formNanghang}
      onRequestClose={() => {
        setFormNanghang(false);
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
        func={layMaEsim}
      />

      {formLayMaNH && formLayMaNH.quyenloi && (
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
                {formLayMaNH.quyenloi
                  ? formLayMaNH.quyenloi
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
                  {json_language['Đóng'][language]}
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
              title={'Sim Data'}
              func={() => setFormNanghang(false)}
            />
            <View>
              <Text_MNV_HoTen
                setMNV={setMNV}
                setHoTen={setHoTen}
                language={language}
                on_MNV={MNV}
                on_handleMNVChange={handleMNVChange}
                on_hoTen={hoTen}
                set_open_find_employee={set_open_find_employee}
                open_find_employee={open_find_employee}
                employees={employees}
              />
            </View>
            <View style={styles.Text2_row}>
              <Text
                style={{
                  width: '40%',
                  color: '#000000',
                  padding: 3,
                  paddingLeft: 0,
                }}>
                {json_language['Nơi đến'][language]}
              </Text>
              <Text style={{width: '60%', color: 'black'}}>
                {!chuyenbay.chauLuc_chuyenbay
                  ? ''
                  : !region[chuyenbay.chauLuc_chuyenbay]
                  ? ''
                  : !region[chuyenbay.chauLuc_chuyenbay][language]
                  ? ''
                  : region[chuyenbay.chauLuc_chuyenbay][language]}
              </Text>
            </View>
            <View>
              <ModalListEsim
                setMNV={setMNV}
                setHoTen={setHoTen}
                language={language}
                on_MNV={MNV}
                on_handleMNVChange={handleMNVChange}
                on_hoTen={hoTen}
                set_open_find_employee={setOpenSelectEsim}
                open_find_employee={openSelectEsim}
                employees={upgrade_tickets_voucher_types}
                setSanPham={setSanPham}
                openNangHang={openNangHang}
                sanPham={sanPham}
                tenSanPham={tenSanPham}
                setTenSanPham={setTenSanPham}
              />
            </View>

            {/* <View style={{ flexDirection: 'row' }}>
                            <View style={{ width: '40%' }}>
                                <Text style={{ color: 'black', justifyContent: 'center', marginLeft: 10, marginTop: 18, fontSize: 15 }}>{language == "English" ? "Select Type" : "Chọn loại gói"}</Text>
                            </View>
                            <View style={{ width: '60%' }}>
                                <Picker
                                    selectedValue={selectedValue1}
                                    onValueChange={(itemValue, itemIndex) => setSelectedValue1(itemValue)}
                                >
                                    {upgrade_tickets_voucher_types.map((item, index) => (
                                        <Picker.Item label={item.name} value={item.code} key={index} />
                                    ))}
                                </Picker>
                            </View>
                        </View> */}
            {/* <View style={{ flexDirection: 'row' }}>
                            <View style={{ width: '40%' }}>
                                <Text style={{ color: 'black', justifyContent: 'center', marginLeft: 10, marginTop: 18, fontSize: 15 }}>Chọn loại gói</Text>
                            </View>
                            <View style={{ width: '60%' }}>
                                <Picker
                                    selectedValue={selectedValue2}
                                    onValueChange={(itemValue, itemIndex) => setSelectedValue2(itemValue)}
                                >
                                    {typeDate.map((item, index) => (
                                        <Picker.Item label={item.name} value={item.code} key={index} />
                                    ))}
                                </Picker>
                            </View>
                        </View> */}
            <View style={{width: '100%'}}>
              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  borderColor: '#DDDFE1',
                  borderBottomWidth: 1,
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    marginLeft: 0,
                    marginTop: 20 + padding_screens,
                    color: '#000000',
                    fontSize: 16,
                    width: '40%',
                    paddingLeft: 10,
                  }}>
                  {language == 'English' ? 'Select sim' : 'Chọn sim'}:
                </Text>
                <TouchableOpacity
                  onPress={() => setOpenSelectEsim(true)}
                  style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    width: '60%',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      marginLeft: 0,
                      marginTop: 20 + padding_screens,
                      color: '#005320',
                      fontSize: 16,
                      flexWrap: 'wrap',
                    }}>
                    {tenSanPham}
                  </Text>
                  {/* <AntDesign name="check" size={20} color="#005320" style={{ marginTop: 20 + padding_screens, marginLeft: 20 }} /> */}
                  {/* <View style={{ width: '40%', justifyContent: 'flex-end', justifyContent: 'center', alignItems: 'center' }}>
                                        <AntDesign name="caretdown" size={20} color="#005320" style={{ marginTop: 0, marginLeft: 20, }} />
                                    </View> */}
                </TouchableOpacity>
              </View>

              {/* <View style={{ flexDirection: 'row', width: '100%', marginTop: 0 + padding_screens }}>
                                <Flastlist_sanpham onVoucherTypes={upgrade_tickets_voucher_types} onCodeSanPham={sanPham} onSetSanPham={setSanPham} onGetValueSP={openNangHang} onImage_source={image_source} />
                            </View> */}
              {formLayMaNH.prices ? (
                <View>
                  {/* <TouchableOpacity style={[styles.Text2_row, { marginTop: 20, maxHeight: 80 }]}
                                        onPress={() => formLayMaNH && formLayMaNH.quyenloi ? set_show_quyen_loi(true) : {}}>
                                        <Text style={{ width: '40%', color: '#000000' }}>{json_language['Quyền lợi'][language]}</Text>
                                        <Text style={{ color: '#000000' }} >{formLayMaNH.quyenloi ? formLayMaNH.quyenloi.replace(/<\/?ul>|<\/li>/g, '').replace(/<li>/g, "- ") : ""}</Text>
                                    </TouchableOpacity> */}

                  <View
                    style={[
                      styles.Text2_row,
                      {marginTop: 10, padding: 0, paddingLeft: 10},
                    ]}>
                    <Text style={{width: '40%', color: '#000000'}}>
                      {json_language['Tiền tệ'][language]}
                    </Text>
                    <View style={{width: '60%', paddingLeft: 1}}>
                      <Flastlist_tienTe
                        onVoucherPrice={upgrade_tickets_voucher_prices}
                        onTenSP={sanPham}
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
                          if (parseInt(soLuong) > 25) {
                            setSoLuong('1');
                            return;
                          }
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
                        onPress={() => {
                          if (parseInt(soLuong) > 25) {
                            setSoLuong('1');
                            return;
                          }
                          setSoLuong(
                            soLuong == 'NaN' || soLuong == ''
                              ? '1'
                              : String(parseInt(soLuong) + 1),
                          );
                        }}>
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
                        color: '#000000',
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
                // layMaEsim()
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
export default memo(HomeEsim);
