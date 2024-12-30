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
import AntDesign from 'react-native-vector-icons/AntDesign';
// AntDesign.loadFont();
const type_responsive =
  Dimensions.get('window').width > 600 && Dimensions.get('window').height > 600
    ? 'ipad'
    : 'smartphone';
const height = type_responsive == 'ipad' ? 60 : 50;
const font_size_normal = type_responsive == 'ipad' ? 17 : 15;
const padding = type_responsive == 'ipad' ? 10 : 8;

export default function ButtonSelectTypeMoney({func, item, onTienTe}) {
  return (
    <TouchableOpacity
      style={[
        styles.button_tiente,
        onTienTe == item.currency
          ? {backgroundColor: '#AAD69F', borderWidth: 1, borderColor: '#005320'}
          : {backgroundColor: 'white'},
      ]}
      onPress={func}>
      <Text
        style={{
          textTransform: 'uppercase',
          color: 'black',
          textAlign: 'center',
          fontSize: font_size_normal,
        }}>
        {item.currency}
      </Text>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  button_tiente: {
    backgroundColor: 'white',
    borderRadius: 5,
    padding: padding,
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
    marginRight: 10,
    marginBottom: 10,
  },
});
