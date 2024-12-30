import React, {memo, useState, useEffect} from 'react';
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
  Animated,
} from 'react-native';
import styles from '../../styles';
import Entypo from 'react-native-vector-icons/Entypo';
import json_language from '../../json/language.json';
function Flatlist_list_sim({
  listPhoneSim,
  language,
  data_a_sim,
  set_data_a_sim,
}) {
  const size =
    Dimensions.get('window').width > 480 &&
    Dimensions.get('window').height > 480
      ? 20
      : 17;
  return (
    <View
      style={[
        {
          width: '100%',
          height: '100%',
          width: Dimensions.get('window').width,
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 5,
        },
        Dimensions.get('window').width > 480 &&
        Dimensions.get('window').height > 480
          ? {alignItems: 'flex-start', paddingLeft: 100}
          : {},
      ]}>
      <FlatList
        keyboardShouldPersistTaps="handled"
        scrollEnabled={true}
        contentContainerStyle={{
          alignSelf: 'flex-start',
        }}
        // numColumns={3}
        horizontal={false}
        data={listPhoneSim}
        keyExtractor={item => item.phone}
        renderItem={({item, index}) => {
          return (
            <TouchableOpacity
              onPress={() => {
                set_data_a_sim(item);
              }}
              style={{
                marginLeft: 0,
                marginTop: 0,
                marginBottom: 10,
                flexDirection: 'row',
              }}>
              <View style={styles.borderBottomDDDFE1}>
                {/* <Text style={{ paddingLeft: 5, color: "#000000", fontSize: 16 }}>{json_language["Số điện thoại"][language]}: </Text> */}
                <Text
                  style={{
                    padding: 10,
                    color:
                      data_a_sim &&
                      data_a_sim.phone &&
                      data_a_sim.phone == item.phone
                        ? 'green'
                        : '#000000',
                    fontSize: size,
                    paddingRight: 0,
                  }}>
                  [{item.phone}] -{' '}
                </Text>
              </View>
              <View style={styles.borderBottomDDDFE1}>
                {/* <Text style={{ paddingLeft: 5, color: "#000000", fontSize: 16 }}>{json_language["Mã serial sim"][language]}: </Text> */}
                <Text
                  style={{
                    padding: 10,
                    color:
                      data_a_sim &&
                      data_a_sim.phone &&
                      data_a_sim.phone == item.phone
                        ? 'green'
                        : '#000000',
                    fontSize: size,
                    paddingLeft: 0,
                    paddingRight: 0,
                  }}>
                  {item.imei} -{' '}
                </Text>
              </View>
              <View style={[styles.borderBottomDDDFE1]}>
                {/* <Text style={{ paddingLeft: 5, color: "#000000", fontSize: 16 }}>{json_language["Tên gói cước"][language]}: </Text> */}
                <Text
                  style={{
                    padding: 10,
                    color:
                      data_a_sim &&
                      data_a_sim.phone &&
                      data_a_sim.phone == item.phone
                        ? 'green'
                        : '#000000',
                    fontSize: size,
                    paddingLeft: 0,
                  }}>
                  {item.packet ? item.packet.name : ''}
                </Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

export default memo(Flatlist_list_sim);
