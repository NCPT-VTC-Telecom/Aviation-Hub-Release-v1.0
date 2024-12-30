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
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import RNFS from 'react-native-fs';

// AntDesign.loadFont();
// Entypo.loadFont();
// MaterialIcons.loadFont();
import Register from '../smart_sim/register';
import ListSoldSimInfo from '../smart_sim/ListSoldSimInfo';
import Register_uninternet from './register_uninternet';
import {show_message} from '../../menu_function';
const img = '../../img/';
import DaBan from './DaBan';
import TakePhotoCCCD from './TakePhotoCCCD';
import AlertTwoButtom from '../component_product/AlertTwoButtom';
import Fill_info_cccd from './fill_info_cccd';
import {url_api} from '../../../config';
import Loading_animation from '../component_modal/Loading_animation';
const responsive =
  Dimensions.get('window').width > 600 &&
  Dimensions.get('window').width < Dimensions.get('window').height
    ? true
    : false;
function Home({
  set_list_goicuoc,
  setDataLocal,
  total_esim_sold_today,
  set_total_esim_sold_today,
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
  open_joytel,
  set_open_joytel,
  listEsim,
  setListEsim,
  json_language,
  language,
  listCusBoughtEsim,
  setListCusBoughtEsim,
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
    idNumber: '',
    createdAt: new Date(),
    snCode: '',
    email: '',
  });

  const handleTotalSimSold = useCallback(
    listCusBoughtEsim => {
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
      const temp = listCusBoughtEsim.filter(d => {
        return (
          d.createdAt && d.createdAt.toString().includes(full_day.toUpperCase())
        );
      });
      set_total_esim_sold_today(temp.length);
    },
    [listCusBoughtEsim],
  );
  useEffect(() => {
    handleTotalSimSold(listCusBoughtEsim);
  }, [listCusBoughtEsim]);
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
      const temp = listCusBoughtEsim.filter(d => {
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
      const temp = listCusBoughtEsim.filter(d => {
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
      const temp = listCusBoughtEsim.filter(d => {
        return (
          (d.fullName || '').includes(newtext.toUpperCase()) ||
          d.phoneRegister.toUpperCase().includes(newtext.toUpperCase())
        );
      });
      set_data_ListSoldSimInfo(temp);
      set_data_cus_by_filter_day(listCusBoughtEsim);
    }
  });
  const [loading, set_loading] = useState(false);
  //xóa uri trong local storage nếu không dùng tới

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
  const [open_take_photo_cccd, set_open_take_photo_cccd] = useState(false);
  const [type_func, set_type_func] = useState('');
  const [formFlightorder, setFormFlightorder] = useState(false);
  const [openDetailStore, setOpenDetailStore] = useState(false);
  const [viTriOpenDetail, setViTriOpenDetail] = useState(0);
  const openDonHangdaMua = useCallback(viTri => {
    setOpenDetailStore(true);
    setViTriOpenDetail(viTri);
  });
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
        visible={open_joytel}
        onRequestClose={() => {
          set_open_joytel(false);
        }}>
        {loading && (
          <View style={styles.center}>
            <Loading_animation
              onLoading={loading}
              onAction={json_language['Đang tải dữ liệu'][language]}
            />
          </View>
        )}
        {/* <AlertTwoButtom open_alert={open_alert} set_open_alert={set_open_alert} type={type} language={language} color={color} status={status} message={message}
                    button_message_close={json_language['Hủy'][language]}
                    button_message_func={json_language['Tiếp tục'][language]} func={type_func == 'dulieusim' ? getNewListSim : getListCusSoldSim} /> */}
        <StatusBar backgroundColor="rgba(0, 0, 0, 1)" />
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
          open_fill_info_cccd={open_fill_info_cccd}
          isConnected={isConnected}
          text={text}
          setText={setText}
          listDataCustomerSync={listDataCustomerSync}
          setListDataCustomerSync={setListDataCustomerSync}
          listDataCustomerUnsync={listDataCustomerUnsync}
          setListDataCustomerUnsync={setListDataCustomerUnsync}
          listDataCustomerTotal={listDataCustomerTotal}
          setListDataCustomerTotal={setListDataCustomerTotal}
          set_total_esim_sold_today={set_total_esim_sold_today}
          total_esim_sold_today={total_esim_sold_today}
          list_goicuoc={list_goicuoc}
          cccd_info_ss={cccd_info_ss}
          set_cccd_info_ss={set_cccd_info_ss}
          photo={photo}
          set_photo={set_photo}
          setListEsim={setListEsim}
          listEsim={listEsim}
          setListCusBoughtEsim={setListCusBoughtEsim}
          listCusBoughtEsim={listCusBoughtEsim}
        />
        <DaBan
          screenHeight={screenHeight}
          screenWidth={screenWidth}
          setListCusBoughtEsim={setListCusBoughtEsim}
          language={language}
          formFlightorder={formFlightorder}
          setFormFlightorder={setFormFlightorder}
          setOpenDetailStore={setOpenDetailStore}
          listCusBoughtEsim={listCusBoughtEsim}
          openDetailStore={openDetailStore}
          onViTriOpenDetail={viTriOpenDetail}
          onSetViTriOpenDetail={setViTriOpenDetail} />

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
            <TouchableOpacity
              style={[{width: '10%', marginLeft: 10}, styles.center]}
              onPress={() => set_open_joytel(false)}>
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
                setFormFlightorder(true);
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
                  {total_esim_sold_today}
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
              <FontAwesome name="search-plus" size={30} color="#6D7B8D" />
              <View style={{width: '80%'}}>
                <Text
                  style={{color: 'black', paddingTop: 5, textAlign: 'center'}}>
                  {json_language['Chọn esim'][language]}
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
              <MaterialCommunityIcons
                name="file-document-edit-outline"
                size={30}
                color="#4CC417"
              />
              <Text style={{color: 'black', paddingTop: 5}}>
                {json_language['Điền thông tin'][language]}
              </Text>
            </View>
            <View
              style={{
                width: '33%',
                height: '100%',
                flexDirection: 'column',
                alignItems: 'center',
              }}>
              <AntDesign name="qrcode" size={30} color="#689e80" />
              <Text style={{color: 'black', paddingTop: 5}}>
                {json_language['Quét QR Code'][language]}
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
export default memo(Home);
