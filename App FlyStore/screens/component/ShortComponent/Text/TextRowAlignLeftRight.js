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
const type_responsive =
  Dimensions.get('window').width > 600 && Dimensions.get('window').height > 600
    ? 'ipad'
    : 'smartphone';
const font_size_normal = type_responsive == 'ipad' ? 19 : 17;
export default function TextRowAlignLeftRight({text1, text2, size, size2}) {
  return (
    <View
      style={[
        styles.Text2_row,
        {
          padding: 8,
          color: 'black',
          paddingBottom: 10,
          paddingTop: 10,
          paddingLeft: 10,
          flexDirection: 'row',
          flexWrap: 'wrap',
        },
      ]}>
      <Text
        style={{
          paddingLeft: 5,
          color: 'black',
          flexWrap: 'wrap',
          marginRight: 5,
          width: size ? size : '35%',
        }}>
        {text1}
      </Text>
      <View style={{width: size2 ? size2 : '60%'}}>
        <Text
          style={{
            color: 'blue',
            flexWrap: 'wrap',
            paddingLeft: 5,
            fontSize: 16,
            textAlign: 'right',
          }}>
          {text2}
        </Text>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  Text2_row: {
    flexDirection: 'row',
    padding: 10,
    fontSize: 14,
    fontWeight: '350',
    borderColor: '#DDDFE1',
    borderBottomWidth: 1,
    alignItems: 'center',
    color: '#000000',
  },
});
