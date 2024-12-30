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
import styles from '../../styles';
import HeaderGoBack from '../ShortComponent/HeaderGoBack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
// Ionicons.loadFont();
// Entypo.loadFont();
import {setDataLocal} from '../../menu_function';
const img = '../../img/';
function Language({
  open_select,
  set_open_select,
  set_language,
  json_language,
  language,
}) {
  return (
    <Modal
      // animationType="slide-left"
      transparent={true}
      visible={open_select}
      onRequestClose={() => {
        set_open_select(false);
      }}>
      <StatusBar backgroundColor="rgba(0, 0, 0, 1)" />
      <SafeAreaView style={{backgroundColor: 'white', minHeight: '100%'}}>
        <HeaderGoBack
          title={json_language['Ngôn ngữ'][language]}
          func={() => set_open_select(false)}
        />
        <View style={{marginTop: 10}}>
          <TouchableOpacity
            onPress={() => {
              set_language('Vietnamese');
              setDataLocal('Vietnamese', 'language');
              set_open_select(false);
              // set_open_select(false)
            }}
            style={{
              backgroundColor: language == 'Vietnamese' ? '#ACD9F5' : '#F5F5F5',
              marginHorizontal: 10,
              borderRadius: 15,
              marginBottom: 10,
              flexDirection: 'row',
              alignItems: 'center',
              padding: 10,
            }}>
            {language == 'Vietnamese' ? (
              <Entypo
                name="check"
                size={23}
                style={{marginLeft: 15, color: '#1E90FF'}}
              />
            ) : (
              <View />
            )}
            <Text
              style={[
                styles.text_setting_setitng_detail,
                language == 'Vietnamese'
                  ? {color: '#1E90FF', marginLeft: 10}
                  : {},
              ]}>
              Vietnamese
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              set_language('English');
              setDataLocal('English', 'language');
              set_open_select(false);
              // set_open_select(false)
            }}
            style={{
              backgroundColor: language == 'English' ? '#ACD9F5' : '#F5F5F5',
              marginHorizontal: 10,
              borderRadius: 15,
              marginBottom: 10,
              flexDirection: 'row',
              alignItems: 'center',
              padding: 10,
            }}>
            {language == 'English' ? (
              <Entypo
                name="check"
                size={23}
                style={{marginLeft: 15, color: '#1E90FF'}}
              />
            ) : (
              <View />
            )}
            <Text
              style={[
                styles.text_setting_setitng_detail,
                language == 'English' ? {color: '#1E90FF', marginLeft: 10} : {},
              ]}>
              English
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
}
export default memo(Language);
