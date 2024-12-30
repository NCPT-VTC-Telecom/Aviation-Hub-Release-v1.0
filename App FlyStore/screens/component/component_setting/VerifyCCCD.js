import React, {memo, useCallback, useState} from 'react';
import {
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
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import TextRecognition from 'react-native-text-recognition';
import RNFS from 'react-native-fs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {Picker} from '@react-native-picker/picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {PermissionsAndroid} from 'react-native';
import {PERMISSIONS, request} from 'react-native-permissions';

// import ModalPicker from 'react-native-modal-picker'

import {show_message, setDataLocal} from '../../menu_function';

import Loading_animation from '../component_modal/Loading_animation';

const img = '../../img/';
function Show_TT({
  getDataLocal,
  open_show_cccd,
  set_open_show_cccd,
  language,
  set_language,
  json_language,
  cccd_info,
  set_cccd_info,
}) {
  const [cccd, set_cccd] = useState('');
  const [date, set_date] = useState(new Date());
  const [date_end, set_date_end] = useState(new Date());
  const [sex, set_sex] = useState('Nam');
  const [nationality, set_nationality] = useState();
  const [address_residence, set_address_residence] = useState();
  const [fullname, set_fullname] = useState();
  const [date_create, set_date_create] = useState(new Date());
  const [open_info, set_open_info] = useState(false);
  const [issued_by, set_issued_by] = useState(
    'Cục Cảnh sát quản lý hành chính về trật tự xã hội',
  );

  const [show, setShow] = useState(false);

  const [image, setImage] = useState();
  const [image_back, setImage_back] = useState();
  const [selfies, set_selfies] = useState();

  const takePhoto = async (type, set_image_any) => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'App needs access to your camera.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        console.log(granted, PermissionsAndroid.RESULTS.GRANTED);
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          launchCamera({}, response => {
            if (response.didCancel) {
              // console.log('User cancelled image picker');
            } else if (response.error) {
              console.log('ImagePicker Error: ', response.error);
            } else {
              // console.log(response)
              if (type === 'front') {
                recognizeText(response.assets[0].uri, 'front');
              } else if (type === 'back') {
                recognizeText(response.assets[0].uri, 'back');
              } else {
              }
              set_image_any(response.assets[0].uri);
            }
          });
        } else {
          console.log('Camera permission denied');
        }
      } catch (error) {
        console.warn(error);
      }
    } else {
      try {
        const result = await request(PERMISSIONS.IOS.CAMERA);
        if (result === 'granted') {
          launchCamera({}, response => {
            if (response.didCancel) {
              // console.log('User cancelled image picker');
            } else if (response.error) {
              console.log('ImagePicker Error: ', response.error);
            } else {
              // console.log(response)
              if (type === 'front') {
                recognizeText(response.assets[0].uri, 'front');
              } else if (type === 'back') {
                recognizeText(response.assets[0].uri, 'back');
              } else {
              }
              set_image_any(response.assets[0].uri);
            }
          });
        } else {
          console.log('Camera permission denied');
        }
      } catch (error) {
        console.warn(error);
      }
    }
  };

  const choosePhoto = type => {
    launchImageLibrary({}, response => {
      if (response.didCancel) {
        // console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        if (type === 'front') {
          // console.log('front')
          // getFiles()
          setImage(response.assets[0].uri);
        } else if (type === 'back') {
          setImage_back(response.assets[0].uri);
        } else {
          set_selfies(response.assets[0].uri);
        }
        // getFiles()
        recognizeText(response.assets[0].uri, type);
      }
    });
  };
  function saveAllImageToStorage() {
    if (image && image_back && selfies) {
      savePicture(image, 'front_cccd.jpg');
      savePicture(image_back, 'back_cccd.jpg');
      savePicture(selfies, 'selfies.jpg');
    }
  }
  function saveInfoToStorage() {
    // console.log('cccd_info')
    // console.log(cccd_info)
    set_cccd_info({
      cccd: cccd,
      date_of_birth: date.toLocaleDateString(),
      // "date_end": date_end.toLocaleDateString(),
      sex: sex,
      nationality: nationality,
      address_residence: address_residence,
      fullname: fullname,
      date_create: date_create.toLocaleDateString(),
      issued_by: issued_by,
      uri_front_image: image,
      uri_back_image: image_back,
      uri_selfies_image: selfies,
    });
    setDataLocal(
      {
        cccd: cccd,
        date_of_birth: date.toLocaleDateString(),
        // "date_end": date_end.toLocaleDateString(),
        sex: sex,
        nationality: nationality,
        address_residence: address_residence,
        fullname: fullname,
        date_create: date_create.toLocaleDateString(),
        issued_by: issued_by,
        uri_front_image: image,
        uri_back_image: image_back,
        uri_selfies_image: selfies,
      },
      'cccdInfo',
    );
    show_message(
      json_language['Thành công'][language],
      json_language['Thông tin đã lưu'][language],
    );
  }

  const recognizeText = async (imageUri, type) => {
    try {
      const result = await TextRecognition.recognize(imageUri);
      // console.log(result)
      let mat_truoc_cccd = {
        cccd: '',
        date: '',
        date_end: '',
        sex: '',
        nationality: '',
        address_residence: '',
        fullname: '',
        issued_by: '',
      };
      let mat_sau_cccd = {
        date: '',
      };
      if (type === 'front') {
        for (let i = 0; i < result.length; i++) {
          const regex_so_cccd = /\b[0-9 ]{12,13}\b/;
          const regex_day_month_year = /\d{2}\/\d{2}\/\d{4}/;
          const result_match = result[i].match(regex_day_month_year);
          if (result[i].match(regex_so_cccd)) {
            mat_truoc_cccd.cccd = result[i]
              .match(regex_so_cccd)[0]
              .replace(' ', '');
            set_cccd(mat_truoc_cccd.cccd);
          }
          if (result_match && !result[i].includes('Date of birth')) {
            mat_truoc_cccd.date_end = result_match[0];
            set_date_end(mat_truoc_cccd.date_end);
          }
          if (result_match && result[i].includes('Date of birth')) {
            mat_truoc_cccd.date = result_match[0];
            const parts = mat_truoc_cccd.date.split('/');
            const year = parseInt(parts[2].replace(/^O+/, ''));
            const month = parseInt(parts[1].replace(/^O+/, '')) - 1;
            const day = parseInt(parts[0].replace(/^O+/, ''));

            const date_new = new Date(year, month, day);
            set_date(date_new);
            mat_truoc_cccd.fullname = result[i + 1];
            set_fullname(mat_truoc_cccd.fullname);
            // console.log(result[i + 1])
          }
          if (result[i].includes('Place of residence')) {
            mat_truoc_cccd.address_residence = result[i]
              .split('Place of residence')[1]
              .replace('\n', ', ')
              .replace(':', '');
            set_address_residence(mat_truoc_cccd.address_residence);
          }
          if (result[i].includes('Sex')) {
            if (result[i].includes('Nam')) {
              mat_truoc_cccd.sex = 'Nam';
              set_sex(mat_truoc_cccd.sex);
            } else {
              mat_truoc_cccd.sex = 'Nữ';
              set_sex(mat_truoc_cccd.sex);
            }
          }
          if (result[i].includes('Nationality: ')) {
            mat_truoc_cccd.nationality = result[i].split('Nationality: ')[1];
            set_nationality(mat_truoc_cccd.nationality);
          }
        }
        // if (mat_truoc_cccd.cccd == "") {
        //     setImage(null)
        //     show_message(json_language["Lỗi"][language], "Không tìm thấy số CCCD. Vui lòng tải lại")
        // }
      } else if (type === 'back') {
        for (let i = 0; i < result.length; i++) {
          const regex_day_month_year = /\d{2}\/\d{2}\/\d{4}/;
          // if (result[i].match(regex_day_month_year)) {
          //     mat_sau_cccd.date = result[i].match(regex_day_month_year)[0]
          //     set_date_create(mat_sau_cccd.date)
          //     // console.log(mat_sau_cccd.date)
          // }
          if (result[i].includes('Date, month, year')) {
            mat_sau_cccd.date = result[i].split('Date, month, year')[1];
            if (mat_sau_cccd.date.includes('/')) {
              // console.log(mat_sau_cccd.date)
              const parts = mat_sau_cccd.date.split('/');
              // console.log(parts)
              const year = parseInt(parts[2].replace(/^O+/, ''));
              const month = parseInt(parts[1].replace(/^O+/, '')) - 1;
              const day = parseInt(parts[0].replace(/^O+/, ''));

              const date_new = new Date(year, month, day);
              // console.log(date_new)
              set_date_create(date_new);
            }
          }
        }
      }
      // console.log(mat_truoc_cccd)
      // console.log(mat_sau_cccd)
    } catch (err) {
      console.error(err);
    }
  };

  const savePicture = async (uri, filename) => {
    const folderPath = RNFS.ExternalDirectoryPath;
    // const fileName = "test1.jpg";
    const fileUri = `${folderPath}/${filename}`;
    // console.log(folderPath)
    if (!(await RNFS.exists(folderPath))) {
      // console.log('Saved')
      await RNFS.mkdir(folderPath, {intermediates: true});
    }

    await RNFS.copyFile(uri, fileUri);
  };
  const getFiles = async () => {
    const folderPath = RNFS.ExternalDirectoryPath;
    const files = await RNFS.readDir(folderPath);
    const filename = 'back_cccd.jpg';
    // set_selfies(`${folderPath}/${filename}`)
    // console.log("get")
    // console.log(files);
    // console.log(files.length);
    // console.log(files.find(emp => emp.path.includes(filename)))
    setImage(files.find(emp => emp.path.includes(filename)).path);
    // Hiển thị danh sách các file cho người dùng
  };
  const [show1, setShow1] = useState();
  const [loading, set_loading] = useState(false);
  const [validate, set_validate] = useState(true);
  const [show_picker_sex, set_show_picker_sex] = useState(false);
  const [show_picker_place, set_show_picker_place] = useState(false);
  const data_sex = [
    {key: 1, label: 'Nam'},
    {key: 2, label: 'Nữ'},
  ];
  function checkValidateAny(text, type) {
    if (!text || !type) {
      return -1;
    }
    if (type == 'phone10') {
      const pattern = /^[0-9]{10}$/; // Mẫu 10 chữ số từ 0-9
      const result = pattern.test(text);
      return result ? 1 : 0;
    } else if (type == 'phone+84') {
      const pattern = /^\+84[0-9]{9}$/; // Mẫu 10 chữ số từ 0-9
      const result = pattern.test(text);
      return result ? 1 : 0;
    } else if (type == 'serial') {
      const pattern = /^[0-9]{12}$/; // Mẫu 10 chữ số từ 0-9
      const result = pattern.test(text);
      return result ? 1 : 0;
    } else if (type == 'cccd') {
      const pattern = /^[0-9]{12}$/; // Mẫu 10 chữ số từ 0-9
      const result = pattern.test(text);
      return result ? 1 : 0;
    }
  }
  return (
    <View>
      <Modal
        animationType="slide-down"
        transparent={true}
        visible={open_show_cccd}
        onRequestClose={() => {
          set_open_show_cccd(false);
        }}>
        <Loading_animation
          onLoading={loading}
          onAction={json_language['Đang xử lý'][language]}
        />

        <StatusBar backgroundColor="rgba(0, 0, 0, 1)" />
        <SafeAreaView style={{backgroundColor: '#ffffff', width: '100%'}}>
          <TouchableOpacity
            onPress={() =>
              !open_info ? set_open_show_cccd(false) : set_open_info(false)
            }>
            <View style={{height: 40, justifyContent: 'center'}}>
              <Ionicons name="arrow-back" size={25} style={{marginLeft: 15}} />
            </View>
          </TouchableOpacity>
          <View style={{marginHorizontal: 10}}>
            <ScrollView>
              {open_info ? (
                <View style={{marginBottom: 20}}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginTop: 10,
                    }}>
                    <Text
                      style={{
                        width: '100%',
                        padding: 8,
                        color: 'black',
                        fontSize: 22,
                        textAlign: 'center',
                      }}>
                      {json_language['Thông tin cá nhân'][language]}
                    </Text>
                  </View>
                  <View style={{marginTop: 10}}>
                    <View
                      style={[
                        styles.Textinput2_row,
                        {
                          marginTop: 10,
                          borderColor:
                            !fullname && !validate ? 'red' : '#DDDFE1',
                        },
                      ]}>
                      <Text style={[styles.text_lable, styles.text_color]}>
                        {' '}
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
                        value={fullname}
                        multiline={true}
                        placeholder={json_language['Nhập họ tên'][language]}
                        placeholderTextColor="#cfcfcb"
                        onChangeText={text => set_fullname(text)}
                      />
                    </View>
                    {!fullname && !validate && (
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
                          marginTop: 10,
                          borderColor:
                            (cccd.length != 0 &&
                              checkValidateAny(cccd, 'cccd') != 1) ||
                            (checkValidateAny(cccd, 'cccd') != 1 && !validate)
                              ? 'red'
                              : '#DDDFE1',
                        },
                      ]}>
                      <Text style={[styles.text_lable, styles.text_color]}>
                        {json_language['Số CCCD'][language]}:{' '}
                      </Text>
                      <TextInput
                        style={{fontSize: 15, width: '60%', color: 'black'}}
                        autoCorrect={false}
                        maxLength={50}
                        autoCapitalized="words"
                        placeholder={
                          json_language['Nhập ID card/Passport'][language]
                        }
                        placeholderTextColor="#cfcfcb"
                        value={cccd}
                        onChangeText={text => set_cccd(text)}
                      />
                    </View>
                    {((cccd.length != 0 &&
                      checkValidateAny(cccd, 'cccd') != 1) ||
                      (checkValidateAny(cccd, 'cccd') != 1 && !validate)) && (
                      <View>
                        <Text style={{paddingLeft: 10, color: 'red'}}>
                          {cccd.length == 0
                            ? json_language[
                                'ID card/Passport không được bỏ trống'
                              ][language]
                            : json_language[
                                'ID card/Passport không đúng định dạng'
                              ][language]}
                        </Text>
                      </View>
                    )}

                    <TouchableOpacity
                      style={[
                        styles.Textinput2_row,
                        {marginTop: 10, width: '100%'},
                      ]}
                      onPress={() => {
                        show1 ? setShow1(false) : setShow1(true);
                        // console.log('djaskjd')
                      }}>
                      <Text style={[styles.text_lable, styles.text_color]}>
                        Ngày sinh:{' '}
                      </Text>
                      <View style={{width: 800, height: '100%'}}>
                        <Text style={{padding: 10, fontSize: 16}}>
                          {date ? date.toLocaleDateString() : ''}
                        </Text>
                      </View>

                      <DateTimePickerModal
                        isVisible={show1}
                        mode="date"
                        onConfirm={d => {
                          set_date(d);
                          setShow1(false);
                        }}
                        onCancel={() => setShow1(false)}
                      />
                    </TouchableOpacity>
                    {Platform.OS != 'ios' ? (
                      <View style={[styles.Textinput2_row, {marginTop: 10}]}>
                        <Text style={[styles.text_lable, , {color: '#153E7E'}]}>
                          {json_language['Giới tính'][language]}:{' '}
                        </Text>
                        <Picker
                          style={{width: '70%'}}
                          selectedValue={sex}
                          onValueChange={(itemValue, itemIndex) =>
                            set_sex(itemValue)
                          }>
                          <Picker.Item
                            label={json_language.Nam[language]}
                            value="Nam"
                          />
                          <Picker.Item
                            label={json_language['Nữ'][language]}
                            value="Nữ"
                          />
                        </Picker>
                      </View>
                    ) : (
                      <TouchableOpacity
                        style={[
                          styles.Textinput2_row,
                          {marginTop: 10, width: '100%'},
                        ]}
                        onPress={() => set_show_picker_sex(true)}>
                        <View
                          style={{
                            width: '40%',
                            flexDirection: 'row',
                            alignItems: 'center',
                          }}>
                          <Text style={[styles.text_lable, {color: '#000000'}]}>
                            {json_language['Giới tính'][language]}:{' '}
                          </Text>
                          <Text style={{padding: 10, fontSize: 17}}>{sex}</Text>
                        </View>
                        <View
                          style={{
                            width: '55%',
                            justifyContent: 'flex-end',
                            alignItems: 'flex-end',
                          }}>
                          <View style={{justifyContent: 'flex-end'}}>
                            <Ionicons
                              name="ios-open-outline"
                              size={25}
                              style={{marginLeft: 15}}
                            />
                          </View>
                        </View>
                        <Modal visible={show_picker_sex} transparent={true}>
                          <View
                            style={{
                              height: '100%',
                              backgroundColor: 'rgba(0,0,0,0.3)',
                              justifyContent: 'flex-end',
                            }}>
                            <View
                              style={{height: '100%', marginHorizontal: 10}}>
                              <View
                                style={{
                                  height: '90%',
                                  width: '100%',
                                  justifyContent: 'flex-end',
                                }}>
                                <View
                                  style={{
                                    height:
                                      Dimensions.get('window').width * 0.545,
                                    backgroundColor: '#ffffff',
                                    width: '100%',
                                    borderRadius: 10,
                                  }}>
                                  <Picker
                                    style={{
                                      width: '100%',
                                      height: 170,
                                      padding: 0,
                                    }}
                                    selectedValue={sex}
                                    onValueChange={itemValue =>
                                      set_sex(itemValue)
                                    }>
                                    <Picker.Item
                                      label={json_language.Nam[language]}
                                      value="Nam"
                                    />
                                    <Picker.Item
                                      label={json_language['Nữ'][language]}
                                      value="Nữ"
                                    />
                                  </Picker>

                                  <View
                                    style={{
                                      height:
                                        Dimensions.get('window').width * 0.545,
                                    }}
                                  />
                                </View>
                              </View>
                              <View style={{height: '10%'}}>
                                <View style={{width: '100%'}}>
                                  <View
                                    style={{
                                      marginTop: 8,
                                      backgroundColor: '#ffffff',
                                      borderRadius: 10,
                                    }}>
                                    <TouchableOpacity
                                      style={{marginHorizontal: 50}}
                                      onPress={() =>
                                        set_show_picker_sex(false)
                                      }>
                                      <Text
                                        style={{
                                          padding: 10,
                                          textAlign: 'center',
                                          fontSize: 22,
                                          color: '#3399FF',
                                          fontWeight: 500,
                                        }}>
                                        Cancel
                                      </Text>
                                    </TouchableOpacity>
                                  </View>
                                </View>
                              </View>
                            </View>
                          </View>
                        </Modal>
                        {/* <ModalPicker
                                              data={data_sex}
                                              initValue="Nam"
                                              onChange={(options) => set_sex(options)}
                                          >
                                              <Text>
                                                  {sex || "Giới tính"}
                                              </Text>
                                          </ModalPicker> */}
                      </TouchableOpacity>
                    )}
                    <View
                      style={[
                        styles.Textinput2_row,
                        {
                          marginTop: 10,
                          borderColor:
                            !address_residence && !validate ? 'red' : '#DDDFE1',
                        },
                      ]}>
                      <Text style={[styles.text_lable, styles.text_color]}>
                        {json_language['Địa chỉ'][language]}:{' '}
                      </Text>
                      <TextInput
                        style={{
                          fontSize: 15,
                          width: '60%',
                          paddingBottom: 4,
                          color: 'black',
                        }}
                        autoCorrect={false}
                        maxLength={100}
                        multiline={true}
                        autoCapitalized="words"
                        placeholder={json_language['Nhập địa chỉ'][language]}
                        placeholderTextColor="#cfcfcb"
                        value={address_residence}
                        onChangeText={text => set_address_residence(text)}
                      />
                    </View>
                    {!address_residence && !validate && (
                      <View>
                        <Text style={{paddingLeft: 10, color: 'red'}}>
                          {
                            json_language['Địa chỉ không được bỏ trống'][
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
                          marginTop: 10,
                          borderColor:
                            !nationality && !validate ? 'red' : '#DDDFE1',
                        },
                      ]}>
                      <Text style={[styles.text_lable, styles.text_color]}>
                        {json_language['Quốc tịch'][language]}:{' '}
                      </Text>
                      <TextInput
                        style={{fontSize: 15, width: '60%', color: 'black'}}
                        autoCorrect={false}
                        maxLength={50}
                        autoCapitalized="words"
                        value={nationality}
                        placeholder={json_language['Nhập quốc tịch'][language]}
                        placeholderTextColor="#cfcfcb"
                        onChangeText={text => set_nationality(text)}
                      />
                    </View>
                    {!nationality && !validate && (
                      <View>
                        <Text style={{paddingLeft: 10, color: 'red'}}>
                          {
                            json_language['Quốc tịch không được bỏ trống'][
                              language
                            ]
                          }
                        </Text>
                      </View>
                    )}
                    {/* <View style={[styles.Textinput2_row, { marginTop: 10 }]}>
                                        <Text style={[styles.text_lable, styles.text_color]}>Ngày hết hạn: </Text>
                                        <TouchableOpacity style={{ width: 800, height: '100%' }}
                                            onPress={() => showDatepicker()}>
                                            <TextInput style={{ color: 'black', fontSize: 16 }}
                                                value={date_end.toLocaleDateString()}
                                                editable={false}
                                            />
                                        </TouchableOpacity>
                                        {show && (
                                            <DateTimePicker
                                                testID="dateTimePicker"
                                                value={date_end}
                                                mode={mode}
                                                is24Hour={true}
                                                display="default"
                                                onChange={(event, selectedDate) => onChange(event, selectedDate, set_date_end)}
                                            />
                                        )}

                                    </View> */}
                    <TouchableOpacity
                      style={[styles.Textinput2_row, {marginTop: 10}]}
                      onPress={() => setShow(true)}>
                      <Text style={[styles.text_lable, styles.text_color]}>
                        {json_language['Ngày phát hành'][language]}:{' '}
                      </Text>
                      <View style={{width: 800, height: '100%'}}>
                        <Text style={{padding: 10, fontSize: 16}}>
                          {date_create ? date_create.toLocaleDateString() : ''}
                        </Text>
                      </View>

                      <DateTimePickerModal
                        isVisible={show}
                        mode="date"
                        onConfirm={d => {
                          set_date_create(d);
                          setShow(false);
                        }}
                        onCancel={() => setShow(false)}
                      />
                    </TouchableOpacity>
                    {Platform.OS !== 'ios' ? (
                      <View style={[styles.Textinput2_row, {marginTop: 10}]}>
                        <Text style={[styles.text_lable, , {color: '#153E7E'}]}>
                          {json_language['Nơi cấp'][language]}:{' '}
                        </Text>
                        <Picker
                          style={{width: '70%', flexWrap: 'wrap'}}
                          selectedValue={issued_by}
                          onValueChange={itemValue => set_issued_by(itemValue)}>
                          <Picker.Item
                            label="Cục Cảnh sát quản lý hành chính về trật tự xã hội"
                            value="Cục Cảnh sát quản lý hành chính về trật tự xã hội"
                          />
                          <Picker.Item
                            label="Cục Cảnh sát ĐKQL cư trú và DLQG về dân cư"
                            value="Cục Cảnh sát ĐKQL cư trú và DLQG về dân cư"
                          />
                        </Picker>
                      </View>
                    ) : (
                      <TouchableOpacity
                        style={[styles.Textinput2_row, {marginTop: 10}]}
                        onPress={() => set_show_picker_place(true)}>
                        <Text style={[styles.text_lable, {color: '#000000'}]}>
                          {json_language['Nơi cấp'][language]}:{' '}
                        </Text>
                        <Text
                          style={{
                            padding: 10,
                            fontSize: 17,
                            flexWrap: 'wrap-reverse',
                            width: '80%',
                          }}>
                          {issued_by}
                        </Text>
                        <View
                          style={{
                            width: '60%',
                            justifyContent: 'flex-end',
                            alignItems: 'flex-end',
                          }}>
                          <View style={{justifyContent: 'flex-end'}}>
                            <Ionicons
                              name="ios-open-outline"
                              size={25}
                              style={{marginLeft: 15}}
                            />
                          </View>
                        </View>
                        <Modal visible={show_picker_place} transparent={true}>
                          <View
                            style={{
                              height: '100%',
                              backgroundColor: 'rgba(0,0,0,0.3)',
                              justifyContent: 'flex-end',
                            }}>
                            <View
                              style={{height: '100%', marginHorizontal: 10}}>
                              <View
                                style={{
                                  height: '90%',
                                  width: '100%',
                                  justifyContent: 'flex-end',
                                }}>
                                <View
                                  style={{
                                    height:
                                      Dimensions.get('window').width * 0.545,
                                    backgroundColor: '#ffffff',
                                    width: '100%',
                                    borderRadius: 10,
                                  }}>
                                  <Picker
                                    style={{
                                      width: '100%',
                                      height:
                                        Dimensions.get('window').width * 0.545,
                                    }}
                                    selectedValue={issued_by}
                                    onValueChange={itemValue =>
                                      set_issued_by(itemValue)
                                    }>
                                    <Picker.Item
                                      label="Cục Cảnh sát quản lý hành chính về trật tự xã hội"
                                      value="Cục Cảnh sát quản lý hành chính về trật tự xã hội"
                                    />
                                    <Picker.Item
                                      label="Cục Cảnh sát ĐKQL cư trú và DLQG về dân cư"
                                      value="Cục Cảnh sát ĐKQL cư trú và DLQG về dân cư"
                                    />
                                  </Picker>

                                  <View
                                    style={{
                                      height:
                                        Dimensions.get('window').width * 0.545,
                                    }}
                                  />
                                </View>
                              </View>
                              <View style={{height: '10%'}}>
                                <View style={{width: '100%'}}>
                                  <View
                                    style={{
                                      marginTop: 8,
                                      backgroundColor: '#ffffff',
                                      borderRadius: 10,
                                    }}>
                                    <TouchableOpacity
                                      style={{marginHorizontal: 50}}
                                      onPress={() =>
                                        set_show_picker_place(false)
                                      }>
                                      <Text
                                        style={{
                                          padding: 10,
                                          textAlign: 'center',
                                          fontSize: 22,
                                          color: '#3399FF',
                                          fontWeight: 500,
                                        }}>
                                        Cancel
                                      </Text>
                                    </TouchableOpacity>
                                  </View>
                                </View>
                              </View>
                            </View>
                          </View>
                        </Modal>
                      </TouchableOpacity>
                    )}

                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginTop: 30,
                        justifyContent: 'flex-end',
                      }}>
                      <TouchableOpacity
                        style={[
                          {
                            padding: 8,
                            borderWidth: 1,
                            borderColor: '#646060',
                            width: 100,
                            backgroundColor: '#F75D59',
                          },
                          styles.shadow,
                        ]}
                        onPress={() => {
                          set_open_info(false);
                          set_open_show_cccd(false);
                        }}>
                        <Text
                          style={{
                            textAlign: 'center',
                            fontSize: 17,
                            color: 'black',
                          }}>
                          {json_language['Hủy'][language]}
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
                          },
                          styles.shadow,
                        ]}
                        onPress={() => {
                          if (
                            !fullname ||
                            !cccd ||
                            !address_residence ||
                            !nationality
                          ) {
                            set_validate(false);
                            return;
                          }
                          //lưu ảnh vào android data
                          set_loading(true);
                          setTimeout(() => {
                            saveAllImageToStorage();
                            saveInfoToStorage();
                            set_loading(false);
                            set_open_info(false);
                            set_open_show_cccd(false);
                          }, 2000);
                          //lưu thông tin và đường dẫn vào local storage
                        }}>
                        <Text
                          style={{
                            textAlign: 'center',
                            fontSize: 17,
                            color: 'black',
                          }}>
                          {json_language['Xác nhận'][language]}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ) : (
                <View style={{}}>
                  <View style={{}}>
                    <Text
                      style={[
                        styles.text_title_setting_open,
                        {marginLeft: 0, marginBottom: 0},
                      ]}>
                      {json_language['Xác thực thông tin'][language]}
                    </Text>
                  </View>
                  <View>
                    <Text
                      style={{
                        fontSize: 16,
                        color: 'black',
                        padding: 8,
                        marginTop: 0,
                      }}>
                      {json_language['CCCD mặt trước'][language]}
                    </Text>
                    <TouchableOpacity
                      onPress={() => choosePhoto('front')}
                      style={[{borderRadius: 20}, styles.center]}>
                      {!image ? (
                        <Image
                          source={require(img + 'icon/front_cccd.jpg')}
                          style={{
                            width: '100%',
                            height: Dimensions.get('window').width * 0.545,
                            borderRadius: 20,
                          }}
                        />
                      ) : (
                        <Image
                          source={{uri: 'file://' + image}}
                          style={{
                            width: '100%',
                            height: Dimensions.get('window').width * 0.545,
                            borderRadius: 20,
                          }}
                        />
                      )}
                    </TouchableOpacity>
                  </View>
                  <View>
                    <Text
                      style={{
                        fontSize: 16,
                        color: 'black',
                        padding: 8,
                        marginTop: 10,
                      }}>
                      {json_language['CCCD mặt sau'][language]}
                    </Text>
                    <TouchableOpacity
                      onPress={() => choosePhoto('back')}
                      style={{borderRadius: 20}}>
                      {!image_back ? (
                        <Image
                          source={require(img + 'icon/back_cccd.jpg')}
                          style={{
                            width: '100%',
                            height: Dimensions.get('window').width * 0.545,
                            borderRadius: 20,
                          }}
                        />
                      ) : (
                        <Image
                          source={{uri: image_back}}
                          style={{
                            width: '100%',
                            height: Dimensions.get('window').width * 0.545,
                            borderRadius: 20,
                          }}
                        />
                      )}
                    </TouchableOpacity>
                  </View>
                  <View>
                    <Text
                      style={{
                        fontSize: 16,
                        color: 'black',
                        padding: 8,
                        marginTop: 10,
                      }}>
                      {json_language['Ảnh chân dung'][language]}
                    </Text>
                    <TouchableOpacity
                      onPress={() => takePhoto('selfies', set_selfies)}
                      style={{borderRadius: 20}}>
                      {!selfies ? (
                        <Image
                          source={require(img + 'icon/selfies.jpg')}
                          style={{
                            width: '100%',
                            height: Dimensions.get('window').width * 0.545,
                            borderRadius: 20,
                          }}
                        />
                      ) : (
                        <Image
                          source={{uri: selfies}}
                          style={{
                            width: '100%',
                            height: Dimensions.get('window').width * 0.545,
                            borderRadius: 20,
                          }}
                        />
                      )}
                    </TouchableOpacity>
                  </View>

                  <View
                    style={{
                      flexDirection: 'row',
                      marginTop: 20,
                      justifyContent: 'flex-end',
                      marginBottom: 30,
                      height: 100,
                    }}>
                    <TouchableOpacity
                      style={[
                        {
                          padding: 8,
                          borderWidth: 1,
                          borderColor: '#646060',
                          width: 100,
                          backgroundColor: '#F75D59',
                          height: 40,
                        },
                        styles.shadow,
                      ]}
                      onPress={() => set_open_show_cccd(false)}>
                      <Text
                        style={{
                          textAlign: 'center',
                          fontSize: 17,
                          color: 'black',
                        }}>
                        {json_language['Hủy'][language]}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        {
                          padding: 8,
                          borderWidth: 1,
                          borderColor: '#646060',
                          width: 100,
                          height: 40,
                          marginLeft: 15,
                          marginRight: 10,
                          backgroundColor: '#82CAFA',
                        },
                        styles.shadow,
                      ]}
                      onPress={
                        image && image_back
                          ? () => {
                              set_loading(true);
                              set_validate(true);
                              setTimeout(() => {
                                set_loading(false);
                                set_open_info(true);
                              }, 1000);
                            }
                          : () =>
                              show_message(
                                json_language['Lỗi'][language],
                                json_language['Vui lòng tải đầy đủ ảnh'][
                                  language
                                ],
                              )
                      }>
                      <Text
                        style={{
                          textAlign: 'center',
                          fontSize: 17,
                          color: 'black',
                        }}>
                        {json_language['Tiếp tục'][language]}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </ScrollView>
          </View>
        </SafeAreaView>
      </Modal>
    </View>
  );
}
export default memo(Show_TT);
