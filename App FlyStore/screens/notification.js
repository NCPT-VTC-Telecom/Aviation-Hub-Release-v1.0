import React, {useState, Component, useEffect, useContext} from 'react';
import {
  Text,
  StatusBar,
  View,
  TextInput,
  Button,
  Image,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  Platform,
} from 'react-native';
import styles from './styles';
import {MyContext} from './index';
import json_language from './json/language.json';
const img = './img/';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Notification = ({navigation, route}) => {
  const {language, set_language} = useContext(MyContext);
  const madonhang = 'NTT23729';
  const nameuser = 'Nguyễn Văn A';
  list = [];
  for (let i = 0; i < 0; i++) {
    list.push({
      madonhang: madonhang,
      nameuser: nameuser,
    });
  }
  return (
    <SafeAreaView>
      {/* <StatusBar
                translucent={false}
                backgroundColor="rgba(0, 0, 0, 1)"
            /> */}
      {Platform.OS !== 'ios' && (
        <View
          style={{
            height: StatusBar.currentHeight,
            width: '100%',
            backgroundColor: 'black',
          }}
        />
      )}
      <View style={{fontSize: 14, marginTop: 0}}>
        <View
          style={{
            height: 50,
            backgroundColor: '#00558F',
            flexDirection: 'row',
          }}>
          <TouchableOpacity
            style={{width: '25%', justifyContent: 'center'}}
            onPress={() => navigation.navigate('Home')}>
            <Ionicons
              name="chevron-back-sharp"
              size={25}
              style={{marginLeft: 15, color: 'white'}}
            />
          </TouchableOpacity>
          <View style={{justifyContent: 'center', width: '50%'}}>
            <Text
              style={{
                color: 'white',
                fontSize: 20,
                fontWeight: 500,
                textAlign: 'center',
              }}>
              {json_language['Thông báo'][language]}{' '}
            </Text>
          </View>
        </View>
        <Text
          style={{
            color: 'black',
            textAlign: 'center',
            fontSize: 16,
            padding: 10,
          }}>
          {language == 'English' ? 'No notification.' : 'Không có thông báo.'}
        </Text>
        <View>
          <FlatList
            data={list}
            scrollEnabled={false}
            renderItem={({item, index}) => {
              return (
                <TouchableOpacity
                  style={[
                    styles.Text2_row,
                    {padding: 10, color: 'black', marginLeft: 10},
                  ]}>
                  <Text style={{width: '85%', paddingLeft: 10, color: 'black'}}>
                    {item.madonhang} - {item.nameuser}
                  </Text>
                  <TouchableOpacity
                    style={{
                      borderRadius: 50,
                      borderColor: '#E55451',
                      height: 18,
                      width: 20,
                      borderWidth: 0.5,
                      textAlign: 'center',
                      alignItems: 'center',
                      backgroundColor: 'red',
                    }}>
                    <Text style={{color: 'white', fontSize: 12}}>1</Text>
                  </TouchableOpacity>
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};
export default Notification;
