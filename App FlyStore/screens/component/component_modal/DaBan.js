import React, { memo, useState, useEffect, useRef } from 'react';
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
  Platform,
  PermissionsAndroid,
} from 'react-native';
import styles from '../../styles';
import ViewShot from 'react-native-view-shot';
import HeaderClose from '../ShortComponent/HeaderClose';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Clipboard from '@react-native-clipboard/clipboard';
import BluetoothStateManager from 'react-native-bluetooth-state-manager';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import TextRowAlignLeftRight from '../ShortComponent/Text/TextRowAlignLeftRight';
import moment from 'moment';
// AntDesign.loadFont();
import QRCode from 'react-native-qrcode-svg';
// import HomePrinter from '../esim/HomePrinter';
import { setDataLocal, QRCodeGenerator } from '../../menu_function';
const img = '../../img/';
import AlertTwoButtom from '../component_product/AlertTwoButtom';
import {
  BluetoothManager,
  BluetoothEscposPrinter,
  BluetoothTscPrinter,
} from 'react-native-bluetooth-escpos-printer';
import
  USBPrinter,
  NetPrinter,
  BLEPrinter,
  COMMANDS,
} from 'react-native-thermal-receipt-printer-image-qr';
const type_responsive =
  Dimensions.get('window').width > 480 && Dimensions.get('window').height > 480
    ? 'ipad'
    : 'smartphone';
