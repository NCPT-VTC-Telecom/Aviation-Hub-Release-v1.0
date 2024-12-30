import React, {memo, useState, useEffect} from 'react';
import {
  SafeAreaView,
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
  TouchableWithoutFeedback,
} from 'react-native';
import styles from '../../styles';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Clipboard from '@react-native-clipboard/clipboard';
import json_language from '../../json/language.json';
import StepIndicator from 'react-native-step-indicator';
// AntDesign.loadFont();
import {setDataLocal, show_message} from '../../menu_function';
const img = '../../img/';
function modalDaBan({
  screenHeight,
  screenWidth,
  set_listCusBoughtEsim,
  language,
  formFlightorder,
  setFormFlightorder,
  setOpenDetailStore,
  listCusBoughtEsim,
  openDetailStore,
  onViTriOpenDetail,
  onSetViTriOpenDetail,
}) {
  // console.log('daban')
  function DeleteFirstItem() {
    const temp = listCusBoughtEsim;
    temp.splice(0, 1);
    setDataLocal(temp, 'listCusBoughtEsim');
    set_listCusBoughtEsim(temp);
    setFormFlightorder(false);
    setFormFlightorder(true);
  }
  const [showNotification, setShowNotification] = useState(false);
  const handleCopy = t => {
    // console.log(t)
    Clipboard.setString(t);
    setShowNotification(true);

    setTimeout(() => {
      setShowNotification(false);
    }, 1000);
  };
  useEffect(() => {}, [listCusBoughtEsim]);
  function show_message_ok_cancel(status, message) {
    Alert.alert(status, message, [
      {
        text: 'Cancel',
        //onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: () => DeleteFirstItem(),
      },
    ]);
  }
  return (
    <Modal
      // animationType="fade"
      transparent={false}
      visible={formFlightorder}
      onRequestClose={() => {
        setFormFlightorder(false);
      }}>
      <StatusBar backgroundColor="rgba(0, 0, 0, 1)" />
      <SafeAreaView
        style={{
          flex: 1,
          height: screenHeight,
          justifyContent: 'center',
          backgroundColor: 'white',
        }}>
        <ScrollView>
          <View
            style={{
              fontSize: 14,
              backgroundColor: '#ffffff',
              minHeight: screenHeight,
            }}>
            {showNotification && (
              <View
                style={{
                  position: 'absolute',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: screenHeight,
                  width: screenWidth,
                }}>
                <View style={{}}>
                  <Text
                    style={{
                      color: 'white',
                      padding: 15,
                      backgroundColor: 'rgba(0,0,0,0.8)',
                      borderRadius: 10,
                      fontWeight: 400,
                    }}>
                    Đã sao chép
                  </Text>
                </View>
              </View>
            )}
            <View
              style={{
                height: 50,
                backgroundColor: '#00558F',
                flexDirection: 'row',
              }}>
              <View
                style={{
                  justifyContent: 'center',
                  paddingLeft: 10,
                  width: '91%',
                }}>
                <Text style={{color: 'white', fontSize: 20, fontWeight: 500}}>
                  {json_language['Esim bán trong chuyến bay'][language]}{' '}
                </Text>
              </View>
              <TouchableOpacity
                style={{justifyContent: 'center', alignItems: 'center'}}
                onPress={
                  !openDetailStore
                    ? () => setFormFlightorder(false)
                    : () => {
                        setFormFlightorder(false);
                        setOpenDetailStore(false);
                      }
                }>
                <AntDesign name="closecircle" size={23} color="#EE0000" />
              </TouchableOpacity>
            </View>

            {listCusBoughtEsim ? (
              <View>
                {!openDetailStore ? (
                  <View>
                    <FlatList
                      inverted
                      data={listCusBoughtEsim}
                      scrollEnabled={false}
                      renderItem={({item, index}) => {
                        return (
                          <View key={index}>
                            <TouchableOpacity
                              style={[styles.Text2_row, {padding: 10}]}
                              onPress={() => {
                                onSetViTriOpenDetail(index);
                                setOpenDetailStore(true);
                              }}>
                              <Text
                                style={{
                                  width: '88%',
                                  paddingLeft: 10,
                                  color: 'black',
                                }}>
                                {listCusBoughtEsim.length - index}.{' '}
                                {item.username} - {item.snCode}{' '}
                              </Text>
                              <TouchableOpacity
                                style={{
                                  borderRadius: 50,
                                  borderColor: '#00558F',
                                  height: 20,
                                  width: 20,
                                  borderWidth: 0.5,
                                  textAlign: 'center',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  backgroundColor:
                                    item.loaiSanPham == 'maban'
                                      ? 'red'
                                      : '#38ACEC',
                                }}>
                                <Text style={{color: 'white', fontSize: 12}}>
                                  1
                                </Text>
                              </TouchableOpacity>
                            </TouchableOpacity>
                          </View>
                        );
                      }}
                    />
                    {!listCusBoughtEsim || listCusBoughtEsim.length == 0 ? (
                      <TouchableOpacity
                        style={[styles.Text2_row, {padding: 10}]}>
                        <Text
                          style={{
                            width: '100%',
                            paddingLeft: 10,
                            color: 'black',
                            fontSize: 16,
                          }}>
                          {language == 'Vietnamese'
                            ? 'Đơn hàng rỗng'
                            : 'Empty order'}
                        </Text>
                      </TouchableOpacity>
                    ) : (
                      <View />
                    )}
                  </View>
                ) : (
                  <View>
                    <TouchableOpacity
                      style={[
                        styles.Text2_row,
                        {padding: 8, backgroundColor: '#DDDFE1'},
                      ]}
                      onPress={() => setOpenDetailStore(false)}>
                      <Ionicons
                        name="chevron-back-outline"
                        size={22}
                        color="#000000"
                      />
                      <Text
                        style={{
                          width: '80%',
                          paddingLeft: 10,
                          fontWeight: 500,
                          color: 'black',
                        }}>
                        {
                          json_language['Link truy cập QR code cho khách hàng'][
                            language
                          ]
                        }
                      </Text>
                    </TouchableOpacity>
                    <View style={{paddingLeft: 10}}>
                      <View
                        style={[
                          styles.Text2_row,
                          {
                            padding: 8,
                            color: 'black',
                            paddingBottom: 10,
                            paddingTop: 10,
                            paddingLeft: 0,
                            flexDirection: 'row',
                          },
                        ]}>
                        <TouchableOpacity
                          onPress={() =>
                            handleCopy(
                              listCusBoughtEsim[onViTriOpenDetail].snCode,
                            )
                          }>
                          <Text style={{color: 'blue', flexWrap: 'wrap'}}>
                            {listCusBoughtEsim[onViTriOpenDetail].dataPackages}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                )}
              </View>
            ) : (
              <View />
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}
export default memo(modalDaBan);
