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
} from 'react-native';
import {PermissionsAndroid} from 'react-native';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';

import styles from '../../styles';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
// AntDesign.loadFont();
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import TextRecognition from 'react-native-text-recognition';
import RNFS from 'react-native-fs';
import TakePhotoCCCD from './TakePhotoCCCD';
import json_language from '../../json/language.json';
import Fill_info_cccd from './fill_info_cccd';
import CameraFaceDetection from './CameraFaceDetection';
import StepIndicator from 'react-native-step-indicator';
import {stepIndicatorStyles} from '../common';
import ImageResizer from 'react-native-image-resizer';
import Select_type_take_photo from './select_type_take_photo';
import Select_type_take_photo_black from './select_type_take_photo_black';
import AlertTwoButtom from '../component_product/AlertTwoButtom';
const img = '../../img/';
const padding_screens =
  Dimensions.get('window').width > 480 && Dimensions.get('window').height > 480
    ? 10
    : 0;
const step = 1;
function Register({
  cccd_info_ss,
  set_cccd_info_ss,
  photo,
  set_photo,
  listPhoneSim,
  set_listPhoneSim,
  open_fill_info_cccd,
  set_open_fill_info_cccd,
  total_sim_sold_today,
  set_total_sim_sold_today,
  isConnected,
  setListDataCustomerSync,
  listDataCustomerSync,
  set_open_register_uninternet,
  listDataCustomerTotal,
  setListDataCustomerTotal,
  listDataCustomerUnsync,
  setListDataCustomerUnsync,
  list_goicuoc,
  employees,
  screenHeight,
  screenWidth,
  json_language,
  language,
  open_register,
  set_open_register,
  data_a_sim,
}) {
  const takePhoto = async (type, set_image_any) => {
    try {
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
          // console.log(granted, PermissionsAndroid.RESULTS.GRANTED)
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
                  set_photo({...photo, image: response.assets[0].uri});
                } else if (type === 'back') {
                  recognizeText(response.assets[0].uri, 'back');
                  set_photo({...photo, image_back: response.assets[0].uri});
                } else {
                  set_photo({...photo, selfies: response.assets[0].uri});
                }
              }
              set_open_select_type(false);
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
                  set_photo({...photo, image: response.assets[0].uri});
                } else if (type === 'back') {
                  recognizeText(response.assets[0].uri, 'back');
                  set_photo({...photo, image_back: response.assets[0].uri});
                } else {
                  if (
                    response &&
                    response.assets &&
                    response.assets.length > 0
                  ) {
                    set_photo({...photo, selfies: response.assets[0].uri});
                  } else {
                    set_status('Fail!!!');
                    set_message('No camera is found');
                    setTimeout(() => {
                      set_open_alert();
                    }, 0);
                  }
                }
                set_open_select_type(false);
              }
            });
          } else {
            console.log('Camera permission denied');
          }
        } catch (error) {
          console.warn(error);
        }
      }
    } catch (err) {}
  };
  const check_permission = async () => {
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
        // console.log(granted, PermissionsAndroid.RESULTS.GRANTED)
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          set_open_camera_dectection(true);
        } else {
          console.log('Camera permission denied');
        }
      } catch (error) {
        console.warn(error);
      }
      check(PERMISSIONS.ANDROID.CAMERA)
        .then(result => {
          if (result === RESULTS.GRANTED) {
            console.log('Camera permission already granted');
          } else {
            requestCameraPermission();
          }
        })
        .catch(error => {
          console.error('Failed to check camera permission:', error);
        });
    } else {
      try {
        const result = await request(PERMISSIONS.IOS.CAMERA);
        if (result === 'granted') {
          set_open_camera_dectection(true);
        } else {
          console.log('Camera permission denied');
        }
      } catch (error) {
        console.warn(error);
      }
    }
  };

  const choosePhoto = (type, set_image_any) => {
    launchImageLibrary({}, response => {
      if (response.didCancel) {
        // console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        // console.log(response)
        if (type === 'front') {
          recognizeText(response.assets[0].uri, 'front');
          set_photo({...photo, image: response.assets[0].uri});
        } else if (type === 'back') {
          recognizeText(response.assets[0].uri, 'back');
          set_photo({...photo, image_back: response.assets[0].uri});
        } else {
          set_photo({...photo, selfies: response.assets[0].uri});
        }
      }
      set_open_select_type(false);
    });
  };
  function saveAllImageToStorage() {
    if (photo.image && photo.image_back && photo.selfies) {
      savePicture(photo.image, 'front_cccd.jpg');
      savePicture(photo.image_back, 'back_cccd.jpg');
      savePicture(photo.selfies, 'selfies.jpg');
    }
  }
  function saveInfoToStorage() {
    setDataLocal(cccd_info_ss, 'cccdInfo');
  }
  //hàm xóa dữ liệu sim cũ
  const deleteURI = async uri => {
    try {
      await RNFS.unlink(uri);
      // console.log('URI đã được xóa thành công');
    } catch (error) {
      // console.log('Đã xảy ra lỗi khi xóa URI:', error);
    }
  };
  const [cccd, set_cccd] = useState(cccd_info_ss.idNumber);
  const [date, set_date] = useState(new Date());
  const [date_end, set_date_end] = useState(new Date());
  const [sex, set_sex] = useState('Nam');
  const [address_residence, set_address_residence] = useState('');
  const [fullname, set_fullname] = useState();
  const [date_create, set_date_create] = useState(new Date());
  const reduceImageResolution = async (imageUri, type) => {
    try {
      const resizedImage = await ImageResizer.createResizedImage(
        imageUri,
        500, // Độ rộng mới mong muốn
        500, // Chiều cao mới mong muốn
        'JPEG', // Định dạng hình ảnh (JPEG, PNG, ...)
        50, // Chất lượng hình ảnh mới (0-100)
        0, // Góc xoay hình ảnh (0, 90, 180, 270)
      );
      await deleteURI(imageUri);
      if (type == 'front') {
        set_photo({...photo, image: resizedImage.uri});
      } else if (type == 'front') {
        set_photo({...photo, image_back: resizedImage.uri});
      } else {
        set_photo({...photo, selfies: resizedImage.uri});
      }
    } catch (error) {
      console.error('Lỗi khi giảm độ phân giải hình ảnh:', error);
    }
  };
  const recognizeText = async (imageUri, type) => {
    try {
      const result = await TextRecognition.recognize(imageUri);
      // console.log(result)
      let cccd = cccd_info_ss;
      if (type === 'front') {
        for (let i = 0; i < result.length; i++) {
          const regex_so_cccd = /\b[0-9 ]{12,13}\b/;
          const regex_day_month_year = /\d{2}\/\d{2}\/\d{4}/;
          const result_match = result[i].match(regex_day_month_year);
          if (result[i].match(regex_so_cccd)) {
            cccd.idNumber = result[i].match(regex_so_cccd)[0].replace(' ', '');
            // set_cccd(cccd.idNumber)
          }
          if (result_match && !result[i].includes('Date of birth')) {
            cccd.date_end = result_match[0];
            const parts = cccd.date_end.split('/');
            const year = parseInt(parts[2].replace(/^O+/, ''));
            const month = parseInt(parts[1].replace(/^O+/, '')) - 1;
            const day = parseInt(parts[0].replace(/^O+/, ''));
            const date_new = new Date(year, month, day + 1);
            date_new.setUTCHours(7);
            date_new.setUTCMinutes(0);
            date_new.setUTCSeconds(0);
            date_new.setUTCMilliseconds(0);
            cccd.date_end = date_new;
            // set_date_end(date_new)
          }
          if (
            result_match &&
            (result[i].includes('Date of birth') ||
              (i > 0 && result[i - 1].includes('Date of birth')))
          ) {
            cccd.birthday = result_match[0];
            const parts = cccd.birthday.split('/');
            const year = parseInt(parts[2].replace(/^O+/, ''));
            const month = parseInt(parts[1].replace(/^O+/, '')) - 1;
            const day = parseInt(parts[0].replace(/^O+/, ''));
            // console.log(parts)
            const date_new = new Date(year, month, day + 1);
            date_new.setUTCHours(7);
            date_new.setUTCMinutes(0);
            date_new.setUTCSeconds(0);
            date_new.setUTCMilliseconds(0);
            // console.log('in', date_new)
            cccd.fullName = result[i + 1];
            // set_fullname(cccd.fullName)
            // set_date(date_new)
            // console.log(date_new)
            cccd.birthday = date_new;
          }
          if (result[i].includes('Place of residence')) {
            cccd.address = result[i]
              .split('Place of residence')[1]
              .replace('\n', ', ')
              .replace(':', '');
            // set_address_residence(cccd.address)
          }
          if (result[i].includes('Sex')) {
            if (result[i].includes('Nam')) {
              cccd.gender = '1';
            } else {
              cccd.gender = '0';
            }
            // set_sex(cccd.gender)
          }
          if (result[i].includes('Nationality: ')) {
            cccd.nationality = result[i].split('Nationality: ')[1];
          }
        }
        const resizedImage = await ImageResizer.createResizedImage(
          imageUri,
          500, // Độ rộng mới mong muốn
          500, // Chiều cao mới mong muốn
          'JPEG', // Định dạng hình ảnh (JPEG, PNG, ...)
          50, // Chất lượng hình ảnh mới (0-100)
          0, // Góc xoay hình ảnh (0, 90, 180, 270)
        );
        await deleteURI(imageUri);
        set_photo({...photo, image: resizedImage.uri});
        cccd.pathFileFront = resizedImage.uri;
      } else if (type === 'back') {
        for (let i = 0; i < result.length; i++) {
          const regex_day_month_year = /\d{2}\/\d{2}\/\d{4}/;
          if (result[i].match(regex_day_month_year)) {
            cccd.dateOfIssue = result[i].match(regex_day_month_year)[0];
            const parts = cccd.dateOfIssue.split('/');
            const year = parseInt(parts[2].replace(/^O+/, ''));
            const month = parseInt(parts[1].replace(/^O+/, '')) - 1;
            const day = parseInt(parts[0].replace(/^O+/, ''));
            const date_new = new Date(year, month, day + 1);
            date_new.setUTCHours(7);
            date_new.setUTCMinutes(0);
            date_new.setUTCSeconds(0);
            date_new.setUTCMilliseconds(0);
            // set_date_create(date_new)
            cccd.dateOfIssue = date_new;
            // set_date_create(mat_sau_cccd.date)
          } else if (result[i].includes('Date, month, year')) {
            cccd.dateOfIssue = result[i].split('Date, month, year')[1];
            // console.log('in')
            // console.log(cccd.dateOfIssue)
            if (cccd.dateOfIssue.includes('/')) {
              const parts = cccd.dateOfIssue.split('/');
              // console.log(parts)
              const year = parseInt(parts[2].replace(/^O+/, ''));
              const month = parseInt(parts[1].replace(/^O+/, '')) - 1;
              const day = parseInt(parts[0].replace(/^O+/, ''));
              const date_new = new Date(year, month, day + 1);
              date_new.setUTCHours(7);
              date_new.setUTCMinutes(0);
              date_new.setUTCSeconds(0);
              date_new.setUTCMilliseconds(0);
              // set_date_create(date_new)
              // console.log(date_new, year, month, day)
            }
          }
        }
        const resizedImage = await ImageResizer.createResizedImage(
          imageUri,
          500, // Độ rộng mới mong muốn
          500, // Chiều cao mới mong muốn
          'JPEG', // Định dạng hình ảnh (JPEG, PNG, ...)
          50, // Chất lượng hình ảnh mới (0-100)
          0, // Góc xoay hình ảnh (0, 90, 180, 270)
        );
        await deleteURI(imageUri);
        set_photo({...photo, image_back: resizedImage.uri});
        cccd.pathFileBack = resizedImage.uri;
      }
      cccd.pathFilePortrait = photo.selfies;
      // console.log(photo.selfies)
      // console.log("cccd")
      // console.log(cccd)
      set_cccd_info_ss(cccd);
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
  // const getFiles = async () => {
  //     const folderPath = RNFS.ExternalDirectoryPath;
  //     const files = await RNFS.readDir(folderPath);
  //     const filename = "back_cccd.jpg"
  //     // set_selfies(`${folderPath}/${filename}`)
  //     // console.log("get")
  //     // console.log(files);
  //     // console.log(files.length);
  //     // console.log(files.find(emp => emp.path.includes(filename)))
  //     setImage(files.find(emp => emp.path.includes(filename)).path)
  //     // Hiển thị danh sách các file cho người dùng
  // };
  const [open_select_type, set_open_select_type] = useState(false);
  const [select_type_take_photo, set_select_type_take_photo] =
    useState('Library');
  const [type, set_type] = useState('selfies');
  const [loading, set_loading] = useState(false);
  const [open_take_photo_cccd, set_open_take_photo_cccd] = useState(false);
  const [open_camera_dectection, set_open_camera_dectection] = useState(false);

  const [open_alert, set_open_alert] = useState(false);
  const [color, set_color] = useState('#EAC117');
  const [message, set_message] = useState('');
  const [status, set_status] = useState('');
  return (
    <View>
      <Modal
        animationType="slide-down"
        transparent={false}
        visible={open_register}
        onRequestClose={() => {
          set_open_register(false);
          if (Platform.OS == 'ios') {
            set_open_register_uninternet(true);
          }
        }}>
        <StatusBar backgroundColor="rgba(0, 0, 0, 1)" />
        <AlertTwoButtom
          open_alert={open_alert}
          set_open_alert={set_open_alert}
          type={'thongbao'}
          language={language}
          color={color}
          status={status}
          message={message}
        />
        <Select_type_take_photo
          type={type}
          takePhoto={takePhoto}
          choosePhoto={choosePhoto}
          language={language}
          open_select_type={open_select_type}
          set_open_select_type={set_open_select_type}
          set_select_type_take_photo={set_select_type_take_photo}
        />

        {/* <Select_type_take_photo_black type={type} takePhoto={takePhoto} choosePhoto={choosePhoto}
                    language={language} open_select_type={open_select_type}
                    set_open_select_type={set_open_select_type} set_select_type_take_photo={set_select_type_take_photo} /> */}

        {open_camera_dectection && (
          <CameraFaceDetection
            open_camera_dectection={open_camera_dectection}
            set_open_camera_dectection={set_open_camera_dectection}
            photo={photo}
            set_photo={set_photo}
            language={language}
            deleteURI={deleteURI}
          />
        )}

        {open_take_photo_cccd && (
          <TakePhotoCCCD
            set_open_fill_info_cccd={set_open_fill_info_cccd}
            language={language}
            open_take_photo_cccd={open_take_photo_cccd}
            set_open_take_photo_cccd={set_open_take_photo_cccd}
            takePhoto={takePhoto}
            choosePhoto={choosePhoto}
            cccd_info_ss={cccd_info_ss}
            set_cccd_info_ss={set_cccd_info_ss}
            open_fill_info_cccd={open_fill_info_cccd}
            isConnected={isConnected}
            listDataCustomerSync={listDataCustomerSync}
            setListDataCustomerSync={setListDataCustomerSync}
            set_total_sim_sold_today={set_total_sim_sold_today}
            total_sim_sold_today={total_sim_sold_today}
            set_open_register_uninternet={set_open_register_uninternet}
            list_goicuoc={list_goicuoc}
            cccd={cccd}
            set_cccd={set_cccd}
            date={date}
            set_date={set_date}
            date_end={date_end}
            set_date_end={set_date_end}
            sex={sex}
            set_sex={set_sex}
            address_residence={address_residence}
            set_address_residence={set_address_residence}
            fullname={fullname}
            set_fullname={set_fullname}
            date_create={date_create}
            set_date_create={set_date_create}
            data_a_sim={data_a_sim}
            setListDataCustomerUnsync={setListDataCustomerUnsync}
            listDataCustomerUnsync={listDataCustomerUnsync}
            listDataCustomerTotal={listDataCustomerTotal}
            setListDataCustomerTotal={setListDataCustomerTotal}
            set_open_register={set_open_register}
            set_photo={set_photo}
            photo={photo}
            listPhoneSim={listPhoneSim}
            set_listPhoneSim={set_listPhoneSim}
            open_select_type={open_select_type}
            set_open_select_type={set_open_select_type}
          />
        )}
        {/* <Fill_info_cccd isConnected={isConnected} listDataCustomerSync={listDataCustomerSync} setListDataCustomerSync={setListDataCustomerSync}
                    set_total_sim_sold_today={set_total_sim_sold_today} total_sim_sold_today={total_sim_sold_today}
                    set_open_register_uninternet={set_open_register_uninternet}
                    list_goicuoc={list_goicuoc} open_fill_info_cccd={open_fill_info_cccd} set_open_fill_info_cccd={set_open_fill_info_cccd}
                    language={language} cccd_info_ss={cccd_info_ss} set_cccd_info_ss={set_cccd_info_ss} cccd={cccd} set_cccd={set_cccd} date={date} set_date={set_date} date_end={date_end} set_date_end={set_date_end} sex={sex} set_sex={set_sex} address_residence={address_residence} set_address_residence={set_address_residence}
                    fullname={fullname} set_fullname={set_fullname} date_create={date_create} set_date_create={set_date_create}
                    set_open_take_photo_cccd={set_open_take_photo_cccd} set_open_register={set_open_register}

                    data_a_sim={data_a_sim} setListDataCustomerUnsync={setListDataCustomerUnsync} listDataCustomerUnsync={listDataCustomerUnsync}
                    listDataCustomerTotal={listDataCustomerTotal} setListDataCustomerTotal={setListDataCustomerTotal}
                    set_selfies={set_selfies} setImage_back={setImage_back} setImage={setImage}

                /> */}
        <SafeAreaView style={{backgroundColor: 'white', height: '100%'}}>
          <ScrollView>
            <View
              style={{
                borderBottomColor: '#6D7B8D',
                borderBottomWidth: 1,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                style={{width: '10%', marginLeft: 10, alignItems: 'center'}}
                onPress={() => {
                  set_open_register(false);
                  if (Platform.OS == 'ios') {
                    set_open_register_uninternet(true);
                  }
                }}>
                <Ionicons name="arrow-back" size={26} color="#151B8D" />
              </TouchableOpacity>
              <View style={{width: '90%'}}>
                <Text
                  style={{
                    fontWeight: 500,
                    borderRadius: 5,
                    padding: 15,
                    color: '#151B8D',
                    fontSize: 18,
                  }}>
                  {json_language['Xác minh khuôn mặt'][language]}
                </Text>
              </View>
            </View>
            <View
              style={[
                styles.stepIndicatorContainer,
                {marginTop: 10 + padding_screens},
              ]}>
              <StepIndicator
                customStyles={stepIndicatorStyles}
                stepCount={4}
                direction="horizontal"
                currentPosition={1}
                onPress={index => {
                  if (index == 2 && photo.selfies) {
                    set_open_take_photo_cccd(true);
                  } else if (index == 0) {
                    set_open_register(false);
                    if (Platform.OS == 'ios') {
                      set_open_register_uninternet(true);
                    }
                  }
                  // Xử lý logic khi nhấp vào từng bước
                }}
                // labels={dummyData.map((_, index) => '')}
              />
            </View>
            <View
              style={{
                flexDirection: 'row',
                marginTop: 0,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <View style={{width: '90%'}}>
                <Text
                  style={{
                    fontWeight: 500,
                    marginTop: 0,
                    borderRadius: 5,
                    padding: 10,
                    color: '#000000',
                    fontSize: 19,
                    textAlign: 'center',
                  }}>
                  {
                    json_language['Sẵn sàng cho việc chụp ảnh selfies của bạn'][
                      language
                    ]
                  }
                </Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <View style={{width: '80%'}}>
                <Text
                  style={{
                    fontWeight: 400,
                    borderRadius: 5,
                    padding: 10,
                    paddingTop: 0,
                    color: '#000000',
                    fontSize: 16,
                    textAlign: 'center',
                  }}>
                  {
                    json_language['Vui lòng chụp ảnh chân dung của bạn'][
                      language
                    ]
                  }
                </Text>
              </View>
            </View>

            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 0 + padding_screens,
              }}>
              <Image
                source={
                  photo.selfies
                    ? {uri: photo.selfies}
                    : require('../../assets/images/istock.png')
                }
                style={{
                  height:
                    Dimensions.get('window').width > 480 &&
                    Dimensions.get('window').height > 480
                      ? Dimensions.get('window').width * 0.8
                      : Dimensions.get('window').width * 0.9,
                  width:
                    Dimensions.get('window').width > 480 &&
                    Dimensions.get('window').height > 480
                      ? Dimensions.get('window').width * 0.8
                      : Dimensions.get('window').width * 0.9,
                  backgroundColor: 'white',
                  borderRadius: 200,
                  borderWidth: 1,
                  borderColor: '#6D7B8D',
                }}
              />
            </View>
            <TouchableOpacity
              style={{
                marginTop: 30,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              // onPress={() => check_permission()
              onPress={
                () => set_open_select_type(true)
                // onPress={() => takePhoto("potrait", set_photo)
              }>
              <Text style={{color: 'black', fontSize: 20, textAlign: 'center'}}>
                {json_language['Chụp ảnh'][language]}
              </Text>
            </TouchableOpacity>

            {photo && photo.selfies && (
              <TouchableOpacity
                style={{
                  marginTop: 40,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: '#151B8D',
                  marginHorizontal: 10,
                  borderRadius: 5,
                  marginBottom: 10,
                }}
                onPress={() => set_open_take_photo_cccd(true)}>
                <Text
                  style={{
                    color: 'white',
                    fontSize: 20,
                    textAlign: 'center',
                    padding: 5,
                  }}>
                  {json_language['Tiếp tục'][language]}
                </Text>
              </TouchableOpacity>
            )}
            {/* <View style={{ width: '100%', alignItems: 'center' }}>
                        <View style={[{
                            height: 60, width: '100%', alignItems: 'center', backgroundColor: '#FFFFFC'
                        }]}>
                            < View style={[styles.centeredView, { marginTop: 10, width: "100%", heightL: '100%' }]} >
                                <View style={[styles.search_container, { width: Dimensions.get('window').width - 60 }]}>
                                    <AntDesign name="search1" size={23} color="#000000" style={{ marginLeft: 20 }} />
                                    <TextInput style={[{ width: '90%', padding: 5, paddingLeft: 20, fontFamily: 'Arial' }]}
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        maxLength={30}
                                        autoCapitalized="words"
                                        value={text}
                                        onChangeText={SearchMNV}
                                        placeholder={json_language["Tìm kiếm theo số điện thoại, số serial"][language]}
                                    />
                                </View>

                            </View>
                        </View>
                    </View> */}
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </View>
  );
}
export default memo(Register);
