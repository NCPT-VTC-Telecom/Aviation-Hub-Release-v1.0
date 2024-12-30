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
export default function TextLableRow({text1, text2}) {
  return (
    <View style={styles.viewRow}>
      <Text style={[styles.text_model, styles.text_color]}>{text1}: </Text>
      <Text style={[styles.text_model1, styles.text_color]}>{text2}</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  viewRow: {
    flexDirection: 'row',
    width: '93%',
    borderColor: '#DDDFE1',
    borderWidth: 1,
    marginTop: 10,
    backgroundColor: '#ffffff',
    flexWrap: 'wrap',
  },
  text_model: {
    padding: 14,
    fontSize: font_size_normal,
    borderRadius: 5,
    flexWrap: 'wrap',
  },
  text_model1: {
    padding: 14,
    fontSize: font_size_normal,
    borderRadius: 5,
    paddingLeft: 0,
    fontWeight: 400,
  },
  text_color: {
    color: 'black',
  },
});
