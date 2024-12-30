import React, {memo, useState} from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  SafeAreaView,
  StatusBar,
  Text,
  View,
  TextInput,
  Image,
  TouchableOpacity,
  Dimensions,
  Modal,
  Pressable,
  ScrollView,
  Platform,
} from 'react-native';
import styles from '../../styles';
const img = '../../img/';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {show_message} from '../../menu_function';
import Mandatory_Notice from '../component_product/Mandatory_Notice';
import moment from 'moment';
import {Picker} from '@react-native-picker/picker';
import AlertTwoButtom from '../component_product/AlertTwoButtom';
import HeaderClose from '../ShortComponent/HeaderClose';
import ModalSelector from 'react-native-modal-selector';
const type_responsive =
  Dimensions.get('window').width > 600 && Dimensions.get('window').height > 600
    ? 'ipad'
    : 'smartphone';
const font_size_normal = type_responsive == 'ipad' ? 17 : 15;
function modalCapNhatChuyenBay({
  chuyenbay_tam,
  set_chuyenbay_tam,
  open_mandatory_notice,
  set_open_mandatory_notice,
  screenWidth,
  screenHeight,
  language,
  json_language,
  Updatechuyenbay,
  setUpdatechuyenbay,
  chuyenbay,
  set_chuyenbay,
  CapNhatChangBay,
}) {
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [openSelectTime, setOpenSelectTime] = useState(false);
  const [openSelectDate, setOpenSelectDate] = useState(false);
  const [date, set_date] = useState(new Date());
  // console.log(chuyenbay_tam)
  const [open_alert, set_open_alert] = useState(false);
  const [alertInfo, setAlertInfo] = useState({
    color: '#1589FF',
    message: '',
    status: '',
  });

  const region = [
    {code: 'AUS', name: json_language.AUS[language]},
    {code: 'EU', name: json_language.EU[language]},
    {code: 'US', name: json_language.US[language]},
    {code: 'ASIA', name: json_language.ASIA[language]},
    {code: 'VN', name: json_language.VN[language]},
  ];
  const region_show = {
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
  const [open_select_region, set_open_select_region] = useState(false);
  const formatUpperCaseChangBay = text => {
    // let temp = text.toUpperCase()
    set_chuyenbay_tam({
      ...chuyenbay_tam,
      changBay_chuyenbay: text.toUpperCase(),
    });
  };
  const validate = () => {
    if (
      chuyenbay_tam.soHieu_chuyenbay == '' ||
      chuyenbay_tam.changBay_chuyenbay == '' ||
      chuyenbay_tam.gioBay_chuyenbay == '' ||
      chuyenbay_tam.ngayBay_chuyenbay == '' ||
      chuyenbay_tam.chauLuc_chuyenbay == ''
    ) {
      setTimeout(() => {
        set_open_alert(true);
      }, 0);
      setAlertInfo({
        status: json_language['Lỗi'][language],
        message:
          json_language['Vui lòng điền đầy đủ thông tin và thử lại'][language],
        color: '#EAC117',
      });
      // show_message(json_language["Lỗi"][language], json_language["Vui lòng điền đầy đủ thông tin và thử lại"][language])
    } else if (
      moment(chuyenbay_tam.ngayBay_chuyenbay).format('DD/MM/YYYY') <
      moment(new Date()).format('DD/MM/YYYY')
    ) {
      setTimeout(() => {
        set_open_alert(true);
      }, 0);
      setAlertInfo({
        status: json_language['Lỗi'][language],
        message: json_language['Ngày phải lớn hơn ngày hiện tại'][language],
        color: '#EAC117',
      });
    } else if (
      moment(chuyenbay_tam.ngayBay_chuyenbay).format('DD/MM/YYYY') ==
        moment(new Date()).format('DD/MM/YYYY') &&
      moment(new Date()).format('HH:mm') > chuyenbay_tam.gioBay_chuyenbay
    ) {
      setTimeout(() => {
        set_open_alert(true);
      }, 0);
      setAlertInfo({
        status: json_language['Lỗi'][language],
        message:
          json_language['Thời gian phải lớn hơn thời gian hiện tại'][language],
        color: '#EAC117',
      });
    } else {
      CapNhatChangBay(chuyenbay_tam);
      setUpdatechuyenbay(false);
    }
  };
  return (
    <Modal
      animationType="fade"
      transparent={false}
      visible={Updatechuyenbay}
      onRequestClose={() => {
        setUpdatechuyenbay(false);
      }}>
      <StatusBar backgroundColor="rgba(0, 0, 0, 1)" />

      {open_alert && (
        <AlertTwoButtom
          open_alert={open_alert}
          set_open_alert={set_open_alert}
          type={'thongbao'}
          language={language}
          color={alertInfo.color}
          status={alertInfo.status}
          message={alertInfo.message}
        />
      )}

      {open_mandatory_notice && (
        <Mandatory_Notice
          open_mandatory_notice={open_mandatory_notice}
          set_open_mandatory_notice={set_open_mandatory_notice}
          language={language}
        />
      )}

      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{flexGrow: 1}}>
        <SafeAreaView
          style={{
            backgroundColor: '#ffffff',
            flex: 1,
            position: 'relative',
          }}>
          <View style={{}}>
            <HeaderClose
              title={json_language['Thông tin chặng bay'][language]}
              func={() => setUpdatechuyenbay(false)}
            />
            <View style={{marginTop: 20}}>
              <View
                style={[
                  styles.Textinput2_row,
                  {flexDirection: 'column', padding: 0},
                ]}>
                <Text
                  style={[
                    styles.text_lable,
                    {
                      color: '#153E7E',
                      width: '100%',
                      fontSize: 16,
                      paddingBottom: 0,
                      paddingTop: 0,
                    },
                  ]}>
                  {json_language['Số hiệu'][language]}:{' '}
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    width: '100%',
                  }}>
                  <TextInput
                    style={{
                      fontSize: 15,
                      flexWrap: 'wrap',
                      padding: 10,
                      color: 'black',
                      width: '100%',
                    }}
                    autoCorrect={false}
                    maxLength={30}
                    autoCapitalized="words"
                    value={chuyenbay_tam.soHieu_chuyenbay}
                    placeholder="QH002"
                    placeholderTextColor="#cfcfcb"
                    onChangeText={async text => {
                      set_chuyenbay_tam({
                        ...chuyenbay_tam,
                        soHieu_chuyenbay: await String(text).toUpperCase(),
                      });
                    }}
                  />
                </View>
              </View>
            </View>

            <View style={{marginTop: 10}}>
              <View
                style={[
                  styles.Textinput2_row,
                  {flexDirection: 'column', padding: 0},
                ]}>
                <Text
                  style={[
                    styles.text_lable,
                    {
                      color: '#153E7E',
                      width: '100%',
                      fontSize: 16,
                      paddingBottom: 0,
                      paddingTop: 0,
                    },
                  ]}>
                  {json_language['Chặng bay'][language]}:{' '}
                </Text>
                <TextInput
                  style={{
                    fontSize: 15,
                    width: '100%',
                    flexWrap: 'wrap',
                    padding: 10,
                    color: 'black',
                  }}
                  autoCorrect={false}
                  maxLength={30}
                  autoCapitalized="sentences"
                  value={chuyenbay_tam.changBay_chuyenbay}
                  placeholder="HN-SGN"
                  onChangeText={async text =>
                    set_chuyenbay_tam({
                      ...chuyenbay_tam,
                      changBay_chuyenbay: await String(text).toUpperCase(),
                    })
                  }
                  placeholderTextColor="#cfcfcb"
                />
              </View>
            </View>
            <View style={{marginTop: 10}}>
              <View
                style={[
                  styles.Textinput2_row,
                  {flexDirection: 'column', padding: 0},
                ]}>
                <Text
                  style={[
                    styles.text_lable,
                    {
                      color: '#153E7E',
                      width: '100%',
                      fontSize: 16,
                      paddingBottom: 0,
                      paddingTop: 0,
                    },
                  ]}>
                  {json_language['Châu lục'][language]}:{' '}
                </Text>
                <View style={{flexDirection: 'row'}}>
                  <View style={{width: '100%'}}>
                    <TouchableOpacity
                      style={[
                        styles.Textinput2_row,
                        {
                          marginTop: 5,
                          width: '100%',
                          borderBottomWidth: 0,
                          marginLeft: 5,
                        },
                      ]}
                      onPress={() => set_open_select_region(true)}>
                      <Text
                        style={[
                          styles.text_lable,
                          {color: 'black', width: '40%'},
                        ]}>
                        {!chuyenbay_tam.chauLuc_chuyenbay
                          ? ''
                          : !region_show[chuyenbay_tam.chauLuc_chuyenbay]
                          ? ''
                          : !region_show[chuyenbay_tam.chauLuc_chuyenbay][
                              language
                            ]
                          ? ''
                          : region_show[chuyenbay_tam.chauLuc_chuyenbay][
                              language
                            ]}{' '}
                      </Text>
                      <View
                        style={{
                          width: '50%',
                          justifyContent: 'flex-end',
                          alignItems: 'flex-end',
                        }}>
                        <View style={{justifyContent: 'flex-end'}}>
                          <AntDesign
                            name="caretdown"
                            size={20}
                            style={{marginLeft: 15}}
                          />
                        </View>
                      </View>
                      <Modal visible={open_select_region} transparent={true}>
                        <View
                          style={{
                            height: '100%',
                            backgroundColor: 'rgba(0,0,0,0.3)',
                            justifyContent: 'flex-end',
                          }}>
                          <View
                            style={{
                              height: '100%',
                              marginHorizontal: 10,
                              justifyContent: 'center',
                            }}>
                            <View
                              style={{
                                height: 250,
                                backgroundColor: '#ffffff',
                                width: '100%',
                                borderRadius: 10,
                              }}>
                              <FlatList
                                keyExtractor={item => item.code}
                                data={region}
                                renderItem={({item, index}) => {
                                  // console.log(item)
                                  return (
                                    <TouchableOpacity
                                      onPress={() => {
                                        set_chuyenbay_tam({
                                          ...chuyenbay_tam,
                                          chauLuc_chuyenbay: item.code,
                                        });
                                        set_open_select_region(false);
                                      }}
                                      key={index}
                                      style={{
                                        width: '100%',
                                        height: 50,
                                        borderBottomColor: '#DDDFE1',
                                        borderBottomWidth:
                                          index == region.length - 1 ? 0 : 1,
                                        justifyContent: 'center',
                                      }}>
                                      <Text
                                        style={{
                                          color: 'black',
                                          fontSize: font_size_normal,
                                          padding: 10,
                                          textAlign: 'center',
                                        }}>
                                        {item.name}
                                      </Text>
                                    </TouchableOpacity>
                                  );
                                }}
                              />

                              {/* <View style={{ height: 200 }}>
                                                                    </View> */}
                            </View>
                            <View style={{height: 55}}>
                              <View
                                style={{
                                  width: '100%',
                                  marginTop: 8,
                                  backgroundColor: '#ffffff',
                                  borderRadius: 10,
                                }}>
                                <TouchableOpacity
                                  style={{marginHorizontal: 50}}
                                  onPress={() => set_open_select_region(false)}>
                                  <Text
                                    style={{
                                      padding: 10,
                                      textAlign: 'center',
                                      fontSize: 20,
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
                      </Modal>
                    </TouchableOpacity>
                    {/* )} */}
                  </View>
                </View>
              </View>
            </View>
            <View style={{marginTop: 10}}>
              <View
                style={[
                  styles.Textinput2_row,
                  {flexDirection: 'column', padding: 0},
                ]}>
                <Text
                  style={[
                    styles.text_lable,
                    {
                      color: '#153E7E',
                      width: '100%',
                      fontSize: 16,
                      paddingBottom: 0,
                      paddingTop: 0,
                    },
                  ]}>
                  {json_language['Ngày bay'][language]}:{' '}
                </Text>
                <TouchableOpacity
                  style={{width: '100%'}}
                  onPress={() => setOpenSelectTime(true)}>
                  <Text
                    style={{
                      fontSize: 16,
                      color: 'black',
                      padding: 15,
                      paddingLeft: 10,
                    }}>
                    {chuyenbay_tam.ngayBay_chuyenbay
                      ? moment(chuyenbay_tam.ngayBay_chuyenbay).format(
                          'DD/MM/YYYY',
                        )
                      : ''}
                  </Text>
                </TouchableOpacity>
                <DateTimePickerModal
                  isVisible={openSelectTime}
                  mode="date"
                  format="DD/MM/YYYY"
                  onConfirm={d => {
                    // console.log(d)
                    set_chuyenbay_tam({...chuyenbay_tam, ngayBay_chuyenbay: d});
                    setOpenSelectTime(false);
                  }}
                  onCancel={() => setOpenSelectTime(false)}
                />
              </View>
            </View>
            <View style={{marginTop: 10}}>
              <View
                style={[
                  styles.Textinput2_row,
                  {flexDirection: 'column', padding: 0},
                ]}>
                <Text
                  style={[
                    styles.text_lable,
                    {
                      color: '#153E7E',
                      width: '100%',
                      fontSize: 16,
                      paddingBottom: 0,
                      paddingTop: 0,
                    },
                  ]}>
                  {json_language['Giờ bay'][language]}:{' '}
                </Text>
                {/* <TextInput style={{ fontSize: 15, width: '100%', flexWrap: 'wrap' }}
                                    autoCorrect={false}
                                    maxLength={30}
                                    autoCapitalized="words"
                                    value={gioBay_chuyenbay}
                                    placeholder="08:25"
                                    onChangeText={text => setgioBay_chuyenbay(text)}
                                /> */}
                <TouchableOpacity
                  style={{width: '100%'}}
                  onPress={() => setOpenSelectDate(true)}>
                  <Text
                    style={{
                      fontSize: 16,
                      color: 'black',
                      padding: 15,
                      paddingLeft: 10,
                      margin: 0,
                      textAlign: 'left',
                    }}>
                    {chuyenbay_tam.gioBay_chuyenbay}
                  </Text>
                </TouchableOpacity>
                <DateTimePickerModal
                  isVisible={openSelectDate}
                  mode="time"
                  onConfirm={d => {
                    // setgioBay_chuyenbay(d.getHours().toString() + ':' + d.getMinutes().toString())
                    set_chuyenbay_tam({
                      ...chuyenbay_tam,
                      gioBay_chuyenbay: moment(d).format('HH:mm'),
                    });
                    setOpenSelectDate(false);
                  }}
                  onCancel={() => setOpenSelectDate(false)}
                />
              </View>
            </View>
          </View>
          <TouchableOpacity
            style={[
              styles.textAlignCenter,
              {
                height: 50,
                backgroundColor: '#4EBDEC',
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
              },
            ]}
            onPress={validate}>
            <Text style={{color: 'white', fontSize: 20, fontWeight: 500}}>
              {json_language['Cập nhật'][language]}
            </Text>
          </TouchableOpacity>
        </SafeAreaView>
      </ScrollView>
    </Modal>
  );
}
export default memo(modalCapNhatChuyenBay);
