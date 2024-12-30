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
  StyleSheet,
} from 'react-native';
// import WebView from 'react-native-webview';
// AntDesign.loadFont();
const img = '../../img/';
const type_responsive =
  Dimensions.get('window').width > 480 && Dimensions.get('window').height > 480
    ? 'ipad'
    : 'smartphone';
const height = type_responsive == 'ipad' ? 60 : 50;
const font_size_h1 = type_responsive == 'ipad' ? 23 : 20;
const font_size_icon = type_responsive == 'ipad' ? 32 : 23;
export default function ButtonMenu({title, linkImage, func, sizeImage}) {
  return (
    <View style={styles.button_menu}>
      <TouchableOpacity
        style={[styles.button_menu_tou, styles.shadow]}
        onPress={func}>
        <Image
          source={linkImage}
          style={[
            styles.img_in_tou_menu,
            {height: sizeImage || '60%', width: sizeImage || '60%'},
          ]}
        />
      </TouchableOpacity>
      <Text style={styles.button_menu_text}>{title}</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  button_menu: {
    marginTop: 13,
    marginLeft: 20,
    width:
      (Dimensions.get('window').width - 80) / 3 >= 150
        ? (Dimensions.get('window').width - 140) / 6
        : (Dimensions.get('window').width - 80) / 3,
    height:
      ((Dimensions.get('window').width - 80) / 3 >= 150
        ? (Dimensions.get('window').width - 140) / 6
        : (Dimensions.get('window').width - 80) / 3) * 1.2,
    // backgroundColor: '#ffffff',
    marginBottom: 5,
  },
  button_menu_text: {
    fontSize: type_responsive == 'ipad' ? 16 : 13.5,
    color: '#011638',
    marginTop: 4,
    textAlign: 'center',
    fontWeight: 400,
  },
  button_menu_tou: {
    justifyContent: 'center',
    textAlign: 'center',
    alignItems: 'center',
    height:
      (Dimensions.get('window').width - 80) / 3 >= 150
        ? (Dimensions.get('window').width - 140) / 6
        : (Dimensions.get('window').width - 80) / 3,
    backgroundColor: '#00558F',
    width:
      (Dimensions.get('window').width - 80) / 3 >= 150
        ? (Dimensions.get('window').width - 140) / 6
        : (Dimensions.get('window').width - 80) / 3,
    borderRadius: 20,
  },
});
