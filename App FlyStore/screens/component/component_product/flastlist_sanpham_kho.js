import React, {memo} from 'react';
import {
  StatusBar,
  FlatList,
  Text,
  View,
  Image,
  TouchableOpacity,
  Alert,
  Modal,
  ScrollView,
  Dimensions,
} from 'react-native';
import styles from '../../styles';
const type_responsive =
  Dimensions.get('window').width > 480 && Dimensions.get('window').height > 480
    ? 'ipad'
    : 'smartphone';
const height = type_responsive == 'ipad' ? 27 : 24;
const font_size_normal = type_responsive == 'ipad' ? 17 : 15;
const font_size_normal_small = type_responsive == 'ipad' ? 14 : 14;
const padding = type_responsive == 'ipad' ? 12 : 8;
function Flastlist_sanpham_kho({vouchers, voucher_types, language}) {
  return (
    <View style={{}}>
      <FlatList
        data={voucher_types}
        scrollEnabled={false}
        keyExtractor={item => item.code}
        renderItem={({item}) => {
          const temp_item = vouchers.filter(d => {
            return d.status != 1 && d.code == item.code;
          });
          return (
            <TouchableOpacity
              style={[styles.Text2_row, {padding: 10, color: 'black'}]}>
              <Text
                style={{
                  width: type_responsive == 'ipad' ? '93%' : '90%',
                  paddingLeft: 10,
                  color: 'black',
                  fontSize: font_size_normal,
                }}>
                {item.name}
              </Text>
              <TouchableOpacity
                style={{
                  borderRadius: 50,
                  borderColor: '#E55451',
                  height: height,
                  width: height,
                  borderWidth: 1,
                  alignItems: 'center',
                  backgroundColor: temp_item.length == 0 ? 'red' : '#4EBDEC',
                  borderColor: temp_item.length == 0 ? '#DDDFE1' : '#DDDFE1',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    color: 'white',
                    fontSize: font_size_normal_small,
                    textAlign: 'center',
                    padding: 0,
                    fontWeight: 500,
                  }}>
                  {temp_item.length || 0}
                </Text>
              </TouchableOpacity>
            </TouchableOpacity>
          );
        }}
      />
      {(!vouchers || vouchers.length == 0) &&
      (!voucher_types || voucher_types.length == 0) ? (
        <TouchableOpacity
          style={[styles.Text2_row, {padding: 10, color: 'black'}]}>
          <Text
            style={{
              width: '90%',
              paddingLeft: 10,
              color: 'black',
              fontSize: font_size_normal,
            }}>
            {language == 'Vietnamese' ? 'Kho rỗng' : 'The store is empty'}
          </Text>
        </TouchableOpacity>
      ) : (
        <View />
      )}
    </View>
  );
}
export default memo(Flastlist_sanpham_kho);
