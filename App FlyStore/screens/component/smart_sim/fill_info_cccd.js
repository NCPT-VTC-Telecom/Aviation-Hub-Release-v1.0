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
const step = 3;
function FillInfoCCCD({
  type_card,
  listPhoneSim,
  set_listPhoneSim,
  total_sim_sold_today,
  set_total_sim_sold_today,
  isConnected,
  setListDataCustomerSync,
  listDataCustomerSync,
  set_open_register_uninternet,
  set_photo,
  photo,
  list_goicuoc,
  getDataLocal,
  open_fill_info_cccd,
  set_open_fill_info_cccd,
  language,
  cccd_info_ss,
  set_cccd_info_ss,
  set_open_register,
  set_open_take_photo_cccd,
  data_a_sim,
  setListDataCustomerUnsync,
  listDataCustomerUnsync,
  listDataCustomerTotal,
  setListDataCustomerTotal,
}) {
  const [nationality, set_nationality] = useState();
  const [open_info, set_open_info] = useState(false);
  const [placeOfIssue, set_placeOfIssue] = useState(
    'Cục Cảnh sát quản lý hành chính về trật tự xã hội',
  );
  const [show, setShow] = useState(false);
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);

  const SaveAndGetSim = useCallback(async () => {
    set_loading(true);

    setTimeout(async () => {
      let register_sim_unsync = {...cccd_info_ss};
      // register_sim_unsync.idNumber = cccd_info_ss.idNumber;
      // register_sim_unsync.birthday = cccd_info_ss.birthday;
      // register_sim_unsync.date_end = cccd_info_ss.date_end;
      // register_sim_unsync.gender = cccd_info_ss.gender;
      // register_sim_unsync.address = cccd_info_ss.address;
      // register_sim_unsync.fullName = cccd_info_ss.Fullname;
      // console.log(register_sim_unsync)
      // const dateStr_ = date_create.toISOString().slice(0, -1);
      // const date_ = new Date(dateStr_);

      // const day_ = date_.getDate().toString().padStart(2, '0');
      // const month_ = (date_.getMonth() + 1).toString().padStart(2, '0');
      // const year_ = date_.getFullYear().toString();

      // const formattedDate_ = `${day_}/${month_}/${year_}`;

      register_sim_unsync.dateOfIssue = moment(cccd_info_ss.createdAt).format(
        'DD/MM/YYYY',
      );
      // register_sim_unsync.placeOfIssue = cccd_info_ss.placeOfIssue;
      // register_sim_unsync.phoneCustomer = phone_customer;
      // register_sim_unsync.phoneRegister = '093833983';
      // register_sim_unsync.codeSim = '3838333388';
      register_sim_unsync.phoneRegister = phone;
      register_sim_unsync.codeSim = serial;
      register_sim_unsync.packOfData = type;
      register_sim_unsync.createdAt = new Date().toISOString().slice(0, -1);
      //test iphone
      // register_sim_unsync.pathFilePortrait = register_sim_unsync.pathFileBacks
      // console.log(register_sim_unsync)
      let temp = [];
      if (listDataCustomerUnsync.length != 0) {
        temp = [...listDataCustomerUnsync];
        // console.log(temp.length)
      }
      // set_loading(false)
      // setDataLocal([], "listDataCustomerUnsync")
      // return
      let temp_customer_total = [];
      if (listDataCustomerTotal.length != 0) {
        temp_customer_total = [...listDataCustomerTotal];
      }

      // console.log(temp)
      temp.push(register_sim_unsync);
      // temp_customer_total.push(register_sim_unsync)
      // console.log('gogo')
      // console.log(temp_customer_total)
      // setListDataCustomerUnsync(temp)

      //nếu có kết nối thì đẩy dữ liệu lên
      let temp_object = [];
      temp_object.push(register_sim_unsync);
      if (isConnected) {
        let sync = await RegisterCustomerSync(temp);
        // console.log(sync)
        if (sync == 1) {
          // let temp_sync = [...listDataCustomerSync]
          // for (i of temp) {
          //     temp_sync.push(i)
          // }
          // setListDataCustomerTotal(temp_customer_total)
          // setDataLocal(temp_sync, "listDataCustomerSync")
          // setDataLocal([], "listDataCustomerUnsync")
          // setListDataCustomerSync(temp_sync)
          // setListDataCustomerUnsync([])
          return;
        } else {
          // console.log('in save sim')
          // console.log(listDataCustomerTotal.length)
          return;
        }
        return;
      } else {
        for (i of temp) {
          temp_customer_total.push(i);
        }
        setListDataCustomerTotal(temp_customer_total);
        setListDataCustomerUnsync(temp);
        setDataLocal(temp, 'listDataCustomerUnsync');
      }
      // console.log("local")
      // console.log(temp)
      // console.log(temp.length)
      // setDataLocal(temp, "listDataCustomerUnsync")
      //cập nhật lại số sim bán trong hôm nay
      // console.log("cập nhật lại số ca bán trong hôm nay")
      set_total_sim_sold_today(total_sim_sold_today + 1);
      let listPhoneSimTemp = [...listPhoneSim];
      for (i of listPhoneSim) {
        //phone register
        if (i.phone === phone) {
          i.status = 1;
          set_listPhoneSim(listPhoneSimTemp);
          setDataLocal(listPhoneSimTemp, 'listPhoneSim');
          break;
        }
      }
      set_photo({
        image: '',
        image_back: '',
        selfies: '',
      });
      set_open_fill_info_cccd(false);
      setTimeout(() => {
        set_loading(false);
        set_open_take_photo_cccd(false);
        set_open_register(false);
        set_open_register_uninternet(false);
        // setTimeout(() => {
        //     set_open_alert(true)
        // }, 0);
        // set_color('#1589FF')
        // set_status(json_language['Thành công'][language])
        // set_message(json_language['Dữ liệu đã được lưu vào máy. Cần Internet để đồng bộ lên hệ thống.'][language])
        show_message(
          json_language['Thành công'][language],
          json_language[
            'Dữ liệu đã được lưu vào máy. Cần Internet để đồng bộ lên hệ thống.'
          ][language],
        );
      }, 0);
    }, 0);
  });
  const RegisterCustomerSync = useCallback(async form_data_register => {
    const url_register = url_api.api_post_register;
    if (!isConnected) {
      setTimeout(() => {
        set_open_alert(true);
      }, 0);
      set_color('#EAC117');
      set_status(json_language['Đồng bộ thất bại'][language]);
      set_message(
        json_language['Không có kết nối. Vui lòng kết nối mạng và thử lại'][
          language
        ],
      );
      // show_message(json_language["Đồng bộ thất bại"][language], json_language["Không có kết nối. Vui lòng kết nối mạng và thử lại"][language])
      return 0;
    } else {
      set_loading(true);
      //đồng bộ ảnh trước để lấy đường dẫn thực tế trên internet bỏ vào mục "cdn"
      const url = url_api.api_post_image;
      const authToken =
        'yvnRdXpzta2UwjO5WTDKSpoyc3urw4vSXLqvo3KdDixqkvdSCy2wgX4CCXzq3V0_7xLQ2mHZwtOXmZK2sOhHhhnnbrh5T41qEqK_wHsFwKw=';

      const formData = new FormData();
      for (i of form_data_register) {
        let CusNumPhone_IDCard = i.phoneRegister + '_';
        formData.append('image[]', {
          uri: i.pathFileFront,
          name: CusNumPhone_IDCard + 'front_.jpg',
          type: 'image/jpeg',
        });
        formData.append('image[]', {
          uri: i.pathFileBack,
          name: CusNumPhone_IDCard + 'back_.jpg',
          type: 'image/jpeg',
        });
        formData.append('image[]', {
          uri: i.pathFilePortrait,
          name: CusNumPhone_IDCard + 'portrait_.jpg',
          type: 'image/jpeg',
        });
        // console.log(i.pathFileBack)
        // console.log(i.pathFilePortrait)
      }

      let list_image_res = [];
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${authToken}`,
            'Content-Type': 'multipart/form-data',
          },
          body: formData,
        });
        const data = await response.json();
        // console.log(data);
        // console.log(response);
        // console.log(data.data.length)
        // set_loading(false)
        if (data.result == 1 && data.data && data.data.length != 0) {
          // console.log("vô")
          list_image_res = data.data;
          // console.log(data.data)
          // set_loading(false)
          // return
        }
      } catch (error) {
        if (error.message === 'Network request failed') {
          // setTimeout(() => {
          //     set_open_alert(true)
          // }, 0);
          // set_color('#EAC117')
          // set_status(json_language['Thất bại'][language])
          // set_message(json_language['Mất kết nối'][language])
          show_message(
            json_language['Thất bại'][language],
            json_language['Mất kết nối'][language],
          );
          // xử lý lỗi mất kết nối internet
        } else if (error.message === 'Timeout') {
          // xử lý lỗi timeout
          // setTimeout(() => {
          //     set_open_alert(true)
          // }, 0);
          // set_color('#EAC117')
          // set_status(json_language['Thất bại'][language])
          // set_message('Time out')
          show_message(json_language['Thất bại'][language], 'Time out');
        } else {
          // xử lý các lỗi khác
          // setTimeout(() => {
          //     set_open_alert(true)
          // }, 0);
          // set_color('#EAC117')
          // set_status(json_language['Thất bại'][language])
          // set_message(error.message)
          show_message(json_language['Thất bại'][language], error.message);
        }
        set_loading(false);
      }

      // console.log(list_image_res)
      // return

      if (list_image_res.length == 0) {
        // console.log("cann not upload image")
        // setTimeout(() => {
        //     set_open_alert(true)
        // }, 0);
        // set_color('#EAC117')
        // set_status(json_language["Thất bại"][language])
        // set_message(json_language["Đồng bộ ảnh thất bại"][language])
        show_message(
          json_language['Thất bại'][language],
          json_language['Đồng bộ ảnh thất bại'][language],
        );
        set_loading(false);
        return 0;
      }
      for (i of list_image_res) {
        for (j of form_data_register) {
          let image_split = i.split('_');
          //thay đường đẫn cũ đến ảnh trên internet bằng đường dẫn mới đồng bộ về
          if (image_split[0] == j.phoneRegister) {
            j.cdn[image_split[1]] = 'https://files.vtctelecom.com.vn/sim/' + i;

            if (image_split[1] == 'front') {
              j.imageFront = 'https://files.vtctelecom.com.vn/sim/' + i;
            } else if (image_split[1] == 'back') {
              j.imageBack = 'https://files.vtctelecom.com.vn/sim/' + i;
            } else {
              j.imagePortrait = 'https://files.vtctelecom.com.vn/sim/' + i;
            }
          }
        }
      }
      // setDataLocal(form_data_register, "listDataCustomerUnsync")
      // setListDataCustomerUnsync(form_data_register)
      fetch(url_register, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + authToken,
        },
        timeout: 50000,
        body: JSON.stringify(form_data_register),
      })
        .then(response => response.json())
        .then(async responseJson => {
          //console.log('inin ')
          if (responseJson.result == 1) {
            try {
              const response = await fetch(url, {
                method: 'POST',
                headers: {
                  Authorization: `Bearer ${authToken}`,
                  'Content-Type': 'multipart/form-data',
                },
                body: formData,
              });
              const data = await response.json();
              // console.log(data);
              // console.log(response);
              // console.log(data.data.length)
              // set_loading(false)
              if (data.result == 1 && data.data && data.data.length != 0) {
                // console.log("vô")
                list_image_res = data.data;
                // console.log(data.data)
                // set_loading(false)
                // return
              }
            } catch (error) {
              if (error.message === 'Network request failed') {
                // setTimeout(() => {
                //     set_open_alert(true)
                // }, 0);
                // set_color('#EAC117')
                // set_status(json_language['Thất bại'][language])
                // set_message(json_language['Mất kết nối'][language])
                show_message(
                  json_language['Thất bại'][language],
                  json_language['Mất kết nối'][language],
                );
                // xử lý lỗi mất kết nối internet
              } else if (error.message === 'Timeout') {
                // xử lý lỗi timeout
                // setTimeout(() => {
                //     set_open_alert(true)
                // }, 0);
                // set_color('#EAC117')
                // set_status(json_language['Thất bại'][language])
                // set_message('Time out')
                show_message(json_language['Thất bại'][language], 'Time out');
              } else {
                // xử lý các lỗi khác
                // setTimeout(() => {
                //     set_open_alert(true)
                // }, 0);
                // set_color('#EAC117')
                // set_status(json_language['Thất bại'][language])
                // set_message(error.message)
                show_message(
                  json_language['Thất bại'][language],
                  error.message,
                );
              }
              set_loading(false);
            }
            // console.log(responseJson)
            set_loading(false);
            let temp_total_project = [...listDataCustomerSync];
            // console.log(temp_total_project.length)
            for (i of form_data_register) {
              temp_total_project.push(i);
            }

            // console.log(form_data_register.length)
            setDataLocal([], 'listDataCustomerUnsync');
            setDataLocal(temp_total_project, 'listDataCustomerSync');
            setListDataCustomerSync(temp_total_project);
            setListDataCustomerUnsync([]);
            setListDataCustomerTotal(temp_total_project);
            // //cập nhật lại số sim bán trong hôm nay
            // console.log("cập nhật lại số ca bán trong hôm nay")
            set_total_sim_sold_today(total_sim_sold_today + 1);
            //cập nhật lại danh sách sim
            let listPhoneSimTemp = [...listPhoneSim];
            for (i of listPhoneSim) {
              //phone register
              if (i.phone === phone) {
                i.status = 1;
                set_listPhoneSim(listPhoneSimTemp);
                setDataLocal(listPhoneSimTemp, 'listPhoneSim');
                break;
              }
            }

            set_photo({
              image: '',
              image_back: '',
              selfies: '',
            });
            setTimeout(() => {
              set_open_take_photo_cccd(false);
              set_open_register_uninternet(false);
              set_open_register(false);
            }, 0);
            set_open_fill_info_cccd(false);
            set_loading(false);
            // setTimeout(() => {
            //     set_open_alert(true)
            // }, 0);
            // set_color('#1589FF')
            // set_status(json_language['Thành công'][language])
            // set_message(responseJson.message)
            show_message(
              json_language['Thành công'][language],
              json_language['Đồng bộ dữ liệu thành công'][language],
            );
            return 1;
          } else {
            set_type_alert('thongbao');
            set_loading(false);
            setTimeout(() => {
              set_open_alert(true);
            }, 0);
            set_color('#EAC117');
            set_status(json_language['Thất bại'][language]);
            set_message(responseJson.message);
            // show_message(json_language['Thất bại'][language], responseJson.message)
            return 0;
          }
        })
        .catch(error => {
          if (error.message === 'Network request failed') {
            // setTimeout(() => {
            //     set_open_alert(true)
            // }, 0);
            // set_color('#EAC117')
            // set_status(json_language['Thất bại'][language])
            // set_message(json_language['Mất kết nối'][language])
            show_message(
              json_language['Thất bại'][language],
              json_language['Mất kết nối'][language],
            );
            // xử lý lỗi mất kết nối internet
          } else if (error.message === 'Timeout') {
            // xử lý lỗi timeout
            // setTimeout(() => {
            //     set_open_alert(true)
            // }, 0);
            // set_color('#EAC117')
            // set_status(json_language['Thất bại'][language])
            // set_message('Time out')
            show_message(json_language['Thất bại'][language], 'Time out');
          } else {
            // xử lý các lỗi khác
            // setTimeout(() => {
            //     set_open_alert(true)
            // }, 0);
            // set_color('#EAC117')
            // set_status(json_language['Thất bại'][language])
            // set_message(error.message)
            show_message(json_language['Thất bại'][language], error.message);
          }
          set_loading(false);
          // show_message('Error', error(error));
        });
    }
  });
  const [validate, set_validate] = useState(true);
  const [loading, set_loading] = useState(false);
  const [phone, set_phone] = useState(data_a_sim.phone ? data_a_sim.phone : '');
  const [phone_customer, set_phone_customer] = useState('');
  const [serial, set_serial] = useState(data_a_sim.imei ? data_a_sim.imei : '');
  const [type, set_type] = useState(
    data_a_sim.packet
      ? data_a_sim.packet.code
      : list_goicuoc.length > 0
      ? list_goicuoc[0].code
      : 'GOI_1',
  );
  const [show_picker_sex, set_show_picker_sex] = useState(false);
  const [show_picker_place, set_show_picker_place] = useState(false);

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
        if (data_a_sim_ && data_a_sim.phone == phone) {
          return 1;
        }
        return 0;
      }
      return result ? 1 : 0;
    } else if (type == 'cccd') {
      const pattern = /^[0-9]{12}$/; // Mẫu 10 chữ số từ 0-9
      const result = pattern.test(text);
      return result ? 1 : 0;
    }
  }
  const SaveInfo = useCallback(() => {
    if (
      !cccd_info_ss.pathFilePortrait ||
      checkValidateAny(cccd_info_ss.phoneCustomer, 'phone10') != 1 ||
      !cccd_info_ss.address ||
      !cccd_info_ss.fullName ||
      !cccd_info_ss.fullName ||
      checkValidateAny(cccd_info_ss.idNumber, 'cccd') != 1 ||
      !cccd_info_ss.placeOfIssue
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
        json_language['Vui lòng điền đầy đủ thông tin và thử lại'][language],
      );
      // show_message(json_language["Lỗi"][language], json_language["Vui lòng điền đầy đủ thông tin và thử lại"][language])
    } else {
      SaveAndGetSim();
    }
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
        <SafeAreaView style={{backgroundColor: '#ffffff', width: '100%'}}>
          {/* <TouchableOpacity onPress={() => {
                        console.log(date)
                        console.log(date_end)
                        console.log(date_create)
                    }}>
                        <Text>
                            sfjslajdlkajdsald
                        </Text>
                    </TouchableOpacity> */}
          {/* <TouchableOpacity
                        onPress={
                            () => {
                                console.log(cccd_info_ss)
                            }
                        }
                    >
                        <Text>
                            dknasldas
                        </Text>
                    </TouchableOpacity> */}
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
                setTimeout(() => {
                  set_open_take_photo_cccd(false);
                  set_open_register(false);
                  set_open_register_uninternet(false);
                }, 50);
                set_open_fill_info_cccd(false);
              }}>
              <AntDesign name="close" size={22} color="red" />
            </TouchableOpacity>
          </View>
          <View style={styles.stepIndicatorContainer}>
            <StepIndicator
              customStyles={stepIndicatorStyles}
              stepCount={4}
              direction="horizontal"
              currentPosition={3}
              onPress={index => {
                if (index == 2) {
                  set_open_fill_info_cccd(false);
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
                            (cccd_info_ss.idNumber.length != 0 &&
                              checkValidateAny(cccd_info_ss.idNumber, 'cccd') !=
                                1) ||
                            (checkValidateAny(cccd_info_ss.idNumber, 'cccd') !=
                              1 &&
                              !validate)
                              ? 'red'
                              : '#DDDFE1',
                        },
                      ]}>
                      <Text style={[styles.text_lable, {color: '#153E7E'}]}>
                        {json_language['Số CCCD'][language]}:{' '}
                      </Text>
                      <TextInput
                        style={{fontSize: 15, width: '60%', color: 'black'}}
                        autoCorrect={false}
                        maxLength={50}
                        autoCapitalized="words"
                        value={cccd_info_ss.idNumber}
                        placeholder={
                          json_language['Nhập ID card/Passport'][language]
                        }
                        placeholderTextColor="#cfcfcb"
                        onChangeText={text => {
                          const regex = /^[0-9]*$/;
                          if (regex.test(text)) {
                            set_cccd_info_ss({...cccd_info_ss, idNumber: text});
                          }
                        }}
                      />
                    </View>
                    {((cccd_info_ss.idNumber.length != 0 &&
                      checkValidateAny(cccd_info_ss.idNumber, 'cccd') != 1) ||
                      (checkValidateAny(cccd_info_ss.idNumber, 'cccd') != 1 &&
                        !validate)) && (
                      <View>
                        <Text style={{paddingLeft: 10, color: 'red'}}>
                          {cccd_info_ss.idNumber.length == 0
                            ? json_language[
                                'ID card/Passport không được bỏ trống'
                              ][language]
                            : json_language[
                                'ID card/Passport không đúng định dạng'
                              ][language]}
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
                            (cccd_info_ss.phoneCustomer.length != 0 &&
                              checkValidateAny(
                                cccd_info_ss.phoneCustomer,
                                'phone10',
                              ) != 1) ||
                            (checkValidateAny(
                              cccd_info_ss.phoneCustomer,
                              'phone10',
                            ) != 1 &&
                              !validate)
                              ? 'red'
                              : '#DDDFE1',
                        },
                      ]}>
                      <Text style={[styles.text_lable, {color: '#153E7E'}]}>
                        {json_language['Số điện thoại'][language]}:{' '}
                      </Text>
                      <TextInput
                        style={{
                          fontSize: 15,
                          width: '60%',
                          flexWrap: 'wrap',
                          color: 'black',
                        }}
                        autoCorrect={false}
                        maxLength={10}
                        autoCapitalized="words"
                        value={cccd_info_ss.phoneCustomer}
                        multiline={true}
                        // placeholder={json_language["Nhập số điện thoại đăng ký "][language]}
                        placeholder="0123878765"
                        placeholderTextColor="#cfcfcb"
                        onChangeText={text => {
                          const regex = /^[0-9]*$/;
                          if (regex.test(text)) {
                            set_cccd_info_ss({
                              ...cccd_info_ss,
                              phoneCustomer: text,
                            });
                          }
                        }}
                      />
                    </View>
                    {((cccd_info_ss.phoneCustomer.length != 0 &&
                      checkValidateAny(cccd_info_ss.phoneCustomer, 'phone10') !=
                        1) ||
                      (checkValidateAny(
                        cccd_info_ss.phoneCustomer,
                        'phone10',
                      ) != 1 &&
                        !validate)) && (
                      <View>
                        <Text style={{paddingLeft: 10, color: 'red'}}>
                          {cccd_info_ss.phoneCustomer.length == 0
                            ? json_language[
                                'Số điện thoại đăng ký không được bỏ trống'
                              ][language]
                            : json_language[
                                'Số điện thoại không đúng định dạng'
                              ][language]}
                        </Text>
                      </View>
                    )}
                    <TouchableOpacity
                      style={[
                        styles.Textinput2_row,
                        {marginTop: 15, width: '100%'},
                      ]}
                      onPress={() => {
                        show ? setShow(false) : setShow(true);
                        // console.log('djaskjd')
                      }}>
                      <Text style={[styles.text_lable, {color: '#153E7E'}]}>
                        {json_language['Ngày sinh'][language]}:{' '}
                      </Text>
                      <View style={{width: 800, height: '100%'}}>
                        <Text
                          style={{padding: 10, fontSize: 16, color: 'black'}}>
                          {cccd_info_ss.birthday
                            ? cccd_info_ss.birthday.toLocaleDateString()
                            : ''}
                        </Text>
                      </View>
                      <DateTimePickerModal
                        isVisible={show}
                        mode="date"
                        onConfirm={d => {
                          // console.log(d)
                          set_cccd_info_ss({...cccd_info_ss, birthday: d});
                          setShow(false);
                        }}
                        onCancel={() => setShow(false)}
                      />
                    </TouchableOpacity>
                    {Platform.OS !== 'ios' ? (
                      <View style={[styles.Textinput2_row, {marginTop: 10}]}>
                        <Text style={[styles.text_lable, {color: '#153E7E'}]}>
                          {json_language['Giới tính'][language]}:{' '}
                        </Text>
                        <Picker
                          style={{width: '80%'}}
                          selectedValue={cccd_info_ss.gender}
                          onValueChange={(itemValue, itemIndex) =>
                            set_cccd_info_ss({
                              ...cccd_info_ss,
                              gender: itemValue,
                            })
                          }>
                          <Picker.Item
                            label={json_language.Nam[language]}
                            value="1"
                          />
                          <Picker.Item
                            label={json_language['Nữ'][language]}
                            value="0"
                          />
                        </Picker>
                      </View>
                    ) : (
                      <TouchableOpacity
                        style={[
                          styles.Textinput2_row,
                          {marginTop: 15, width: '100%'},
                        ]}
                        onPress={() => set_show_picker_sex(true)}>
                        <Text style={[styles.text_lable, {color: '#153E7E'}]}>
                          {json_language['Giới tính'][language]}:{' '}
                        </Text>
                        <Text
                          style={{
                            padding: 10,
                            fontSize: 17,
                            width: 60,
                            color: 'black',
                          }}>
                          {cccd_info_ss.gender == 1 ? 'Nam' : 'Nữ'}
                        </Text>
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
                                    height: 200,
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
                                    selectedValue={cccd_info_ss.gender}
                                    onValueChange={(itemValue, itemIndex) => {
                                      set_cccd_info_ss({
                                        ...cccd_info_ss,
                                        gender: itemValue,
                                      });
                                      // console.log(itemValue)
                                    }}>
                                    <Picker.Item
                                      label={json_language.Nam[language]}
                                      value="1"
                                    />
                                    <Picker.Item
                                      label={json_language['Nữ'][language]}
                                      value="0"
                                    />
                                  </Picker>

                                  <View style={{height: 200}} />
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
                          marginTop: 15,
                          borderColor:
                            !cccd_info_ss.address && !validate
                              ? 'red'
                              : '#DDDFE1',
                        },
                      ]}>
                      <Text style={[styles.text_lable, {color: '#153E7E'}]}>
                        {json_language['Địa chỉ'][language]}:{' '}
                      </Text>
                      <TextInput
                        style={{
                          fontSize: 15,
                          width: '60%',
                          paddingBottom: 8,
                          color: 'black',
                        }}
                        autoCorrect={false}
                        maxLength={100}
                        multiline={true}
                        autoCapitalized="words"
                        value={cccd_info_ss.address}
                        placeholder={json_language['Nhập địa chỉ'][language]}
                        placeholderTextColor="#cfcfcb"
                        onChangeText={text =>
                          set_cccd_info_ss({...cccd_info_ss, address: text})
                        }
                      />
                    </View>
                    {!cccd_info_ss.address && !validate && (
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
                    {/* <View style={[styles.Textinput2_row, { marginTop: 15 }]}>
                                        <Text style={[styles.text_lable, {color: '#153E7E'}]}>Quốc tịch: </Text>
                                        <TextInput style={{ fontSize: 15, width: '60%' }}
                                            autoCorrect={false}
                                            maxLength={50}
                                            autoCapitalized="words"
                                            value={nationality}
                                            onChangeText={text => set_nationality(text)}
                                        />
                                    </View> */}
                    <TouchableOpacity
                      style={[
                        styles.Textinput2_row,
                        {marginTop: 15, width: '100%'},
                      ]}
                      onPress={() => {
                        show1 ? setShow1(false) : setShow1(true);
                        // console.log('djaskjd')
                      }}>
                      <Text style={[styles.text_lable, {color: '#153E7E'}]}>
                        {json_language['Ngày hết hạn'][language]}
                      </Text>
                      <View style={{width: 800, height: '100%'}}>
                        <Text
                          style={{padding: 10, fontSize: 16, color: 'black'}}>
                          {cccd_info_ss.date_end
                            ? cccd_info_ss.date_end.toLocaleDateString()
                            : ''}
                        </Text>
                      </View>
                      <DateTimePickerModal
                        isVisible={show1}
                        mode="date"
                        onConfirm={d => {
                          set_cccd_info_ss({...cccd_info_ss, date_end: d});
                          setShow1(false);
                        }}
                        onCancel={() => setShow1(false)}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.Textinput2_row, {marginTop: 15}]}
                      onPress={() => setShow2(true)}>
                      <Text style={[styles.text_lable, {color: '#153E7E'}]}>
                        {json_language['Ngày phát hành'][language]}:{' '}
                      </Text>
                      <View style={{width: 800, height: '100%'}}>
                        <Text
                          style={{padding: 10, fontSize: 16, color: 'black'}}>
                          {cccd_info_ss.createdAt
                            ? cccd_info_ss.createdAt.toLocaleDateString()
                            : ''}
                        </Text>
                      </View>

                      <DateTimePickerModal
                        isVisible={show2}
                        mode="date"
                        onConfirm={d => {
                          set_cccd_info_ss({...cccd_info_ss, createdAt: d});
                          setShow2(false);
                        }}
                        onCancel={() => setShow2(false)}
                      />
                    </TouchableOpacity>

                    {Platform.OS !== 'ios' ? (
                      <View style={[styles.Textinput2_row, {marginTop: 10}]}>
                        <Text style={[styles.text_lable, {color: '#153E7E'}]}>
                          {json_language['Nơi cấp'][language]}:{' '}
                        </Text>
                        <Picker
                          style={{width: '80%', flexWrap: 'wrap'}}
                          selectedValue={cccd_info_ss.placeOfIssue}
                          onValueChange={itemValue =>
                            set_cccd_info_ss({
                              ...cccd_info_ss,
                              placeOfIssue: itemValue,
                            })
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
                      </View>
                    ) : (
                      <TouchableOpacity
                        style={[styles.Textinput2_row, {marginTop: 15}]}
                        onPress={() => set_show_picker_place(true)}>
                        <Text style={[styles.text_lable, {color: '#153E7E'}]}>
                          {json_language['Nơi cấp'][language]}:{' '}
                        </Text>
                        <Text
                          style={{
                            padding: 10,
                            fontSize: 17,
                            flexWrap: 'wrap',
                            width: '70%',
                            color: 'black',
                          }}>
                          {cccd_info_ss.placeOfIssue}
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
                                    height: 200,
                                    backgroundColor: '#ffffff',
                                    width: '100%',
                                    borderRadius: 10,
                                  }}>
                                  <Picker
                                    style={{width: '100%', height: 200}}
                                    selectedValue={cccd_info_ss.placeOfIssue}
                                    onValueChange={itemValue =>
                                      set_cccd_info_ss({
                                        ...cccd_info_ss,
                                        placeOfIssue: itemValue,
                                      })
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

                                  <View style={{height: 200}} />
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
                  </View>
                </View>

                {!data_a_sim.phone ? (
                  <View
                    style={[
                      {
                        padding: 10,
                        backgroundColor: '#ffffff',
                        marginTop: 15,
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
                        {
                          marginTop: 15,
                          alignItems: 'center',
                          borderColor:
                            (phone.length != 0 &&
                              checkValidateAny(phone, 'phone84') != 1) ||
                            (checkValidateAny(phone, 'phone84') != 1 &&
                              !validate)
                              ? 'red'
                              : '#DDDFE1',
                        },
                      ]}>
                      <Text style={[styles.text_lable, {color: '#153E7E'}]}>
                        {json_language['Số điện thoại'][language]}:{' '}
                      </Text>
                      <TextInput
                        style={{
                          fontSize: 17,
                          paddingBottom: 3,
                          width: '60%',
                          flexWrap: 'wrap',
                          color: 'black',
                        }}
                        autoCorrect={false}
                        maxLength={11}
                        autoCapitalized="words"
                        value={phone}
                        multiline={true}
                        // placeholder={json_language["Nhập số điện thoại"][language]}
                        placeholder="84849384394"
                        placeholderTextColor="#cfcfcb"
                        onChangeText={text => set_phone(text)}
                      />
                    </View>
                    {((phone.length != 0 &&
                      checkValidateAny(phone, 'phone84') != 1) ||
                      (checkValidateAny(phone, 'phone84') != 1 &&
                        !validate)) && (
                      <View>
                        <Text style={{paddingLeft: 10, color: 'red'}}>
                          {phone.length == 0
                            ? json_language[
                                'Số điện thoại không được bỏ trống'
                              ][language]
                            : phone.length == 11
                            ? json_language['Số điện thoại không tồn tại'][
                                language
                              ]
                            : json_language[
                                'Số điện thoại không đúng định dạng'
                              ][language]}
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
                            (serial.length != 0 &&
                              checkValidateAny(serial, 'serial') != 1) ||
                            (checkValidateAny(serial, 'serial') != 1 &&
                              !validate)
                              ? 'red'
                              : '#DDDFE1',
                        },
                      ]}>
                      <Text style={[styles.text_lable, {color: '#153E7E'}]}>
                        {json_language['Mã serial sim'][language]}:{' '}
                      </Text>
                      <TextInput
                        style={{
                          fontSize: 17,
                          paddingBottom: 3,
                          width: '60%',
                          flexWrap: 'wrap',
                          color: 'black',
                        }}
                        autoCorrect={false}
                        maxLength={11}
                        autoCapitalized="words"
                        value={serial}
                        multiline={true}
                        // placeholder={json_language["Nhập số serial"][language]}
                        placeholder="73627382738"
                        placeholderTextColor="#cfcfcb"
                        onChangeText={text =>
                          handleInputNumber(text, set_serial)
                        }
                      />
                    </View>
                    {((serial.length != 0 &&
                      checkValidateAny(serial, 'serial') != 1) ||
                      (checkValidateAny(serial, 'serial') != 1 &&
                        !validate)) && (
                      <View>
                        <Text style={{paddingLeft: 10, color: 'red'}}>
                          {serial.length == 0
                            ? json_language['Số serial không được bỏ trống'][
                                language
                              ]
                            : serial.length == 11
                            ? json_language['Số serial không tồn tại'][language]
                            : json_language['Số serial không đúng định dạng'][
                                language
                              ]}
                        </Text>
                      </View>
                    )}
                    <View>
                      <Text
                        style={[
                          styles.text_lable,
                          {color: '#153E7E', paddingTop: 20, paddingLeft: 10},
                        ]}>
                        {json_language['Gói cước'][language]}:{' '}
                      </Text>
                      <View>
                        <FlatList
                          data={list_goicuoc}
                          scrollEnabled={false}
                          renderItem={({item}) => {
                            return (
                              <View
                                style={{
                                  flexDirection: 'row',
                                  borderBottomWidth: 1,
                                  borderColor: '#DDDFE1',
                                  paddingLeft: 5,
                                }}>
                                <TouchableOpacity
                                  style={[
                                    styles.Text2_row,
                                    {
                                      padding: 10,
                                      color: 'black',
                                      width: '80%',
                                      borderBottomWidth: 0,
                                    },
                                  ]}
                                  onPress={() => {
                                    set_type(item.code);
                                  }}>
                                  <Text
                                    style={{
                                      width: '100%',
                                      paddingLeft: 0,
                                      color: 'black',
                                      fontSize: 18,
                                    }}>
                                    {item.text}
                                  </Text>
                                  <Fontisto
                                    name={
                                      type === item.code
                                        ? 'checkbox-active'
                                        : 'checkbox-passive'
                                    }
                                    size={22}
                                    style={{marginLeft: 15}}
                                    color={
                                      type == item.code ? '#153E7E' : '#DDDFE1'
                                    }
                                  />
                                </TouchableOpacity>
                              </View>
                            );
                          }}
                        />
                      </View>
                    </View>
                    <View style={{height: 190}} />
                  </View>
                ) : (
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
                        {phone}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.Textinput2_row,
                        {marginTop: 15, alignItems: 'center'},
                      ]}>
                      <Text style={[styles.text_lable, {color: '#153E7E'}]}>
                        {json_language['Mã serial sim'][language]}:{' '}
                      </Text>
                      <Text
                        style={[
                          styles.text_lable,
                          {color: '#000000', fontSize: 15},
                        ]}>
                        {serial}
                      </Text>
                    </View>
                    <View>
                      <Text
                        style={[
                          styles.text_lable,
                          {color: '#153E7E', paddingTop: 20, paddingLeft: 10},
                        ]}>
                        {json_language['Gói cước'][language]}:{' '}
                      </Text>
                      <View>
                        <FlatList
                          data={list_goicuoc}
                          scrollEnabled={false}
                          renderItem={({item}) => {
                            return (
                              <View
                                style={{
                                  flexDirection: 'row',
                                  borderBottomWidth: 1,
                                  borderColor: '#DDDFE1',
                                  paddingLeft: 5,
                                }}>
                                <View
                                  style={[
                                    styles.Text2_row,
                                    {
                                      padding: 10,
                                      color: 'black',
                                      width: '80%',
                                      borderBottomWidth: 0,
                                    },
                                  ]}>
                                  <Text
                                    style={{
                                      width: '100%',
                                      paddingLeft: 0,
                                      color: 'black',
                                      fontSize: 18,
                                    }}>
                                    {item.text}
                                  </Text>
                                  <Fontisto
                                    name={
                                      data_a_sim.packet.code === item.code
                                        ? 'checkbox-active'
                                        : 'checkbox-passive'
                                    }
                                    size={22}
                                    style={{marginLeft: 15}}
                                    color={
                                      data_a_sim.packet.code == item.code
                                        ? '#153E7E'
                                        : '#DDDFE1'
                                    }
                                  />
                                </View>
                              </View>
                            );
                          }}
                        />
                      </View>
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
                onPress={() => set_open_info(false)}>
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
                  // console.log(serial, phone)

                  // SaveAndGetSim()

                  //lưu ảnh vào android data
                  // set_loading(true)
                  // setTimeout(() => {
                  //     saveAllImageToStorage();
                  //     saveInfoToStorage();
                  //     set_loading(false);
                  //     set_open_fill_info_cccd(false);
                  // }, 2000);
                  //lưu thông tin và đường dẫn vào local storage
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
