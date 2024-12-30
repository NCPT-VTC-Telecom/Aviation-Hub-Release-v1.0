import React, {
  useState,
  Component,
  useEffect,
  Fragment,
  useCallback,
} from 'react';
import {Alert, Modal, Text, View, TouchableOpacity} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import AsyncStorage from '@react-native-community/async-storage';
import styles from './styles';
export function show_message(status, message) {
  Alert.alert(status, message, [
    // {
    //     text: 'Cancel',
    //     //onPress: () => console.log('Cancel Pressed'),
    //     style: 'cancel',
    // },
    {
      text: 'OK',
      //onPress: () => console.log('OK Pressed')
    },
  ]);
}
export function show_message_having_function(status, message, func) {
  Alert.alert(status, message, [
    {
      text: 'Cancel',
      //onPress: () => console.log('Cancel Pressed'),
      style: 'cancel',
    },
    {
      text: 'OK',
      onPress: () => func(),
    },
  ]);
}
export const setDataLocal = async (list, name) => {
  try {
    const jsonValue = JSON.stringify(list);
    await AsyncStorage.setItem(name, jsonValue);
  } catch (error) {
    show_message('Error from set data local', error);
  }
};
//dùng để lấy dữ liệu đã mua
export const getDataLocalPost = (
  wifi_vouchers,
  upgrade_tickets_vouchers,
  esim_vouchers,
) => {
  const merge_upgrade_and_wifi = [];
  if (wifi_vouchers || upgrade_tickets_vouchers) {
    for (let i = 0; i < upgrade_tickets_vouchers.length; i++) {
      // if (upgrade_tickets_vouchers[i].status == 1)
      merge_upgrade_and_wifi.push(upgrade_tickets_vouchers[i]);
    }
    // console.log(re)
    for (let i = 0; i < wifi_vouchers.length; i++) {
      // if (wifi_vouchers[i].status == 1)
      merge_upgrade_and_wifi.push(wifi_vouchers[i]);
    }
    for (let i = 0; i < esim_vouchers.length; i++) {
      if (esim_vouchers[i].status == 1) {
        merge_upgrade_and_wifi.push(esim_vouchers[i]);
      }
    }
    // console.log(re)
    // console.log('go go')

    return merge_upgrade_and_wifi;
  }
  return [];
};

export function set_data_local_store(data_store) {
  if (data_store) {
    setDataLocal(
      data_store.upgrade_tickets.prices,
      'upgrade_tickets_voucher_prices',
    );
    setDataLocal(
      data_store.upgrade_tickets.types,
      'upgrade_tickets_voucher_types',
    );
    setDataLocal(
      data_store.upgrade_tickets.vouchers,
      'upgrade_tickets_vouchers',
    );
    setDataLocal(data_store.wifi.prices, 'wifi_voucher_prices');
    setDataLocal(data_store.wifi.types, 'wifi_voucher_types');
    setDataLocal(data_store.wifi.vouchers, 'wifi_vouchers');
    setDataLocal(data_store.employees, 'employees');
    setDataLocal(data_store.currency, 'currency');
    //cập nhật lại liền sau khi đồng bộ
    getDataLocal([
      'upgrade_tickets_voucher_prices',
      'upgrade_tickets_voucher_types',
      'upgrade_tickets_vouchers',
      'wifi_voucher_prices',
      'wifi_voucher_types',
      'wifi_vouchers',
      'employees',
      'currency',
    ]);
  }
}
// export function handleInputNumber(text, set_number_any) {
//     // Chỉ cho phép nhập số nguyên
//     const regex = /^[0-9]*$/;
//     if (regex.test(text)) {
//         set_number_any(text);
//     }
// }
// export const handleInputChange = useCallback((text, obj, setObj) => {
//     // Chỉ cho phép nhập số nguyên
//     if (!text) {
//         setObj({ ...obj, soLuong: "1" })
//         return
//     }
//     const regex = /^[0-9]*$/;
//     if (regex.test(text)) {
//         if (text[0] === '0') {
//             text = text.slice(0, 0);
//         }
//         setObj({ ...obj, soLuong: text })
//     }
// })
// export const handleMNVChange = useCallback((newText, obj, setObj, employees) => {
//     obj.MNV = newText
//     if (employees && newText) {
//         const temp = employees.find(emp => emp.code === newText.toUpperCase());
//         if (temp) {
//             obj.MNV = newText.toUpperCase()
//             obj.hoTen = temp.name
//         }
//         else obj.hoTen = "";
//     }
//     else
//         obj.hoTen = " "
//     setObj(obj)
// })

export function QRCodeGenerator({text}) {
  return (
    <View style={{justifyContent: 'center', alignItems: 'center'}}>
      <QRCode
        value={text} // Đoạn văn bản bạn muốn chuyển thành QR Code
        size={300} // Kích thước của mã QR Code
        color="black" // Màu sắc của mã QR Code
        backgroundColor="white" // Màu nền của mã QR Code
      />
    </View>
  );
}
