import React, {memo, useState} from 'react';
import {
  Alert,
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
// import WebView from 'react-native-webview';
import AntDesign from 'react-native-vector-icons/AntDesign';
// AntDesign.loadFont();
const type_responsive =
  Dimensions.get('window').width > 600 && Dimensions.get('window').height > 600
    ? 'ipad'
    : 'smartphone';
const height = type_responsive == 'ipad' ? 60 : 50;
const font_size_h1 = type_responsive == 'ipad' ? 23 : 20;
const font_size_icon = type_responsive == 'ipad' ? 32 : 23;

export default function HeaderClose({title, func}) {
  return (
    <View
      style={{
        height: height,
        backgroundColor: '#00558F',
        flexDirection: 'row',
      }}>
      <View style={{justifyContent: 'center', paddingLeft: 10, width: '91%'}}>
        <Text style={{color: 'white', fontSize: font_size_h1, fontWeight: 500}}>
          {title}
        </Text>
      </View>
      <TouchableOpacity onPress={func} style={{justifyContent: 'center'}}>
        <AntDesign name="closecircle" size={font_size_icon} color="#EE0000" />
      </TouchableOpacity>
    </View>
  );
}
