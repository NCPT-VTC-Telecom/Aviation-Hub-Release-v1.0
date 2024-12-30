import React, {memo} from 'react';
import {
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
import ButtonSelectTypeMoney from '../ShortComponent/ButtonSelectTypeMoney';
function FlatList_tienTe({
  onVoucherPrice,
  onTenSP,
  onTienTe,
  onSetTienTe,
  onSet_prices_sp,
}) {
  const number_columns = parseInt((0.6 * Dimensions.get('window').width) / 56);
  return (
    <FlatList
      keyboardShouldPersistTaps="handled"
      scrollEnabled={true}
      contentContainerStyle={{
        alignSelf: 'flex-start',
      }}
      horizontal={true}
      keyExtractor={item => item.currency}
      // showsVerticalScrollIndicator={false}
      // showsHorizontalScrollIndicator={false}
      // horizontal={true}
      data={onVoucherPrice
        .filter(d => d.code == onTenSP)
        .sort((a, b) => {
          if (a.price > b.price) {
            return -1;
          }
          if (a.price < b.price) {
            return 1;
          }
          return 0;
        })}
      renderItem={({item, index}) => {
        // console.log((onVoucherPrice
        //     .filter((d) => d.code == onTenSP)).sort((a, b) => a.price > b.price))
        return (
          <View key={index} style={{height: '100%'}}>
            <ButtonSelectTypeMoney
              onTienTe={onTienTe}
              item={item}
              func={() => {
                onTienTe != item.currency ? onSet_prices_sp(item.price) : {};
                onSetTienTe(item.currency);
              }}
            />
          </View>
        );
      }}
    />
  );
}
export default memo(FlatList_tienTe);
