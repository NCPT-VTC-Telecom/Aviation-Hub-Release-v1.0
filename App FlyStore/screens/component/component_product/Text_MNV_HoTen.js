import styles from '../../styles';
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
import json_language from '../../json/language.json';
import Modal_find_employee from './modal_find_employee';
import {show_message} from '../../menu_function';
function Text_MNV_HoTen({
  language,
  on_MNV,
  on_handleMNVChange,
  on_hoTen,
  employees,
  set_open_find_employee,
  open_find_employee,
  setMNV,
  setHoTen,
}) {
  function nhapMNV() {
    if (employees && employees.length > 0) {
      set_open_find_employee(true);
    } else {
      // console.log(employees.length)
      show_message(json_language['Thất bại'][language]);
    }
  }
  return (
    <View>
      <Modal_find_employee
        MNV={on_MNV}
        language={language}
        open_find_employee={open_find_employee}
        set_open_find_employee={set_open_find_employee}
        employees={employees}
        setMNV={setMNV}
        setHoTen={setHoTen}
      />
      <TouchableOpacity style={styles.Text2_row} onPress={() => nhapMNV()}>
        <Text
          style={{width: '40%', padding: 3, paddingLeft: 0, color: 'black'}}>
          {json_language['Mã nhân viên'][language]}
        </Text>
        {/* <TextInput style={[styles.Textinput2_row, { width: '60%' }]}
                    autoCorrect={false}
                    maxLength={30}
                    autoCapitalized="words"
                    value={on_MNV}
                    onChangeText={on_handleMNVChange}
                    placeholder={json_language["Nhập mã nhân viên"][language]}
                /> */}
        <View style={{width: '60%'}}>
          {on_MNV ? (
            <Text style={{color: 'black'}}>{on_MNV}</Text>
          ) : (
            <Text style={{color: 'black'}}>
              {json_language['Nhập mã nhân viên'][language]}
            </Text>
          )}
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => nhapMNV()} style={styles.Text2_row}>
        <Text
          style={{width: '40%', color: '#000000', padding: 3, paddingLeft: 0}}>
          {json_language['Họ tên'][language]}
        </Text>
        {on_hoTen ? (
          <Text style={{width: '60%', color: 'black'}}>
            {on_hoTen ? on_hoTen.toUpperCase() : ''}
          </Text>
        ) : (
          <Text style={{width: '60%', color: 'red'}}>
            {json_language['Sai tiếp viên'][language]}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
export default memo(Text_MNV_HoTen);
