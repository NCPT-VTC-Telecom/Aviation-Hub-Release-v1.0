import React, {memo, useCallback, useState} from 'react';
import {
  KeyboardAvoidingView,
  SafeAreaView,
  Button,
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
import DateTimePicker from '@react-native-community/datetimepicker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import RNFS from 'react-native-fs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import AntDesign from 'react-native-vector-icons/AntDesign';
import moment from 'moment';
// Ionicons.loadFont();
// Fontisto.loadFont();
// import simple from 'react-native-vector-icons/simple-line-icons'
// Fontisto.loadFont();
// simple.loadFont();
import {
  show_message,
  setDataLocal,
  handleInputNumber,
} from '../../menu_function';
import Loading_animation from '../component_modal/Loading_animation';
import {Picker} from '@react-native-picker/picker';
import json_language from '../../json/language.json';
import {url_api} from '../../../config';

import AlertTwoButtom from '../component_product/AlertTwoButtom';
import {useSafeArea} from 'native-base';
import StepIndicator from 'react-native-step-indicator';
import {stepIndicatorStyles} from '../common';
import ShowDataPackage from './ShowDataPackage';
const step = 3;
function FillInfoCCCD({
  listPhoneSim,
  set_open_register_uninternet,
  open_fill_info_cccd,
  set_open_fill_info_cccd,
  language,
  cccd_info_ss,
  set_cccd_info_ss,
  data_a_sim,
  listEsim,
  setListEsim,
  setListCusBoughtEsim,
  listCusBoughtEsim,
  set_total_esim_sold_today,
  total_esim_sold_today,
  set_sold,
  sold,
  set_listPhoneSim_filter,
  openShowDataPackage,
  setOpenShowDataPackage,
}) {
  const SaveAndGetSim = useCallback(async () => {
    // set_loading(true);
    let register_sim_unsync = {...cccd_info_ss};
    register_sim_unsync.snCode = data_a_sim.snCode;
    register_sim_unsync.dataPackages = data_a_sim.dataPackages;
    register_sim_unsync.createdAt = new Date().toISOString().slice(0, -1);
    register_sim_unsync.username = register_sim_unsync.fullName;
    //thêm vào listEsim cài đặt lại danh sách khách hàng đã mua sim
    listCusBoughtEsim.push(register_sim_unsync);
    setListCusBoughtEsim(listCusBoughtEsim);
    set_total_esim_sold_today(total_esim_sold_today + 1);
    setDataLocal(listCusBoughtEsim, 'listCusBoughtEsim');
    //cập nhật sim đã mua thành status 1
    for (i of listEsim) {
      //phone register
      if (i.snCode === data_a_sim.snCode) {
        i.status = 1;
        i.username = cccd_info_ss.fullName;
        i.email = cccd_info_ss.email;
        setListEsim(listEsim);
        setDataLocal(listEsim, 'listEsim');
        break;
      }
    }
    set_listPhoneSim_filter(
      listEsim.filter(d => {
        return !d.status || d.status == 0;
      }),
    );
    //cho ấn step 3
    set_sold(1);
    console.log(listEsim);
    console.log(listCusBoughtEsim);
    setOpenShowDataPackage(true);
    // setTimeout(() => {
    //     set_loading(false);
    //     show_message(json_language['Thành công'][language], json_language['Dữ liệu đã được lưu vào máy. Cần Internet để đồng bộ lên hệ thống.'][language])
    // }, 0);
    // set_open_fill_info_cccd(false)
    // set_open_register_uninternet(false)
  });
  const [validate, set_validate] = useState(true);
  const [loading, set_loading] = useState(false);
  const [phone, set_phone] = useState(
    data_a_sim.snCode ? data_a_sim.snCode : '',
  );
  const [open_alert, set_open_alert] = useState(false);
  const [color, set_color] = useState('#1589FF');
  const [message, set_message] = useState('');

  const [status, set_status] = useState('');
  function checkValidateAny(text, type) {
    if (!text || !type) {
      return -1;
    }
    if (type == 'phone10') {
      const pattern = /^[0-9]{10}$/; // Mẫu 10 chữ số từ 0-9
      const result = pattern.test(text);
      return result ? 1 : 0;
    } else if (type == 'phone84') {
      // console.log(listPhoneSim)
      const pattern = /^\84[0-9]{9}$/; // Mẫu 10 chữ số từ 0-9
      const result = pattern.test(text);
      if (!result) {
        return 0;
      } else {
        const data_a_sim_ =
          listPhoneSim && listPhoneSim.length != 0
            ? listPhoneSim.find(d => {
                return d.phone == text;
              })
            : {};
        // console.log(data_a_sim_)
        if (data_a_sim_) {
          return 1;
        }
        return 0;
      }
      return result ? 1 : 0;
    } else if (type == 'serial') {
      const pattern = /^[0-9]{11}$/; // Mẫu 10 chữ số từ 0-9
      const result = pattern.test(text);
      if (!result) {
        return 0;
      } else {
        const data_a_sim_ =
          listPhoneSim && listPhoneSim.length != 0
            ? listPhoneSim.find(d => {
                return d.imei == text;
              })
            : {};
        if (data_a_sim_ && data_a_sim.snCode == phone) {
          return 1;
        }
        return 0;
      }
      return result ? 1 : 0;
    } else if (type == 'cccd') {
      const pattern = /^[0-9]{12}$/; // Mẫu 10 chữ số từ 0-9
      const result = pattern.test(text);
      return result ? 1 : 0;
    } else if ((type = 'email')) {
      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      const result = emailPattern.test(text);
      return result ? 1 : 0;
    }
  }
  const SaveInfo = useCallback(async () => {
    await SaveAndGetSim();
  });
  const [type_alert, set_type_alert] = useState('thongbao');
  return (
    <View>
      <Modal
        animationType="slide-down"
        transparent={false}
        visible={open_fill_info_cccd}
        onRequestClose={() => {
          set_open_fill_info_cccd(false);
        }}>
        <AlertTwoButtom
          open_alert={open_alert}
          set_open_alert={set_open_alert}
          type={type_alert}
          language={language}
          color={color}
          status={status}
          message={message}
          button_message_close={json_language['Hủy'][language]}
          button_message_func={json_language['Lưu'][language]}
          func={SaveInfo}
        />
        <Loading_animation
          onLoading={loading}
          onAction={json_language['Đang xử lý'][language]}
        />
        <StatusBar backgroundColor="rgba(0, 0, 0, 1)" />
        <ShowDataPackage
          language={language}
          openShowDataPackage={openShowDataPackage}
          setOpenShowDataPackage={setOpenShowDataPackage}
          data_a_sim={data_a_sim}
          set_open_fill_info_cccd={set_open_fill_info_cccd}
          set_open_register_uninternet={set_open_register_uninternet}
          set_sold={set_sold}
        />
        <SafeAreaView style={{backgroundColor: '#ffffff', width: '100%'}}>
          <View
            style={[
              {
                borderBottomColor: '#6D7B8D',
                borderBottomWidth: 1,
                flexDirection: 'row',
              },
              styles.center,
            ]}>
            <TouchableOpacity
              style={{width: '10%', marginLeft: 0}}
              onPress={() => set_open_fill_info_cccd(false)}>
              <Ionicons name="arrow-back" size={26} color="#151B8D" />
            </TouchableOpacity>
            <View style={{width: '75%'}}>
              <Text
                style={{
                  fontWeight: 500,
                  borderRadius: 5,
                  padding: 15,
                  color: '#151B8D',
                  fontSize: 18,
                  paddingLeft: 15,
                }}>
                {json_language['Điền thông tin'][language]}
              </Text>
            </View>
            <TouchableOpacity
              style={{width: '10%'}}
              onPress={() => {
                set_open_fill_info_cccd(false);
              }}>
              <AntDesign name="close" size={22} color="red" />
            </TouchableOpacity>
          </View>
          <View style={styles.stepIndicatorContainer}>
            <StepIndicator
              customStyles={stepIndicatorStyles}
              stepCount={3}
              direction="horizontal"
              currentPosition={1}
              onPress={index => {
                if (index == 0) {
                  setOpenShowDataPackage(false);
                  set_open_fill_info_cccd(false);
                } else if (index == 2 && data_a_sim && sold) {
                  setOpenShowDataPackage(true);
                }
                // Xử lý logic khi nhấp vào từng bước
              }}
              // labels={dummyData.map((_, index) => '')}
            />
          </View>
          <View style={{backgroundColor: '#DDDFE1'}}>
            <ScrollView style={{marginHorizontal: 10}}>
              <View>
                <View
                  style={[
                    {
                      padding: 10,
                      backgroundColor: '#ffffff',
                      marginTop: 10,
                      borderRadius: 10,
                    },
                    styles.shadow,
                  ]}>
                  <View
                    style={[
                      {flexDirection: 'row', marginTop: 15},
                      styles.center,
                    ]}>
                    <Text
                      style={{
                        width: '100%',
                        padding: 8,
                        color: 'black',
                        fontSize: 22,
                      }}>
                      {json_language['Thông tin khách hàng'][language]}
                    </Text>
                  </View>
                  <View style={{marginTop: 15}}>
                    <View
                      style={[
                        styles.Textinput2_row,
                        {
                          alignItems: 'center',
                          borderColor:
                            !cccd_info_ss.fullName && !validate
                              ? 'red'
                              : '#DDDFE1',
                        },
                      ]}>
                      <Text style={[styles.text_lable, {color: '#153E7E'}]}>
                        {json_language['Họ tên'][language]}:{' '}
                      </Text>
                      <TextInput
                        style={{
                          fontSize: 15,
                          width: '60%',
                          flexWrap: 'wrap',
                          paddingBottom: 3,
                          color: 'black',
                        }}
                        autoCorrect={false}
                        maxLength={50}
                        autoCapitalized="words"
                        value={cccd_info_ss.fullName}
                        multiline={true}
                        placeholder={json_language['Nhập họ tên'][language]}
                        placeholderTextColor="#cfcfcb"
                        onChangeText={text =>
                          set_cccd_info_ss({...cccd_info_ss, fullName: text})
                        }
                      />
                    </View>

                    {!cccd_info_ss.fullName && !validate && (
                      <View>
                        <Text style={{paddingLeft: 10, color: 'red'}}>
                          {
                            json_language['Họ tên không được bỏ trống'][
                              language
                            ]
                          }
                        </Text>
                      </View>
                    )}
                    <View
                      style={[
                        styles.Textinput2_row,
                        {
                          marginTop: 15,
                          alignItems: 'center',
                          borderColor:
                            (cccd_info_ss.email.length != 0 &&
                              checkValidateAny(cccd_info_ss.email, 'email') !=
                                1) ||
                            (checkValidateAny(cccd_info_ss.email, 'email') !=
                              1 &&
                              !validate)
                              ? 'red'
                              : '#DDDFE1',
                        },
                      ]}>
                      <Text style={[styles.text_lable, {color: '#153E7E'}]}>
                        Email:{' '}
                      </Text>
                      <TextInput
                        style={{fontSize: 15, width: '60%', color: 'black'}}
                        autoCorrect={false}
                        maxLength={50}
                        autoCapitalized="words"
                        value={cccd_info_ss.email}
                        placeholder={
                          json_language['Nhập ID card/Passport'][language]
                        }
                        placeholderTextColor="#cfcfcb"
                        onChangeText={text => {
                          set_cccd_info_ss({...cccd_info_ss, email: text});
                        }}
                      />
                    </View>
                    {((cccd_info_ss.email.length != 0 &&
                      checkValidateAny(cccd_info_ss.email, 'email') != 1) ||
                      (checkValidateAny(cccd_info_ss.email, 'email') != 1 &&
                        !validate)) && (
                      <View>
                        <Text style={{paddingLeft: 10, color: 'red'}}>
                          {cccd_info_ss.email.length == 0
                            ? json_language['Email không được bỏ trống'][
                                language
                              ]
                            : json_language['Email không đúng định dạng'][
                                language
                              ]}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
                {data_a_sim.snCode && (
                  <View
                    style={[
                      {
                        padding: 10,
                        backgroundColor: '#ffffff',
                        marginTop: 15,
                        borderRadius: 10,
                        marginBottom: 100,
                      },
                      styles.shadow,
                    ]}>
                    <View
                      style={[
                        {flexDirection: 'row', marginTop: 15},
                        styles.center,
                      ]}>
                      <Text
                        style={{
                          width: '100%',
                          padding: 8,
                          color: 'black',
                          fontSize: 22,
                        }}>
                        {
                          json_language['Thông tin thuê bao và gói cước'][
                            language
                          ]
                        }
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.Textinput2_row,
                        {marginTop: 15, alignItems: 'center'},
                      ]}>
                      <Text style={[styles.text_lable, {color: '#153E7E'}]}>
                        {json_language['Số điện thoại'][language]}:{' '}
                      </Text>
                      <Text
                        style={[
                          styles.text_lable,
                          {color: '#000000', fontSize: 15},
                        ]}>
                        {data_a_sim.snCode}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.Textinput2_row,
                        {marginTop: 15, alignItems: 'center'},
                      ]}>
                      <Text style={[styles.text_lable, {color: '#153E7E'}]}>
                        Nhà cung cấp:{' '}
                      </Text>
                      <Text
                        style={[
                          styles.text_lable,
                          {color: '#000000', fontSize: 15},
                        ]}>
                        Joytel
                      </Text>
                    </View>
                    <View style={{height: 190}} />
                  </View>
                )}
              </View>
            </ScrollView>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: Platform.OS == 'ios' ? 48 : 30,
                justifyContent: 'flex-end',
                position: 'absolute',
                top:
                  Dimensions.get('window').height > 480 &&
                  Dimensions.get('window').width > 480
                    ? Dimensions.get('window').height - 280
                    : Platform.OS != 'ios'
                    ? Dimensions.get('window').height - 220
                    : Dimensions.get('window').height - 270,
                right: 10,
                padding: 10,
                alignItems: 'center',
              }}>
              <TouchableOpacity
                style={[
                  {
                    padding: 8,
                    borderWidth: 1,
                    borderColor: '#646060',
                    width: 100,
                    backgroundColor: '#F75D59',
                    borderRadius: 5,
                  },
                  styles.shadow,
                ]}
                onPress={() => {
                  setTimeout(() => {
                    set_open_fill_info_cccd(false);
                  }, 1000);
                  set_open_register_uninternet(false);
                }}>
                <Text
                  style={{textAlign: 'center', fontSize: 17, color: 'black'}}>
                  {language == 'Vietnamese' ? 'Hủy' : 'Cancel'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  {
                    padding: 8,
                    borderWidth: 1,
                    borderColor: '#646060',
                    width: 100,
                    marginLeft: 15,
                    marginRight: 10,
                    backgroundColor: '#82CAFA',
                    borderRadius: 5,
                  },
                  styles.shadow,
                ]}
                onPress={async () => {
                  if (
                    !cccd_info_ss.fullName ||
                    checkValidateAny(cccd_info_ss.email, 'email') != 1
                  ) {
                    // console.log(sex)
                    set_validate(false);
                    setTimeout(() => {
                      set_open_alert(true);
                    }, 0);
                    set_type_alert('thongbao');
                    set_color('#EAC117');
                    set_status(json_language['Lỗi'][language]);
                    set_message(
                      json_language[
                        'Vui lòng điền đầy đủ thông tin và thử lại'
                      ][language],
                    );
                    return;
                  }
                  setTimeout(() => {
                    set_open_alert(true);
                  }, 0);
                  set_type_alert('thuchien');
                  set_status(json_language['Xác nhận'][language]);
                  set_message(
                    json_language['Vui lòng xác nhận thông tin trước khi lưu!'][
                      language
                    ],
                  );
                }}>
                <Text
                  style={{textAlign: 'center', fontSize: 17, color: 'black'}}>
                  {json_language['Lưu'][language]}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    </View>
  );
}
export default memo(FillInfoCCCD);
