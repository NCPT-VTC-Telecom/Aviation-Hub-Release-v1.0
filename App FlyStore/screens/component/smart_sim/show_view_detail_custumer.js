import React, {memo, useCallback, useState} from 'react';
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
import styles from '../../styles';
import Loading_animation from '../component_modal/Loading_animation';
import {Picker} from '@react-native-picker/picker';
import json_language from '../../json/language.json';

function show_detail_info_customer({
  detail_customer,
  language,
  open_detail_info_customer,
  set_open_detail_info_customer,
}) {
  const [loading, set_loading] = useState(false);
  return (
    <View>
      <Loading_animation onLoading={loading} />
      <Modal
        animationType="slide-down"
        transparent={false}
        visible={open_detail_info_customer}
        onRequestClose={() => {
          set_open_detail_info_customer(false);
        }}>
        <StatusBar backgroundColor="rgba(0, 0, 0, 1)" />
        <SafeAreaView style={{backgroundColor: '#ffffff', width: '100%'}}>
          <TouchableOpacity
            onPress={() => set_open_detail_info_customer(false)}>
            <View
              style={{
                height: 60,
                flexDirection: 'row',
                alignItems: 'center',
                borderBottomWidth: 1,
                borderColor: '#6D7B8D',
              }}>
              <Ionicons name="arrow-back" size={25} style={{marginLeft: 10}} />
              <Text style={{fontSize: 18, color: '#153E7E', paddingLeft: 10}}>
                {detail_customer.fullName}
              </Text>
            </View>
          </TouchableOpacity>
          <View style={{backgroundColor: '#DDDFE1'}}>
            <ScrollView style={{marginHorizontal: 10}}>
              {detail_customer && (
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
                            ? json_language.Nam[language]
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
                        {detail_customer.text}{' '}
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
                    <View
                      style={[
                        styles.Textinput2_row,
                        {marginTop: 10, alignItems: 'center'},
                      ]}>
                      <Text style={[styles.text_lable40, {color: '#153E7E'}]}>
                        {json_language['Tình trạng'][language]}:{' '}
                      </Text>
                      <Text style={[styles.text_lable60, {color: '#000000'}]}>
                        {detail_customer.isSync ? 'true' : 'false'}{' '}
                      </Text>
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
                          fontSize: 20,
                        }}>
                        {
                          json_language['Ảnh giấy tờ tùy thân & chân dung'][
                            language
                          ]
                        }
                      </Text>
                    </View>
                    <View>
                      <Text
                        style={{
                          fontSize: 16,
                          paddingTop: 10,
                          paddingBottom: 5,
                          color: 'black',
                        }}>
                        {json_language['Mặt trước'][language]}
                      </Text>
                      <Image
                        source={{uri: detail_customer.pathFileFront}}
                        style={{
                          width: '100%',
                          height: Dimensions.get('window').width * 0.625,
                          borderRadius: 10,
                          marginBottom: 20,
                        }}
                      />
                    </View>
                    <View>
                      <Text
                        style={{
                          fontSize: 16,
                          paddingBottom: 5,
                          color: 'black',
                        }}>
                        {json_language['Mặt sau'][language]}
                      </Text>
                      <Image
                        source={{uri: detail_customer.pathFileBack}}
                        style={{
                          width: '100%',
                          height: Dimensions.get('window').width * 0.625,
                          borderRadius: 10,
                          marginBottom: 20,
                        }}
                      />
                    </View>
                    <View>
                      <Text
                        style={{
                          fontSize: 16,
                          paddingBottom: 5,
                          color: 'black',
                        }}>
                        {json_language['Ảnh chân dung'][language]}
                      </Text>
                      <Image
                        source={{uri: detail_customer.pathFilePortrait}}
                        style={{
                          width: '100%',
                          height: Dimensions.get('window').width * 0.625,
                          borderRadius: 10,
                          marginBottom: 20,
                        }}
                      />
                    </View>

                    <View style={{height: 100}} />
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
export default memo(show_detail_info_customer);
