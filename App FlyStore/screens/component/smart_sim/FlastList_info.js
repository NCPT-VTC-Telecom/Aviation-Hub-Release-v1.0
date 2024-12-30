import React, {memo, useState} from 'react';
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

function FlastList_info({
  type_card,
  listDataCustomerTotal,
  data_ListSoldSimInfo,
  set_type,
  set_open_detail_info_customer,
  set_detail_customer,
}) {
  return (
    <FlatList
      data={data_ListSoldSimInfo}
      scrollEnabled={true}
      horizontal={false}
      initialNumToRender={10}
      maxToRenderPerBatch={10}
      renderItem={({item, index}) => {
        console.log(item.pathFilePortrait);
        return (
          <View
            key={index}
            style={{
              flexDirection: 'row',
              borderBottomWidth: 1,
              borderColor: '#DDDFE1',
            }}>
            <TouchableOpacity
              style={[
                styles.Text2_row,
                {
                  padding: 10,
                  color: 'black',
                  width: '100%',
                  borderBottomWidth: 0,
                },
              ]}
              onPress={() => {
                set_type(item.address);
                set_open_detail_info_customer(true);
                // const temp = list_goicuoc.find((d) => {
                //     return d.code === item.packOfData
                // })
                // item.text = temp.text
                set_detail_customer(item);
              }}>
              <View>
                {item.pathFilePortrait != '' ? (
                  <Image
                    source={{uri: item.pathFilePortrait}}
                    style={{
                      width: 45,
                      height: 45,
                      borderRadius: 50,
                      marginRight: 20,
                    }}
                  />
                ) : (
                  <Image
                    source={require('../../assets/images/avatar.jpg')}
                    style={{
                      width: 45,
                      height: 45,
                      borderRadius: 50,
                      marginRight: 20,
                    }}
                  />
                )}
              </View>
              <View style={{flexDirection: 'column'}}>
                <Text
                  style={{
                    width: '100%',
                    paddingLeft: 0,
                    color: 'black',
                    fontSize: 18,
                  }}>
                  {item.fullName}
                </Text>
                <Text
                  style={{
                    width: '100%',
                    paddingLeft: 0,
                    fontSize: 16,
                    color: 'black',
                  }}>
                  {item.phoneRegister}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        );
      }}
    />
  );
}
export default memo(FlastList_info);
