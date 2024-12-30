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
import Ionicons from 'react-native-vector-icons/Ionicons';
// AntDesign.loadFont();
const type_responsive =
  Dimensions.get('window').width > 600 && Dimensions.get('window').height > 600
    ? 'ipad'
    : 'smartphone';
const height = type_responsive == 'ipad' ? 60 : 50;
const font_size_h1 = type_responsive == 'ipad' ? 23 : 20;
const font_size_icon = type_responsive == 'ipad' ? 32 : 25;

export default function HeaderGoBack({title, func}) {
  return (
    <View>
      <TouchableOpacity onPress={func}>
        <View style={{height: 40, justifyContent: 'center'}}>
          <Ionicons
            name="arrow-back"
            size={font_size_icon}
            style={{marginLeft: 15, color: 'black'}}
          />
        </View>
      </TouchableOpacity>
      <Text
        style={{
          marginHorizontal: 10,
          fontWeight: 300,
          marginTop: 0,
          fontSize: 28,
          borderRadius: 5,
          padding: 10,
          color: '#000000',
        }}>
        {title}
      </Text>
    </View>
  );
}