const font_size_normal = type_responsive == 'ipad' ? 17 : 15;
import json_language from '../../json/language.json';
import Loading_animation from './Loading_animation';
import RNFS from 'react-native-fs';
async function downloadAndConvertToBase64(uri) {
  try {
    // Tải xuống ảnh từ URI
    const downloadedFilePath = `${RNFS.DocumentDirectoryPath}/downloaded_image.jpg`;
    const downloadResult = await RNFS.downloadFile({
      fromUrl: uri,
      toFile: downloadedFilePath,
    }).promise;

    // Kiểm tra xem việc tải xuống có thành công không
    if (downloadResult.statusCode === 200) {
      // Đọc nội dung ảnh dưới dạng base64
      const base64Data = await RNFS.readFile(downloadedFilePath, 'base64');

      // Xóa tệp đã tải xuống sau khi chuyển thành base64
      await RNFS.unlink(downloadedFilePath);
      return base64Data;
    } else {
      console.error('Lỗi khi tải xuống ảnh');
      return null;
    }
  } catch (error) {
    console.error('Lỗi khi xử lý ảnh:', error);
    return null;
  }
}
function modalDaBan({
  screenHeight,
  screenWidth,
  set_order_list,
  language,
  formFlightorder,
  setFormFlightorder,
  setOpenDetailStore,
  order_list,
  openDetailStore,
  onViTriOpenDetail,
  onSetViTriOpenDetail,
  printer,
  setPrinter,
  setViewShotURIStorage,
  viewShotURIStorage,
}) {
  // console.log('daban')
  const [open_alert, set_open_alert] = useState(false);
  // const [color, set_color] = useState('#1589FF')
  // const [message, set_message] = useState('')
  // const [status, set_status] = useState('')
  const [alertInfo, setAlertInfo] = useState({
    color: '#1589FF',
    message: '',
    status: '',
  });
  const [tempViewShot, setTempViewShort] = useState('');
  const data = [{ a: 1 }, { b: 2 }, { c: 3 }]; // Dữ liệu mẫu
  let refArray = [];
  for (let i = 0; i < 25; i++) {
    refArray.push(useRef(null));
  }
  const [listImageBase64, setListImageBase64] = useState([]);
  // Tạo một mảng các biến useRef dựa trên dữ liệu
  // const refArray = data.map(() => useRef(null));

  // useEffect(() => {
  //     // Truy cập các biến useRef sau khi đã được tạo
  //     refArray.forEach((ref, index) => {
  //         console.log(`Ref ${index} current value:`, ref.current);
  //     });
  //     console.log(refArray)
  //     console.log(data)
  // }, []);
  const captureView = async (listViewShotRef, length) => {
    // console.log(PERMISSIONS.IOS.PHOTO_LIBRARY)
    // return
    try {
      const temp = [];
      let temp_viewShotURIStorage = viewShotURIStorage;
      for (let i = 0; i < length; i++) {
        if (listViewShotRef[i].current) {
          try {
            const base64Data = await listViewShotRef[i].current.capture();
            const fileData = await RNFS.readFile(base64Data, 'base64');
            temp.push({ image: fileData });
            temp_viewShotURIStorage.push(fileData);
          } catch (error) {
            console.error('Error capturing view:', error);
          }
        }
      }
      setViewShotURIStorage(temp_viewShotURIStorage);
      setDataLocal(temp_viewShotURIStorage, 'viewShotURIStorage');
      setListImageBase64(temp);
      // console.log(temp)
      return temp || [];
    } catch (err) {
      console.log(err);
      return temp || [];
    }
  };
  function DeleteFirstItem() {
    const temp = order_list;
    temp.splice(0, 1);
    setDataLocal(temp, 'order_list');
    set_order_list(temp);
    setFormFlightorder(false);
    setFormFlightorder(true);
  }
  const [loading, setLoading] = useState(false);
  const connectBlue = async (item, listDevice) => {
    // let isBlue = await BluetoothManager.isBluetoothEnabled()
    // if (isBlue == 'false' || isBlue == false) {
    //     setTimeout(() => {
    //         set_open_alert(true)
    //     }, 0);
    //     set_color('#EAC117')
    //     set_status(json_language["Lỗi"][language])
    //     set_message(json_language["Bluetooth đang tắt"][language])
    //     return
    // }
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Access fine location Permission',
        message: 'App needs access to your fine location.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    const granted1 = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      {
        title: 'Bluetooth Permission',
        message: 'App needs access to your bluetooth connect.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    let isBlue = await BluetoothStateManager.getState();
    if (isBlue != 'PoweredOn') {
      setTimeout(() => {
        set_open_alert(true);
      }, 0);
      const [alertInfo, setAlertInfo] = useState({
        color: '#1589FF',
        message: '',
        status: '',
      });
      setAlertInfo({
        status: json_language['Lỗi'][language],
        message: json_language['Bluetooth đang tắt'][language],
        color: '#EAC117',
      });
      return;
    }
    setLoading(true);
    set_messgae_Loading_animation(
      language == 'English'
        ? 'Connecting bluetooth'
        : 'Đang kết nối với bluetooth',
    );
    setTimeout(() => {
      BLEPrinter.connectPrinter(item.mac_address) // the device address scanned.
        .then(
          async s => {
            setLoading(false);
            setTimeout(() => {
              set_open_alert(true);
            }, 0);
            setAlertInfo({
              status: json_language['Thành công'][language],
              message: json_language['Bluetooth đã được kết nối'][language],
              color: '#1589FF',
            });
            setDataLocal(
              {
                listDevice: [],
                connected: {
                  ...printer.connected,
                  name: item.name,
                  mac_address: item.mac_address,
                  status: 0,
                },
              },
              'printer',
            );
            setPrinter({
              ...printer,
              listDevice: listDevice,
              connected: {
                ...printer.connected,
                name: item.name,
                mac_address: item.mac_address,
                status: 1,
              },
            });
            return {
              connected: {
                name: item.name,
                mac_address: item.mac_address,
                status: 1,
              },
            };
            // await press()
          },
          e => {
            // setLoading(false)
            setLoading(false);
            setTimeout(() => {
              set_open_alert(true);
            }, 0);
            setAlertInfo({
              status: json_language['Lỗi'][language],
              message: json_language['Bluetooth không thể kết nối'][language],
              color: '#EAC117',
            });
            // alert(e + "error")
            setDataLocal(
              {
                listDevice: [],
                connected: {
                  ...printer.connected,
                  status: 0,
                  name: '',
                  mac_address: '',
                },
              },
              'printer',
            );
            setPrinter({
              ...printer,
              connected: {
                ...printer.connected,
                status: 0,
                name: '',
                mac_address: '',
              },
            });
            return { connected: { name: '', mac_address: '', status: 0 } };
          },
        );
      return 0;
    }, 0);
  };
  function removeAccents(str) {
    // Chuyển chuỗi có dấu thành chuỗi không dấu
    const accentMap = {
      Á: 'A',
      À: 'A',
      Ả: 'A',
      Ã: 'A',
      Ạ: 'A',
      Ắ: 'A',
      Ằ: 'A',
      Ẳ: 'A',
      Ẵ: 'A',
      Ặ: 'A',
      Â: 'A',
      Ấ: 'A',
      Ầ: 'A',
      Ẩ: 'A',
      Ẫ: 'A',
      Ậ: 'A',
      Đ: 'D',
      É: 'E',
      È: 'E',
      Ẻ: 'E',
      Ẽ: 'E',
      Ẹ: 'E',
      Ế: 'E',
      Ề: 'E',
      Ể: 'E',
      Ễ: 'E',
      Ệ: 'E',
      Í: 'I',
      Ì: 'I',
      Ỉ: 'I',
      Ĩ: 'I',
      Ị: 'I',
      Ó: 'O',
      Ò: 'O',
      Ỏ: 'O',
      Õ: 'O',
      Ọ: 'O',
      Ố: 'O',
      Ồ: 'O',
      Ổ: 'O',
      Ỗ: 'O',
      Ộ: 'O',
      Ơ: 'O',
      Ớ: 'O',
      Ờ: 'O',
      Ở: 'O',
      Ỡ: 'O',
      Ợ: 'O',
      Ú: 'U',
      Ù: 'U',
      Ủ: 'U',
      Ũ: 'U',
      Ụ: 'U',
      Ứ: 'U',
      Ừ: 'U',
      Ử: 'U',
      Ữ: 'U',
      Ự: 'U',
      Ý: 'Y',
      Ỳ: 'Y',
      Ỷ: 'Y',
      Ỹ: 'Y',
      Ỵ: 'Y',
    };

    return str
      .normalize('NFD') // Chuẩn hóa thành Unicode Normalization Form D (NFD)
      .replace(/[\u0300-\u036f]/g, '') // Xóa tất cả các dấu
      .replace(/Đ/g, 'D'); // Chuyển "Đ" thành "D"
  }
  const ScanDevice = async () => {
    // let isBlue = await BluetoothManager.isBluetoothEnabled()
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Access fine location Permission',
        message: 'App needs access to your fine location.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    const granted1 = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      {
        title: 'Bluetooth Permission',
        message: 'App needs access to your bluetooth connect.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    let isBlue = await BluetoothStateManager.getState();
    if (isBlue != 'PoweredOn') {
      setTimeout(() => {
        set_open_alert(true);
      }, 0);
      setAlertInfo({
        status: json_language['Lỗi'][language],
        message: json_language['Bluetooth đang tắt'][language],
        color: '#EAC117',
      });
      return;
    }
    // [{"device_name": "MTP-II_3864", "inner_mac_address": "9F985105-08C0-4D4F-4050-989A41B0D1CB"}]
    try {
      await setLoading(true);
      setTimeout(async () => {
        await setLoading(false);
      }, 5000);
      set_messgae_Loading_animation(
        language == 'English' ? 'Scaning device' : 'Đang quét thiết bị',
      );
      setPrinter({ ...printer, listDevice: [] });
      BLEPrinter.init();
      let listDevice = await BLEPrinter.getDeviceList().then();
      if (!listDevice || listDevice.length == 0) {
        setTimeout(() => {
          set_open_alert(true);
        }, 0);
        setAlertInfo({
          status:
            json_language['Chưa tìm thấy thiết bị hoặc bluetooth'][language],
          message:
            json_language['Vui lòng tắt mở lại máy in và ấn quét thiết bị'][
            language
            ],
          color: '#EAC117',
        });
      } else {
        if (Platform.OS == 'ios' || Platform.OS == 'IOS') {
          const tempListDevice = [];
          for (let i of listDevice) {
            tempListDevice.push({
              name: i.device_name,
              mac_address: i.inner_mac_address,
            });
            if (
              i.device_name == printer.connected.name &&
              i.inner_mac_address == printer.connected.mac_address
            ) {
              await setLoading(false);
              await connectBlue(
                {
                  name: printer.connected.name,
                  mac_address: printer.connected.mac_address,
                },
                tempListDevice,
              );
            }
          }
          setPrinter({ ...printer, listDevice: tempListDevice });
        } else {
          const tempListDevice = [];
          for (let i of listDevice) {
            tempListDevice.push({
              name: i.device_name,
              mac_address: i.inner_mac_address,
            });
            if (
              i.device_name == printer.connected.name &&
              i.inner_mac_address == printer.connected.mac_address
            ) {
              await setLoading(false);
              await connectBlue(
                {
                  name: printer.connected.name,
                  mac_address: printer.connected.mac_address,
                },
                tempListDevice,
              );
            }
          }
          setPrinter({ ...printer, listDevice: tempListDevice });
        }
      }
    } catch (err) {
      setLoading(false);
      setTimeout(() => {
        set_open_alert(true);
      }, 0);
      setAlertInfo({
        status: json_language['Lỗi'][language],
        message: 'Error! ' + err,
        color: '#EAC117',
      });
    }
  };
  const [messgae_Loading_animation, set_messgae_Loading_animation] = useState(
    language != 'English' ? 'Đang xử lý' : 'Processing',
  );

  const press = async listBill => {
    // console.log(printer)
    let isBlue = await BluetoothStateManager.getState();
    if (isBlue != 'PoweredOn') {
      setTimeout(() => {
        set_open_alert(true);
      }, 0);
      setAlertInfo({
        status: json_language['Lỗi'][language],
        message: json_language['Bluetooth đang tắt'][language],
        color: '#EAC117',
      });
      return;
    }
    // if (Platform.OS == 'IOS' || Platform.OS == 'ios') {
    //     setTimeout(() => {
    //         set_open_alert(true)
    //     }, 0);
    //     set_color('#EAC117')
    //     set_status(language == "English" ? "Notification" : "Thông báo")
    //     set_message(language == "English" ? "Coming soon" : "Tính năng đang phát triển")
    //     return
    // }
    try {
      if (!listBill || listBill.length == 0) {
        setTimeout(() => {
          set_open_alert(true);
        }, 0);
        setAlertInfo({
          status: json_language['Lỗi'][language],
          message: json_language['Đơn hàng rỗng! Không thể in.'][language],
          color: '#EAC117',
        });
        return;
      }
      if (
        printer.connected.status == 0 &&
        (printer.connected.name == undefined || printer.connected.name == '')
      ) {
        setTimeout(() => {
          set_open_alert(true);
        }, 0);
        setAlertInfo({
          status: json_language['Lỗi'][language],
          message:
            json_language[
            'Bluetooth chưa được kết nối với máy in. Vào cài đặt để kết nối với máy in.'
            ][language],
          color: '#EAC117',
        });
        return;
      } else if (
        printer.connected.status == 0 &&
        printer.connected.name != undefined &&
        printer.connected.name != '' &&
        printer.listDevice.length > 0
      ) {
        const reConnect = await connectBlue({
          name: printer.connected.name,
          address: printer.connected.mac_address,
        });
      } else if (
        printer.connected.status == 0 &&
        printer.connected.name != undefined &&
        printer.connected.name != '' &&
        printer.listDevice.length == 0
      ) {
        const scanAndConnectBlu = await ScanDevice();
      }
      if (printer.connected.status == 1) {
        // console.log('in')
        // return
        // console.log(COMMANDS)
        // return
        const BOLD_ON = COMMANDS.TEXT_FORMAT.TXT_BOLD_ON;
        const BOLD_OFF = COMMANDS.TEXT_FORMAT.TXT_BOLD_OFF;
        const CENTER = COMMANDS.TEXT_FORMAT.TXT_ALIGN_CT;
        const OFF_CENTER = COMMANDS.TEXT_FORMAT.TXT_ALIGN_LT;
        if (true) {
          let tempBase64Print = await captureView(refArray, listBill.length);
          let k = 1,
            inK = 0,
            totalPrice = 0;
          let emp_name_ = removeAccents(listBill[0].emp_name);
          let cur = removeAccents(await listBill[0].currency.toUpperCase());
          let qua = listBill.length;
          totalPrice = qua * listBill[0].price;
          const printTxtInfo =
            OFF_CENTER +
            '--------------------------------' +
            '\n' +
            json_language.TVHK[language] +
            ' : ' +
            emp_name_ +
            '\n' +
            json_language['So hieu'][language] +
            ' : ' +
            listBill[0].fight.number +
            '\n' +
            json_language['Thoi gian ban'][language] +
            ' : ' +
            moment(listBill[0].sold_time).format('DD-MM-YYYY hh:mm') +
            '\n' +
            json_language.Gia[language] +
            ' : ' +
            listBill[0].price +
            ' ' +
            cur +
            '\n' +
            json_language['So luong'][language] +
            ' : ' +
            qua +
            '\n' +
            json_language['Tong tien'][language] +
            ' : ' +
            totalPrice +
            ' ' +
            cur;
          await BLEPrinter.printText(
            `${CENTER}\nBAMBOO AIRWAY - VTC TELECOME`,
            {},
          );
          await BLEPrinter.printText(printTxtInfo, {});
          for (let i of listBill) {
            inK = k >= 10 ? ' --' : ' -';
            const printTxtPrice =
              OFF_CENTER +
              'ID: ' +
              k +
              inK +
              '-------------------------\n' +
              'Code:' +
              i.name +
              '\n' +
              'SMDP+Address:' +
              i.sm_dp_address +
              '\n' +
              'Activation code: ' +
              i.activation_code +
              '\n' +
              '--------------------------------\n' +
              '            QR Code';

            // await BLEPrinter.printerAlign(BLEPrinter.ALIGN.CENTER);

            await BLEPrinter.printText(printTxtPrice, {});
            let dataURL = tempBase64Print[k - 1].image;
            let qrProcessed = dataURL.replace(/(\r\n|\n|\r)/gm, '');
            // console.log(qrProcessed)
            // console.log('in')
            // await BLEPrinter.printImageBase64(
            //     qrProcessed
            //     ,
            //     { imageHeight: 300, imageWidth: 800 }
            // );
            if (type_responsive == 'ipad' || Platform.OS == 'ios') {
              await BLEPrinter.printImageBase64(qrProcessed, {
                imageHeight: 300,
                imageWidth: 800,
              });
            } else {
              await BLEPrinter.printImageBase64(qrProcessed);
            }
            k++;
          }
          await BLEPrinter.printText(`${CENTER}Have a nice trip`, {});
          await BLEPrinter.printText(`${CENTER}`, {});
          if (Platform.OS != 'ios' && Platform.OS != 'IOS') {
            await BLEPrinter.printText(`${CENTER}`, {});
          }
        } else {
          // await BluetoothEscposPrinter.setWidth(60)
          // for (let i of listBill) {
          //     // console.log(i)
          //     // console.log(moment(i.sold_time).format('DD-MM-YYYY hh:mm'))
          //     // return
          //     await BluetoothEscposPrinter.printText("\r\n", {});
          //     await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER);
          //     await BluetoothEscposPrinter.printText("BAMBOO AIRWAY - VTC TELECOME\r\n", {});
          //     // await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.LEFT);
          //     // await BluetoothEscposPrinter.printText("MNV\r\n", { fonttype: 2 });
          //     // await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.RIGHT);
          //     // await BluetoothEscposPrinter.printText(i.emp_code, { fonttype: 2 });
          //     // console.log(i.emp_code)
          //     // return
          //     // await BluetoothEscposPrinter.printText("Activation code: " + " " + i.activation_code + "\r\n", { fonttype: 2 });
          //     await BluetoothEscposPrinter.printText("--------------------------------\n", {});
          //     await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.LEFT);
          //     await BluetoothEscposPrinter.printText(json_language["Ma nhan vien"][language] + " : " + i.emp_code + "\r\n", { fonttype: 2 });
          //     // await BluetoothEscposPrinter.printText("Name: " + " " + i.emp_name + "\r\n", { fonttype: 2 });
          //     await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.LEFT);
          //     // await BluetoothEscposPrinter.printText("--------------------------------\n", {});
          //     // await BluetoothEscposPrinter.printText("Thoi gian: " + " " + moment(new Date()).format('DD-MM-YYYY hh:mm:ss') + "\r\n", { fonttype: 2 });
          //     await BluetoothEscposPrinter.printText(json_language["So hieu chuyen bay"][language] + " : " + i.fight.number + "\r\n", { fonttype: 2 });
          //     await BluetoothEscposPrinter.printText(json_language["Thoi gian ban"][language] + " : " + moment(i.sold_time).format('DD-MM-YYYY hh:mm') + "\r\n", { fonttype: 2 });
          //     // await BluetoothEscposPrinter.printText("Purchase time: " + " " + moment(new Date()).format('DD-MM-YYYY hh:mm') + "\r\n", { fonttype: 2 });
          //     await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER);
          //     await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.LEFT);
          //     // await BluetoothEscposPrinter.printText("--------------------------------\n", {});
          //     await BluetoothEscposPrinter.printText(json_language["Gia"][language] + " : " + i.price + " " + i.currency + "\r\n", {});
          //     await BluetoothEscposPrinter.printText(json_language["So luong"][language] + " : " + i.quantity + "\r\n", {});
          //     await BluetoothEscposPrinter.printText(json_language["Tong tien"][language] + " : " + i.totalPrice + " " + i.currency + "\r\n", {});
          //     await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER);
          //     //activation code
          //     await BluetoothEscposPrinter.printText("--------------------------------\n", {});
          //     await BluetoothEscposPrinter.printText("Code: " + " " + i.code + "\r\n", { fonttype: 2 });
          //     await BluetoothEscposPrinter.printText("SM-DP+Address: " + i.sm_dp_address + "\r\n", { fonttype: 2 });
          //     await BluetoothEscposPrinter.printText("Activation code: " + i.activation_code + "\r\n", { fonttype: 2 });
          //     await BluetoothEscposPrinter.printText("--------------------------------\n", {});
          //     await BluetoothEscposPrinter.printText("QR Code\r\n", {});
          //     await BluetoothEscposPrinter.printQRCode(i.voucher, 300, 1)
          //     await BluetoothEscposPrinter.printText("\r\n\n\n\n", {});
          //     // await BluetoothEscposPrinter.printText(" Printed At : " + moment(new Date()).format('DD-MM-YYYY hh:mm:ss') + "\r\n\r\n", { fonttype: 1 });
          //     // Actions.TransaksiAdd();
          // }
        }
      }
    } catch (err) {
      let isBlue = await BluetoothStateManager.getState();
      if (isBlue != 'PoweredOn') {
        setTimeout(() => {
          set_open_alert(true);
        }, 0);
        setAlertInfo({
          status: json_language['Lỗi'][language],
          message: json_language['Bluetooth đang tắt'][language],
          color: '#EAC117',
        });
      } else {
        setTimeout(() => {
          set_open_alert(true);
        }, 0);
        setAlertInfo({
          status: json_language['Lỗi'][language],
          message: 'Error! ' + err,
          color: '#EAC117',
        });
      }
    }
  };
  const [showNotification, setShowNotification] = useState(false);
  const handleCopy = t => {
    // console.log(t)
    Clipboard.setString(t);
    setShowNotification(true);

    setTimeout(() => {
      setShowNotification(false);
    }, 1000);
  };
  useEffect(() => { }, [order_list]);
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
  const [openGetQRCode, setOpenGetQRCode] = useState(false);
  const [codeSelect, setCodeSelect] = useState(false);
  const [itemQRCodeSelect, setItemQRCodeSelect] = useState({});
  return (
    <Modal
      // animationType="fade"
      transparent={false}
      visible={formFlightorder}
      onRequestClose={() => {
        setFormFlightorder(false);
        setOpenGetQRCode(false);
      }}>
      <StatusBar backgroundColor="rgba(0, 0, 0, 1)" />
      <Loading_animation
        onLoading={loading}
        onAction={messgae_Loading_animation}
      />
      <AlertTwoButtom
        open_alert={open_alert}
        set_open_alert={set_open_alert}
        type={'thongbao'}
        language={language}
        color={alertInfo.color}
        status={alertInfo.status}
        message={alertInfo.message}
      />
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
            <HeaderClose
              title={json_language['Đơn hàng trong chuyến bay'][language]}
              func={
                !openDetailStore
                  ? () => {
                    setFormFlightorder(false);
                    setOpenGetQRCode(false);
                  }
                  : () => {
                    setFormFlightorder(false);
                    setOpenDetailStore(false);
                    setOpenGetQRCode(false);
                  }
              }
            />
            {order_list && (
              <View>
                {!openDetailStore && (
                  <View>
                    <FlatList
                      inverted
                      data={order_list}
                      scrollEnabled={false}
                      renderItem={({ item, index }) => {
                        return (
                          <View key={index}>
                            <TouchableOpacity
                              style={[styles.Text2_row, { padding: 10 }]}
                              onPress={() => {
                                onSetViTriOpenDetail(index);
                                setOpenDetailStore(true);
                                if (
                                  order_list[onViTriOpenDetail].loaiSanPham ==
                                  'esim'
                                ) {
                                  setOpenGetQRCode(false);
                                }
                              }}>
                              <Text
                                style={{
                                  width:
                                    type_responsive == 'ipad' ? '93%' : '88%',
                                  paddingLeft: 10,
                                  color: 'black',
                                }}>
                                {order_list.length - index}. {item.MNV} -{' '}
                                {item.hoTen.toUpperCase()}{' '}
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
                                      : item.loaiSanPham == 'mananghang'
                                        ? '#38ACEC'
                                        : '#9E7BFF',
                                }}>
                                <Text style={{ color: 'white', fontSize: 12 }}>
                                  {item.soLuong}
                                </Text>
                              </TouchableOpacity>
                            </TouchableOpacity>
                          </View>
                        );
                      }}
                    />
                    {!order_list || order_list.length == 0 ? (
                      <TouchableOpacity
                        style={[styles.Text2_row, { padding: 10 }]}>
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
                )}

                {openDetailStore && !openGetQRCode && (
                  <View>
                    {order_list[onViTriOpenDetail].loaiSanPham == 'maban' && (
                      <TouchableOpacity
                        style={[
                          styles.Text2_row,
                          { padding: 8, backgroundColor: '#DDDFE1' },
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
                            json_language['Mã truy cập wifi cho khách hàng'][
                            language
                            ]
                          }
                        </Text>
                      </TouchableOpacity>
                    )}
                    {order_list[onViTriOpenDetail].loaiSanPham ==
                      'mananghang' && (
                        <TouchableOpacity
                          style={[
                            styles.Text2_row,
                            { padding: 8, backgroundColor: '#DDDFE1' },
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
                              json_language['Mã nâng hạng wifi cho khách hàng'][
                              language
                              ]
                            }
                          </Text>
                        </TouchableOpacity>
                      )}
                    {order_list[onViTriOpenDetail].loaiSanPham == 'esim' && (
                      <View>
                        <View
                          style={[
                            styles.Text2_row,
                            {
                              padding: 8,
                              backgroundColor: '#DDDFE1',
                              width: '100%',
                            },
                          ]}>
                          <TouchableOpacity
                            onPress={() => setOpenDetailStore(false)}
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                            }}>
                            <Ionicons
                              name="chevron-back-outline"
                              size={22}
                              color="#000000"
                            />
                            <Text
                              style={{
                                width: '50%',
                                paddingLeft: 10,
                                fontWeight: 500,
                                color: 'black',
                              }}>
                              Sim data
                            </Text>
                          </TouchableOpacity>
                        </View>
                        {/* <TouchableOpacity
                                                onPress={() => set_openHomePrinter(true)}
                                            >
                                                <Text style={{ padding: 20 }}>
                                                    Printer
                                                </Text>
                                            </TouchableOpacity> */}
                        {/* <View style={{ width: '100%' }}>
                                                {order_list[onViTriOpenDetail].donHang && order_list[onViTriOpenDetail].donHang.length > 0 && (
                                                    <TouchableOpacity style={[styles.Text2_row, { padding: 8, backgroundColor: '#4EBDEC', justifyContent: 'center' }]}
                                                        onPress={() => setOpenDetailStore(false)}
                                                    >
                                                        <View style={{ flexDirection: 'row' }}>
                                                            <AntDesign name="setting" size={22} color="#000000" />
                                                            <Text style={{ paddingLeft: 10, fontWeight: 500, color: 'black', paddingTop: 3, }}>Setting</Text>
                                                        </View>
                                                    </TouchableOpacity>)}
                                            </View> */}
                        <View style={{ width: '100%' }}>
                          {order_list[onViTriOpenDetail].donHang &&
                            order_list[onViTriOpenDetail].donHang.length >
                            0 && (
                              <TouchableOpacity
                                style={[
                                  styles.Text2_row,
                                  {
                                    padding: 8,
                                    backgroundColor: '#4EBDEC',
                                    justifyContent: 'center',
                                  },
                                ]}
                                onPress={async () => {
                                  // console.log(refArray[0])
                                  // return
                                  await press(
                                    order_list[onViTriOpenDetail].donHang,
                                  );
                                }}>
                                <View style={{ flexDirection: 'row' }}>
                                  <AntDesign
                                    name="printer"
                                    size={22}
                                    color="#000000"
                                  />
                                  <Text
                                    style={{
                                      paddingLeft: 10,
                                      fontWeight: 500,
                                      color: 'black',
                                      paddingTop: 3,
                                    }}>
                                    {language == 'English'
                                      ? 'Print all'
                                      : 'In tất cả'}
                                  </Text>
                                </View>
                              </TouchableOpacity>
                            )}
                        </View>
                      </View>
                    )}
                    <View style={{}}>
                      <FlatList
                        data={order_list[onViTriOpenDetail].donHang}
                        scrollEnabled={false}
                        renderItem={({ item, index }) => {
                          const uniqueKey = `${index}-${item.voucher}`;
                          // console.log(uniqueKey)
                          if (
                            order_list[onViTriOpenDetail].loaiSanPham == 'esim'
                          ) {
                            // const refArray = data.map(() => useRef(null));
                          }
                          // console.log(refArray)
                          return (
                            <View key={uniqueKey}>
                              {order_list[onViTriOpenDetail].loaiSanPham ==
                                'esim' ? (
                                <View
                                  style={{
                                    borderBottomWidth: 1,
                                    borderBottomColor: '#DDDFE1',
                                  }}>
                                  <TextRowAlignLeftRight
                                    text1={'ID'}
                                    text2={index + 1}
                                    size={'40%'}
                                    size2={'52%'}
                                  />

                                  {/* <TextRowAlignLeftRight text1={"Package name"} text2={item.code} /> */}
                                  {/* <TextRowAlignLeftRight text1={"Validation"} text2={item.code} /> */}
                                  <TextRowAlignLeftRight
                                    text1={'SM-DP+Address'}
                                    text2={item.sm_dp_address}
                                  />
                                  <TextRowAlignLeftRight
                                    text1={'Activation code'}
                                    text2={item.activation_code}
                                  />
                                  <View style={{ alignItems: 'center' }}>
                                    <View
                                      style={{
                                        height: 100,
                                        width: 100,
                                        justifyContent: 'center',
                                      }}>
                                      {type_responsive == 'ipad' ? (
                                        <ViewShot
                                          ref={refArray[index]}
                                          style={{ backgroundColor: 'white' }}
                                          options={{
                                            format: 'jpg',
                                            quality: 1,
                                            backgroundColor: 'white',
                                          }}>
                                          <View
                                            style={{
                                              backgroundColor: 'white',
                                              marginLeft:
                                                Platform.OS == 'ios' ? 93 : 3,
                                            }}>
                                            <QRCode
                                              value={item.voucher} // Ná»™i dung cá»§a mĂ£ QR
                                              size={
                                                Platform.OS == 'ios' ? 300 : 200
                                              }
                                            />
                                          </View>
                                        </ViewShot>
                                      ) : (
                                        <ViewShot
                                          ref={refArray[index]}
                                          style={{ backgroundColor: 'white' }}
                                          options={{
                                            format: 'jpg',
                                            quality: 1,
                                            backgroundColor: 'white',
                                          }}>
                                          <View
                                            style={{
                                              backgroundColor: 'white',
                                              marginLeft: 0,
                                            }}>
                                            <QRCode
                                              value={item.voucher} // Ná»™i dung cá»§a mĂ£ QR
                                              size={100}
                                            />
                                          </View>
                                        </ViewShot>
                                      )}
                                    </View>
                                  </View>
                                  {/* <View style={{ width: Dimensions.get('window').width, justifyContent: 'center', alignContent: 'center', marginTop: 20, marginBottom: 20 }}>
                                                                    <QRCodeGenerator
                                                                        value={codeSelect}
                                                                    />
                                                                </View> */}
                                  <TouchableOpacity
                                    style={[
                                      styles.Text2_row,
                                      {
                                        padding: 8,
                                        backgroundColor: '#4EBDEC',
                                        justifyContent: 'center',
                                        width: '100%',
                                      },
                                      order_list[onViTriOpenDetail].donHang &&
                                        order_list[onViTriOpenDetail].donHang
                                          .length > 1
                                        ? { marginTop: 20 }
                                        : {
                                          top:
                                            Dimensions.get('window').height -
                                            100,
                                          position: 'absolute',
                                        },
                                    ]}
                                    onPress={async () => {
                                      const bill = [];
                                      bill.push(item);
                                      await press(bill);
                                    }}>
                                    <View
                                      style={{ flexDirection: 'row', heigh: 50 }}>
                                      <AntDesign
                                        name="printer"
                                        size={22}
                                        color="#000000"
                                      />
                                      <View style={{ justifyContent: 'center' }}>
                                        <Text
                                          style={{
                                            paddingLeft: 10,
                                            fontWeight: 500,
                                            color: 'black',
                                          }}>
                                          {language == 'English'
                                            ? 'Print bill '
                                            : 'In đơn '}
                                          {index + 1}
                                        </Text>
                                      </View>
                                    </View>
                                  </TouchableOpacity>
                                </View>
                              ) : (
                                // <TouchableOpacity
                                //     onPress={async () => {
                                //         setOpenGetQRCode(true)
                                //         setCodeSelect("LPA:1$" + item.code + "$" + item.code)
                                //         item.id = index + 1
                                //         await setItemQRCodeSelect(item)
                                //     }}
                                //     style={[styles.Text2_row, { padding: 8, color: 'black', paddingBottom: 10, paddingTop: 10, paddingLeft: 0, flexDirection: 'row' }]}
                                // >
                                //     <Text style={{ paddingLeft: 5, color: 'black', flexWrap: 'wrap', maxWidth: '70%', marginRight: 5 }}>{index + 1}.  {item.name} -</Text>
                                //     <View>
                                //         <Text style={{ color: 'blue' }}>{item.voucher}</Text>
                                //     </View>
                                // </TouchableOpacity>
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
                                  <Text
                                    style={{
                                      paddingLeft: 10,
                                      color: 'black',
                                      flexWrap: 'wrap',
                                      maxWidth: '70%',
                                      marginRight: 5,
                                    }}>
                                    {index + 1}. {item.name} -
                                  </Text>
                                  <TouchableOpacity
                                    onPress={() => handleCopy(item.voucher)}>
                                    <Text style={{ color: 'blue' }}>
                                      {item.voucher}
                                    </Text>
                                  </TouchableOpacity>
                                </View>
                              )}
                            </View>
                          );
                        }}
                      />
                    </View>

                    {/* {order_list[onViTriOpenDetail].donHang && order_list[onViTriOpenDetail].donHang.length < 2 && (
                                    <TouchableOpacity style={[styles.Text2_row, { padding: 8, backgroundColor: '#4EBDEC', justifyContent: 'center', top: Dimensions.get('window').height - 100, position: 'absolute', width: '100%' }]}
                                        onPress={() => setOpenDetailStore(false)}
                                    >
                                        <View style={{ flexDirection: 'row', heigh: 50 }}>
                                            <AntDesign name="printer" size={22} color="#000000" />
                                            <Text style={{ paddingLeft: 10, fontWeight: 500, color: 'black' }}>Print</Text>
                                        </View>
                                    </TouchableOpacity>
                                )} */}
                  </View>
                )}
                {openDetailStore && openGetQRCode && (
                  <View>
                    {order_list[onViTriOpenDetail].loaiSanPham == 'maban' && (
                      <TouchableOpacity
                        style={[
                          styles.Text2_row,
                          { padding: 8, backgroundColor: '#DDDFE1' },
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
                            json_language['Mã truy cập wifi cho khách hàng'][
                            language
                            ]
                          }
                        </Text>
                      </TouchableOpacity>
                    )}
                    {order_list[onViTriOpenDetail].loaiSanPham ==
                      'mananghang' && (
                        <TouchableOpacity
                          style={[
                            styles.Text2_row,
                            { padding: 8, backgroundColor: '#DDDFE1' },
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
                              json_language['Mã nâng hạng wifi cho khách hàng'][
                              language
                              ]
                            }
                          </Text>
                        </TouchableOpacity>
                      )}
                    {order_list[onViTriOpenDetail].loaiSanPham == 'esim' && (
                      <TouchableOpacity
                        style={[
                          styles.Text2_row,
                          { padding: 8, backgroundColor: '#DDDFE1' },
                        ]}
                        onPress={() => setOpenGetQRCode(false)}>
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
                            alignItems: 'center',
                          }}>
                          Sim data
                        </Text>
                      </TouchableOpacity>
                    )}
                    <TextRowAlignLeftRight
                      text1={'Order ID'}
                      text2={itemQRCodeSelect.id}
                    />
                    <TextRowAlignLeftRight
                      text1={'Package name'}
                      text2={itemQRCodeSelect.code}
                    />
                    <TextRowAlignLeftRight
                      text1={'Validation'}
                      text2={itemQRCodeSelect.code}
                    />
                    <TextRowAlignLeftRight
                      text1={'SM-DP+Address'}
                      text2={itemQRCodeSelect.code}
                    />
                    <TextRowAlignLeftRight
                      text1={'Activation code'}
                      text2={itemQRCodeSelect.code}
                    />

                    <View
                      style={{
                        width: Dimensions.get('window').width,
                        justifyContent: 'center',
                        alignContent: 'center',
                        marginTop: 50,
                      }}>
                      <QRCodeGenerator value={codeSelect} />
                    </View>
                    <TouchableOpacity
                      style={[
                        styles.Text2_row,
                        {
                          padding: 8,
                          backgroundColor: '#4EBDEC',
                          justifyContent: 'center',
                          width: '100%',
                        },
                        order_list[onViTriOpenDetail].donHang &&
                          order_list[onViTriOpenDetail].donHang.length > 1
                          ? { marginTop: 20 }
                          : {
                            top: Dimensions.get('window').height - 100,
                            position: 'absolute',
                          },
                      ]}
                      onPress={async () => {
                        const bill = [];
                        bill.push(item);
                        await press(bill);
                      }}>
                      <View style={{ flexDirection: 'row', heigh: 50 }}>
                        <AntDesign name="printer" size={22} color="#000000" />
                        <View style={{ justifyContent: 'center' }}>
                          <Text
                            style={{
                              paddingLeft: 10,
                              fontWeight: 500,
                              color: 'black',
                            }}>
                            {language == 'English' ? 'Print bill ' : 'In đơn '}
                            {index + 1}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}
export default memo(modalDaBan);
