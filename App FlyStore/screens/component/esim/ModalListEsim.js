import React, {memo, useState} from 'react';
import {
  StatusBar,
  Text,
  View,
  Image,
  TouchableOpacity,
  Modal,
  Pressable,
  ScrollView,
  Dimensions,
  FlatList,
  TextInput,
} from 'react-native';
import styles from '../../styles';
import AntDesign from 'react-native-vector-icons/AntDesign';
import json_language from '../../json/language.json';
const img = '../../img/';
function ModalListEsim({
  language,
  open_find_employee,
  set_open_find_employee,
  employees,
  openNangHang,
  setSanPham,
  sanPham,
  setTenSanPham,
  tenSanPham,
}) {
  const [renderedItems, setRenderedItems] = useState(20);
  const [text, set_text] = useState('');
  function touchMNV_Hoten(item) {
    setTenSanPham(item.name);
    setSanPham(item.code);
    openNangHang(item.code);
    set_open_find_employee(false);
  }
  const renderListItem = ({item, index}) => {
    return (
      <View
        key={index}
        style={[
          {width: '100%', flexDirection: 'row', justifyContent: 'center'},
        ]}>
        <TouchableOpacity
          style={[{width: '95%', padding: 8}]}
          onPress={() => touchMNV_Hoten(item)}>
          {item.code == sanPham ? (
            <View style={{flexDirection: 'row'}}>
              <Text style={{marginLeft: 20, color: '#64AF53', fontSize: 15}}>
                [{item.name}]
              </Text>
              <AntDesign
                name="check"
                size={20}
                color="#005320"
                style={{marginLeft: 30}}
              />
            </View>
          ) : (
            <Text style={{marginLeft: 20, color: '#000000', fontSize: 15}}>
              [{item.name}]
            </Text>
          )}
        </TouchableOpacity>
      </View>
    );
  };
  const handleEndReached = () => {
    setRenderedItems(renderedItems + 30);
  };
  const [data, set_data] = useState(employees || []);
  function SearchMNV(newtext) {
    set_text(newtext);
    if (newtext && employees) {
      set_data(
        employees.filter(d => {
          return (
            d.code.includes(newtext.toUpperCase()) ||
            d.name.toUpperCase().includes(newtext.toUpperCase())
          );
        }),
      );
    } else set_data(employees);
  }
  return (
    <View>
      <Modal
        animationType="slide-up"
        transparent={true}
        visible={open_find_employee}
        onRequestClose={() => {
          set_open_find_employee(false);
        }}>
        <View
          style={{
            width: '100%',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0, 0.3)',
            height: '100%',
          }}>
          <View
            style={[
              {
                height: Dimensions.get('window').height - 100,
                width: '90%',
                alignItems: 'center',
                marginTop: 60,
                backgroundColor: '#FFFFFC',
                borderRadius: 10,
              },
              styles.shadow,
            ]}>
            <View
              style={[
                styles.centeredView,
                {marginTop: 5, width: '100%', height: '100%'},
              ]}>
              <View style={{flexDirection: 'row', marginVertical: 10}}>
                <Text
                  style={{
                    paddingLeft: '10%',
                    width: '80%',
                    textAlign: 'center',
                    fontSize: 18,
                    color: 'black',
                    fontWeight: 500,
                  }}>
                  {language != 'English'
                    ? 'Chọn loại esim'
                    : 'Select esim type'}
                </Text>
                <TouchableOpacity
                  style={{marginBottom: 5, width: '10%', marginLeft: '5%'}}
                  onPress={() => set_open_find_employee(false)}>
                  <AntDesign name="closecircle" size={23} color="#C11B17" />
                </TouchableOpacity>
              </View>
              <View style={[styles.search_container, {}]}>
                <AntDesign
                  name="search1"
                  size={23}
                  color="rgba(0,0,0, 0.4)"
                  style={{marginLeft: 20}}
                />
                <TextInput
                  style={[
                    {
                      width: '90%',
                      padding: 5,
                      paddingLeft: 20,
                      fontFamily: 'Arial',
                      color: 'black',
                    },
                  ]}
                  autoCapitalize="none"
                  autoCorrect={false}
                  maxLength={30}
                  autoCapitalized="words"
                  value={text}
                  onChangeText={SearchMNV}
                  placeholder={json_language['Tìm kiếm'][language]}
                  placeholderTextColor="#cfcfcb"
                />
              </View>
              <View
                style={{
                  width: '100%',
                  height: Dimensions.get('window').height - 210,
                  marginTop: 10,
                }}>
                <FlatList
                  keyboardShouldPersistTaps="handled"
                  data={
                    data && data.length == 0
                      ? employees.slice(0, renderedItems)
                      : data && data.length == 0
                      ? data.slice(0, renderedItems)
                      : data
                  }
                  scrollEnabled={true}
                  initialNumToRender={10}
                  onEndReached={handleEndReached}
                  keyExtractor={item => item.code}
                  onEndReachedThreshold={0.2}
                  renderItem={renderListItem}></FlatList>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
export default memo(ModalListEsim);

