import React, {memo, useState, useCallback, useEffect} from 'react';
import {
  StatusBar,
  SafeAreaView,
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
import NetInfo from '@react-native-community/netinfo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import RNFS from 'react-native-fs';
import RNFetchBlob from 'react-native-blob-util';

// AntDesign.loadFont();
// Entypo.loadFont();
// MaterialIcons.loadFont();
import Register from './register';
import ListSoldSimInfo from './ListSoldSimInfo';
import Register_uninternet from './register_uninternet';
import {show_message} from '../../menu_function';
const img = '../../img/';
import AlertTwoButtom from '../component_product/AlertTwoButtom';
import {url_api} from '../../../config';
import Loading_animation from '../component_modal/Loading_animation';
const responsive =
  Dimensions.get('window').width > 600 &&
  Dimensions.get('window').width < Dimensions.get('window').height
    ? true
    : false;
function SmartSimHome({
  set_list_goicuoc,
  setDataLocal,
  total_sim_sold_today,
  set_total_sim_sold_today,
  listDataCustomerSync,
  setListDataCustomerSync,
  setListDataCustomerTotal,
  listDataCustomerTotal,
  listDataCustomerUnsync,
  setListDataCustomerUnsync,
  isConnected,
  listPhoneSim,
  set_listPhoneSim,
  list_goicuoc,
  cccd_info,
  set_cccd_info,
  screenHeight,
  screenWidth,
  smart_sim_home,
  set_smart_sim_home,
  json_language,
  language,
}) {
  const [open_register, set_open_register] = useState(false);
  const [open_list_sold_sim_info, set_open_list_sold_sim_info] =
    useState(false);
  const [data_ListSoldSimInfo, set_data_ListSoldSimInfo] = useState(
    listDataCustomerTotal,
  );

  const [type_card, set_type_card] = useState('day');
  const [open_fill_info_cccd, set_open_fill_info_cccd] = useState(false);
  const [cccd_info_ss, set_cccd_info_ss] = useState({
    fullName: '',
    address: '',
    gender: '1',
    birthday: new Date(),
    phoneCustomer: '',
    phoneRegister: '',
    codeSim: '',
    packOfData: '',
    typeIdentity: '1',
    imageBack:
      'http://localhost/_capacitor_file_/data/user/0/com.vn.vtctelecom.sell.sim/files/0855858843_back_366e39f6-34a5-4032-9e5a-0fa085ba55.jpeg',
    imageFront:
      'http://localhost/_capacitor_file_/data/user/0/com.vn.vtctelecom.sell.sim/files/0855858843_front_e544483f-3f38-41e2-8150-2ae3b820a77c.jpeg',
    imagePortrait:
      'http://localhost/_capacitor_file_/data/user/0/com.vn.vtctelecom.sell.sim/files/0855858843_portrait_e93e30d1-9228-4207-896f-9b9ca5554c61.jpeg',
    pathFilePortrait: '',
    pathFileFront: '',
    pathFileBack: '',
    placeOfIssue: 'Cục Cảnh sát quản lý hành chính về trật tự xã hội',
    dateOfIssue: new Date(),
    idNumber: '',
    createdAt: new Date(),
    isSync: false,
    custId: '',
    cdn: {
      front: '',
      portrait: '',
      back: '',
    },
    date_end: new Date(),
    type_card: 'IDCard',
  });

  const handleTotalSimSold = useCallback(
    listDataCustomerTotal => {
      let today = new Date();
      let day_today = today.getDate().toString();
      let month_today = (today.getMonth() + 1).toString(); // Lưu ý: Tháng bắt đầu từ 0
      if (month_today.length < 2) {
        month_today = '0' + month_today;
      }
      if (day_today.length < 2) {
        day_today = '0' + day_today;
      }
      const year_today = today.getFullYear().toString();
      const full_day = year_today + '-' + month_today + '-' + day_today;
      const full_month = year_today + '-' + month_today;
      // console.log(full_day)
      const temp = listDataCustomerTotal.filter(d => {
        return (
          d.createdAt && d.createdAt.toString().includes(full_day.toUpperCase())
        );
      });
      set_total_sim_sold_today(temp.length);
    },
    [listDataCustomerTotal],
  );
  useEffect(() => {
    handleTotalSimSold(listDataCustomerTotal);
  }, [listDataCustomerTotal]);
  const [data_cus_by_filter_day, set_data_cus_by_filter_day] = useState([]);
  //hàm lấy danh sách khách hàng bán theo ngày tháng hoặc năm
  const get_data_ListSoldSimInfo_in_day = useCallback((type, newtext) => {
    // console.log(newtext)
    let today = new Date();
    let day_today = today.getDate().toString();
    let month_today = (today.getMonth() + 1).toString(); // Lưu ý: Tháng bắt đầu từ 0
    if (month_today.length < 2) {
      month_today = '0' + month_today;
    }
    if (day_today.length < 2) {
      day_today = '0' + day_today;
    }
    const year_today = today.getFullYear().toString();
    const full_day = year_today + '-' + month_today + '-' + day_today;
    const full_month = year_today + '-' + month_today;
    if (type == 'day') {
      const temp = listDataCustomerTotal.filter(d => {
        return (
          d.createdAt && d.createdAt.toString().includes(full_day.toUpperCase())
        );
      });
      set_data_cus_by_filter_day(temp);
      set_data_ListSoldSimInfo(
        temp.filter(d => {
          return (
            (d.fullName || '').toUpperCase().includes(newtext.toUpperCase()) ||
            d.phoneRegister.toUpperCase().includes(newtext.toUpperCase())
          );
        }),
      );
    } else if (type == 'month') {
      const temp = listDataCustomerTotal.filter(d => {
        return (
          d.createdAt &&
          d.createdAt.toString().includes(full_month.toUpperCase())
        );
      });
      set_data_cus_by_filter_day(temp);
      set_data_ListSoldSimInfo(
        temp.filter(d => {
          return (
            (d.fullName || '').toUpperCase().includes(newtext.toUpperCase()) ||
            d.phoneRegister.toUpperCase().includes(newtext.toUpperCase())
          );
        }),
      );
    } else {
      const temp = listDataCustomerTotal.filter(d => {
        return (
          (d.fullName || '').includes(newtext.toUpperCase()) ||
          d.phoneRegister.toUpperCase().includes(newtext.toUpperCase())
        );
      });
      set_data_ListSoldSimInfo(temp);
      set_data_cus_by_filter_day(listDataCustomerTotal);
    }
  });
  //sự kiện đóng mở internet
  // useEffect(() => {
  //     set_open_register(false)
  //     set_open_register_uninternet(false)
  //     set_data_a_sim({})
  // }, [isConnected])
  const [loading, set_loading] = useState(false);
  //xóa uri trong local storage nếu không dùng tới
  const deleteURI = async uri => {
    try {
      await RNFS.unlink(uri);
      // console.log('URI đã được xóa thành công');
    } catch (error) {
      // console.log('Đã xảy ra lỗi khi xóa URI:', error);
    }
  };
  const getNewListSim = useCallback(async () => {
    return new Promise((resolve, reject) => {
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
      set_loading(true);
      // set_message_Loading_animation(json_language["Đang tải dữ liệu sim"][language])
      const urls = [url_api.api_get_listphone, url_api.api_get_list_goicuoc];

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
              // timeout: 200000,
            }).then(response => response.json()),
        ),
      )
        .then(([listPhoneDataCallAPI, list_goicuocDataCallAPI]) => {
          // handle responses here
          // you can access each response with listPhoneDataCallAPI, syncDataCallAPI, and list_goicuocDataCallAPI
          // set_loading(false)
          if (
            listPhoneDataCallAPI.result == 1 &&
            list_goicuocDataCallAPI.result == 1
          ) {
            set_list_goicuoc(list_goicuocDataCallAPI.data);
            set_listPhoneSim(listPhoneDataCallAPI.data);
            setDataLocal(list_goicuocDataCallAPI.data, 'list_goicuoc');
            setDataLocal(listPhoneDataCallAPI.data, 'listPhoneSim');
            console.log(listPhoneDataCallAPI.data);
            set_loading(false);
            setTimeout(() => {
              set_open_alert(true);
            }, 0);
            set_type('thongbao');
            set_color('#1589FF');
            set_status(json_language['Thành công'][language]);
            set_message(json_language['Tải dữ liệu thành công'][language]);
          } else {
            set_loading(false);
            setTimeout(() => {
              set_open_alert(true);
            }, 0);
            set_type('thongbao');
            set_color('#EAC117');
            set_status(json_language['Thất bại'][language]);
            set_message(json_language['Tải dữ liệu thất bại'][language]);
            // show_message(json_language['Thất bại'][language], json_language['Đồng bộ dữ liệu thất bại'][language])
            return 0;
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
        });
      return 0;
    });
  });
  const getListCusSoldSim = useCallback(async () => {
    return new Promise((resolve, reject) => {
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
      set_loading(true);
      // set_message_Loading_animation(json_language["Đang tải dữ liệu sim"][language])
      const urls = [url_api.api_get_sync];

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
              timeout: 1000000,
            }).then(response => response.json()),
        ),
      )
        .then(([syncDataCallAPI]) => {
          // handle responses here
          // you can access each response with listPhoneDataCallAPI, syncDataCallAPI, and list_goicuocDataCallAPI
          // set_loading(false)
          // console.log('tới 1')
          if (syncDataCallAPI.result == 1) {
            const imageUrls = [
              // 'https://files.vtctelecom.com.vn/sim/0855858843_front_e544483f-3f38-41e2-8150-2ae3b820a77c.jpeg',
              // 'https://files.vtctelecom.com.vn/sim/0855858843_back_366e39f6-34a5-4032-9e5a-0fa085ba5115.jpeg',
              // 'https://files.vtctelecom.com.vn/sim/0855858843_portrait_e93e30d1-9228-4207-896f-9b9ca5554c61.jpeg'
              //Thêm đường dẫn ảnh khác nếu có
            ];
            for (let i = 0; i < syncDataCallAPI.data.length; i++) {
              // imageUrls.push(syncDataCallAPI.data[i].cdn.front)
              // imageUrls.push(syncDataCallAPI.data[i].cdn.back)
              imageUrls.push(syncDataCallAPI.data[i].cdn.portrait);
            }
            // console.log('toi 2')
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
                // console.log('toi')
                // console.log(fetch_image)
                // set_loading(false)
                // return
                // Lưu đường dẫn đến các file ảnh đã tải vào một mảng
                for (let i = 0; i < fetch_image.length; i++) {
                  if (fetch_image[i].respInfo.status != 200) {
                    set_loading(false);
                    setTimeout(() => {
                      set_open_alert(true);
                    }, 0);
                    set_type('thongbao');
                    set_color('#EAC117');
                    set_status(json_language['Lỗi ảnh'][language]);
                    set_message(
                      json_language['Tải dữ liệu thất bại'][language],
                    );
                    // show_message(json_language['Lỗi ảnh'][language], json_language['Đồng bộ dữ liệu thất bại'][language])
                    return 0;
                  }
                }
                // console.log('tới')
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
                  // list_image_uri.push(i.pathFileFront)
                  // list_image_uri.push(i.pathFileBack)
                  list_image_uri.push(i.pathFilePortrait);
                }
                for (i of listDataCustomerSync) {
                  // await deleteURI(i.pathFileFront)
                  // await deleteURI(i.pathFileBack)
                  await deleteURI(i.pathFilePortrait);
                }
                setListDataCustomerTotal(temp_total_);
                setDataLocal([], 'listDataCustomerUnsync');
                setDataLocal(syncDataCallAPI.data, 'listDataCustomerSync');
                //
                setTimeout(() => {
                  set_open_alert(true);
                }, 0);
                set_loading(false);
                set_type('thongbao');
                set_color('#1589FF');
                set_status(json_language['Thành công'][language]);
                set_message(
                  json_language['Đồng bộ dữ liệu thành công'][language],
                );
                // show_message(json_language['Thành công'][language], json_language['Đồng bộ dữ liệu thành công'][language])
                return 1;
                // Hiển thị các ảnh này trong ứng dụng của bạn
                // ...
              })
              .catch(error => {
                // console.log('dksajjkdjkl')
                // console.log(error)
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
            set_type('thongbao');
            set_color('#EAC117');
            set_status(json_language['Thất bại'][language]);
            set_message(json_language['Tải dữ liệu thất bại'][language]);
            // show_message(json_language['Thất bại'][language], json_language['Đồng bộ dữ liệu thất bại'][language])
            return 0;
          }
        })
        .catch(error => {
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
          set_loading(false);
        });
      return 0;
    });
  });
  const [open_register_uninternet, set_open_register_uninternet] =
    useState(false);
  const [data_a_sim, set_data_a_sim] = useState({});
  const [uninternet_allow_register, set_uninternet_allow_register] =
    useState(false);

  const [open_alert, set_open_alert] = useState(false);
  const [color, set_color] = useState('#1589FF');
  const [message, set_message] = useState('');
  const [status, set_status] = useState('');
  const [text, setText] = useState('');
  const [type, set_type] = useState('thongbao');
  const [open_get_new, set_open_get_new] = useState(false);
  const [type_func, set_type_func] = useState('');
  const [photo, set_photo] = useState({
    image: '',
    image_back: '',
    selfies: '',
  });
  return (
    <View>
      <Modal
        animationType="slide-down"
        transparent={false}
        visible={smart_sim_home}
        onRequestClose={() => {
          set_smart_sim_home(false);
        }}>
        {loading && (
          <View style={styles.center}>
            <Loading_animation
              onLoading={loading}
              onAction={json_language['Đang tải dữ liệu'][language]}
            />
          </View>
        )}
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
          func={type_func == 'dulieusim' ? getNewListSim : getListCusSoldSim}
        />
        <StatusBar backgroundColor="rgba(0, 0, 0, 1)" />
        {/* {(isConnected || uninternet_allow_register) && open_register && */}
        {uninternet_allow_register && open_register && (
          <Register
            photo={photo}
            set_photo={set_photo}
            listPhoneSim={listPhoneSim}
            set_listPhoneSim={set_listPhoneSim}
            // isconnect={isconnect} để khi đóng mở internet sẽ đóng mở kiểu vào sim
            open_fill_info_cccd={open_fill_info_cccd}
            set_open_fill_info_cccd={set_open_fill_info_cccd}
            isConnected={isConnected}
            setListDataCustomerSync={setListDataCustomerSync}
            listDataCustomerSync={listDataCustomerSync}
            set_open_register_uninternet={set_open_register_uninternet}
            list_goicuoc={list_goicuoc}
            listDataCustomerTotal={listDataCustomerTotal}
            setListDataCustomerTotal={setListDataCustomerTotal}
            language={language}
            json_language={json_language}
            open_register={open_register}
            set_open_register={set_open_register}
            cccd_info_ss={cccd_info_ss}
            set_cccd_info_ss={set_cccd_info_ss}
            data_a_sim={data_a_sim}
            setListDataCustomerUnsync={setListDataCustomerUnsync}
            listDataCustomerUnsync={listDataCustomerUnsync}
            set_total_sim_sold_today={set_total_sim_sold_today}
            total_sim_sold_today={total_sim_sold_today}
          />
        )}
        <ListSoldSimInfo
          data_cus_by_filter_day={data_cus_by_filter_day}
          list_goicuoc={list_goicuoc}
          type_card={type_card}
          set_type_card={set_type_card}
          get_data_ListSoldSimInfo_in_day={get_data_ListSoldSimInfo_in_day}
          data_ListSoldSimInfo={data_ListSoldSimInfo}
          set_data_ListSoldSimInfo={set_data_ListSoldSimInfo}
          listDataCustomerTotal={listDataCustomerTotal}
          language={language}
          open_list_sold_sim_info={open_list_sold_sim_info}
          set_open_list_sold_sim_info={set_open_list_sold_sim_info}
        />
        {open_register_uninternet && (
          <Register_uninternet
            set_uninternet_allow_register={set_uninternet_allow_register}
            set_open_register={set_open_register}
            data_a_sim={data_a_sim}
            set_data_a_sim={set_data_a_sim}
            listPhoneSim={listPhoneSim}
            set_listPhoneSim={set_listPhoneSim}
            open_register_uninternet={open_register_uninternet}
            set_open_register_uninternet={set_open_register_uninternet}
            language={language}
            set_open_fill_info_cccd={set_open_fill_info_cccd}
            text={text}
            setText={setText}
          />
        )}
        <SafeAreaView
          style={{
            backgroundColor: 'rgba(221,223,225,0.2)',
            height: '100%',
            alignItems: 'center',
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 0,
              marginBottom: 10,
              marginTop: 10,
            }}>
            {/* <TouchableOpacity onPress={() => {
                            listDataCustomerSync.forEach(element => {
                                console.log(element.cdn)
                            });
                        }}>
                            <Text>
                                sshkadjksajdjkashdjskadhsajklds
                            </Text>
                        </TouchableOpacity> */}
            {/* <TouchableOpacity onPress={() => console.log(Dimensions.get('window').width)}>
                            <Text>
                                đajashdjksahdklas
                            </Text>
                        </TouchableOpacity> */}
            <TouchableOpacity
              style={[{width: '10%', marginLeft: 10}, styles.center]}
              onPress={() => set_smart_sim_home(false)}>
              <Ionicons name="arrow-back" size={26} color="#151B8D" />
            </TouchableOpacity>
            <Text
              style={{
                width: '80%',
                textAlign: 'center',
                marginRight: '10%',
                fontWeight: 500,
                borderRadius: 5,
                padding: 10,
                color: '#000000',
                fontSize: 20,
              }}>
              {json_language['Xin chào Vtctelecome'][language]}
            </Text>
          </View>
          <View
            style={{
              height: '23%',
              width: '100%',
              marginVertical: 0,
              marginHorizontal: 20,
              backgroundColor: '#15317E',
              borderRadius: 10,
              justifyContent: 'space-between',
            }}>
            <View style={{alignItems: 'center'}}>
              <View
                style={{
                  width: 60,
                  borderRadius: 60,
                  backgroundColor: 'white',
                  marginTop: 10,
                }}>
                <Image
                  source={
                    cccd_info.uri_selfies_image
                      ? {uri: cccd_info.uri_selfies_image}
                      : require('../../assets/images/avatar.jpg')
                  }
                  style={{height: 60, width: 60, borderRadius: 50}}
                />
              </View>
            </View>
            <TouchableOpacity
              style={{flexDirection: 'row', width: '100%'}}
              onPress={() => {
                get_data_ListSoldSimInfo_in_day('day', '');
                set_type_card('day');
                set_open_list_sold_sim_info(true);
              }}>
              <View style={{width: '85%'}}>
                <Text
                  style={{
                    color: '#ffffff',
                    paddingLeft: 20,
                    paddingBottom: 30,
                  }}>
                  {
                    json_language['Tổng số sim bán được trong hôm nay'][
                      language
                    ]
                  }
                  :
                </Text>
              </View>
              <View style={{width: '15%', flexDirection: 'row'}}>
                <Text style={{color: '#6D7B8D', paddingRight: 5}}>
                  {total_sim_sold_today}
                </Text>
                <AntDesign name="right" size={18} color="#6D7B8D" />
              </View>
            </TouchableOpacity>
          </View>
          <View
            style={{
              height: 60,
              width: '100%',
              marginTop: 20,
              flexDirection: 'row',
            }}>
            <TouchableOpacity
              style={{
                width: '33%',
                height: '100%',
                flexDirection: 'column',
                alignItems: 'center',
              }}
              onPress={() => {
                // set_open_register(true)
                if (
                  listPhoneSim &&
                  listPhoneSim.length != 0 &&
                  list_goicuoc &&
                  list_goicuoc.length != 0
                ) {
                  set_data_a_sim({});
                  set_open_fill_info_cccd(false);
                  // isConnected ? set_open_register(true) : set_open_register_uninternet(true)
                  set_open_register_uninternet(true);
                  setText('');
                } else {
                  setTimeout(() => {
                    set_open_alert(true);
                  }, 0);
                  set_type('thongbao');
                  set_color('#EAC117');
                  set_status(json_language['Lỗi'][language]);
                  set_message(
                    json_language[
                      'Danh sách sim rỗng. Vui lòng đăng xuất và đăng nhập lại để tải dữ liệu sim'
                    ][language],
                  );
                  // show_message(json_language['Lỗi'][language], json_language['Danh sách sim rỗng. Vui lòng đăng xuất và đăng nhập lại để tải dữ liệu sim'][language])
                }
              }}>
              <Entypo name="add-user" size={30} color="#6D7B8D" />
              <View style={{width: '80%'}}>
                <Text
                  style={{color: 'black', paddingTop: 5, textAlign: 'center'}}>
                  {json_language['Đăng ký thuê bao'][language]}
                </Text>
              </View>
            </TouchableOpacity>
            <View
              style={{
                width: '33%',
                height: '100%',
                flexDirection: 'column',
                alignItems: 'center',
              }}>
              {listDataCustomerUnsync.length == 0 ? (
                <AntDesign name="checkcircle" size={30} color="#4CC417" />
              ) : (
                <AntDesign name="closecircle" size={30} color="#C11B17" />
              )}
              <Text style={{color: 'black', paddingTop: 5}}>
                {
                  json_language[
                    listDataCustomerUnsync.length == 0
                      ? 'Đã đồng bộ'
                      : 'Chưa đồng bộ'
                  ][language]
                }
              </Text>
            </View>
            <View
              style={{
                width: '33%',
                height: '100%',
                flexDirection: 'column',
                alignItems: 'center',
              }}>
              <MaterialIcons name="attach-money" size={30} color="#689e80" />
              <Text style={{color: 'black', paddingTop: 5}}>
                {json_language['Nạp tiền'][language]}
              </Text>
            </View>
          </View>
          <View
            style={{
              position: 'absolute',
              bottom: 10,
              right: 10,
              padding: 10,
              backgroundColor: 'rgba(221,223,225,0.1)',
              alignItems: 'center',
            }}>
            {open_get_new && (
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  width: responsive ? 195 : 110,
                }}
                onPress={() => {
                  // setTimeout(() => {
                  //     set_open_alert(true)
                  // }, 0);
                  // set_type_func('dulieusim')
                  // set_type('thuchien')
                  // set_status(json_language["Xác nhận"][language])
                  // set_message(json_language['Bạn chắc chắn muốn tải dữ liệu sim và gói cước mới?'][language])
                  // return
                  // set_open_register(true)
                  if (
                    listPhoneSim &&
                    listPhoneSim.length != 0 &&
                    list_goicuoc &&
                    list_goicuoc.length != 0
                  ) {
                    if (listDataCustomerUnsync.length != 0) {
                      setTimeout(() => {
                        set_open_alert(true);
                      }, 0);
                      set_type('thongbao');
                      set_color('#EAC117');
                      set_status(json_language['Lỗi'][language]);
                      set_message(
                        json_language[
                          'Vui lòng đồng bộ dữ liệu đã bán lên hệ thống trước khi tải dữ liệu sim mới. Xin cảm ơn!!!'
                        ][language],
                      );
                      return;
                    } else {
                      setTimeout(() => {
                        set_open_alert(true);
                      }, 0);
                      set_type_func('dulieusim');
                      set_type('thuchien');
                      set_status(json_language['Xác nhận'][language]);
                      set_message(
                        json_language[
                          'Bạn chắc chắn muốn tải dữ liệu sim và gói cước mới?'
                        ][language],
                      );
                    }
                  } else {
                    setTimeout(() => {
                      set_open_alert(true);
                    }, 0);
                    set_type('thongbao');
                    set_color('#EAC117');
                    set_status(json_language['Lỗi'][language]);
                    set_message(
                      json_language[
                        'Danh sách sim rỗng. Vui lòng đăng xuất và đăng nhập lại để tải dữ liệu sim'
                      ][language],
                    );
                    // show_message(json_language['Lỗi'][language], json_language['Danh sách sim rỗng. Vui lòng đăng xuất và đăng nhập lại để tải dữ liệu sim'][language])
                  }
                }}>
                <View
                  style={[
                    {minWidth: responsive ? 35 : 55, marginRight: 10},
                    styles.end,
                    styles.shadow,
                  ]}>
                  <Text
                    style={{
                      marginTop: 0,
                      color: '#000000',
                      flexWrap: 'wrap',
                      fontSize: responsive ? 24 : 14,
                      fontWeight: 400,
                      padding: 3,
                      backgroundColor: '#ffffff',
                    }}>
                    {json_language['Sim mới'][language]}
                  </Text>
                </View>
                <View
                  style={[
                    {
                      width: responsive ? 60 : 40,
                      height: responsive ? 60 : 40,
                      backgroundColor: '#3BB9FF',
                      borderRadius: 100,
                    },
                    styles.center,
                    styles.shadow,
                  ]}>
                  <MaterialCommunityIcons
                    name="sim"
                    size={responsive ? 34 : 20}
                    color="#ffffff"
                  />
                </View>
              </TouchableOpacity>
            )}
            {/* {open_get_new && (<TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10, width: 100 }}
                            onPress={() => {
                                // set_open_register(true)
                                setTimeout(() => {
                                    set_open_alert(true)
                                }, 0);
                                set_type_func('dulieukhachhang')
                                set_type('thuchien')
                                set_status(json_language["Xác nhận"][language])
                                set_message('Bạn chắc chắn muốn tải dữ liệu khách hàng đã mua sim?')
                            }}
                        >
                            <View style={[{ width: 55, marginRight: 10 }, styles.end, styles.shadow]}>
                                <Text style={{ marginTop: 0, color: '#000000', flexWrap: 'wrap', fontSize: 14, fontWeight: 400, padding: 3, backgroundColor: '#ffffff' }}>{json_language['Đã bán'][language]}</Text>
                            </View>
                            <View style={[{ width: 40, height: 40, backgroundColor: '#AAD69F', borderRadius: 100, }, styles.center, styles.shadow]}>
                                <MaterialIcons name="get-app" size={20} color="#ffffff" />
                            </View>
                        </TouchableOpacity>)} */}
            <TouchableOpacity
              onPress={() => set_open_get_new(!open_get_new)}
              style={[
                {
                  flexDirection: 'column',
                  marginBottom: 20,
                  marginTop: responsive ? 30 : 10,
                  width: responsive ? 160 : 120,
                  marginRight: responsive ? 35 : 10,
                },
                styles.end,
              ]}>
              <View
                style={[
                  {
                    width: responsive ? 60 : 40,
                    height: responsive ? 60 : 40,
                    backgroundColor: '#F62217',
                    borderRadius: 100,
                  },
                  styles.center,
                  styles.shadow,
                ]}>
                <AntDesign
                  name={!open_get_new ? 'plus' : 'close'}
                  size={20}
                  color="#ffffff"
                />
              </View>
            </TouchableOpacity>
            {/* <Text style={{ marginTop: 0, color: '#000000' }}>{json_language["Đăng ký"][language]}</Text> */}
          </View>
        </SafeAreaView>
      </Modal>
    </View>
  );
}
export default memo(SmartSimHome);
