import React, {memo, useState} from 'react';
import {
  StatusBar,
  ScrollView,
  SafeAreaView,
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
import Ionicons from 'react-native-vector-icons/Ionicons';
// AntDesign.loadFont();
// Ionicons.loadFont();
import Loading_animation from '../component_modal/Loading_animation';
import json_language from '../../json/language.json';
import Show_view_detail_custumer from './show_view_detail_custumer';
import FlastList_info from './FlastList_info';
const img = '../../img/';
function ListSoldSimInfo({
  data_cus_by_filter_day,
  list_goicuoc,
  type_card,
  set_type_card,
  get_data_ListSoldSimInfo_in_day,
  data_ListSoldSimInfo,
  set_data_ListSoldSimInfo,
  listDataCustomerTotal,
  screenHeight,
  screenWidth,
  language,
  open_list_sold_sim_info,
  set_open_list_sold_sim_info,
}) {
  const [loading, set_loading] = useState(false);
  const [text, setText] = useState('');
  const [type, set_type] = useState();
  const [detail_customer, set_detail_customer] = useState(false);

  function SearchNamePhone(newtext) {
    setText(newtext);
    if (newtext && newtext != '' && data_cus_by_filter_day) {
      set_data_ListSoldSimInfo(
        data_cus_by_filter_day.filter(d => {
          return (
            (d.fullName || '').toUpperCase().includes(newtext.toUpperCase()) ||
            d.phoneRegister.toUpperCase().includes(newtext.toUpperCase())
          );
        }),
      );
    } else set_data_ListSoldSimInfo(data_cus_by_filter_day);
  }
  const [open_detail_info_customer, set_open_detail_info_customer] =
    useState(false);
  return (
    <View>
      <Modal
        animationType="slide-down"
        transparent={false}
        visible={open_list_sold_sim_info}
        onRequestClose={() => {
          !open_detail_info_customer ? set_open_list_sold_sim_info(false) : {};
          set_open_detail_info_customer(false);
        }}>
        <Loading_animation onLoading={loading} />
        <StatusBar backgroundColor="rgba(0, 0, 0, 1)" />

        {!open_detail_info_customer ? (
          <SafeAreaView style={{backgroundColor: 'white', height: '100%'}}>
            <View
              style={[
                styles.borderWidth_all_center_row,
                {borderBottomColor: '#6D7B8D'},
              ]}>
              <TouchableOpacity
                style={{
                  width: '10%',
                  marginLeft: 10,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onPress={() => set_open_list_sold_sim_info(false)}>
                <Ionicons name="arrow-back" size={26} color="#151B8D" />
              </TouchableOpacity>
              <View style={{width: '90%'}}>
                <Text
                  style={{
                    fontWeight: 500,
                    borderRadius: 5,
                    padding: 20,
                    color: '#000000',
                    fontSize: 18,
                  }}>
                  {json_language['Đăng ký thuê bao'][language]}
                </Text>
              </View>
            </View>
            <View style={{alignItems: 'center', marginTop: 10}}>
              <View
                style={{
                  flexDirection: 'row',
                  width: '90%',
                  borderRadius: 5,
                  borderWidth: 1,
                  borderColor: 'black',
                }}>
                <TouchableOpacity
                  style={{
                    width: '33.33%',
                    backgroundColor:
                      type_card === 'day' ? '#6D7B8D' : '#ffffff',
                    borderTopLeftRadius: 3,
                    borderBottomLeftRadius: 3,
                  }}
                  onPress={() => {
                    get_data_ListSoldSimInfo_in_day('day', text);
                    set_type_card('day');
                    // setText("")
                  }}>
                  <Text
                    style={{
                      color: type_card === 'day' ? 'white' : 'black',
                      fontSize: 18,
                      padding: 8,
                      textAlign: 'center',
                    }}>
                    {json_language['Ngày'][language]}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    width: '33.33%',
                    backgroundColor:
                      type_card === 'month' ? '#6D7B8D' : '#ffffff',
                    borderColor: '#A8ABAB',
                    borderLeftWidth: type_card === 'month' ? 0 : 1,
                    borderRightWidth: type_card === 'month' ? 0 : 1,
                  }}
                  onPress={() => {
                    get_data_ListSoldSimInfo_in_day('month', text);
                    set_type_card('month');
                    // setText("")
                  }}>
                  <Text
                    style={{
                      color: type_card === 'month' ? 'white' : 'black',
                      fontSize: 18,
                      padding: 8,
                      textAlign: 'center',
                    }}>
                    {json_language['Tháng'][language]}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    width: '33.33%',
                    backgroundColor:
                      type_card === 'all' ? '#6D7B8D' : '#ffffff',
                    borderTopRightRadius: 3,
                    borderBottomRightRadius: 3,
                  }}
                  onPress={() => {
                    get_data_ListSoldSimInfo_in_day('all', text);
                    set_type_card('all');
                    // setText("")
                  }}>
                  <Text
                    style={{
                      color: type_card === 'all' ? 'white' : 'black',
                      fontSize: 18,
                      padding: 8,
                      textAlign: 'center',
                    }}>
                    {json_language['Tất cả'][language]}
                  </Text>
                </TouchableOpacity>
              </View>
              <View
                style={{width: '100%', alignItems: 'center', marginTop: 10}}>
                <View
                  style={[
                    {
                      height: 60,
                      width: '100%',
                      alignItems: 'center',
                      backgroundColor: '#FFFFFC',
                    },
                  ]}>
                  <View
                    style={[
                      styles.centeredView,
                      {marginTop: 10, width: '100%', heightL: '100%'},
                    ]}>
                    <View
                      style={[
                        styles.search_container,
                        {
                          width:
                            Dimensions.get('window').width > 480 &&
                            Dimensions.get('window').height > 480
                              ? Dimensions.get('window').width - 60
                              : Dimensions.get('window').width - 30,
                        },
                      ]}>
                      <AntDesign
                        name="search1"
                        size={23}
                        color="#000000"
                        style={{marginLeft: 25}}
                      />
                      <TextInput
                        style={[
                          {
                            width: '90%',
                            padding: 10,
                            paddingLeft: 20,
                            fontFamily: 'Arial',
                            color: 'black',
                          },
                        ]}
                        autoCapitalize="none"
                        autoCorrect={false}
                        maxLength={30}
                        autoCapitalized="words"
                        value={text}
                        onChangeText={SearchNamePhone}
                        placeholder={
                          json_language[
                            'Tìm kiếm theo số điện thoại, số serial'
                          ][language]
                        }
                        placeholderTextColor="#cfcfcb"
                      />
                    </View>
                  </View>
                </View>
              </View>
              <View
                style={{
                  marginTop: 20,
                  width: Dimensions.get('window').width - 30,
                  height:
                    Platform.OS == 'ios' &&
                    Dimensions.get('window').height > 480 &&
                    Dimensions.get('window').width > 480
                      ? '80%'
                      : '76%',
                  paddingLeft:
                    Dimensions.get('window').width > 480 &&
                    Dimensions.get('window').height > 480
                      ? 30
                      : 0,
                }}>
                <FlastList_info
                  type_card={type_card}
                  listDataCustomerTotal={listDataCustomerTotal}
                  data_ListSoldSimInfo={data_ListSoldSimInfo}
                  set_type={set_type}
                  set_open_detail_info_customer={set_open_detail_info_customer}
                  set_detail_customer={set_detail_customer}
                />
              </View>
            </View>
          </SafeAreaView>
        ) : (
          <SafeAreaView style={{backgroundColor: '#ffffff', width: '100%'}}>
            <View
              style={[
                styles.borderWidth_all_center_row,
                {borderBottomColor: '#6D7B8D'},
              ]}>
              <TouchableOpacity
                style={{
                  width: '10%',
                  marginLeft: 10,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onPress={() => set_open_detail_info_customer(false)}>
                <Ionicons name="arrow-back" size={26} color="#151B8D" />
              </TouchableOpacity>
              <View style={{width: '90%'}}>
                <Text
                  style={{
                    fontWeight: 500,
                    borderRadius: 5,
                    padding: 20,
                    color: '#000000',
                    fontSize: 18,
                  }}>
                  {detail_customer.fullName}
                </Text>
              </View>
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
                          color: '#153E7E',
                          fontSize: 22,
                        }}>
                        {json_language['Thông tin khách hàng'][language]}
                      </Text>
                    </View>
                    <View style={{marginTop: 10}}>
                      <View
                        style={[styles.Textinput2_row, {alignItems: 'center'}]}>
                        <Text style={[styles.text_lable40, {color: '#153E7E'}]}>
                          {json_language['Họ tên'][language]}:{' '}
                        </Text>
                        <Text style={[styles.text_lable60, {color: '#000000'}]}>
                          {detail_customer.fullName}{' '}
                        </Text>
                      </View>
                      <View
                        style={[
                          styles.Textinput2_row,
                          {marginTop: 10, alignItems: 'center'},
                        ]}>
                        <Text style={[styles.text_lable40, {color: '#153E7E'}]}>
                          {json_language['Địa chỉ'][language]}:{' '}
                        </Text>
                        <Text style={[styles.text_lable60, {color: '#000000'}]}>
                          {detail_customer.address}{' '}
                        </Text>
                      </View>
                      <View
                        style={[
                          styles.Textinput2_row,
                          {marginTop: 10, alignItems: 'center'},
                        ]}>
                        <Text style={[styles.text_lable40, {color: '#153E7E'}]}>
                          {json_language['Giới tính'][language]}:{' '}
                        </Text>
                        <Text style={[styles.text_lable60, {color: '#000000'}]}>
                          {detail_customer.gender == 1
                            ? json_language['Nam'][language]
                            : json_language['Nữ'][language]}{' '}
                        </Text>
                      </View>
                      <View style={[styles.Textinput2_row, {marginTop: 10}]}>
                        <Text style={[styles.text_lable40, {color: '#153E7E'}]}>
                          {json_language['Ngày sinh'][language]}:{' '}
                        </Text>
                        <Text style={[styles.text_lable60, {color: '#000000'}]}>
                          {detail_customer.birthday
                            ? detail_customer.birthday.toString().split('T')[0]
                            : ''}{' '}
                        </Text>
                      </View>
                      <View style={[styles.Textinput2_row, {marginTop: 10}]}>
                        <Text style={[styles.text_lable40, {color: '#153E7E'}]}>
                          {json_language['Số điện thoại'][language]}:{' '}
                        </Text>
                        <Text style={[styles.text_lable60, {color: '#000000'}]}>
                          {detail_customer.phoneCustomer}{' '}
                        </Text>
                      </View>
                      <View style={[styles.Textinput2_row, {marginTop: 10}]}>
                        <Text style={[styles.text_lable40, {color: '#153E7E'}]}>
                          {json_language['Số ID card/Passport'][language]}:{' '}
                        </Text>
                        <Text style={[styles.text_lable60, {color: '#000000'}]}>
                          {detail_customer.idNumber}{' '}
                        </Text>
                      </View>
                      <View style={[styles.Textinput2_row, {marginTop: 10}]}>
                        <Text style={[styles.text_lable40, {color: '#153E7E'}]}>
                          {json_language['Ngày phát hành'][language]}:{' '}
                        </Text>
                        <Text style={[styles.text_lable60, {color: '#000000'}]}>
                          {detail_customer.dateOfIssue.toString().split('T')[0]}{' '}
                        </Text>
                      </View>
                      <View style={[styles.Textinput2_row, {marginTop: 10}]}>
                        <Text style={[styles.text_lable40, {color: '#153E7E'}]}>
                          {json_language['Nơi cấp'][language]}:{' '}
                        </Text>
                        <Text style={[styles.text_lable60, {color: '#000000'}]}>
                          {detail_customer.placeOfIssue}{' '}
                        </Text>
                      </View>
                    </View>
                  </View>
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
                          color: '#153E7E',
                          fontSize: 22,
                        }}>
                        {json_language['Thông tin gói cước'][language]}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.Textinput2_row,
                        {marginTop: 10, alignItems: 'center'},
                      ]}>
                      <Text style={[styles.text_lable40, {color: '#153E7E'}]}>
                        {json_language['Tên gói cước'][language]}:{' '}
                      </Text>
                      <Text style={[styles.text_lable60, {color: '#000000'}]}>
                        {detail_customer.packOfData}{' '}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.Textinput2_row,
                        {marginTop: 10, alignItems: 'center'},
                      ]}>
                      <Text style={[styles.text_lable40, {color: '#153E7E'}]}>
                        {json_language['Ngày đăng ký'][language]}:{' '}
                      </Text>
                      <Text style={[styles.text_lable60, {color: '#000000'}]}>
                        {detail_customer.createdAt
                          ? detail_customer.createdAt.toString().split('T')[0]
                          : ''}{' '}
                      </Text>
                    </View>
                    {/* <View style={[styles.Textinput2_row, { marginTop: 10, alignItems: 'center' }]}>
                                            <Text style={[styles.text_lable40, { color: '#153E7E' }]}>{json_language["Tình trạng"][language]}: </Text>
                                            <Text style={[styles.text_lable60, { color: '#000000' }]}>{detail_customer.isSync ? "true" : "false"} </Text>
                                        </View> */}
                  </View>
                  <View
                    style={[
                      {
                        padding: 10,
                        backgroundColor: '#ffffff',
                        marginTop: 10,
                        borderRadius: 10,
                        marginBottom:
                          Platform.OS == 'ios'
                            ? Dimensions.get('window').width > 600
                              ? 30
                              : 100
                            : 150,
                      },
                      styles.shadow,
                    ]}>
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
                          color: '#153E7E',
                          fontSize: 22,
                        }}>
                        {json_language['Thông tin thuê bao'][language]}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.Textinput2_row,
                        {marginTop: 10, alignItems: 'center'},
                      ]}>
                      <Text style={[styles.text_lable40, {color: '#153E7E'}]}>
                        {json_language['Số điện thoại đăng ký'][language]}:{' '}
                      </Text>
                      <Text style={[styles.text_lable60, {color: '#000000'}]}>
                        {detail_customer.phoneRegister}{' '}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.Textinput2_row,
                        {marginTop: 10, alignItems: 'center'},
                      ]}>
                      <Text style={[styles.text_lable40, {color: '#153E7E'}]}>
                        {json_language['Mã serial sim'][language]}:{' '}
                      </Text>
                      <Text style={[styles.text_lable60, {color: '#000000'}]}>
                        {detail_customer.codeSim}{' '}
                      </Text>
                    </View>
                  </View>
                  {/* <View style={[{ padding: 10, backgroundColor: "#ffffff", marginTop: 10, borderRadius: 10 }, styles.shadow]}>

                                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>
                                            <Text style={{ width: '100%', padding: 8, color: '#153E7E', fontSize: 20 }}>
                                                {json_language["Ảnh giấy tờ tùy thân & chân dung"][language]}
                                            </Text>
                                        </View>
                                        <View>
                                            <Text style={{ fontSize: 16, paddingTop: 10, paddingBottom: 5, color: 'black' }}>{json_language["Mặt trước"][language]}</Text>
                                            <Image source={{ uri: detail_customer.pathFileFront }} style={{ width: '100%', height: Dimensions.get('window').width * 0.55, borderRadius: 10, marginBottom: 20 }} />
                                        </View>
                                        <View>
                                            <Text style={{ fontSize: 16, paddingBottom: 5, color: 'black' }}>{json_language["Mặt sau"][language]}</Text>
                                            <Image source={{ uri: detail_customer.pathFileBack }} style={{ width: '100%', height: Dimensions.get('window').width * 0.55, borderRadius: 10, marginBottom: 20 }} />
                                        </View>
                                        <View>
                                            <Text style={{ fontSize: 16, paddingBottom: 5, color: 'black' }}>{json_language["Ảnh chân dung"][language]}</Text>
                                            <Image source={{ uri: detail_customer.pathFilePortrait }} style={{ width: '100%', height: Dimensions.get('window').width * 0.55, borderRadius: 10, marginBottom: 20 }} />
                                        </View>

                                        <View style={{ height: 100 }}></View>
                                    </View> */}
                </View>
              </ScrollView>
            </View>
          </SafeAreaView>
        )}
      </Modal>
    </View>
  );
}
export default memo(ListSoldSimInfo);
