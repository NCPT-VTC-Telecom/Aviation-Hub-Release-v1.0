import React, {memo, useState} from 'react';
import {
  SafeAreaView,
  Button,
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
import Ionicons from 'react-native-vector-icons/Ionicons';
// Ionicons.loadFont();

const img = '../../img/';

function ViewInfo({
  show_view_info,
  set_show_view_info,
  json_language,
  language,
  cccd_info,
}) {
  const [image, setImage] = useState(cccd_info.uri_front_image);
  const [image_back, setImage_back] = useState(cccd_info.uri_back_image);
  const [selfies, set_selfies] = useState(cccd_info.uri_selfies_image);
  return (
    <View>
      <Modal
        animationType="slide-down"
        transparent={true}
        visible={show_view_info}
        onRequestClose={() => {
          set_show_view_info(false);
        }}>
        <StatusBar backgroundColor="rgba(0, 0, 0, 1)" />
        <SafeAreaView style={{backgroundColor: '#ffffff', width: '100%'}}>
          <View style={{height: '100%', marginHorizontal: 10}}>
            <ScrollView>
              <View style={{marginBottom: 20}}>
                <View style={{flexDirection: 'row', marginTop: 10}}>
                  <TouchableOpacity
                    style={{justifyContent: 'center', width: '10%'}}
                    onPress={() => set_show_view_info(false)}>
                    <Ionicons
                      name="arrow-back"
                      size={25}
                      style={{marginLeft: 0}}
                    />
                  </TouchableOpacity>
                  <View
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      width: '80%',
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        padding: 8,
                        color: 'black',
                        fontSize: 22,
                        textAlign: 'center',
                      }}>
                      {json_language['Thông tin cá nhân'][language]}
                    </Text>
                  </View>
                  {/* <TouchableOpacity style={{ justifyContent: 'center', width: "10%", alignItems: 'flex-end' }}
                                    >
                                        <AntDesign name="closecircle" size={20} color="#EE0000" />
                                    </TouchableOpacity> */}
                </View>
                {/* <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                                    <View style={{ width: 80, borderRadius: 80, backgroundColor: 'white', marginVertical: 30, }}>
                                        <Image source={require(img + 'icon/translate.png')} style={{ height: 80, width: 80, borderRadius: 50 }} />
                                    </View>
                                </View> */}
                <View style={{marginTop: 10}}>
                  <Text style={{paddingLeft: 10}}>
                    {json_language['Họ tên'][language]}
                  </Text>
                  <View style={[styles.Textinput2_row, {marginTop: 0}]}>
                    <Text style={[styles.text_lable, styles.text_color]}>
                      {cccd_info.fullname}
                    </Text>
                  </View>
                </View>
                <View style={{marginTop: 5}}>
                  <Text style={{paddingLeft: 10, color: 'black'}}>
                    {json_language['Số CCCD'][language]}
                  </Text>
                  <View style={[styles.Textinput2_row]}>
                    <Text style={[styles.text_lable, styles.text_color]}>
                      {cccd_info.cccd}
                    </Text>
                  </View>
                </View>
                <View style={{marginTop: 10}}>
                  <Text style={{paddingLeft: 10, color: 'black'}}>
                    {json_language['Ngày sinh'][language]}
                  </Text>
                  <View style={[styles.Textinput2_row, {marginTop: 0}]}>
                    <Text style={[styles.text_lable, styles.text_color]}>
                      {cccd_info.date_of_birth}
                    </Text>
                  </View>
                </View>
                <View style={{marginTop: 5}}>
                  <Text style={{paddingLeft: 10, color: 'black'}}>
                    {json_language['Giới tính'][language]}
                  </Text>
                  <View style={[styles.Textinput2_row]}>
                    <Text style={[styles.text_lable, styles.text_color]}>
                      {cccd_info.sex}
                    </Text>
                  </View>
                </View>
                <View style={{marginTop: 10}}>
                  <Text style={{paddingLeft: 10, color: 'black'}}>
                    {json_language['Quê quán'][language]}
                  </Text>
                  <View style={[styles.Textinput2_row, {marginTop: 0}]}>
                    <Text style={[styles.text_lable, styles.text_color]}>
                      {cccd_info.address_residence}
                    </Text>
                  </View>
                </View>
                <View style={{marginTop: 5}}>
                  <Text style={{paddingLeft: 10, color: 'black'}}>
                    {json_language['Quốc tịch'][language]}
                  </Text>
                  <View style={[styles.Textinput2_row]}>
                    <Text style={[styles.text_lable, styles.text_color]}>
                      {cccd_info.nationality}
                    </Text>
                  </View>
                </View>
                {/* <View style={{ marginTop: 10 }}>
                                    <Text style={{ paddingLeft: 10 }}>{json_language["Ngày hết hạn"][language]}</Text>
                                    <View style={[styles.Textinput2_row, { marginTop: 0 }]}>
                                        <Text style={[styles.text_lable, styles.text_color]}>{cccd_info.date_end}</Text>
                                    </View>

                                </View> */}
                <View style={{marginTop: 5}}>
                  <Text style={{paddingLeft: 10, color: 'black'}}>
                    {json_language['Ngày phát hành'][language]}
                  </Text>
                  <View style={[styles.Textinput2_row]}>
                    <Text style={[styles.text_lable, styles.text_color]}>
                      {cccd_info.date_create}
                    </Text>
                  </View>
                </View>
                <View style={{marginTop: 10}}>
                  <Text style={{paddingLeft: 10, color: 'black'}}>
                    {json_language['Nơi cấp'][language]}
                  </Text>
                  <View style={[styles.Textinput2_row, {marginTop: 0}]}>
                    <Text style={[styles.text_lable, styles.text_color]}>
                      {cccd_info.issued_by}
                    </Text>
                  </View>
                </View>
              </View>

              <View>
                <View>
                  <Text
                    style={{
                      fontSize: 16,
                      color: 'black',
                      padding: 8,
                      marginVertical: 5,
                    }}>
                    {json_language['CCCD mặt trước'][language]}
                  </Text>
                  <TouchableOpacity style={{borderRadius: 20}}>
                    {!cccd_info.uri_front_image ? (
                      <Image
                        source={require(img + 'icon/front_cccd.jpg')}
                        style={{width: '100%', height: 200, borderRadius: 20}}
                      />
                    ) : (
                      <Image
                        source={{uri: 'file://' + cccd_info.uri_front_image}}
                        style={{width: '100%', height: 200, borderRadius: 20}}
                      />
                    )}
                  </TouchableOpacity>
                </View>
                <View>
                  <Text
                    style={{
                      fontSize: 16,
                      color: 'black',
                      padding: 8,
                      marginVertical: 5,
                    }}>
                    {json_language['CCCD mặt sau'][language]}
                  </Text>
                  <TouchableOpacity style={{borderRadius: 20}}>
                    {!cccd_info.uri_back_image ? (
                      <Image
                        source={require(img + 'icon/back_cccd.jpg')}
                        style={{width: '100%', height: 200, borderRadius: 20}}
                      />
                    ) : (
                      <Image
                        source={{uri: cccd_info.uri_back_image}}
                        style={{width: '100%', height: 200, borderRadius: 20}}
                      />
                    )}
                  </TouchableOpacity>
                </View>
                <View>
                  <Text
                    style={{
                      fontSize: 16,
                      color: 'black',
                      padding: 8,
                      marginVertical: 5,
                    }}>
                    {json_language['Ảnh chân dung'][language]}
                  </Text>
                  <TouchableOpacity style={{borderRadius: 20}}>
                    {!cccd_info.uri_selfies_image ? (
                      <Image
                        source={require('../../img/icon/selfies.jpg')}
                        style={{width: '100%', height: 200, borderRadius: 20}}
                      />
                    ) : (
                      <Image
                        source={{uri: cccd_info.uri_selfies_image}}
                        style={{width: '100%', height: 200, borderRadius: 20}}
                      />
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </View>
        </SafeAreaView>
      </Modal>
    </View>
  );
}
export default memo(ViewInfo);
