import React, {memo, useState, useCallback} from 'react';
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
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
// AntDesign.loadFont();
// Ionicons.loadFont();
import Loading_animation from '../component_modal/Loading_animation';
import json_language from '../../json/language.json';
import {handleInputNumber} from '../../menu_function';
import Flatlist_list_sim from './Flatlist_list_sim';
import Fill_info_cccd from './fill_info_cccd';
const img = '../../img/';
const step = 0;
import StepIndicator from 'react-native-step-indicator';

import {stepIndicatorStyles} from '../common';

function register_uninternet({
  text,
  setText,
  open_fill_info_cccd,
  set_open_fill_info_cccd,
  screenHeight,
  screenWidth,
  set_open_register,
  data_a_sim,
  set_data_a_sim,
  language,
  open_register_uninternet,
  set_open_register_uninternet,
  set_uninternet_allow_register,
  isConnected,
  listDataCustomerSync,
  setListDataCustomerSync,
  listDataCustomerUnsync,
  setListDataCustomerUnsync,
  listDataCustomerTotal,
  setListDataCustomerTotal,
  set_total_esim_sold_today,
  total_esim_sold_today,
  list_goicuoc,
  cccd_info_ss,
  set_cccd_info_ss,
  photo,
  set_photo,
  listPhoneSim,
  set_listPhoneSim,
  listEsim,
  setListEsim,
  setListCusBoughtEsim,
  listCusBoughtEsim,
}) {
  const [loading, set_loading] = useState(false);
  const [type, set_type] = useState();
  const [openShowDataPackage, setOpenShowDataPackage] = useState(false);
  const [listPhoneSim_filter, set_listPhoneSim_filter] = useState(
    listEsim
      ? listEsim.filter(d => {
          return !d.status || d.status == 0;
        })
      : [],
  );
  // const [detail_customer, set_detail_customer] = useState(false)
  const SearchNamePhone = useCallback(async newtext => {
    // await handleInputNumber(newtext, setText)
    // console.log(listPhoneSim)
    // console.log(listPhoneSim.length)
    const regex = /^[0-9]*$/;
    if (regex.test(newtext)) {
      setText(newtext);
    } else {
      set_listPhoneSim_filter(listEsim);
      return;
    }
    setText(newtext);
    if (newtext && listEsim) {
      set_listPhoneSim_filter(
        listEsim.filter(d => {
          return (
            (!d.status || d.status == 0) &&
            (d.phone.includes(newtext.toUpperCase()) ||
              d.imei.toUpperCase().includes(newtext.toUpperCase()) ||
              d.packet.name.toUpperCase().includes(newtext.toUpperCase()))
          );
        }),
      );
    } else set_listPhoneSim_filter(listEsim);
  });
  const [sold, set_sold] = useState(false);

  return (
    <View>
      <Modal
        animationType="slide-down"
        transparent={true}
        visible={open_register_uninternet}
        onRequestClose={() => {
          set_open_register_uninternet(false);
        }}>
        <Loading_animation onLoading={loading} />
        <StatusBar backgroundColor="rgba(0, 0, 0, 1)" />
        <Fill_info_cccd
          isConnected={isConnected}
          listDataCustomerSync={listDataCustomerSync}
          setListDataCustomerSync={setListDataCustomerSync}
          set_total_esim_sold_today={set_total_esim_sold_today}
          total_esim_sold_today={total_esim_sold_today}
          set_open_register_uninternet={set_open_register_uninternet}
          list_goicuoc={list_goicuoc}
          open_fill_info_cccd={open_fill_info_cccd}
          set_open_fill_info_cccd={set_open_fill_info_cccd}
          language={language}
          cccd_info_ss={cccd_info_ss}
          set_cccd_info_ss={set_cccd_info_ss}
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
          setListEsim={setListEsim}
          listEsim={listEsim}
          listCusBoughtEsim={listCusBoughtEsim}
          setListCusBoughtEsim={setListCusBoughtEsim}
          sold={sold}
          set_sold={set_sold}
          set_listPhoneSim_filter={set_listPhoneSim_filter}
          openShowDataPackage={openShowDataPackage}
          setOpenShowDataPackage={setOpenShowDataPackage}
        />
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
              style={{width: '10%', marginLeft: 10, alignItems: 'center'}}
              onPress={() => set_open_register_uninternet(false)}>
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
                {json_language['Chọn số thuê bao'][language]}
              </Text>
            </View>
          </View>
          <View style={styles.stepIndicatorContainer}>
            <StepIndicator
              customStyles={stepIndicatorStyles}
              stepCount={3}
              direction="horizontal"
              currentPosition={0}
              // labels={dummyData.map((_, index) => '')}
              onPress={index => {
                if (index == 1 && data_a_sim && data_a_sim.snCode) {
                  setOpenShowDataPackage(false);
                  setTimeout(() => {
                    set_open_fill_info_cccd(true);
                  }, 0);
                }
                // Xử lý logic khi nhấp vào từng bước
              }}
            />
          </View>
          <View style={{marginTop: 0}}>
            <Text
              style={{
                fontSize: 18,
                color: '#151B8D',
                padding: 10,
                paddingLeft: 20,
                fontWeight: 500,
                paddingTop: 0,
              }}>
              {json_language['Nhập thông tin tìm kiếm'][language]}
            </Text>
            <View style={{width: '100%', alignItems: 'center', marginTop: 10}}>
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
                    {marginTop: 0, width: '100%', heightL: '100%'},
                  ]}>
                  <View
                    style={[
                      styles.search_container,
                      {width: Dimensions.get('window').width - 30},
                    ]}>
                    <View
                      style={{
                        width: '10%',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <AntDesign
                        name="search1"
                        size={23}
                        color="#000000"
                        style={{marginLeft: 10}}
                      />
                    </View>
                    <TextInput
                      style={[
                        {
                          width: text ? '75%' : '85%',
                          padding: 10,
                          paddingLeft: 15,
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
                        json_language['Tìm kiếm theo số điện thoại, số serial'][
                          language
                        ]
                      }
                      placeholderTextColor="#cfcfcb"
                    />
                    {text && (
                      <TouchableOpacity
                        style={{width: '10%'}}
                        onPress={() => {
                          setText('');
                          set_listPhoneSim_filter(listEsim);
                        }}>
                        <AntDesign
                          name="closecircle"
                          size={22}
                          color="red"
                          style={{marginLeft: 0}}
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </View>
            </View>
            <View
              style={{
                width: Dimensions.get('window').width,
                height: data_a_sim && data_a_sim.snCode ? '50%' : '67%',
              }}>
              <Flatlist_list_sim
                listPhoneSim={listPhoneSim_filter}
                language={language}
                data_a_sim={data_a_sim}
                set_data_a_sim={set_data_a_sim}
              />
            </View>
          </View>
          {data_a_sim.snCode && (
            <View
              style={{
                flex: 1,
                justifyContent: 'flex-end',
                height: '100%',
                marginBottom: 10,
                marginHorizontal: 10,
              }}>
              <TouchableOpacity
                onPress={() => {
                  set_open_fill_info_cccd(true);
                }}
                style={{
                  height: 40,
                  backgroundColor: '#153E7E',
                  borderRadius: 5,
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    padding: 5,
                    textAlign: 'center',
                    color: 'white',
                    fontSize: 18,
                    fontWeight: 400,
                  }}>
                  {json_language['Tiếp tục'][language]}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </SafeAreaView>
      </Modal>
    </View>
  );
}
export default memo(register_uninternet);
