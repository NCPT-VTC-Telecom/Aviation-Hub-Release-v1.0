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
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
// import TextRecognition from 'react-native-text-recognition';
import RNFS from 'react-native-fs';
import Select_type_take_photo from './select_type_take_photo';
import Select_type_take_photo_black from './select_type_take_photo_black';
import Fill_info_cccd from './fill_info_cccd';
import Loading_animation from '../component_modal/Loading_animation';
import StepIndicator from 'react-native-step-indicator';
import {stepIndicatorStyles} from '../common';
import json_language from '../../json/language.json';
const img = '../../img/';
const padding_screens =
  Dimensions.get('window').width > 480 && Dimensions.get('window').height > 480
    ? 10
    : 0;
const margin_and_ios = Platform.OS == 'ios' ? 0 : 10;
const step = 2;
function TakePhotoCCCD({
  photo,
  set_photo,
  listPhoneSim,
  set_listPhoneSim,
  isConnected,
  listDataCustomerSync,
  setListDataCustomerSync,
  set_total_sim_sold_today,
  total_sim_sold_today,
  set_open_register_uninternet,
  list_goicuoc,
  data_a_sim,
  setListDataCustomerUnsync,
  listDataCustomerUnsync,
  listDataCustomerTotal,
  setListDataCustomerTotal,
  set_open_register,
  open_select_type,
  set_open_select_type,
  screenHeight,
  screenWidth,
  language,
  open_take_photo_cccd,
  set_open_take_photo_cccd,
  takePhoto,
  choosePhoto,
  cccd_info_ss,
  set_cccd_info_ss,
  open_fill_info_cccd,
  set_open_fill_info_cccd,
}) {
  const [type_card, set_type_card] = useState('IDCard');
  const [select_type_take_photo, set_select_type_take_photo] =
    useState('Library');
  const [type, set_type] = useState('front_cccd');
  const [loading, set_loading] = useState(false);
  const width_image =
    Dimensions.get('window').width > 480 &&
    Dimensions.get('window').height > 480
      ? Dimensions.get('window').width * 0.8
      : Dimensions.get('window').width * 0.9;
  const height_image =
    Dimensions.get('window').width > 480 &&
    Dimensions.get('window').height > 480
      ? Dimensions.get('window').width * 0.48
      : Dimensions.get('window').width * 0.51;

  return (
    <View>
      <Modal
        animationType="slide-down"
        transparent={false}
        visible={open_take_photo_cccd}
        onRequestClose={() => {
          set_open_take_photo_cccd(false);
        }}>
        <Loading_animation
          onLoading={loading}
          onAction={json_language['Đang xử lý'][language]}
        />
        <StatusBar backgroundColor="rgba(0, 0, 0, 1)" />
        {/* <Select_type_take_photo_black type={type} takePhoto={takePhoto} choosePhoto={choosePhoto}
                    language={language} open_select_type={open_select_type}
                    set_open_select_type={set_open_select_type} set_select_type_take_photo={set_select_type_take_photo} /> */}
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

        {open_fill_info_cccd && (
          <Fill_info_cccd
            isConnected={isConnected}
            listDataCustomerSync={listDataCustomerSync}
            setListDataCustomerSync={setListDataCustomerSync}
            set_total_sim_sold_today={set_total_sim_sold_today}
            total_sim_sold_today={total_sim_sold_today}
            set_open_register_uninternet={set_open_register_uninternet}
            list_goicuoc={list_goicuoc}
            open_fill_info_cccd={open_fill_info_cccd}
            set_open_fill_info_cccd={set_open_fill_info_cccd}
            language={language}
            cccd_info_ss={cccd_info_ss}
            set_cccd_info_ss={set_cccd_info_ss}
            set_open_take_photo_cccd={set_open_take_photo_cccd}
            set_open_register={set_open_register}
            photo={photo}
            set_photo={set_photo}
            data_a_sim={data_a_sim}
            setListDataCustomerUnsync={setListDataCustomerUnsync}
            listDataCustomerUnsync={listDataCustomerUnsync}
            listDataCustomerTotal={listDataCustomerTotal}
            setListDataCustomerTotal={setListDataCustomerTotal}
            listPhoneSim={listPhoneSim}
            set_listPhoneSim={set_listPhoneSim}
            type_card={type_card}
          />
        )}
        {/* <Fill_info_cccd open_fill_info_cccd={open_fill_info_cccd} set_open_fill_info_cccd={set_open_fill_info_cccd}
                    language={language} cccd_info_ss={cccd_info_ss} set_cccd_info_ss={set_cccd_info_ss}
                /> */}
        <SafeAreaView style={{backgroundColor: 'white', height: '100%'}}>
          <View
            style={{
              borderBottomColor: '#6D7B8D',
              borderBottomWidth: 1,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              style={{width: '10%', marginLeft: 0}}
              onPress={() => set_open_take_photo_cccd(false)}>
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
                {json_language['Chụp ảnh CCCD/Passport'][language]}
              </Text>
            </View>
            <TouchableOpacity
              style={{width: '10%'}}
              onPress={() => {
                setTimeout(() => {
                  set_open_register(false);
                  set_open_register_uninternet(false);
                }, 0);

                set_open_take_photo_cccd(false);
              }}>
              <AntDesign name="close" size={22} color="red" />
            </TouchableOpacity>
          </View>
          <View style={styles.stepIndicatorContainer}>
            <StepIndicator
              customStyles={stepIndicatorStyles}
              stepCount={4}
              direction="horizontal"
              currentPosition={2}
              onPress={index => {
                if (index == 1) {
                  set_open_take_photo_cccd(false);
                } else if (index == 3 && photo.image && photo.image_back) {
                  // set_loading(true)
                  // setTimeout(() => {
                  set_loading(true);
                  setTimeout(() => {
                    set_loading(false);
                    set_open_fill_info_cccd(true);
                  }, 0);
                  //     set_loading(false)
                  // }, 1000);
                }
                // Xử lý logic khi nhấp vào từng bước
              }}
              // labels={dummyData.map((_, index) => '')}
            />
          </View>
          <ScrollView>
            <View style={{flexDirection: 'row', marginTop: 0}}>
              <View style={{marginLeft: 10}}>
                <Text
                  style={{
                    fontWeight: 500,
                    marginTop: 5,
                    borderRadius: 5,
                    padding: 10,
                    paddingTop: 0,
                    color: '#000000',
                    fontSize: 22,
                  }}>
                  {json_language['Chọn loại giấy tờ tùy thân'][language]}
                </Text>
              </View>
            </View>
            <View style={{marginLeft: 20}}>
              <Text>
                {json_language['Để hoàn tất đăng ký của bạn'][language]}
              </Text>
              <Text>
                {
                  json_language[
                    'Vui lòng tải lên bản sao giấy tờ tùy thân của bạn'
                  ][language]
                }
              </Text>
            </View>

            {/* <View style={{ marginLeft: 20, marginTop: 20 }}>
                            <Text style={{ color: 'black', fontSize: 16 }}>{json_language["Chọn loại giấy tờ tùy thân"][language]}</Text>
                        </View> */}
            <View
              style={{alignItems: 'center', marginTop: 10 + padding_screens}}>
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
                    width: '50%',
                    backgroundColor:
                      cccd_info_ss.type_card === 'IDCard'
                        ? '#6D7B8D'
                        : '#ffffff',
                    borderTopLeftRadius: 3,
                    borderBottomLeftRadius: 3,
                  }}
                  onPress={() =>
                    set_cccd_info_ss({...cccd_info_ss, type_card: 'IDCard'})
                  }>
                  <Text
                    style={{
                      color:
                        cccd_info_ss.type_card === 'IDCard' ? 'white' : 'black',
                      fontSize: 18,
                      padding: 5,
                      textAlign: 'center',
                    }}>
                    ID Card
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    width: '50%',
                    backgroundColor:
                      cccd_info_ss.type_card === 'Passport'
                        ? '#6D7B8D'
                        : '#ffffff',
                    borderTopRightRadius: 3,
                    borderBottomRightRadius: 3,
                  }}
                  onPress={() =>
                    set_cccd_info_ss({...cccd_info_ss, type_card: 'Passport'})
                  }>
                  <Text
                    style={{
                      color:
                        cccd_info_ss.type_card === 'Passport'
                          ? 'white'
                          : 'black',
                      fontSize: 18,
                      padding: 5,
                      textAlign: 'center',
                    }}>
                    Passport
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View
              style={{
                marginTop: 10 + padding_screens,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              {photo.image ? (
                <TouchableOpacity
                  style={{
                    width:
                      Dimensions.get('window').width > 480 &&
                      Dimensions.get('window').height > 480
                        ? '80%'
                        : '90%',
                    height:
                      Dimensions.get('window').width > 480 &&
                      Dimensions.get('window').height > 480
                        ? Dimensions.get('window').width * 0.42
                        : Dimensions.get('window').width * 0.51,
                    borderWidth: 1,
                    borderRadius: 10,
                    borderStyle: 'dashed',
                    flexDirection: 'row',
                  }}
                  onPress={async () => {
                    await set_open_select_type(true);
                    await set_type('front_cccd');
                  }}>
                  <Image
                    source={{uri: photo.image}}
                    style={{
                      width: '100%',
                      height:
                        Dimensions.get('window').width > 480 &&
                        Dimensions.get('window').height > 480
                          ? Dimensions.get('window').width * 0.415
                          : Dimensions.get('window').width * 0.505,
                      borderRadius: 10,
                      marginBottom: 20,
                    }}
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={{
                    width:
                      Dimensions.get('window').width > 480 &&
                      Dimensions.get('window').height > 480
                        ? '80%'
                        : '90%',
                    height:
                      Dimensions.get('window').width > 480 &&
                      Dimensions.get('window').height > 480
                        ? Dimensions.get('window').width * 0.42
                        : Dimensions.get('window').width * 0.51,
                    borderWidth: 1,
                    borderRadius: 10,
                    borderStyle: 'dashed',
                    flexDirection: 'row',
                  }}
                  onPress={async () => {
                    await set_open_select_type(true);
                    await set_type('front_cccd');
                  }}>
                  <View style={{width: '50%', justifyContent: 'center'}}>
                    <Text
                      style={{
                        fontWeight: 500,
                        paddingLeft: 20,
                        paddingBottom: 10,
                        color: '#000000',
                        fontSize: 22,
                      }}>
                      {json_language['Mặt trước'][language]}
                    </Text>
                    <Text
                      style={{
                        fontWeight: 400,
                        paddingLeft: 20,
                        color: '#000000',
                        fontSize: 20,
                      }}>
                      {json_language['Chúng tôi chỉ chấp nhận'][language]}
                    </Text>
                    <Text style={{paddingLeft: 20, paddingTop: 10}}>
                      ID card, Passport
                    </Text>
                  </View>
                  <View
                    style={{
                      width: '50%',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <AntDesign
                      name="idcard"
                      size={120}
                      style={{marginLeft: 0}}
                    />
                  </View>
                </TouchableOpacity>
              )}

              {photo.image_back ? (
                <TouchableOpacity
                  style={{
                    width:
                      Dimensions.get('window').width > 480 &&
                      Dimensions.get('window').height > 480
                        ? '80%'
                        : '90%',
                    height:
                      Dimensions.get('window').width > 480 &&
                      Dimensions.get('window').height > 480
                        ? Dimensions.get('window').width * 0.42
                        : Dimensions.get('window').width * 0.51,
                    borderWidth: 1,
                    borderRadius: 10,
                    borderStyle: 'dashed',
                    flexDirection: 'row',
                    marginTop: 10 + padding_screens,
                  }}
                  onPress={async () => {
                    await set_open_select_type(true);
                    await set_type('back_cccd');
                  }}>
                  <Image
                    source={{uri: photo.image_back}}
                    style={{
                      width: '100%',
                      height:
                        Dimensions.get('window').width > 480 &&
                        Dimensions.get('window').height > 480
                          ? Dimensions.get('window').width * 0.415
                          : Dimensions.get('window').width * 0.505,
                      borderRadius: 10,
                      marginBottom: 20,
                      borderRadius: 10,
                      marginBottom: 20,
                    }}
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={{
                    width:
                      Dimensions.get('window').width > 480 &&
                      Dimensions.get('window').height > 480
                        ? '80%'
                        : '90%',
                    height:
                      Dimensions.get('window').width > 480 &&
                      Dimensions.get('window').height > 480
                        ? Dimensions.get('window').width * 0.42
                        : Dimensions.get('window').width * 0.51,
                    borderWidth: 1,
                    borderRadius: 10,
                    borderStyle: 'dashed',
                    flexDirection: 'row',
                    marginTop: 20,
                  }}
                  onPress={async () => {
                    await set_open_select_type(true);
                    await set_type('back_cccd');
                  }}>
                  <View style={{width: '50%', justifyContent: 'center'}}>
                    <Text
                      style={{
                        fontWeight: 500,
                        paddingLeft: 20,
                        paddingBottom: 10,
                        color: '#000000',
                        fontSize: 22,
                      }}>
                      {json_language['Mặt sau'][language]}
                    </Text>
                    <Text
                      style={{
                        fontWeight: 400,
                        paddingLeft: 20,
                        color: '#000000',
                        fontSize: 20,
                      }}>
                      {json_language['Chúng tôi chỉ chấp nhận'][language]}
                    </Text>
                    <Text style={{paddingLeft: 20, paddingTop: 5}}>
                      ID card, Passport
                    </Text>
                  </View>
                  <View
                    style={{
                      width: '50%',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <AntDesign
                      name="creditcard"
                      size={120}
                      style={{marginLeft: 0}}
                    />
                  </View>
                </TouchableOpacity>
              )}
            </View>
            {photo.image && photo.image_back && (
              <TouchableOpacity
                style={{
                  marginTop: 10 + padding_screens + margin_and_ios,
                  marginBottom: 20,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: '#151B8D',
                  marginHorizontal: 10,
                  borderRadius: 5,
                }}
                onPress={() => {
                  // console.log(open_fill_info_cccd)
                  set_loading(true);
                  setTimeout(() => {
                    set_loading(false);
                    set_open_fill_info_cccd(true);
                  }, 0);
                }}>
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
          </ScrollView>

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
        </SafeAreaView>
      </Modal>
    </View>
  );
}
export default memo(TakePhotoCCCD);
