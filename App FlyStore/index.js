/**
 * @format
 */

import {
  AppRegistry,
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import React, {useState, useRef, useEffect} from 'react';
import {Linking} from 'react-native';
import {name as appName} from './app.json';
import ind from './screens/index';

const OpenLinkButton = () => {
  const handleOpenLink = () => {
    const url = 'https://www.youtube.com/watch?v=hj02zM4dtpY'; // Đặt liên kết của trang web bạn muốn mở ở đây
    Linking.openURL(url);
  };

  return (
    <View>
      <TouchableOpacity style={{marginTop: 100}} onPress={handleOpenLink}>
        {/* Hiển thị nút hoặc phần tử có thể nhấp */}
        <Text style={{color: 'black'}}>Touch</Text>
      </TouchableOpacity>
    </View>
  );
};
AppRegistry.registerComponent(appName, () => ind);
