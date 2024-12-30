import React, {
  useState,
  Component,
  useEffect,
  Fragment,
  useCallback,
  useMemo,
  useContext,
  useRef,
} from 'react';
import {
  StatusBar,
  ActivityIndicator,
  ScrollView,
  FlatList,
  Text,
  StyleSheet,
  View,
  TextInput,
  Button,
  Image,
  TouchableOpacity,
  Dimensions,
  TouchableWithoutFeedback,
  Alert,
  SafeAreaView,
  ImageBackground,
  Modal,
  Pressable,
  TurboModuleRegistry,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import NetInfo from '@react-native-community/netinfo';
import RNFetchBlob from 'react-native-blob-util';
import ImageResizer from 'react-native-image-resizer';
import LinearGradient from 'react-native-linear-gradient';

import Header_home from './component/component_product/header_home';
import DaBan from './component/component_modal/DaBan';
import KhoVoucher from './component/component_modal/KhoVoucher';
import Login from './component/component_modal/Login';
import BanMaWifi from './component/component_modal/BanMaWifi';
import CapNhatChuyenBay from './component/component_modal/CapNhatChuyenBay';
import BanMaNangHang from './component/component_modal/BanMaNangHang';
import XemTTChangBay from './component/component_modal/XemTTChangBay';
import Loading_animation from './component/component_modal/Loading_animation';
import Main_function from './component/component_product/Main_function';
import Order_function from './component/component_product/Order_function';
import AlertTwoButtom from './component/component_product/AlertTwoButtom';
import HomeEsim from './component/esim/HomeEsim';

import {show_message, setDataLocal, getDataLocalPost} from './menu_function';
import {url_api} from '../config';

import id, {isCameraPresent} from 'react-native-device-info';
import {MyContext} from './index';

import RNFS from 'react-native-fs';

const img = './img';
const image_source = {
  BAMP: require(img + '/product/BAMP.png'),
  BAMCHAT: require(img + '/product/BAMCHAT.png'),
  BAMWEB: require(img + '/product/BAMWEB.png'),
  BAMS: require(img + '/product/BAMS.png'),
  UP1: require(img + '/product/UP1.png'),
  UP2: require(img + '/product/UP2.png'),
  NONE: require(img + '/product/BAMS.png'),
};
import json_language from './json/language.json';
import moment from 'moment';
import {status_module_smart_sim} from '../config';
import codePush from 'react-native-code-push';

const Home = ({route, navigation}) => {
  const [checkSync, setCheckSync] = useState(false);
  const {language, set_language} = useContext(MyContext);
  const [viewShotURIStorage, setViewShotURIStorage] = useState([]);
  // const device_id = (id.getUniqueId());
  // console.log(device_id)
  const [device_id, set_device_id] = useState('');
  //lấy device id để đăng nhập
  id.getUniqueId().then(uniqueId => {
    // console.log(uniqueId)
    set_device_id(uniqueId);
    // iOS: "FCDBD8EF-62FC-4ECB-B2F5-92C9E79AC7F9"
    // Android: "dd96dec43fb81c97"
    // Windows: "{2cf7cb3c-da7a-d508-0d7f-696bb51185b4}"
  });
  //
  const [loading, set_loading] = useState(false);
  const [printer, setPrinter] = useState({
    listDevice: [],
    connected: {
      name: '',
      mac_address: '',
      status: 0,
      type: 'blue',
    },
  });
  const [isConnected, setIsConnected] = useState(true);
  // kiểm tra xem có kết nối không. Nếu có kết nối mà còn dữ liệu sim chưa đồng bộ thì đề nghị đồng bộ
  const [suggest_sync_first, set_suggest_sync_first] = useState(1);
  const coRefIsConnected = useRef(1);
  const [canClick, setCanClick] = useState(false);
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
      coRefIsConnected.current = state.isConnected;
      if (suggest_sync_first) {
        set_suggest_sync_first(0);
      }
      if (
        state.isConnected &&
        !isConnected &&
        listDataCustomerUnsync.length > 0
      ) {
        Alert.alert(
          json_language['Dữ liệu chưa đồng bộ'][language],
          json_language['Bạn có muốn đồng bộ dữ liệu khách hàng đã mua sim'][
            language
          ],
          [
            {
              text: 'Cancel',
              //onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
            },
            {
              text: 'OK',
              onPress: async () =>
                await RegisterCustomerSync(listDataCustomerUnsync),
            },
          ],
        );
      }
    });

    return () => {
      unsubscribe();
    };
  }, [isConnected]);
  //hàm đồng bộ voucher
  const sync = useCallback(async () => {
    if (
      !chuyenbay.soHieu_chuyenbay ||
      !chuyenbay.changBay_chuyenbay ||
      !chuyenbay.ngayBay_chuyenbay ||
      !chuyenbay.gioBay_chuyenbay
    ) {
      setTimeout(() => {
        set_open_alert(true);
      }, 0);
      set_type_alert('thongbao');
      set_color('#EAC117');
      set_status(json_language['Thất bại'][language]);
      set_message(
        json_language['Vui lòng điền đầy đủ thông tin chuyến bay và thử lại'][
          language
        ],
      );
      return;
    }
    if (!isConnected) {
      setTimeout(() => {
        set_open_alert(true);
      }, 0);
      set_type_alert('thongbao');
      set_color('#EAC117');
      set_status(json_language['Đồng bộ thất bại'][language]);
      set_message(
        json_language['Không có kết nối. Vui lòng kết nối mạng và thử lại'][
          language
        ],
      );
      // show_message(json_language["Đồng bộ thất bại"][language], json_language["Không có kết nối. Vui lòng kết nối mạng và thử lại"][language])
      return;
    } else {
      set_open_StatusBar(true);
      // console.log('skdsjkakl')
      set_loading(true);
      set_message_Loading_animation(json_language['Đang đồng bộ'][language]);
      const data_post = getDataLocalPost(
        wifi_vouchers,
        upgrade_tickets_vouchers,
        esim_vouchers,
      );
      // console.log(data_post)
      // console.log('iin')
      // console.log(esim_vouchers)
      // console.log('data_post')
      //return;
      // console.log(ngayBay_chuyenbay.toString("dd'/'MM'/'yyyy"))
      const fight = [
        {
          fight: {
            number: chuyenbay.soHieu_chuyenbay,
            dst: chuyenbay.changBay_chuyenbay,
            time: chuyenbay.gioBay_chuyenbay,
            day: moment(chuyenbay.ngayBay_chuyenbay).format('DD/MM/YY'),
            region: chuyenbay.chauLuc_chuyenbay,
          },
        },
      ];

      // console.log(data_post)
      // console.log(fight)
      // console.log(upgrade_tickets_vouchers.length == 0 && wifi_vouchers.length == 0 ? fight : data_post)

      //command lại để xài sau
      // const res_getListEsim = await getListEsim()
      // if (res_getListEsim == null || res_getListEsim == 0) {
      //     return
      // }
      fetch(url_api.sync, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
        timeout: 50000,
        body: JSON.stringify(checkSync == false ? fight : data_post),
      })
        .then(response => response.json())
        .then(responseJson => {
          // console.log(data_post)
          // console.log(responseJson.data.esim_joytel)
          if (responseJson.result == 1) {
            // console.log(responseJson.message)
            setDataLocal([], 'order_list');
            set_order_list([]);
            if (checkSync == false) {
              set_data_local_store(responseJson.data);
            } else {
              for (let i of viewShotURIStorage) {
                try {
                  deleteURI(i);
                } catch (err) {
                  console.log(err);
                }
              }
              setDataLocal([], 'viewShotURIStorage');
              set_chuyenbay({...chuyenbay, chauLuc_chuyenbay: ''});
              setDataLocal(
                {
                  soHieu: chuyenbay.soHieu_chuyenbay,
                  changBay: chuyenbay.changBay_chuyenbay,
                  ngayBay: chuyenbay.ngayBay_chuyenbay
                    ? moment(chuyenbay.ngayBay_chuyenbay).format('DD/MM/YYYY')
                    : moment(new Date()).format('DD/MM/YYYY'),
                  gioBay: chuyenbay.gioBay_chuyenbay,
                  chauLuc: '',
                },
                'flyInfo',
              );
              setDataLocal([], 'upgrade_tickets_voucher_prices');
              setDataLocal([], 'upgrade_tickets_voucher_types');
              setDataLocal([], 'upgrade_tickets_vouchers');
              setDataLocal([], 'wifi_voucher_prices');
              setDataLocal([], 'wifi_voucher_types');
              setDataLocal([], 'wifi_vouchers');
              setDataLocal([], 'esim_voucher_prices');
              setDataLocal([], 'esim_voucher_types');
              setDataLocal([], 'esim_vouchers');
              setDataLocal([], 'esim_region');

              set_upgrade_tickets_voucher_prices([]);
              set_upgrade_tickets_voucher_types([]);
              set_upgrade_tickets_vouchers([]);
              set_esim_voucher_prices([]);
              set_esim_voucher_types([]);
              set_esim_vouchers([]);
              set_esim_region([]);
              set_wifi_voucher_prices([]);
              set_wifi_voucher_types([]);
              set_wifi_vouchers([]);
            }
            setDataLocal(!checkSync, 'checkSync');
            setCheckSync(!checkSync);
            // console.log("end data post")
            set_loading(false);
            set_open_StatusBar(false);
            setTimeout(() => {
              set_open_alert(true);
            }, 0);
            set_type_alert('thongbao');
            set_color('#1589FF');
            set_status(json_language['Thành công'][language]);
            set_message(json_language['Đồng bộ dữ liệu thành công'][language]);
            // show_message(json_language['Thành công'][language], json_language['Đồng bộ dữ liệu thành công'][language])
          } else {
            // console.log(responseJson)
            set_open_StatusBar(false);
            set_loading(false);
            // return
            // console.log(responseJson.message)
            if (
              responseJson.message &&
              responseJson.message == 'Thông tin chuyến bay không hợp lệ'
            ) {
              setTimeout(() => {
                set_open_alert(true);
              }, 0);
              set_type_alert('thongbao');
              set_color('#EAC117');
              set_status(json_language['Thất bại'][language]);
              set_message(
                json_language['Thông tin chuyến bay không hợp lệ'][language],
              );
              // show_message(json_language['Thất bại'][language], json_language['Thông tin chuyến bay không hợp lệ'][language])
            } else if (
              responseJson.message &&
              responseJson.message == 'Truy cập không hợp lệ'
            ) {
              setTimeout(() => {
                set_open_alert(true);
              }, 0);
              set_type_alert('thongbao');
              set_color('#EAC117');
              set_status(json_language['Thất bại'][language]);
              set_message(json_language['Truy cập không hợp lệ'][language]);
              // show_message(json_language['Thất bại'][language], json_language['Truy cập không hợp lệ'][language])
            } else if (
              responseJson.message &&
              responseJson.message ==
                'Chuyến bay đã tồn tại trong hệ thống. Vui lòng cập nhật thông tin chuyến bay mới để tiếp tục'
            ) {
              setTimeout(() => {
                set_open_alert(true);
              }, 0);
              set_type_alert('thongbao');
              set_color('#EAC117');
              set_status(json_language['Thất bại'][language]);
              set_message(
                json_language[
                  'Chuyến bay đã tồn tại trong hệ thống. Vui lòng cập nhật thông tin chuyến bay mới để tiếp tục'
                ][language],
              );
              // show_message(json_language['Thất bại'][language], json_language['Chuyến bay đã tồn tại trong hệ thống. Vui lòng cập nhật thông tin chuyến bay mới để tiếp tục'][language])
            } else {
              setTimeout(() => {
                set_open_alert(true);
              }, 0);
              set_type_alert('thongbao');
              set_color('#EAC117');
              set_status(json_language['Thất bại'][language]);
              set_message(responseJson.message);
              // show_message(json_language['Thất bại'][language], responseJson.message)}
            }
            set_open_StatusBar(false);
            return;
          }
        })
        .catch(error => {
          if (error.message === 'Network request failed') {
            setTimeout(() => {
              set_open_alert(true);
            }, 0);
            set_type_alert('thongbao');
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
            set_type_alert('thongbao');
            set_color('#EAC117');
            set_status(json_language['Thất bại'][language]);
            set_message('Time out');
            // show_message(json_language["Thất bại"][language], "Time out")
          } else {
            // xử lý các lỗi khác
            setTimeout(() => {
              set_open_alert(true);
            }, 0);
            set_type_alert('thongbao');
            set_color('#EAC117');
            set_status(json_language['Thất bại'][language]);
            set_message(error.message);
            // show_message(json_language["Thất bại"][language], error.message)
          }
          set_loading(false);
          // show_message('Error', error(error));
        });
    }
  });
  const [screenWidth, setScreenWidth] = useState(
    Dimensions.get('window').width,
  );
  const [screenHeight, setScreenHeight] = useState(
    Dimensions.get('window').height,
  );
  //dùng useRef lưu lại giá trị cũ để check khi xài listener khi click vào đồng bộ nó hiểu nhầm là thay đổi kích thước màn hình
  const coRef = useRef(0);
  // lấy dữ liệu cho lần đầu tiên nếu đã login trước đó
  const [messgae_Loading_animation, set_message_Loading_animation] =
    useState('');
  const [open_mandatory_notice, set_open_mandatory_notice] = useState(false);
  useEffect(() => {
    // setDataLocal('true', 'islogin')
    // set_loading(false)
    // setIsLogin(true)
    AsyncStorage.getItem('language')
      .then(async data => {
        temp = JSON.parse(data);

        AsyncStorage.getItem('islogin')
          .then(async data => {
            const myData = JSON.parse(data);
            if (myData === 'true') {
              set_loading(true);
              set_message_Loading_animation(
                json_language['Đang đăng nhập'][temp ? temp : language],
              );
              getDataLocal(['token']);
              if (status_module_smart_sim) {
                await getDataLocal([
                  'upgrade_tickets_voucher_prices',
                  'upgrade_tickets_voucher_types',
                  'upgrade_tickets_vouchers',
                  'wifi_voucher_prices',
                  'wifi_voucher_types',
                  'wifi_vouchers',
                  'esim_voucher_prices',
                  'esim_voucher_types',
                  'esim_vouchers',
                  'esim_region',
                  'employees',
                  'currency',
                  'order_list',
                  'user',
                  'cccdInfo',
                  'listPhoneSim',
                  'list_goicuoc',
                  'listDataCustomerSync',
                  'listDataCustomerUnsync',
                  'flyInfo',
                  'listEsim',
                  'listCusBoughtEsim',
                  'printer',
                  'checkSync',
                  'typeExistCodeEsim',
                  'typeExistCodeUpgrade',
                  'typeExistCodeWifi',
                  'setViewShotURIStorage',
                ]);
              } else {
                await getDataLocal([
                  'upgrade_tickets_voucher_prices',
                  'upgrade_tickets_voucher_types',
                  'upgrade_tickets_vouchers',
                  'wifi_voucher_prices',
                  'wifi_voucher_types',
                  'wifi_vouchers',
                  'esim_voucher_prices',
                  'esim_voucher_types',
                  'esim_vouchers',
                  'esim_region',
                  'employees',
                  'currency',
                  'order_list',
                  'user',
                  'cccdInfo',
                  'flyInfo',
                  'listEsim',
                  'listCusBoughtEsim',
                  'printer',
                  'checkSync',
                  'typeExistCodeEsim',
                  'typeExistCodeUpgrade',
                  'typeExistCodeWifi',
                  'setViewShotURIStorage',
                ]);
              }
              //nếu đã đồng bộ dữ liệu thì không cần hiển thị thông báo đề nghị điền thông tin chuyến bay
              AsyncStorage.getItem('checkSync')
                .then(async data_checkSync => {
                  await set_loading(false);
                  await setIsLogin(myData);
                  const temp_checkSync = JSON.parse(data_checkSync);
                  if (!temp_checkSync || temp_checkSync == false) {
                    // setTimeout(() => {
                    //     setUpdatechuyenbay(true)
                    // }, 0);
                    // setTimeout(() => {
                    //     setUpdatechuyenbay(true)
                    //     set_open_mandatory_notice(true)
                    // }, 0);
                    setTimeout(() => {
                      setUpdatechuyenbay(true);
                      set_open_mandatory_notice(true);
                      setCanClick(true);
                    }, 1500);
                    // }, Platform.OS == 'ios' ? 500 : 0);
                    // setTimeout(() => {
                    //     setUpdatechuyenbay(true)
                    // }, 1000);
                  } else {
                    setCanClick(true);
                  }
                  set_off_message_background(false);
                })
                .catch(err => {
                  set_loading(false);
                  console.log(err);
                });
            } else {
              setIsLogin(false);
            }
            setTimeout(() => {
              set_load_local_storage(false);
            }, 10);
          })
          .catch(err => {
            set_loading(false);
            console.log(err);
          });
      })
      .catch(() => {});
  }, [isLogin]);
  //lắng nghe ấn nút đồng bộ ở trên thanh tab bar
  useEffect(() => {
    if (route.params?.action === 'sync') {
      navigation.setParams({action: 'newActionValue'});
      coRef.current = 1;
      if (Platform.OS !== 'ios') {
        setTimeout(() => {
          set_open_alert(true);
        }, 0);
        set_type_alert('thuchien');
        set_color('#EAC117');
        set_status(json_language['Xác nhận thông tin hành trình'][language]);
        set_message(
          json_language[
            'Vui lòng [bỏ qua] thông báo này nếu bạn đã cập nhật hành trình chuyến bay để tiếp tục đồng bộ. \nXin cảm ơn!'
          ][language],
        );
      } else {
        Alert.alert(
          json_language['Xác nhận thông tin hành trình'][language],
          json_language[
            'Vui lòng [bỏ qua] thông báo này nếu bạn đã cập nhật hành trình chuyến bay để tiếp tục đồng bộ. \nXin cảm ơn!'
          ][language],
          [
            {
              text: json_language['Hủy'][language],
              //onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
            },
            {
              text: json_language['Đồng bộ'][language],
              onPress: () => sync(),
            },
          ],
          {
            cancelable: true,
            onDismiss: () => {
              // Xử lý khi thông báo bị đóng
            },
            // Các thuộc tính style dưới đây sẽ giúp bạn tùy chỉnh giao diện của thẻ alert
            titleStyle: {fontWeight: 'bold', fontSize: 18},
            messageStyle: {fontSize: 16},
            containerStyle: {backgroundColor: 'white'},
            // Nếu bạn muốn tùy chỉnh từng nút trong alert, bạn có thể sử dụng các thuộc tính style cho từng button
            buttonTextStyle: {color: 'red'},
            buttonStyle: {backgroundColor: 'transparent'},
          },
        );
      }
    }
  }, [route.params?.action]);
  //dùng để thay đổi khi lật ngang dọc màn hình
  useEffect(() => {
    if (coRef.current === 0) {
      const handleOrientationChange = () => {
        setScreenWidth(Dimensions.get('window').width);
        setScreenHeight(Dimensions.get('window').height);
      };
      Dimensions.addEventListener('change', handleOrientationChange);
      return () => {
        Dimensions.removeEventListener('change', handleOrientationChange);
      };
    }
  }, [coRef]);
  //danh sách biến trong local stoge
  const [store_data_default, set_store_data_default] = useState([]);
  const [upgrade_tickets_voucher_prices, set_upgrade_tickets_voucher_prices] =
    useState([]);
  const [upgrade_tickets_voucher_types, set_upgrade_tickets_voucher_types] =
    useState([]);
  const [upgrade_tickets_vouchers, set_upgrade_tickets_vouchers] = useState([]);
  const [wifi_voucher_prices, set_wifi_voucher_prices] = useState([]);
  const [wifi_voucher_types, set_wifi_voucher_types] = useState([]);
  const [wifi_vouchers, set_wifi_vouchers] = useState([]);

  const [esim_voucher_prices, set_esim_voucher_prices] = useState([]);
  const [esim_voucher_types, set_esim_voucher_types] = useState([]);
  const [esim_vouchers, set_esim_vouchers] = useState([]);
  const [esim_region, set_esim_region] = useState([]);

  const [employees, set_employees] = useState([]);
  const [currency, set_currency] = useState([]);
  const [order_list, set_order_list] = useState([]);
  const [token, set_token] = useState([]);
  const [user, set_user] = useState([]);
  const [cccd_info, set_cccd_info] = useState({
    cccd: '',
    date_of_birth: '',
    date_end: '',
    sex: '',
    nationality: '',
    address_residence: '',
    fullname: '',
    date_create: '',
    issued_by: '',
    uri_front_image: '',
    uri_back_image: '',
    uri_selfies_image: '',
  });

  const [openXemTTChangBay, set_openXemTTChangBay] = useState(false);
  const [isLogin, setIsLogin] = useState(Platform.OS == 'ios' ? false : true);
  const [user_login, set_user_login] = useState({
    username: '',
    password: '',
  });
  //form matruycap
  const [formMatruycap, setFormMatruycap] = useState('false');
  const [MNV, setMNV] = useState('');
  const [hoTen, setHoTen] = useState(' ');
  const [sanPhamBam, setSanPhamBam] = useState('BAMCHAT');
  const [sanPham, setSanPham] = useState('UP1');
  const [tienTe, setTienTe] = useState('vnd');
  const [soLuong, setSoLuong] = useState('1');
  const [prices_san_pham, set_prices_sp] = useState();

  //form nang hang
  const [formNanghang, setFormNanghang] = useState(false);
  const [openEsim, setOpenEsim] = useState(false);
  const [formLayMaNH, setFormLayMaNH] = useState({});
  const [formLayMaEsim, setFormLayMaEsim] = useState({});

  //lấy data từ local storage với đầu vào là danh sách string cần lấy
  const getDataLocal = useCallback(async list_name => {
    for (let i = 0; i < list_name.length; i++) {
      await AsyncStorage.getItem(list_name[i])
        .then(async data => {
          const myData = JSON.parse(data);
          //console.log('in')
          if (myData) {
            if (list_name[i] == 'upgrade_tickets_voucher_prices') {
              set_upgrade_tickets_voucher_prices(myData);
            } else if (list_name[i] == 'upgrade_tickets_voucher_types') {
              set_upgrade_tickets_voucher_types(myData);
            } else if (list_name[i] == 'upgrade_tickets_vouchers') {
              set_upgrade_tickets_vouchers(myData);
            } else if (list_name[i] == 'wifi_voucher_prices') {
              set_wifi_voucher_prices(myData);
            } else if (list_name[i] == 'wifi_voucher_types') {
              set_wifi_voucher_types(myData);
            } else if (list_name[i] == 'wifi_vouchers') {
              set_wifi_vouchers(myData);
            } else if (list_name[i] == 'esim_voucher_prices') {
              set_esim_voucher_prices(myData);
            } else if (list_name[i] == 'typeExistCodeEsim') {
              setTypeExistCodeEsim(myData);
            } else if (list_name[i] == 'typeExistCodeWifi') {
              setTypeExistCodeWifi(myData);
            } else if (list_name[i] == 'typeExistCodeUpgrade') {
              setTypeExistCodeUpgrade(myData);
            } else if (list_name[i] == 'esim_voucher_types') {
              set_esim_voucher_types(myData);
            } else if (list_name[i] == 'esim_vouchers') {
              set_esim_vouchers(myData);
            } else if (list_name[i] == 'checkSync') {
              setCheckSync(myData);
            } else if (list_name[i] == 'esim_region') {
              set_esim_region(myData);
            } else if (list_name[i] == 'employees') {
              set_employees(myData);
            } else if (list_name[i] == 'currency') {
              set_currency(myData);
            } else if (list_name[i] == 'user') {
              set_user(myData);
            } else if (list_name[i] == 'order_list') {
              set_order_list(myData);
            } else if (list_name[i] == 'token') {
              set_token(myData);
            } else if (list_name[i] == 'language') {
              set_language(myData);
            } else if (list_name[i] == 'islogin') {
              setIsLogin(myData);
            } else if (list_name[i] == 'cccdInfo') {
              set_cccd_info(myData);
            } else if (list_name[i] == 'printer') {
              // if (Platform.OS == 'ios' || Platform.OS == 'IOS')
              //     return
              setPrinter(myData);
            } else if (list_name[i] == 'listDataCustomerSync') {
              setListDataCustomerSync(myData);
              const temp = listDataCustomerTotal;
              for (let i = 0; i < myData.length; i++) {
                temp.push(myData[i]);
              }
              await setListDataCustomerTotal(temp);
              // if (temp && temp.length > 0) {
              //     let today = new Date();
              //     let day_today = today.getDate().toString();
              //     let month_today = (today.getMonth() + 1).toString(); // Lưu ý: Tháng bắt đầu từ 0
              //     if (month_today.length < 2) {
              //         month_today = "0" + month_today
              //     }
              //     if (day_today.length < 2) {
              //         day_today = "0" + day_today
              //     }
              //     const year_today = today.getFullYear().toString();
              //     const full_day = year_today + '-' + month_today + '-' + day_today
              //     const full_month = year_today + '-' + month_today
              //     // console.log(full_day)
              //     const temp1 = listDataCustomerTotal.filter((d) => {
              //         return d.createdAt && d.createdAt.toString().includes((full_day).toUpperCase())
              //     })
              //     set_total_sim_sold_today(temp1.length)
              // }
              // await openBanMaTCWifi();
              // await openNangHang();
            } else if (list_name[i] == 'listDataCustomerUnsync') {
              setListDataCustomerUnsync(myData);
              const temp = [...listDataCustomerTotal];
              for (let i = 0; i < myData.length; i++) {
                temp.push(myData[i]);
              }
              setListDataCustomerTotal(temp);
              // if (temp && temp.length > 0) {
              //     let today = new Date();
              //     let day_today = today.getDate().toString();
              //     let month_today = (today.getMonth() + 1).toString(); // Lưu ý: Tháng bắt đầu từ 0
              //     if (month_today.length < 2) {
              //         month_today = "0" + month_today
              //     }
              //     if (day_today.length < 2) {
              //         day_today = "0" + day_today
              //     }
              //     const year_today = today.getFullYear().toString();
              //     const full_day = year_today + '-' + month_today + '-' + day_today
              //     const full_month = year_today + '-' + month_today
              //     // console.log(full_day)
              //     const temp1 = listDataCustomerTotal.filter((d) => {
              //         return d.createdAt && d.createdAt.toString().includes((full_day).toUpperCase())
              //     })
              //     set_total_sim_sold_today(temp1.length)
              // }
            } else if (list_name[i] == 'listDataCustomerTotal') {
              setListDataCustomerTotal(myData);
            } else if (list_name[i] == 'list_goicuoc') {
              set_list_goicuoc(myData);
            } else if (list_name[i] == 'listPhoneSim') {
              set_listPhoneSim(myData);
            } else if (list_name[i] == 'flyInfo') {
              set_flyInfo(myData);
              // setsoHieu_chuyenbay(myData.soHieu)
              // setchangBay_chuyenbay(myData.changBay)
              // console.log('in ngay bay')
              // console.log(myData.ngayBay)
              if (myData.ngayBay) {
                // console.log(myData)
                let date_new = new Date();
                const parts = myData.ngayBay.split('/');
                if (parts.length == 3) {
                  const year = parseInt(parts[2].replace(/^O+/, ''));
                  const month = parseInt(parts[1].replace(/^O+/, '')) - 1;
                  const day = parseInt(parts[0].replace(/^O+/, ''));
                  date_new = new Date(year, month, day);
                  // setngayBay_chuyenbay(date_new)
                }
                // setgioBay_chuyenbay(myData.gioBay)
                // console.log(myData.chauLuc)
                set_chuyenbay({
                  soHieu_chuyenbay: myData.soHieu != '' ? myData.soHieu : 'QH',
                  changBay_chuyenbay: myData.changBay,
                  ngayBay_chuyenbay: date_new,
                  gioBay_chuyenbay: myData.gioBay,
                  chauLuc_chuyenbay: !myData.chauLuc ? 'VN' : myData.chauLuc,
                });
                set_chuyenbay_tam({
                  soHieu_chuyenbay: myData.soHieu != '' ? myData.soHieu : 'QH',
                  changBay_chuyenbay: myData.changBay,
                  ngayBay_chuyenbay: date_new,
                  gioBay_chuyenbay: myData.gioBay,
                  chauLuc_chuyenbay: !myData.chauLuc ? 'VN' : myData.chauLuc,
                });
              }
            } else if (list_name[i] == 'listEsim') {
              setListEsim(myData);
            } else if (list_name[i] == 'listCusBoughtEsim') {
              setListCusBoughtEsim(myData);
            } else set_store_data_default(myData);
          }
          return myData;
        })
        .catch(error => {
          setTimeout(() => {
            set_open_alert(true);
          }, 0);
          set_type_alert('thongbao');
          set_color('#EAC117');
          set_status('Error get data from local');
          set_message(error.message ? error.message : '');
          // show_message('Error get data from local', error);
        });
    }
  });
  //đồng bộ sim tự động khi có mạng
  const RegisterCustomerSync = useCallback(async form_data_register => {
    const url_register = url_api.api_post_register;
    set_loading(true);
    set_message_Loading_animation(
      json_language['Đang đồng bộ dữ liệu khách hàng'][language],
    );
    //đồng bộ ảnh trước để lấy đường dẫn thực tế trên internet bỏ vào mục "cdn"
    const url = url_api.api_post_image;
    const authToken =
      'yvnRdXpzta2UwjO5WTDKSpoyc3urw4vSXLqvo3KdDixqkvdSCy2wgX4CCXzq3V0_7xLQ2mHZwtOXmZK2sOhHhhnnbrh5T41qEqK_wHsFwKw=';

    const formData = new FormData();
    for (i of form_data_register) {
      let CusNumPhone_IDCard = i.phoneRegister + '_';
      // console.log(CusNumPhone_IDCard)
      // console.log(i.pathFileFront)
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
    }
    // console.log(formData)
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
      // console.log('in nè')
      // console.log(data);
      // console.log(response);
      // console.log(data.data.length)
      // set_loading(false)
      if (data.result == 1 && data.data && data.data.length != 0) {
        // console.log("vô")
        list_image_res = data.data;
      }
    } catch (error) {
      if (error.message === 'Network request failed') {
        setTimeout(() => {
          set_open_alert(true);
        }, 0);
        set_type_alert('thongbao');
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
        set_type_alert('thongbao');
        set_color('#EAC117');
        set_status(json_language['Thất bại'][language]);
        set_message('Time out');
        // show_message(json_language["Thất bại"][language], "Time out")
      } else {
        setTimeout(() => {
          set_open_alert(true);
        }, 0);
        set_type_alert('thongbao');
        set_color('#EAC117');
        set_status(json_language['Thất bại'][language]);
        set_message(error.message);
        // show_message(json_language["Thất bại"][language], error.message)
        // xử lý các lỗi khác
      }
      set_loading(false);
    }

    // console.log(list_image_res)
    // return

    if (list_image_res.length == 0) {
      setTimeout(() => {
        set_open_alert(true);
      }, 0);
      set_type_alert('thongbao');
      set_color('#EAC117');
      set_status(json_language['Thất bại'][language]);
      set_message(json_language['Đồng bộ ảnh thất bại'][language]);
      // show_message(json_language["Thất bại"][language], json_language["Đồng bộ ảnh thất bại"][language])
      set_loading(false);
      return;
    }
    for (i of list_image_res) {
      for (j of form_data_register) {
        let image_split = i.split('_');
        //thay đường đẫn cũ đến ảnh trên internet bằng đường dẫn mới đồng bộ về
        if (image_split[0] == j.phoneRegister) {
          j['cdn'][image_split[1]] = 'https://files.vtctelecom.com.vn/sim/' + i;

          if (image_split[1] == 'front') {
            j['imageFront'] = 'https://files.vtctelecom.com.vn/sim/' + i;
          } else if (image_split[1] == 'back') {
            j['imageBack'] = 'https://files.vtctelecom.com.vn/sim/' + i;
          } else {
            j['imagePortrait'] = 'https://files.vtctelecom.com.vn/sim/' + i;
          }
        }
      }
    }

    // console.log(form_data_register)
    setDataLocal(form_data_register, 'listDataCustomerUnsync');
    setListDataCustomerUnsync(form_data_register);
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
      .then(responseJson => {
        //console.log('inin ')
        if (responseJson.result == 1) {
          // console.log(responseJson)
          set_loading(false);
          let temp_listDataCusSync = listDataCustomerSync;
          for (i of listDataCustomerUnsync) {
            temp_listDataCusSync.push(i);
          }
          setDataLocal([], 'listDataCustomerUnsync');
          setDataLocal(temp_listDataCusSync, 'listDataCustomerSync');
          setListDataCustomerSync(temp_listDataCusSync);
          setListDataCustomerUnsync([]);
          set_loading(false);
          setTimeout(() => {
            set_open_alert(true);
          }, 0);
          set_type_alert('thongbao');
          set_color('#1589FF');
          set_status(json_language['Thành công'][language]);
          set_message(
            json_language['Thông tin đã được cập nhật lên hệ thống'][language],
          );
          // show_message(json_language['Thành công'][language], json_language['Thông tin đã được cập nhật lên hệ thống'])
          return 1;
        } else {
          set_loading(false);
          setTimeout(() => {
            set_open_alert(true);
          }, 0);
          set_type_alert('thongbao');
          set_color('#EAC117');
          set_status(json_language['Thất bại'][language]);
          set_message(responseJson.message);
          // show_message(json_language['Thất bại'][language], responseJson.message)
        }
      })
      .catch(error => {
        if (error.message === 'Network request failed') {
          setTimeout(() => {
            set_open_alert(true);
          }, 0);
          set_type_alert('thongbao');
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
          set_type_alert('thongbao');
          set_color('#EAC117');
          set_status(json_language['Thất bại'][language]);
          set_message('Time out');
          // show_message(json_language["Thất bại"][language], "Time out")
        } else {
          setTimeout(() => {
            set_open_alert(true);
          }, 0);
          set_type_alert('thongbao');
          set_color('#EAC117');
          set_status(json_language['Thất bại'][language]);
          set_message(error.message);
          // show_message(json_language["Thất bại"][language], error.message)
          // xử lý các lỗi khác
        }
        set_loading(false);
        // show_message('Error', error(error));
      });
  });
  //đăng nhập
  const coRefFirst = useRef(0);
  //khi k có mạng và mở mạng lên nếu có dữ liệu sim chưa đồng bộ thì gợi ý đồng bộ
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
      if (state.isConnected) {
        // console.log('sjdsjjhk')
        if (
          coRefFirst.current != 1 &&
          listDataCustomerSync.length > 0 &&
          listDataCustomerTotal.length > 0
        ) {
          coRefFirst.current = 1;
          if (listDataCustomerUnsync.length > 0) {
            Alert.alert(
              json_language['Dữ liệu chưa đồng bộ'][language],
              json_language[
                'Bạn có muốn đồng bộ dữ liệu khách hàng đã mua sim'
              ][language],
              [
                {
                  text: 'Cancel',
                  //onPress: () => console.log('Cancel Pressed'),
                  style: 'cancel',
                },
                {
                  text: 'OK',
                  onPress: async () =>
                    await RegisterCustomerSync(listDataCustomerUnsync),
                },
              ],
            );
          }
        }
      }
    });

    return () => {
      unsubscribe();
    };
  }, [coRefFirst, isLogin]);
  //gửi thông tin đăng nhập lên api
  const sendValues = useCallback(async (username, password) => {
    if (!isConnected) {
      // set_loading(false)
      // setTimeout(() => {
      //     set_open_alert(true)
      // }, 0);
      // set_type_alert('thongbao')
      // set_color('#EAC117')
      // set_status(json_language["Đăng nhập thất bại"][language])
      // set_message(json_language["Không có kết nối. Vui lòng kết nối mạng và thử lại"][language])
      // show_message(json_language["Đăng nhập thất bại"][language], json_language["Không có kết nối. Vui lòng kết nối mạng và thử lại"][language])
      return;
    } else {
      set_loading(true);
      set_message_Loading_animation(
        json_language['Đang kiểm tra thông tin đăng nhập'][language],
      );
      try {
        // console.log('vô login')
        const response = await fetch(url_api.login, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            UserName: username,
            Password: password,
            DeviceId: device_id,
            // UserName: 'thuatnd007@yopmail.com',
            // Password: 'zXks13X3',
            // DeviceId: "8e90f79e9b7f5793"
            // UserName: 'adminvtc@yopmail.com',
            // Password: 'Thai123456789'
            // DeviceId: "8e90f79e9b7f5793"
          }),
        });
        // console.log('xong api')
        const responseJson = await response.json();
        if (responseJson.result == 1) {
          // console.log('vô')
          setDataLocal(responseJson.data.token, 'token');
          setDataLocal(responseJson.data.user, 'user');

          await Promise.all([
            getDataLocal(['token']),
            getDataLocal([
              'upgrade_tickets_voucher_prices',
              'upgrade_tickets_voucher_types',
              'upgrade_tickets_vouchers',
              'wifi_voucher_prices',
              'wifi_voucher_types',
              'wifi_vouchers',
              'employees',
              'currency',
              'order_list',
              'user',
            ]),
          ]);
          // console.log("vô fetch")

          if (!status_module_smart_sim) {
            setDataLocal('true', 'islogin');
            set_loading(false);
            set_off_message_background(false);
            setIsLogin(true);
            setCanClick(true);
            set_user_login({
              ...user_login,
              password: '',
            });
            if (Platform.OS == 'ios') {
              setTimeout(() => {
                setUpdatechuyenbay(true);
                set_open_mandatory_notice(true);
              }, 1000);

              // show_message(json_language['Thành công'][language], json_language['Đăng nhập thành công'][language])
            } else {
              setTimeout(() => {
                // show_message(json_language['Thành công'][language], json_language['Đăng nhập thành công'][language])
              }, 0);
              setUpdatechuyenbay(true);
              set_open_mandatory_notice(true);
            }
            // setTimeout(() => {
            //     set_open_alert(true)
            // }, 0);
            // set_color('#1589FF')
            // set_status(json_language["Thành công"][language])
            // set_message(json_language["Đồng bộ dữ liệu thành công"][language])
          } else {
            await FetchDataSim();
          }
          // console.log("inin")
          set_loading(false);
        } else {
          set_loading(false);
          if (Platform.OS == 'ios') {
            show_message(
              json_language['Thất bại'][language],
              json_language[responseJson.message]
                ? json_language[responseJson.message][language]
                : json_language['Đăng nhập thất bại'][language],
            );
          } else {
            setTimeout(() => {
              set_open_alert(true);
            }, 0);
            set_type_alert('thongbao');
            set_color('#EAC117');
            set_status(json_language['Thất bại'][language]);
            // console.log(responseJson)
            set_message(
              json_language[responseJson.message]
                ? json_language[responseJson.message][language]
                : json_language['Đăng nhập thất bại'][language],
            );
          }
        }
      } catch (error) {
        if (!isConnected) {
          set_loading(false);
          setTimeout(() => {
            set_open_alert(true);
          }, 0);
          set_type_alert('thongbao');
          set_color('#EAC117');
          set_status(json_language['Đăng nhập thất bại'][language]);
          set_message(
            json_language['Không có kết nối. Vui lòng kết nối mạng và thử lại'][
              language
            ],
          );
          return;
        }
        // console.log('vô')
        if (error.message === 'Network request failed') {
          setTimeout(() => {
            set_open_alert(true);
          }, 0);
          set_type_alert('thongbao');
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
          setTimeout(() => {
            set_open_alert(true);
          }, 0);
          set_type_alert('thongbao');
          set_color('#EAC117');
          set_status(json_language['Thất bại'][language]);
          set_message(error.message);
          // show_message(json_language["Thất bại"][language], error.message)
          // xử lý các lỗi khác
        }
        set_loading(false);
        // show_message('Error', error(error));
      }
      return 0;
    }
    //console.log(res.data.token)
  });
  //dữ liệu tổng hợp của thông tin khách hàng đã mua sim sẽ không được lưu trong local storage
  //lúc đồng bộ sẽ tổng hợp lại
  const [listDataCustomerSync, setListDataCustomerSync] = useState([]);
  const [listDataCustomerUnsync, setListDataCustomerUnsync] = useState([]);
  const [listDataCustomerTotal, setListDataCustomerTotal] = useState([]);
  const [list_goicuoc, set_list_goicuoc] = useState([]);
  const [listPhoneSim, set_listPhoneSim] = useState([]);
  const [total_sim_sold_today, set_total_sim_sold_today] = useState(0);
  const [total_esim_sold_today, set_total_esim_sold_today] = useState(0);
  //hàm xóa dữ liệu sim cũ
  const deleteURI = async uri => {
    try {
      await RNFS.unlink(uri);
      // console.log('URI đã được xóa thành công');
    } catch (error) {
      // console.log('Đã xảy ra lỗi khi xóa URI:', error);
    }
  };
  const [listEsim, setListEsim] = useState([]);
  const [listCusBoughtEsim, setListCusBoughtEsim] = useState([]);
  //hàm get list esim
  const getListEsim = useCallback(async () => {
    if (!isConnected) {
      setTimeout(() => {
        set_open_alert(true);
      }, 0);
      set_type('thongbao');
      set_color('#EAC117');
      set_status(json_language['Đồng bộ thất bại'][language]);
      set_message(
        json_language['Không có kết nối. Vui lòng kết nối mạng và thử lại'][
          language
        ],
      );
      // show_message(json_language["Đồng bộ thất bại"][language], json_language["Không có kết nối. Vui lòng kết nối mạng và thử lại"][language])
      return 0;
    }
    const fight = [
      {
        fight: {
          number: chuyenbay.soHieu_chuyenbay,
          dst: chuyenbay.changBay_chuyenbay,
          time: chuyenbay.gioBay_chuyenbay,
          day: moment(chuyenbay.ngayBay_chuyenbay).format('DD/MM/YY'),
        },
      },
    ];
    set_loading(true);
    set_message_Loading_animation(
      json_language['Đang tải dữ liệu sim'][language],
    );
    await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
      timeout: 50000,
      body:
        listEsim != null && listEsim.length != 0
          ? listCusBoughtEsim.filter(d => {
              return d.status == 1;
            })
          : fight,
    })
      .then(response => response.json())
      .then(responseJson => {
        // handle responses here
        if (responseJson.result > 0) {
          // set_loading(false)
          setListEsim(responseJson.data);
          for (let i of listCusBoughtEsim) {
            i.status = 2;
          }
          setListCusBoughtEsim(listCusBoughtEsim);
          setDataLocal(responseJson.data, 'listEsim');
          return 1;
        }
      })
      .catch(error => {
        set_loading(false);
        if (error.message === 'Network request failed') {
          setTimeout(() => {
            set_open_alert(true);
          }, 0);
          set_type('thongbao');
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
          set_type('thongbao');
          set_color('#EAC117');
          set_status(json_language['Thất bại'][language]);
          set_message('Time out');
          // show_message(json_language["Thất bại"][language], "Time out")
        } else {
          setTimeout(() => {
            set_open_alert(true);
          }, 0);
          set_type('thongbao');
          set_color('#EAC117');
          set_status(json_language['Thất bại'][language]);
          set_message(error.message);
          // show_message(json_language["Thất bại"][language], error.message)
          // xử lý các lỗi khác
        }
        return 0;
      });
  });
  //get api từ api của smart sim gồm 3 api
  const FetchDataSim = useCallback(async () => {
    return new Promise((resolve, reject) => {
      if (!isConnected) {
        setTimeout(() => {
          set_open_alert(true);
        }, 0);
        set_type_alert('thongbao');
        set_color('#EAC117');
        set_status(json_language['Đồng bộ thất bại'][language]);
        set_message(
          json_language['Không có kết nối. Vui lòng kết nối mạng và thử lại'][
            language
          ],
        );
        // show_message(json_language["Đồng bộ thất bại"][language], json_language["Không có kết nối. Vui lòng kết nối mạng và thử lại"][language])
        return 0;
      }
      set_loading(true);
      set_message_Loading_animation(
        json_language['Đang tải dữ liệu sim'][language],
      );
      const urls = [
        url_api.api_get_listphone,
        url_api.api_get_sync,
        url_api.api_get_list_goicuoc,
      ];

      Promise.all(
        urls.map(
          async url =>
            await fetch(url, {
              method: 'GET',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization:
                  'Bearer yvnRdXpzta2UwjO5WTDKSpoyc3urw4vSXLqvo3KdDixqkvdSCy2wgX4CCXzq3V0_7xLQ2mHZwtOXmZK2sOhHhhnnbrh5T41qEqK_wHsFwKw=',
              },
              // timeout: 500000,
            }).then(response => response.json()),
        ),
      )
        .then(
          ([
            listPhoneDataCallAPI,
            syncDataCallAPI,
            list_goicuocDataCallAPI,
          ]) => {
            // handle responses here
            // you can access each response with listPhoneDataCallAPI, syncDataCallAPI, and list_goicuocDataCallAPI
            // set_loading(false)
            if (
              listPhoneDataCallAPI.result == 1 &&
              syncDataCallAPI.result == 1 &&
              list_goicuocDataCallAPI.result == 1
            ) {
              const imageUrls = [
                // 'https://files.vtctelecom.com.vn/sim/0855858843_front_e544483f-3f38-41e2-8150-2ae3b820a77c.jpeg',
                // 'https://files.vtctelecom.com.vn/sim/0855858843_back_366e39f6-34a5-4032-9e5a-0fa085ba5115.jpeg',
                // 'https://files.vtctelecom.com.vn/sim/0855858843_portrait_e93e30d1-9228-4207-896f-9b9ca5554c61.jpeg'
                //Thêm đường dẫn ảnh khác nếu có
              ];
              // for (let i = 0; i < syncDataCallAPI.data.length; i++) {
              for (let i = 0; i < syncDataCallAPI.data.length; i++) {
                // imageUrls.push(syncDataCallAPI.data[i].cdn.front)
                // imageUrls.push(syncDataCallAPI.data[i].cdn.back)
                imageUrls.push(syncDataCallAPI.data[i].cdn.portrait);
              }
              Promise.all(
                imageUrls.map(
                  async imageUrl =>
                    await RNFetchBlob.config({
                      fileCache: true,
                      appendExt: 'jpg',
                    }).fetch('GET', imageUrl),
                ),
              )
                .then(async fetch_image => {
                  // Lưu đường dẫn đến các file ảnh đã tải vào một mảng
                  for (let i = 0; i < fetch_image.length; i++) {
                    if (fetch_image[i].respInfo.status != 200) {
                      set_loading(false);
                      setTimeout(() => {
                        set_open_alert(true);
                      }, 0);
                      set_type_alert('thongbao');
                      set_color('#EAC117');
                      set_status(json_language['Lỗi ảnh'][language]);
                      set_message(
                        json_language['Đồng bộ dữ liệu thất bại'][language],
                      );
                      // show_message(json_language['Lỗi ảnh'][language], json_language['Đồng bộ dữ liệu thất bại'][language])
                      return 0;
                    }
                  }
                  let imagePaths = fetch_image.map(res => res.path());
                  // giảm dung lượng nếu mong muốn
                  // for (i of imagePaths) {
                  //     i = await ImageResizer.createResizedImage(
                  //         i,
                  //         790, // Độ rộng mới mong muốn
                  //         500, // Chiều cao mới mong muốn
                  //         'JPEG', // Định dạng hình ảnh (JPEG, PNG, ...)
                  //         50, // Chất lượng hình ảnh mới (0-100)
                  //         0, // Góc xoay hình ảnh (0, 90, 180, 270)
                  //     );
                  // }
                  for (let i = 0, j = 0; i < imagePaths.length; i += 1, j++) {
                    // syncDataCallAPI.data[j].pathFileFront = "file://" + imagePaths[i]
                    // syncDataCallAPI.data[j].pathFileBack = "file://" + imagePaths[i + 1]
                    syncDataCallAPI.data[j].pathFilePortrait =
                      'file://' + imagePaths[i];
                  }
                  // console.log(syncDataCallAPI.data.length)
                  // console.log(listDataCustomerUnsync.length)
                  const temp_total_ = [...syncDataCallAPI.data];
                  setListDataCustomerSync(syncDataCallAPI.data);
                  for (i of listDataCustomerUnsync) {
                    temp_total_.push(i);
                  }
                  // setListDataCustomerUnsync([])
                  //xóa uri cũ
                  let list_image_uri = [];
                  for (i of temp_total_) {
                    list_image_uri.push(i.pathFileFront);
                    list_image_uri.push(i.pathFileBack);
                    list_image_uri.push(i.pathFilePortrait);
                  }
                  for (i of listDataCustomerSync) {
                    deleteURI(i.pathFileFront);
                    deleteURI(i.pathFileBack);
                    deleteURI(i.pathFilePortrait);
                  }
                  setListDataCustomerTotal(temp_total_);
                  set_list_goicuoc(list_goicuocDataCallAPI.data);
                  set_listPhoneSim(listPhoneDataCallAPI.data);
                  setDataLocal([], 'listDataCustomerUnsync');
                  setDataLocal(syncDataCallAPI.data, 'listDataCustomerSync');
                  setDataLocal(list_goicuocDataCallAPI.data, 'list_goicuoc');
                  setDataLocal(listPhoneDataCallAPI.data, 'listPhoneSim');

                  // console.log(listPhoneDataCallAPI)
                  // console.log(syncDataCallAPI)
                  // console.log(list_goicuocDataCallAPI)
                  // console.log('Đường dẫn các file ảnh:', imagePaths);
                  setDataLocal('true', 'islogin');
                  set_off_message_background(false);
                  setIsLogin(true);
                  setCanClick(true);
                  setTimeout(() => {
                    setUpdatechuyenbay(true);
                    set_open_mandatory_notice(true);
                  }, 100);
                  set_loading(false);
                  // setTimeout(() => {
                  //     set_open_alert(true)
                  // }, 0);
                  // set_color('#1589FF')
                  // set_status(json_language["Thành công"][language])
                  // set_message(json_language["Đồng bộ dữ liệu thành công"][language])
                  // show_message(json_language['Thành công'][language], json_language['Đồng bộ dữ liệu thành công'][language])
                  return 1;
                  // Hiển thị các ảnh này trong ứng dụng của bạn
                  // ...
                })
                .catch(error => {
                  // console.log('dksajjkdjkl')
                  // console.log(error.message)
                  if (error.message === 'Network request failed') {
                    setTimeout(() => {
                      set_open_alert(true);
                    }, 0);
                    set_type_alert('thongbao');
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
                    set_type_alert('thongbao');
                    set_color('#EAC117');
                    set_status(json_language['Thất bại'][language]);
                    set_message('Time out');
                    // show_message(json_language["Thất bại"][language], "Time out")
                  } else {
                    setTimeout(() => {
                      set_open_alert(true);
                    }, 0);
                    set_type_alert('thongbao');
                    set_color('#EAC117');
                    set_status(json_language['Thất bại'][language]);
                    set_message(error.message ? error.message : 'undefined');
                    // show_message(json_language["Thất bại"][language], error.message)
                    // xử lý các lỗi khác
                  }
                  set_loading(false);
                  return 0;
                });
            } else {
              set_loading(false);
              setTimeout(() => {
                set_open_alert(true);
              }, 0);
              set_type_alert('thongbao');
              set_color('#EAC117');
              set_status(json_language['Thất bại'][language]);
              set_message(json_language['Đồng bộ dữ liệu thất bại'][language]);
              // show_message(json_language['Thất bại'][language], json_language['Đồng bộ dữ liệu thất bại'][language])
              return 0;
            }
          },
        )
        .catch(error => {
          if (error.message === 'Network request failed') {
            setTimeout(() => {
              set_open_alert(true);
            }, 0);
            set_type_alert('thongbao');
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
            set_type_alert('thongbao');
            set_color('#EAC117');
            set_status(json_language['Thất bại'][language]);
            set_message('Time out');
            // show_message(json_language["Thất bại"][language], "Time out")
          } else {
            setTimeout(() => {
              set_open_alert(true);
            }, 0);
            set_type_alert('thongbao');
            set_color('#EAC117');
            set_status(json_language['Thất bại'][language]);
            set_message(error.message);
            // show_message(json_language["Thất bại"][language], error.message)
            // xử lý các lỗi khác
          }
          set_loading(false);
        });
      return 0;
    });
  });

  //khi đúng mã MNV thì sẽ tự động viết hoa và cật nhật họ tên nhân viên
  const handleMNVChange = useCallback(newText => {
    setMNV(newText);
    if (employees && newText) {
      const temp = employees.find(emp => emp.code === newText.toUpperCase());
      if (temp) {
        setMNV(newText.toUpperCase());
        setHoTen(temp.name);
      } else setHoTen('');
    } else setHoTen(' ');
  });
  //handle số lượng là số nguyên
  const handleInputChange = useCallback(text => {
    // Chỉ cho phép nhập số nguyên

    if (!text) {
      setSoLuong('1');
      // return
    }
    const regex = /^[0-9]*$/;
    if (regex.test(text)) {
      if (text[0] === '0') {
        text = text.slice(0, 0);
      }
      if (parseInt(text) > 25) {
        setSoLuong('1');
      } else {setSoLuong(text);}
    }
  });
  //Tou lấy mã nâng hạng
  const layMaNHWifi = useCallback(() => {
    if (MNV && hoTen != '') {
      if (!soLuong) {
        setTimeout(() => {
          set_open_alert(true);
        }, 0);
        set_type_alert('thongbao');
        set_color('#EAC117');
        set_status(json_language['Lỗi'][language]);
        set_message(json_language['Số lượng phải lớn hơn 0'][language]);
        // show_message(json_language['Lỗi'][language], json_language["Số lượng phải lớn hơn 0"][language])
        return;
      }
      if (Number(soLuong) <= 0) {
        setTimeout(() => {
          set_open_alert(true);
        }, 0);
        set_type_alert('thongbao');
        set_color('#EAC117');
        set_status(json_language['Lỗi'][language]);
        set_message(json_language['Số lượng phải lớn hơn 0'][language]);
        // show_message(json_language['Lỗi'][language], json_language["Số lượng phải lớn hơn 0"][language])
        return;
      }
      upgrade_vouchers(sanPham, upgrade_tickets_vouchers);
    } else {
      setTimeout(() => {
        set_open_alert(true);
      }, 0);
      set_type_alert('thongbao');
      set_color('#EAC117');
      set_status(json_language['Lỗi'][language]);
      set_message(
        json_language['Mã nhân viên và họ tên không được để trống'][language],
      );
      // show_message(json_language['Lỗi'][language], json_language['Mã nhân viên và họ tên không được để trống'][language])
    }
  });
  const layMaEsim = useCallback(() => {
    if (MNV && hoTen != '') {
      if (!soLuong) {
        setTimeout(() => {
          set_open_alert(true);
        }, 0);
        set_type_alert('thongbao');
        set_color('#EAC117');
        set_status(json_language['Lỗi'][language]);
        set_message(json_language['Số lượng phải lớn hơn 0'][language]);
        // show_message(json_language['Lỗi'][language], json_language["Số lượng phải lớn hơn 0"][language])
        return;
      }
      if (Number(soLuong) <= 0) {
        setTimeout(() => {
          set_open_alert(true);
        }, 0);
        set_type_alert('thongbao');
        set_color('#EAC117');
        set_status(json_language['Lỗi'][language]);
        set_message(json_language['Số lượng phải lớn hơn 0'][language]);
        // show_message(json_language['Lỗi'][language], json_language["Số lượng phải lớn hơn 0"][language])
        return;
      }
      upgrade_vouchers_esim(sanPham, esim_vouchers);
    } else {
      setTimeout(() => {
        set_open_alert(true);
      }, 0);
      set_type_alert('thongbao');
      set_color('#EAC117');
      set_status(json_language['Lỗi'][language]);
      set_message(
        json_language['Mã nhân viên và họ tên không được để trống'][language],
      );
      // show_message(json_language['Lỗi'][language], json_language['Mã nhân viên và họ tên không được để trống'][language])
    }
  });
  //tou lấy mã bán wifi
  const layMaBanWifi = useCallback(() => {
    if (MNV && hoTen != '') {
      if (!soLuong) {
        setTimeout(() => {
          set_open_alert(true);
        }, 0);
        set_type_alert('thongbao');
        set_color('#EAC117');
        set_status(json_language['Lỗi'][language]);
        set_message(json_language['Số lượng phải lớn hơn 0'][language]);
        // show_message(json_language['Lỗi'][language], json_language["Số lượng phải lớn hơn 0"][language])
        return;
      }
      if (Number(soLuong) <= 0) {
        setTimeout(() => {
          set_open_alert(true);
        }, 0);
        set_type_alert('thongbao');
        set_color('#EAC117');
        set_status(json_language['Lỗi'][language]);
        set_message(json_language['Số lượng phải lớn hơn 0'][language]);
        // show_message(json_language['Lỗi'][language], json_language["Số lượng phải lớn hơn 0"][language])
        return;
      }
      mua_ma_ban_wifi(sanPhamBam, wifi_vouchers);
    } else {
      setTimeout(() => {
        set_open_alert(true);
      }, 0);
      set_type_alert('thongbao');
      set_color('#EAC117');
      set_status(json_language['Lỗi'][language]);
      set_message(
        json_language['Mã nhân viên và họ tên không được để trống'][language],
      );
    }
    //có result lấy số lượng
  });
  //cập nhật chuyến bay
  const [flyInfo, set_flyInfo] = useState({
    soHieu: '',
    changBay: '',
    ngayBay: '',
    gioBay: '',
    chauLuc_chuyenbay: '',
  });
  const [chuyenbay_tam, set_chuyenbay_tam] = useState({
    chauLuc_chuyenbay: '',
    soHieu_chuyenbay: flyInfo.soHieu,
    changBay_chuyenbay: flyInfo.changBay,
    ngayBay_chuyenbay: new Date(),
    gioBay_chuyenbay:
      flyInfo.gioBay != ''
        ? flyInfo.gioBay
        : moment(new Date()).format('HH:mm'),
  });
  const CapNhatChangBay = useCallback(chuyenbay_tam => {
    if (checkSync == false) {
      set_chuyenbay(chuyenbay_tam);
      set_flyInfo({
        soHieu: chuyenbay_tam.soHieu_chuyenbay,
        changBay: chuyenbay_tam.changBay_chuyenbay,
        ngayBay: chuyenbay_tam.ngayBay_chuyenbay,
        gioBay: chuyenbay_tam.gioBay_chuyenbay,
        chauLuc: chuyenbay_tam.chauLuc_chuyenbay,
      });
      // console.log(ngayBay_chuyenbay.toLocaleDateString())
      setDataLocal(
        {
          soHieu: chuyenbay_tam.soHieu_chuyenbay,
          changBay: chuyenbay_tam.changBay_chuyenbay,
          ngayBay: chuyenbay_tam.ngayBay_chuyenbay
            ? moment(chuyenbay_tam.ngayBay_chuyenbay).format('DD/MM/YYYY')
            : moment(new Date()).format('DD/MM/YYYY'),
          gioBay: chuyenbay_tam.gioBay_chuyenbay,
          chauLuc: chuyenbay_tam.chauLuc_chuyenbay,
        },
        'flyInfo',
      );
      setTimeout(() => {
        set_open_alert(true);
      }, 0);
      set_type_alert('thongbao');
      set_color('#1589FF');
      set_status(json_language['Thành công'][language]);
      set_message(json_language['Cật nhật thành công'][language]);
      // show_message(json_language['Thành công'][language], json_language['Cật nhật thành công'][language])
    } else {
      setTimeout(() => {
        set_open_alert(true);
      }, 0);
      set_type_alert('thongbao');
      set_color('#EAC117');
      set_status(json_language['Thất bại'][language]);
      set_message(
        json_language['Đồng bộ lại để cập nhật chuyến bay mới'][language],
      );
      // show_message(json_language['Thất bại'][language], json_language['Đồng bộ lại để cập nhật chuyến bay mới'][language])
    }
  });
  //format local store
  const set_data_local_store = useCallback(data_store => {
    if (data_store) {
      // console.log(data_store.esim_joytel)
      let temp = [];
      setDataLocal(
        data_store.upgrade_tickets && data_store.upgrade_tickets.prices
          ? data_store.upgrade_tickets.prices
          : [],
        'upgrade_tickets_voucher_prices',
      );

      if (data_store.upgrade_tickets && data_store.upgrade_tickets.types) {
        for (let i of data_store.upgrade_tickets.types) {
          if (temp.length != 0) {
            let listTypes = temp.filter(d => {
              return d.code == i.code;
            });
            if (!listTypes || listTypes.length == 0) {
              temp.push(i);
            }
          } else {
            temp.push(i);
          }
        }
      }
      let tempExistCode = [];
      if (
        temp &&
        temp.length > 0 &&
        data_store.upgrade_tickets &&
        data_store.upgrade_tickets.vouchers
      ) {
        for (i of temp) {
          let tempExistCodeFilte = data_store.upgrade_tickets.vouchers.filter(
            d => {
              return d.code == i.code;
            },
          );
          if (tempExistCodeFilte && tempExistCodeFilte.length > 0) {
            tempExistCode.push(i);
          }
        }
      }

      setDataLocal(tempExistCode, 'typeExistCodeUpgrade');
      setTypeExistCodeUpgrade(tempExistCode);

      setDataLocal(temp, 'upgrade_tickets_voucher_types');
      setDataLocal(
        data_store.upgrade_tickets && data_store.upgrade_tickets.vouchers
          ? data_store.upgrade_tickets.vouchers
          : [],
        'upgrade_tickets_vouchers',
      );
      setDataLocal(
        data_store.wifi && data_store.wifi.prices ? data_store.wifi.prices : [],
        'wifi_voucher_prices',
      );
      let tempWifi = [];
      if (data_store.wifi && data_store.wifi.types) {
        for (let i of data_store.wifi.types) {
          if (tempWifi.length != 0) {
            let listTypes = tempWifi.filter(d => {
              return d.code == i.code;
            });
            if (!listTypes || listTypes.length == 0) {
              tempWifi.push(i);
            }
          } else {
            tempWifi.push(i);
          }
        }
      }
      let tempExistCodeWifi = [];
      if (
        tempWifi &&
        tempWifi.length > 0 &&
        data_store.wifi &&
        data_store.wifi.vouchers
      ) {
        for (i of tempWifi) {
          let tempExistCodeFilte = data_store.wifi.vouchers.filter(d => {
            return d.code == i.code;
          });
          if (tempExistCodeFilte && tempExistCodeFilte.length > 0) {
            tempExistCodeWifi.push(i);
          }
        }
      }

      setDataLocal(tempExistCodeWifi, 'typeExistCodeWifi');
      setTypeExistCodeWifi(tempExistCodeWifi);

      setDataLocal(tempWifi, 'wifi_voucher_types');
      setDataLocal(
        data_store.wifi && data_store.wifi.vouchers
          ? data_store.wifi.vouchers
          : [],
        'wifi_vouchers',
      );

      // setDataLocal(data_store.wifi.prices, 'esim_voucher_prices');
      setDataLocal(
        data_store.esim_joytel && data_store.esim_joytel.types
          ? data_store.esim_joytel.types
          : [],
        'esim_voucher_types',
      );

      let tempEsim = [];
      if (data_store.esim_joytel && data_store.esim_joytel.types) {
        for (let i of data_store.esim_joytel.types) {
          if (tempEsim.length != 0) {
            let listTypes = tempEsim.filter(d => {
              return d.code == i.code;
            });
            if (!listTypes || listTypes.length == 0) {
              tempEsim.push(i);
            }
          } else {
            tempEsim.push(i);
          }
        }
      }
      // console.log(data_store.esim_joytel.vouchers)
      // console.log('tempesim')
      // console.log(tempEsim)
      let tempExistCodeEsim = [];
      if (
        tempEsim &&
        tempEsim.length > 0 &&
        data_store.esim_joytel &&
        data_store.esim_joytel.vouchers
      ) {
        for (i of tempEsim) {
          let tempExistCodeFilte = data_store.esim_joytel.vouchers.filter(d => {
            return d.code == i.code;
          });
          if (tempExistCodeFilte && tempExistCodeFilte.length > 0) {
            tempExistCodeEsim.push(i);
          }
        }
      }
      console.log('temp exist esim');
      console.log(tempExistCodeEsim);
      setDataLocal(tempExistCodeEsim, 'typeExistCodeEsim');
      setTypeExistCodeEsim(tempExistCodeEsim);

      setDataLocal(
        tempEsim && tempEsim.length > 0 ? tempEsim : [],
        'esim_voucher_types',
      );
      setDataLocal(
        data_store.esim_joytel && data_store.esim_joytel.prices
          ? data_store.esim_joytel.prices
          : [],
        'esim_voucher_prices',
      );
      // console.log('in type')
      // console.log(data_store.esim_joytel.types)
      // console.log(data_store.esim_joytel.prices)
      // console.log(data_store.esim_joytel.vouchers)
      // console.log(data_store.esim_joytel.region)
      // setDataLocal(data_store.esim_joytel.types);
      // setDataLocal(data_store.esim_joytel.types && data_store.esim_joytel.types.length > 0 ? data_store.esim_joytel.types.filter((d) => {
      //     return d.code.includes(chuyenbay.chauLuc_chuyenbay);
      // }) : [], 'esim_voucher_types');
      // console.log('tới')
      setDataLocal(
        data_store.esim_joytel && data_store.esim_joytel.vouchers
          ? data_store.esim_joytel.vouchers
          : [],
        'esim_vouchers',
      );

      setDataLocal(
        data_store.esim_joytel && data_store.esim_joytel.region
          ? data_store.esim_joytel.region
          : [],
        'esim_region',
      );

      setDataLocal(
        data_store && data_store.employees ? data_store.employees : [],
        'employees',
      );
      setDataLocal(
        data_store && data_store.currency ? data_store.currency : [],
        'currency',
      );

      //cập nhật lại liền sau khi đồng bộ
      getDataLocal([
        'upgrade_tickets_voucher_prices',
        'upgrade_tickets_voucher_types',
        'upgrade_tickets_vouchers',
        'wifi_voucher_prices',
        'wifi_voucher_types',
        'wifi_vouchers',
        'esim_voucher_prices',
        'esim_voucher_types',
        'esim_vouchers',
        'employees',
        'currency',
        'esim_joytel',
        'esim_region',
      ]);
    }
  });
  //khi mở form bán mã nâng hạng thì sẽ lấy một giá trị index với đầu vào là code như UP1, UP2
  const openNangHang = useCallback(async newText => {
    if (upgrade_tickets_voucher_prices.length != 0) {
      let tienTeTemp = 'vnd';
      if (!newText && upgrade_tickets_voucher_prices.length != 0) {
        newText = upgrade_tickets_vouchers[0].code;
        setSanPham(newText);
        // tienTeTemp = upgrade_tickets_voucher_prices ? upgrade_tickets_voucher_prices[0].currency : 'vnd'
        setTienTe(tienTeTemp);
      } else {
        setSanPham(newText);
      }
      setTienTe(tienTeTemp);
      // if (!tienTe) {
      //     tienTeTemp = upgrade_tickets_voucher_prices ? upgrade_tickets_voucher_prices[0].currency : 'vnd'
      //     setTienTe(tienTeTemp)
      // }
      const temp_set_default_price = upgrade_tickets_voucher_prices.find(d => {
        return d.code == newText && d.currency === tienTeTemp;
      });
      //dù không có được cấp hạn mức sản phẩm vẫn hiển thị được giá sản phầm
      if (!temp_set_default_price) {
        temp_set_default_price = upgrade_tickets_voucher_prices.filter(d => {
          return d.code == newText;
        });
        if (temp_set_default_price && temp_set_default_price.length > 0) {
          temp_set_default_price = temp_set_default_price[0];
          setTienTe(temp_set_default_price.currency);
        } else {
          console.log('fail');
          return;
        }
      }
      if (temp_set_default_price) {
        set_prices_sp(temp_set_default_price.price);
      }
      if (upgrade_tickets_vouchers && newText) {
        const temp = upgrade_tickets_vouchers.find(emp => emp.code === newText);
        setFormLayMaNH(temp);
        if (!temp) {
          show_message(
            json_language['Hết hạn mức'][language],
            json_language['Quá hạn kho'][language],
          );
          return;
        }
      }
    } else {
      setTimeout(() => {
        set_open_alert(true);
      }, 0);
      set_type_alert('thongbao');
      set_color('#EAC117');
      set_status(json_language['Thất bại'][language]);
      set_message(json_language['Kho voucher rỗng'][language]);
      // show_message(json_language['Thất bại'][language], json_language['Kho voucher rỗng'][language])
      setFormNanghang(false);
    }
  });
  const [typeExistCodeEsim, setTypeExistCodeEsim] = useState([]);
  const [typeExistCodeWifi, setTypeExistCodeWifi] = useState([]);
  const [typeExistCodeUpgrade, setTypeExistCodeUpgrade] = useState([]);
  const [tenSanPham, setTenSanPham] = useState('');
  const eventOpenEsim = useCallback(async newText => {
    // console.log('ininin')
    // console.log(esim_voucher_types)

    if (esim_voucher_prices.length != 0 && esim_vouchers.length > 0) {
      let tienTeTemp = 'vnd';
      if (!newText && esim_vouchers.length != 0) {
        newText = esim_vouchers[0].code;
        setSanPham(newText);
        setTenSanPham(esim_vouchers[0].name);
        // tienTeTemp = esim_voucher_prices ? esim_voucher_prices[0].currency : 'vnd'
        setTienTe(tienTeTemp);
      } else {
        setSanPham(newText);
      }
      setTienTe(tienTeTemp);
      // if (!tienTe) {
      //     tienTeTemp = esim_voucher_prices ? esim_voucher_prices[0].currency : 'vnd'
      //     setTienTe(tienTeTemp)
      // }
      // console.log(newText)
      let temp_set_default_price = esim_voucher_prices.find(d => {
        // console.log(d.currency)
        return d.code == newText && d.currency === tienTeTemp;
      });
      if (!temp_set_default_price) {
        temp_set_default_price = esim_voucher_prices.filter(d => {
          return d.code == newText;
        });
        if (temp_set_default_price && temp_set_default_price.length > 0) {
          temp_set_default_price = temp_set_default_price[0];
          setTienTe(temp_set_default_price.currency);
        } else {
          console.log('fail');
          return;
        }
      }
      // console.log(temp_set_default_price)
      //dù không có được cấp hạn mức sản phẩm vẫn hiển thị được giá sản phầm
      set_prices_sp(temp_set_default_price.price);
      if (esim_vouchers && newText) {
        const temp = esim_vouchers.find(emp => emp.code === newText);
        setFormLayMaEsim(temp);
        if (!temp) {
          show_message(
            json_language['Hết hạn mức'][language],
            json_language['Quá hạn kho'][language],
          );
          return;
        }
      }
    } else {
      setTimeout(() => {
        set_open_alert(true);
      }, 0);
      set_type_alert('thongbao');
      set_color('#EAC117');
      set_status(json_language['Thất bại'][language]);
      set_message(json_language['Kho voucher rỗng'][language]);
      // show_message(json_language['Thất bại'][language], json_language['Kho voucher rỗng'][language])
      setOpenEsim(false);
    }
  });
  const [formBanMaTCWifi, setFormBanMaTCWifi] = useState({});
  //khi mở form bán mã wifi thì sẽ lấy một giá trị index với đầu vào là code như BAMCHAT, BAMWEB
  const openBanMaTCWifi = useCallback(async newText => {
    if (wifi_voucher_prices.length != 0) {
      let tienTeTemp = 'vnd';
      if (!newText && wifi_voucher_prices.length != 0) {
        newText = wifi_vouchers[0].code;
        setSanPhamBam(newText);
        // tienTeTemp = wifi_voucher_prices ? wifi_voucher_prices[0].currency : 'vnd'
        setTienTe(tienTeTemp);
      } else {
        setSanPhamBam(newText);
      }
      // if (!tienTe) {
      //     tienTeTemp = wifi_voucher_prices ? wifi_voucher_prices[0].currency : 'vnd'
      //     setTienTe(tienTeTemp)
      // }
      setTienTe(tienTeTemp);
      const temp_set_default_price = wifi_voucher_prices.find(
        emp => emp.code === newText && emp.currency === tienTeTemp,
      );
      //dù không có được cấp hạn mức sản phẩm vẫn hiển thị được giá sản phầm
      if (!temp_set_default_price) {
        temp_set_default_price = wifi_voucher_prices.filter(d => {
          return d.code == newText;
        });
        if (temp_set_default_price && temp_set_default_price.length > 0) {
          temp_set_default_price = temp_set_default_price[0];
          setTienTe(temp_set_default_price.currency);
        } else {
          console.log('fail');
          return;
        }
      }
      if (temp_set_default_price) {
        set_prices_sp(temp_set_default_price.price);
      }
      const temp = wifi_vouchers.find(emp => emp.code === newText);
      setFormBanMaTCWifi(temp);
      if (!temp) {
        setTimeout(() => {
          set_open_alert(true);
        }, 0);
        set_type_alert('thongbao');
        set_color('#EAC117');
        set_status(json_language['Hết hạn mức'][language]);
        set_message(json_language['Quá hạn kho'][language]);
        // show_message(json_language['Hết hạn mức'][language], json_language['Quá hạn kho'][language])
        return;
      }
    } else {
      console.log('false');
      setTimeout(() => {
        set_open_alert(true);
      }, 0);
      set_type_alert('thongbao');
      set_color('#EAC117');
      set_status(json_language['Thất bại'][language]);
      set_message(json_language['Kho voucher rỗng'][language]);
      // show_message(json_language['Thất bại'][language], json_language['Kho voucher rỗng'][language])
      setFormMatruycap(false);
    }
  });
  //form voucher store
  const [formVoucherstore, setFormVoucherstore] = useState(false);
  const openKhoVoucher = useCallback(() => {});
  // form đã bán
  const [formFlightorder, setFormFlightorder] = useState(false);
  const [openDetailStore, setOpenDetailStore] = useState(false);
  const [viTriOpenDetail, setViTriOpenDetail] = useState(0);
  const openDonHangdaMua = useCallback(viTri => {
    setOpenDetailStore(true);
    setViTriOpenDetail(viTri);
  });
  const openDaBan = () => {
    //console.log(order_list)
  };
  //update chuyến bay
  const [Updatechuyenbay, setUpdatechuyenbay] = useState(false);
  const [chuyenbay, set_chuyenbay] = useState({
    chauLuc_chuyenbay: '',
    soHieu_chuyenbay: flyInfo.soHieu,
    changBay_chuyenbay: flyInfo.changBay,
    ngayBay_chuyenbay: new Date(),
    gioBay_chuyenbay:
      flyInfo.gioBay != ''
        ? flyInfo.gioBay
        : moment(new Date()).format('HH:mm'),
  });

  //code : UP1, UP2.... SLK: số lượng kho cần truyền vào upgrade_ticket_voucher
  const upgrade_vouchers = useCallback((code, SLK) => {
    const fight = {
      number: chuyenbay.soHieu_chuyenbay,
      dst: chuyenbay.changBay_chuyenbay,
      time: chuyenbay.gioBay_chuyenbay,
      day: moment(chuyenbay.ngayBay_chuyenbay).format('DD/MM/YY'),
      region: chuyenbay.chauLuc_chuyenbay,
    };
    const tempSLKho = SLK.filter(d => {
      return d.status != 1 && d.code == code;
    });
    if (parseInt(soLuong) <= tempSLKho.length) {
      const ttt = [];
      for (let i = 0, j = 0; j < parseInt(soLuong); i++) {
        if (SLK[i].status != 1 && SLK[i].code == code) {
          ttt.push(SLK[i]);
          SLK[i]['emp_code'] = MNV;
          SLK[i]['emp_name'] = hoTen;
          SLK[i]['currency'] = tienTe;
          SLK[i]['status'] = 1;
          SLK[i]['sold_time'] = Date.now();
          SLK[i]['fight'] = fight;
          j++;
        }
      }
      setDataLocal(SLK, 'upgrade_tickets_vouchers');
      getDataLocal(['upgrade_tickets_vouchers']);
      let temp = [];
      if (order_list.length != 0) {
        temp = order_list;
      }
      temp.push({
        MNV: MNV,
        hoTen: hoTen,
        soLuong: soLuong,
        loaiSanPham: 'mananghang',
        donHang: ttt,
      });
      set_order_list(temp);
      setDataLocal(temp, 'order_list');
      setFormNanghang(false);
      setFormFlightorder(true);
      openDonHangdaMua(temp.length - 1);
      // setMNV("");
      // setHoTen(" ");
      setSoLuong('1');
    } else {
      setTimeout(() => {
        set_open_alert(true);
      }, 0);
      set_type_alert('thongbao');
      set_color('#EAC117');
      set_status(json_language['Thất bại'][language]);
      set_message(json_language['Số lượng vượt quá kho'][language]);
      // show_message(json_language['Thất bại'][language], json_language['Số lượng vượt quá kho'][language])
    }
  });
  const upgrade_vouchers_esim = useCallback((code, SLK) => {
    const fight = {
      number: chuyenbay.soHieu_chuyenbay,
      dst: chuyenbay.changBay_chuyenbay,
      time: chuyenbay.gioBay_chuyenbay,
      day: moment(chuyenbay.ngayBay_chuyenbay).format('DD/MM/YY'),
      region: chuyenbay.chauLuc_chuyenbay,
    };
    const tempSLKho = SLK.filter(d => {
      return d.status != 1 && d.code == code;
    });
    // console.log('in code')
    // console.log(code)
    // console.log('in list')
    // console.log(tempSLKho)
    // return
    if (parseInt(soLuong) <= tempSLKho.length) {
      const ttt = [];
      for (let i = 0, j = 0; j < parseInt(soLuong); i++) {
        if (SLK[i].status != 1 && SLK[i].code == code) {
          ttt.push(SLK[i]);
          const splitCode = SLK[i].voucher.split('$');
          if (splitCode && splitCode.length == 3) {
            SLK[i].LPA = splitCode[0];
            SLK[i].sm_dp_address = splitCode[1];
            SLK[i].activation_code = splitCode[2];
            SLK[i].voucher = SLK[i].voucher;
          }
          SLK[i]['emp_code'] = MNV;
          SLK[i]['emp_name'] = hoTen;
          SLK[i]['currency'] = tienTe;
          SLK[i]['quantity'] = soLuong;
          SLK[i]['price'] = prices_san_pham;
          SLK[i]['totalPrice'] = (
            Number(prices_san_pham) * soLuong
          ).toLocaleString('en-US', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          });
          SLK[i]['status'] = 1;
          SLK[i]['sold_time'] = Date.now();
          SLK[i]['fight'] = fight;
          j++;
        }
      }
      setDataLocal(SLK, 'esim_vouchers');
      getDataLocal(['esim_vouchers']);
      let temp = [];
      if (order_list.length != 0) {
        temp = order_list;
      }
      temp.push({
        MNV: MNV,
        hoTen: hoTen,
        soLuong: soLuong,
        loaiSanPham: 'esim',
        donHang: ttt,
      });
      set_order_list(temp);
      setDataLocal(temp, 'order_list');
      setOpenEsim(false);
      setFormFlightorder(true);
      openDonHangdaMua(temp.length - 1);
      // setMNV("");
      // setHoTen(" ");
      setSoLuong('1');
    } else {
      setTimeout(() => {
        set_open_alert(true);
      }, 0);
      set_type_alert('thongbao');
      set_color('#EAC117');
      set_status(json_language['Thất bại'][language]);
      set_message(json_language['Số lượng vượt quá kho'][language]);
      // show_message(json_language['Thất bại'][language], json_language['Số lượng vượt quá kho'][language])
    }
  });
  //code : BAMCHAT, BAMWEB.... SLK: số lượng kho cần truyền vào wifi_voucher
  const mua_ma_ban_wifi = useCallback((code, SLK) => {
    const fight = {
      number: chuyenbay.soHieu_chuyenbay,
      dst: chuyenbay.changBay_chuyenbay,
      time: chuyenbay.gioBay_chuyenbay,
      day: moment(chuyenbay.ngayBay_chuyenbay).format('DD/MM/YY'),
      region: chuyenbay.chauLuc_chuyenbay,
    };
    const tempSLKho = SLK.filter(d => {
      return d.status != 1 && d.code == code;
    });
    if (parseInt(soLuong) <= tempSLKho.length) {
      const ttt = [];
      for (let i = 0, j = 0; j < parseInt(soLuong); i++) {
        if (SLK[i].status != 1 && SLK[i].code == code) {
          ttt.push(SLK[i]);
          SLK[i]['emp_code'] = MNV;
          SLK[i]['emp_name'] = hoTen;
          SLK[i]['currency'] = tienTe;
          SLK[i]['status'] = 1;
          SLK[i]['sold_time'] = Date.now();
          SLK[i]['fight'] = fight;
          j++;
        }
      }
      let temp = [];
      if (order_list.length != 0) {
        temp = order_list;
      }
      temp.push({
        MNV: MNV,
        hoTen: hoTen,
        soLuong: soLuong,
        loaiSanPham: 'maban',
        donHang: ttt,
      });
      setDataLocal(SLK, 'wifi_vouchers');
      getDataLocal(['wifi_vouchers']);
      set_order_list(temp);
      setDataLocal(temp, 'order_list');
      setFormMatruycap(false);
      setFormFlightorder(true);
      openDonHangdaMua(temp.length - 1);
      // setMNV("");
      // setHoTen(" ");
      setSoLuong('1');
    } else {
      setTimeout(() => {
        set_open_alert(true);
      }, 0);
      set_type_alert('thongbao');
      set_color('#EAC117');
      set_status(json_language['Thất bại'][language]);
      set_message(json_language['Số lượng vượt quá kho'][language]);
    }
  });
  //cho cỡ chữ to hơn khi màn hình có chiều cao > 900
  const font_size =
    Dimensions.get('window').height > 900 ||
    Dimensions.get('window').width > 900
      ? 18
      : 14;
  // console.log(260 / (0.9 * Dimensions.get('window').width))
  const [open_find_employee, set_open_find_employee] = useState(false);

  const [open_alert, set_open_alert] = useState(false);
  const [color, set_color] = useState('#1589FF');
  const [message, set_message] = useState('');
  const [status, set_status] = useState('');
  const [type_alert, set_type_alert] = useState('thongbao');
  const [open_StatusBar, set_open_StatusBar] = useState(false);
  const [load_local_storage, set_load_local_storage] = useState(true);
  const [off_message_background, set_off_message_background] = useState(true);
  // const [formEsim, setFormEsim] = useState(
  //     {
  //         MNV: "",
  //         hoTen: "",
  //         sanPham: "",
  //         soLuong: "",
  //         tienTe: "",
  //         prices_san_pham: "",
  //         formLayMaNH: {}
  //     })
  // const [objOpenAlert, setObjOpenAlert] = useState(
  //     {
  //         open_alert: false,
  //         color: "",
  //         status: "",
  //         message: "",
  //         type: "",

  //     })
  // const [statusModalEsim, setStatusModalEsim] = useState(
  //     {
  //         open_find_employee: false,
  //         formNanghang: false
  //     })
  return (
    <View>
      <StatusBar translucent={true} backgroundColor="rgba(0, 0, 0, 0)" />
      <AlertTwoButtom
        open_statusBar={true}
        open_alert={open_alert}
        set_open_alert={set_open_alert}
        type={type_alert}
        language={language}
        color={color}
        status={status}
        message={message}
        func={sync}
        button_message_func={json_language['Tiếp tục'][language]}
        button_message_close={json_language['Hủy'][language]}
      />
      {!isLogin && (
        <Login
          loading={loading}
          messgae_Loading_animation={messgae_Loading_animation}
          user_login={user_login}
          set_user_login={set_user_login}
          language={language}
          json_language={json_language}
          isLogin={isLogin}
          setIsLogin={setIsLogin}
          sendValues={sendValues}
          screenHeight={screenHeight}
          screenWidth={screenWidth}
          isConnected={isConnected}></Login>
      )}
      {loading && isLogin && (
        <View style={{alignItems: 'center', justifyContent: 'center'}}>
          <Loading_animation
            onLoading={loading}
            onAction={messgae_Loading_animation}
            open_StatusBar={open_StatusBar}
            off_message_background={off_message_background}
          />
        </View>
      )}
      <Modal
        transparent={false}
        visible={load_local_storage}
        onRequestClose={() => {
          set_load_local_storage(false);
        }}>
        <StatusBar translucent={true} backgroundColor="rgba(0, 0, 0, 1)" />
        <ImageBackground
          source={require(img + '/logo/logo-fly-store-background.png')}
          resizeMode="cover"
          style={{height: screenHeight, width: screenWidth}}></ImageBackground>
      </Modal>
      {/* <StatusBar
                backgroundColor="rgba(0, 0, 0, 1)"
            /> */}
      <View>
        <ScrollView keyboardShouldPersistTaps="handled">
          <View
            style={{
              marginBottom: 50,
              minHeight: Dimensions.get('window').height,
            }}>
            {/* <Example/> */}
            {/* Responsive theo màn hình ngang và dọc trên điện thoại và cả tablet có màn hình lớn */}
            {/* image background */}

            <Header_home
              checkSync={checkSync}
              fullname={user.Fullname}
              set_openXemTTChangBay={set_openXemTTChangBay}
              language={language}
              font_size={font_size}
              openXemTTChangBay={openXemTTChangBay}
              screenHeight={screenHeight}
              screenWidth={screenWidth}
              canClick={canClick}
            />
            {/* Hiển thị modal khi click vào xem tt chặng bay */}
            <View style={{width: Dimensions.get('window').width}}>
              <XemTTChangBay
                set_open_alert={set_open_alert}
                set_color={set_color}
                set_status={set_status}
                set_message={set_message}
                upgrade_tickets_vouchers={upgrade_tickets_vouchers}
                wifi_vouchers={wifi_vouchers}
                screenHeight={screenHeight}
                screenWidth={screenWidth}
                language={language}
                json_language={json_language}
                modalVisible={openXemTTChangBay}
                setmodalVisible={set_openXemTTChangBay}
                chuyenbay={chuyenbay}
                set_chuyenbay={set_chuyenbay}
                setUpdatechuyenbay={setUpdatechuyenbay}
                chuyenbay_tam={chuyenbay_tam}
                set_chuyenbay_tam={set_chuyenbay_tam}
                checkSync={checkSync}></XemTTChangBay>
            </View>
            <LinearGradient
              colors={['#ACD9F5', '#FFFFFF']}
              style={{
                minHeight: Dimensions.get('window').height - 260,
                backgroundColor: '#ffffff',
                borderTopLeftRadius: 15,
                borderTopRightRadius: 15,
                marginTop: -15,
              }}>
              <Main_function
                setSoLuong={setSoLuong}
                upgrade_tickets_vouchers={upgrade_tickets_vouchers}
                wifi_vouchers={wifi_vouchers}
                set_language={set_language}
                language={language}
                json_language={json_language}
                onOpenBanMaTCWifi={openBanMaTCWifi}
                onSetFormMatruycap={setFormMatruycap}
                onOpenNangHang={openNangHang}
                onSync={sync}
                onSetFormNanghang={setFormNanghang}
                onSetFormVoucherstore={setFormVoucherstore}
                onOpenDaBan={openDaBan}
                onSetFormFlightorder={setFormFlightorder}
                setOpenEsim={setOpenEsim}
                eventOpenEsim={eventOpenEsim}
                esim_vouchers={esim_vouchers}
                checkSync={checkSync}
                canClick={canClick}
              />
              {!openXemTTChangBay ? (
                <View style={{marginTop: 0}}>
                  <Order_function
                    set_list_goicuoc={set_list_goicuoc}
                    upgrade_tickets_vouchers={upgrade_tickets_vouchers}
                    wifi_vouchers={wifi_vouchers}
                    user={user}
                    listDataCustomerSync={listDataCustomerSync}
                    setListDataCustomerSync={setListDataCustomerSync}
                    listPhoneSim={listPhoneSim}
                    set_listPhoneSim={set_listPhoneSim}
                    set_language={set_language}
                    language={language}
                    json_language={json_language}
                    setIsLogin={setIsLogin}
                    setDataLocal={setDataLocal}
                    cccd_info={cccd_info}
                    set_cccd_info={set_cccd_info}
                    list_goicuoc={list_goicuoc}
                    listDataCustomerUnsync={listDataCustomerUnsync}
                    isConnected={isConnected}
                    setListDataCustomerUnsync={setListDataCustomerUnsync}
                    listDataCustomerTotal={listDataCustomerTotal}
                    setListDataCustomerTotal={setListDataCustomerTotal}
                    total_sim_sold_today={total_sim_sold_today}
                    set_total_sim_sold_today={set_total_sim_sold_today}
                    total_esim_sold_today={total_esim_sold_today}
                    set_total_esim_sold_today={set_total_esim_sold_today}
                    listEsim={listEsim}
                    setListEsim={setListEsim}
                    listCusBoughtEsim={listCusBoughtEsim}
                    setListCusBoughtEsim={setListCusBoughtEsim}
                    printer={printer}
                    setPrinter={setPrinter}
                    token={token}
                    checkSync={checkSync}
                    canClick={canClick}
                  />
                </View>
              ) : (
                <View></View>
              )}
            </LinearGradient>
          </View>
        </ScrollView>
      </View>

      {formMatruycap && (
        <BanMaWifi
          employees={employees}
          setMNV={setMNV}
          setHoTen={setHoTen}
          open_find_employee={open_find_employee}
          set_open_find_employee={set_open_find_employee}
          handleInputChange={handleInputChange}
          language={language}
          json_language={json_language}
          formMatruycap={formMatruycap}
          setFormMatruycap={setFormMatruycap}
          MNV={MNV}
          handleMNVChange={handleMNVChange}
          hoTen={hoTen}
          wifi_voucher_types={typeExistCodeWifi}
          sanPhamBam={sanPhamBam}
          image_source={image_source}
          setSanPhamBam={setSanPhamBam}
          openBanMaTCWifi={openBanMaTCWifi}
          formBanMaTCWifi={formBanMaTCWifi}
          wifi_voucher_prices={wifi_voucher_prices}
          layMaBanWifi={layMaBanWifi}
          soLuong={soLuong}
          setSoLuong={setSoLuong}
          tienTe={tienTe}
          setTienTe={setTienTe}
          prices_san_pham={prices_san_pham}
          set_prices_sp={set_prices_sp}></BanMaWifi>
      )}
      {formNanghang && (
        <BanMaNangHang
          employees={employees}
          setMNV={setMNV}
          setHoTen={setHoTen}
          open_find_employee={open_find_employee}
          set_open_find_employee={set_open_find_employee}
          handleInputChange={handleInputChange}
          language={language}
          json_language={json_language}
          formNanghang={formNanghang}
          setFormNanghang={setFormNanghang}
          MNV={MNV}
          handleMNVChange={handleMNVChange}
          hoTen={hoTen}
          sanPham={sanPham}
          setSanPham={setSanPham}
          upgrade_tickets_voucher_types={typeExistCodeUpgrade}
          openNangHang={openNangHang}
          formLayMaNH={formLayMaNH}
          prices_san_pham={prices_san_pham}
          set_prices_sp={set_prices_sp}
          tienTe={tienTe}
          setTienTe={setTienTe}
          layMaNHWifi={layMaNHWifi}
          soLuong={soLuong}
          setSoLuong={setSoLuong}
          upgrade_tickets_voucher_prices={upgrade_tickets_voucher_prices}
          image_source={image_source}></BanMaNangHang>
      )}
      {formVoucherstore && (
        <KhoVoucher
          esim_voucher_types={esim_voucher_types}
          esim_vouchers={esim_vouchers}
          language={language}
          json_language={json_language}
          formVoucherstore={formVoucherstore}
          setFormVoucherstore={setFormVoucherstore}
          wifi_voucher_types={wifi_voucher_types}
          wifi_vouchers={wifi_vouchers}
          upgrade_tickets_voucher_types={upgrade_tickets_voucher_types}
          upgrade_tickets_vouchers={upgrade_tickets_vouchers}></KhoVoucher>
      )}
      {formFlightorder && (
        <DaBan
          screenHeight={screenHeight}
          screenWidth={screenWidth}
          set_order_list={set_order_list}
          language={language}
          json_language={json_language}
          formFlightorder={formFlightorder}
          setFormFlightorder={setFormFlightorder}
          setOpenDetailStore={setOpenDetailStore}
          order_list={order_list}
          openDetailStore={openDetailStore}
          onViTriOpenDetail={viTriOpenDetail}
          onSetViTriOpenDetail={setViTriOpenDetail}
          printer={printer}
          setPrinter={setPrinter}
          viewShotURIStorage={viewShotURIStorage}
          setViewShotURIStorage={setViewShotURIStorage}></DaBan>
      )}
      {Updatechuyenbay && (
        <CapNhatChuyenBay
          chuyenbay_tam={chuyenbay_tam}
          set_chuyenbay_tam={set_chuyenbay_tam}
          open_mandatory_notice={open_mandatory_notice}
          set_open_mandatory_notice={set_open_mandatory_notice}
          set_open_alert={set_open_alert}
          set_color={set_color}
          set_status={set_status}
          set_message={set_message}
          screenHeight={screenHeight}
          screenWidth={screenWidth}
          language={language}
          json_language={json_language}
          Updatechuyenbay={Updatechuyenbay}
          setUpdatechuyenbay={setUpdatechuyenbay}
          chuyenbay={chuyenbay}
          set_chuyenbay={set_chuyenbay}
          CapNhatChangBay={CapNhatChangBay}></CapNhatChuyenBay>
      )}

      {/* <HomeEsim
                employees={employees}
                language={language}
                upgrade_tickets_voucher_types={upgrade_tickets_voucher_types}
                openNangHang={openNangHang}
                layMaNHWifi={layMaNHWifi}
                upgrade_tickets_voucher_prices={upgrade_tickets_voucher_prices} image_source={image_source}
                setStatusModalEsim={setStatusModalEsim} statusModalEsim={statusModalEsim}
                setObjOpenAlert={setObjOpenAlert} objOpenAlert={objOpenAlert}
                setFormEsim={setFormEsim} formEsim={formEsim}
            /> */}
      {openEsim && (
        <HomeEsim
          employees={employees}
          setMNV={setMNV}
          setHoTen={setHoTen}
          open_find_employee={open_find_employee}
          set_open_find_employee={set_open_find_employee}
          handleInputChange={handleInputChange}
          language={language}
          formNanghang={openEsim}
          setFormNanghang={setOpenEsim}
          MNV={MNV}
          handleMNVChange={handleMNVChange}
          hoTen={hoTen}
          prices_san_pham={prices_san_pham}
          set_prices_sp={set_prices_sp}
          tienTe={tienTe}
          setTienTe={setTienTe}
          sanPham={sanPham}
          setSanPham={setSanPham}
          image_source={image_source}
          soLuong={soLuong}
          setSoLuong={setSoLuong}
          openNangHang={eventOpenEsim}
          upgrade_tickets_voucher_types={typeExistCodeEsim}
          formLayMaNH={formLayMaEsim}
          layMaEsim={layMaEsim}
          upgrade_tickets_voucher_prices={esim_voucher_prices}
          tenSanPham={tenSanPham}
          setTenSanPham={setTenSanPham}
          esim_region={esim_region}
          set_esim_region={set_esim_region}
          esim_vouchers={esim_vouchers}
          set_esim_vouchers={set_esim_vouchers}
          chuyenbay={chuyenbay}
        />
      )}
    </View>
  );
};
export default codePush(Home);
