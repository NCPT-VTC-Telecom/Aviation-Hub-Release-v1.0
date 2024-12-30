import React, {memo, useState, useRef} from 'react';
import {
  Alert,
  SafeAreaView,
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
  Platform,
  PermissionsAndroid,
} from 'react-native';
import styles from '../../styles';
import ViewShot from 'react-native-view-shot';
import json_language from '../../json/language.json';
const img = '../../img/';
import BluetoothStateManager from 'react-native-bluetooth-state-manager';
import HeaderClose from '../ShortComponent/HeaderClose';
import TextLabelRow from '../ShortComponent/Text/TextLableRow';
import Button from '../ShortComponent/Button';
import QRCode from 'react-native-qrcode-svg';

import {
  fontSizeNormal,
  typeResponsive,
  fontSizeMedium,
} from '../ShortComponent/config';
import Loading_animation from '../component_modal/Loading_animation';
import AlertTwoButtom from '../component_product/AlertTwoButtom';
import {PERMISSIONS, request} from 'react-native-permissions';
import {
  USBPrinter,
  NetPrinter,
  BLEPrinter,
} from 'react-native-thermal-receipt-printer-image-qr';
// import { BluetoothManager, BluetoothEscposPrinter, BluetoothTscPrinter } from 'react-native-bluetooth-escpos-printer';
import moment from 'moment';
import RNFS from 'react-native-fs';
// import RNFetchBlob from 'react-native-fetch-blob';
import {setDataLocal} from '../../menu_function';
// import { print } from 'react-native-print';

function HomePrinter({
  language,
  openHomePrinter,
  set_openHomePrinter,
  printer,
  setPrinter,
}) {
  const [open_alert, set_open_alert] = useState(false);
  const [color, set_color] = useState('#1589FF');
  const [message, set_message] = useState('');
  const [status, set_status] = useState('');
  const viewShotRef = useRef(null);
  const [tempViewShot, setTempViewShort] = useState('');
  const captureView = async () => {
    // console.log(PERMISSIONS.IOS.PHOTO_LIBRARY)
    // return
    if (viewShotRef.current) {
      try {
        const base64Data = await viewShotRef.current.capture();
        const fileData = await RNFS.readFile(base64Data, 'base64');
        setTempViewShort(fileData);
        // console.log()
        console.log('Base64 image data:', base64Data);
        // Ở đây, bạn có thể làm gì đó với base64Data, ví dụ: lưu vào cơ sở dữ liệu, hiển thị, hoặc gửi lên server
      } catch (error) {
        console.error('Error capturing view:', error);
      }
    }
  };
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
        console.log(base64Data);
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
  const renderListItem = ({item, index}) => {
    return (
      <View
        key={index}
        style={[
          {
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItem: 'center',
          },
        ]}>
        <TouchableOpacity
          style={[{width: '100%', padding: 8}]}
          onPress={async () => {
            await connectBlue(item);
          }}>
          {item.mac_address == printer.connected.mac_address &&
          printer.connected.status == 1 ? (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItem: 'center',
              }}>
              <Text style={{color: '#64AF53', fontSize: fontSizeNormal}}>
                [{index + 1}] - {item.name}
              </Text>
              {/* <AntDesign name="check" size={20} color="#005320" style={{ marginLeft: 30 }} /> */}
            </View>
          ) : (
            <Text
              style={{
                color: '#000000',
                fontSize: fontSizeNormal,
                textAlign: 'center',
              }}>
              [{index + 1}] - {item.name}
            </Text>
          )}
        </TouchableOpacity>
        {/* <Text style={{ width: '50%', textAlign: 'center', color: '#000000' }} >{item.name}</Text> */}
      </View>
    );
  };
  const connectBlue = async item => {
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
      set_color('#EAC117');
      set_status(json_language['Lỗi'][language]);
      set_message(json_language['Bluetooth đang tắt'][language]);
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
            set_color('#1589FF');
            set_status(json_language['Thành công'][language]);
            set_message(json_language['Bluetooth đã được kết nối'][language]);
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
              connected: {
                ...printer.connected,
                name: item.name,
                mac_address: item.mac_address,
                status: 1,
              },
            });
            return 1;
            // await press()
          },
          e => {
            // setLoading(false)
            setLoading(false);
            setTimeout(() => {
              set_open_alert(true);
            }, 0);
            set_color('#EAC117');
            set_status(json_language['Lỗi'][language]);
            set_message(json_language['Bluetooth không thể kết nối'][language]);
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
          },
        );
      return 0;
    }, 0);
  };
  // const connectBlue = async (item) => {
  //     const granted1 = await PermissionsAndroid.request(
  //         PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
  //         {
  //             title: 'Bluetooth Permission',
  //             message: 'App needs access to your bluetooth connect.',
  //             buttonNeutral: 'Ask Me Later',
  //             buttonNegative: 'Cancel',
  //             buttonPositive: 'OK',
  //         },
  //     );
  //     // let isBlue = await BluetoothManager.isBluetoothEnabled()
  //     // if (isBlue == 'false' || isBlue == false) {
  //     //     setTimeout(() => {
  //     //         set_open_alert(true)
  //     //     }, 0);
  //     //     set_color('#EAC117')
  //     //     set_status(json_language["Lỗi"][language])
  //     //     set_message(json_language["Bluetooth đang tắt"][language])
  //     //     return
  //     // }
  //     set_messgae_Loading_animation(language == "English" ? "Connecting bluetooth" : "Đang kết nối với bluetooth")
  //     setLoading(true)
  //     BluetoothManager.connect(item.address) // the device address scanned.
  //         .then(async (s) => {
  //             setLoading(false)
  //             setTimeout(() => {
  //                 set_open_alert(true)
  //             }, 0);
  //             set_color('#1589FF')
  //             set_status(json_language["Thành công"][language])
  //             set_message(json_language["Bluetooth đã được kết nối"][language])
  //             setDataLocal({ ...printer, connected: { ...printer.connected, name: item.name, mac_address: item.address, status: 0 } }, 'printer')
  //             setPrinter({ ...printer, connected: { ...printer.connected, name: item.name, mac_address: item.address, status: 1 } })
  //             return 1
  //             // await press()
  //         }, (e) => {
  //             // setLoading(false)
  //             setLoading(false)
  //             setTimeout(() => {
  //                 set_open_alert(true)
  //             }, 0);
  //             set_color('#EAC117')
  //             set_status(json_language["Lỗi"][language])
  //             set_message(json_language["Bluetooth không thể kết nối"][language])
  //             // alert(e + "error")
  //             setDataLocal({ ...printer, connected: { ...printer.connected, status: 0, name: "", mac_address: "" } }, 'printer')
  //             setPrinter({ ...printer, connected: { ...printer.connected, status: 0, name: "", mac_address: "" } })
  //         })
  //     return 0
  // }
  const ScanDevice = async () => {
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
    // let isBlue = await BluetoothManager.isBluetoothEnabled()
    let isBlue = await BluetoothStateManager.getState();
    if (isBlue != 'PoweredOn') {
      setTimeout(() => {
        set_open_alert(true);
      }, 0);
      set_color('#EAC117');
      set_status(json_language['Lỗi'][language]);
      set_message(json_language['Bluetooth đang tắt'][language]);
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
      setPrinter({...printer, listDevice: []});
      BLEPrinter.init();
      let listDevice = await BLEPrinter.getDeviceList().then();
      if (!listDevice || listDevice.length == 0) {
        setTimeout(() => {
          set_open_alert(true);
        }, 0);
        set_color('#EAC117');
        set_status(
          json_language['Chưa tìm thấy thiết bị hoặc bluetooth'][language],
        );
        set_message(
          json_language['Vui lòng tắt mở lại máy in và ấn quét thiết bị'][
            language
          ],
        );
      } else {
        if (Platform.OS == 'ios' || Platform.OS == 'IOS') {
          const tempListDevice = [];
          for (let i of listDevice) {
            tempListDevice.push({
              name: i.device_name,
              mac_address: i.inner_mac_address,
            });
          }
          setPrinter({...printer, listDevice: tempListDevice});
        } else {
          const tempListDevice = [];
          for (let i of listDevice) {
            tempListDevice.push({
              name: i.device_name,
              mac_address: i.inner_mac_address,
            });
          }
          setPrinter({...printer, listDevice: tempListDevice});
        }
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setTimeout(() => {
        set_open_alert(true);
      }, 0);
      set_color('#EAC117');
      set_status(json_language['Lỗi'][language]);
      set_message('Error! ' + err);
    }
  };
  const [temp_url_base64, set_temp_url_base64] = useState('');
  // const ScanDevice = async () => {
  //     const granted = await PermissionsAndroid.request(
  //         PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  //         {
  //             title: 'Access fine location Permission',
  //             message: 'App needs access to your fine location.',
  //             buttonNeutral: 'Ask Me Later',
  //             buttonNegative: 'Cancel',
  //             buttonPositive: 'OK',
  //         },
  //     );
  //     const granted1 = await PermissionsAndroid.request(
  //         PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
  //         {
  //             title: 'Bluetooth Permission',
  //             message: 'App needs access to your bluetooth connect.',
  //             buttonNeutral: 'Ask Me Later',
  //             buttonNegative: 'Cancel',
  //             buttonPositive: 'OK',
  //         },
  //     );
  //     // let isBlue = await BluetoothManager.isBluetoothEnabled()
  //     // if (isBlue == 'false' || isBlue == false) {
  //     //     setTimeout(() => {
  //     //         set_open_alert(true)
  //     //     }, 0);
  //     //     set_color('#EAC117')
  //     //     set_status(json_language["Lỗi"][language])
  //     //     set_message(json_language["Bluetooth đang tắt"][language])
  //     //     return
  //     // }
  //     BluetoothManager.isBluetoothEnabled().then((enabled) => {
  //         setLoading(true)
  //         set_messgae_Loading_animation(language == "English" ? "Init" : "Đang khởi tạo")
  //         // await BLEPrinter.init()
  //         try {
  //             set_messgae_Loading_animation(language == "English" ? "Scaning device" : "Đang quét thiết bị")
  //             // const temp = await BLEPrinter.getDeviceList()
  //             setTimeout(() => {
  //                 if (loading == true) {
  //                     setLoading(false)
  //                     setTimeout(() => {
  //                         set_open_alert(true)
  //                     }, 0);
  //                     set_color('#EAC117')
  //                     set_status(json_language["Lỗi"][language])
  //                     set_message("Error! Time out!")
  //                 }
  //             }, 5000);
  //             // console.log(Platform.OS == 'IOS')
  //             if (Platform.OS == 'ios' || Platform.OS == 'IOS') {
  //                 BluetoothManager.scanDevices()
  //                     .then((s) => {
  //                         let ss = JSON.parse(s.found);
  //                         console.log(ss);//JSON string
  //                         let temp = []
  //                         for (let i of ss) {
  //                             if (i.name != "")
  //                                 temp.push(i)
  //                         }
  //                         if (temp && temp.length != 0) {
  //                             setPrinter({ ...printer, listDevice: temp })
  //                         }
  //                         else {
  //                             setPrinter({ ...printer, listDevice: [] })
  //                         }
  //                         setLoading(false)

  //                     }, (er) => {
  //                         setPrinter({ ...printer, listDevice: [] })
  //                         setLoading(false)
  //                         console.log(er)
  //                         setTimeout(() => {
  //                             set_open_alert(true)
  //                         }, 0);
  //                         set_color('#EAC117')
  //                         set_status(json_language["Lỗi"][language])
  //                         set_message("Error! " + er)
  //                     });

  //             }
  //             else {
  //                 // console.log('vô')
  //                 BluetoothManager.enableBluetooth().then((r) => {
  //                     var paired = [];
  //                     if (r && r.length > 0) {
  //                         for (var i = 0; i < r.length; i++) {
  //                             try {
  //                                 const temp = JSON.parse(r[i])
  //                                 if (temp.name != undefined && temp.name != '') {
  //                                     paired.push(temp); // NEED TO PARSE THE DEVICE INFORMATION
  //                                 }
  //                             } catch (e) {
  //                                 //ignore
  //                             }
  //                         }
  //                     }
  //                     // console.log(paired.length)
  //                     // console.log(JSON.stringify(paired))
  //                     // console.log(JSON.stringify(paired).length)
  //                     setPrinter({ ...printer, listDevice: paired })
  //                     setLoading(false)
  //                 }, (err) => {
  //                     setPrinter({ ...printer, listDevice: [] })
  //                     setLoading(false)
  //                     setTimeout(() => {
  //                         set_open_alert(true)
  //                     }, 0);
  //                     set_color('#EAC117')
  //                     set_status(json_language["Lỗi"][language])
  //                     set_message("Error! " + err)
  //                 });
  //             }
  //         }
  //         catch (err) {
  //             setLoading(false)
  //             setTimeout(() => {
  //                 set_open_alert(true)
  //             }, 0);
  //             set_color('#EAC117')
  //             set_status(json_language["Lỗi"][language])
  //             set_message("Error! " + err)
  //         }
  //     }, (err) => {
  //         // console.log('vô')
  //         setTimeout(() => {
  //             set_open_alert(true)
  //         }, 0);
  //         set_color('#EAC117')
  //         set_status(json_language["Lỗi"][language])
  //         set_message("Error! " + err)
  //     });

  // }
  const [loading, setLoading] = useState(false);
  const [messgae_Loading_animation, set_messgae_Loading_animation] = useState(
    language != 'English' ? 'Đang xử lý' : 'Processing',
  );
  return (
    <Modal
      transparent={false}
      visible={openHomePrinter}
      onRequestClose={() => {
        set_openHomePrinter(false);
      }}>
      <StatusBar backgroundColor="rgba(0, 0, 0, 1)" />
      <AlertTwoButtom
        open_alert={open_alert}
        set_open_alert={set_open_alert}
        type={'thongbao'}
        language={language}
        color={color}
        status={status}
        message={message}
      />

      <Loading_animation
        onLoading={loading}
        onAction={messgae_Loading_animation}
      />

      <SafeAreaView style={{backgroundColor: 'white'}}>
        <HeaderClose
          title={'Printer'}
          func={() => {
            set_openHomePrinter(false);
          }}
        />
        {/* <View>
                    <ViewShot ref={viewShotRef} options={{ format: 'jpg', quality: 1, width: 800, height: 300 }}>
                        <View style={{ alignItems: 'center', paddingTop: 20 }}>
                            <QRCode
                                value="LPA$jsadjad$sjadhsjklahdkl" // Nội dung của mã QR
                                size={300}
                            />
                        </View>
                    </ViewShot>
                    <TouchableOpacity onPress={captureView}>
                        <Text>Capture View to Base64</Text>
                    </TouchableOpacity>
                </View> */}
        {/* <Text style={{ color: 'black' }}>
                    {tempViewShot}
                </Text> */}
        {tempViewShot && (
          <Image
            source={{uri: `data:image/jpeg;base64,${tempViewShot}`}} // Thay đổi "jpeg" và "base64Data" tùy theo loại ảnh và dữ liệu base64 của bạn
            style={{width: 300, height: 300}} // Điều chỉnh kích thước ảnh theo ý muốn
          />
        )}
        {temp_url_base64 && (
          <Image
            source={{uri: `data:image/jpeg;base64,${temp_url_base64}`}} // Thay đổi "jpeg" và "base64Data" tùy theo loại ảnh và dữ liệu base64 của bạn
            style={{width: 200, height: 200}} // Điều chỉnh kích thước ảnh theo ý muốn
          />
        )}
        {/* <View style={{}}>
                    <View>
                        <Text style={{ padding: 10, color: 'black', fontSize: fontSizeMedium, fontWeight: 500 }}>
                            {language == "English" ? "Select printer type:" : "Chọn loại máy in"}
                        </Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                        <TouchableOpacity style={[{ borderColor: printer.connected.type == "blue" ? "#64AF53" : '#DDDFE1', borderBottomWidth: 1, marginRight: 0 }]}
                            onPress={() => setPrinter({ ...printer, connected: { ...printer.connected, type: 'blue' } })}
                        >
                            <Text style={{ padding: 10, color: printer.connected.type == "blue" ? "#64AF53" : 'black', fontSize: fontSizeMedium, fontWeight: 400, paddingBottom: 5 }}>
                                Bluetooth
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[{ borderColor: printer.connected.type == "net" ? "#64AF53" : '#DDDFE1', borderBottomWidth: 1, }]}
                            onPress={() => setPrinter({ ...printer, connected: { ...printer.connected, type: 'net' } })}
                        >
                            <Text style={{ padding: 10, color: printer.connected.type == "net" ? "#64AF53" : 'black', fontSize: fontSizeMedium, fontWeight: 400, paddingBottom: 5 }}>
                                Network
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ marginTop: 10 }}>
                        <Text style={{ padding: 10, color: 'black', fontSize: fontSizeMedium, fontWeight: 500 }}>
                            {language == "English" ? "Connected:" : "Trạng thái kết nối"}
                        </Text>
                        <Text style={{ padding: 10, color: 'black', fontSize: fontSizeMedium, fontWeight: 500 }}>
                            {printer}
                        </Text>
                    </View>
                </View> */}

        <View style={{maxHeight: Dimensions.get('window').height - 240}}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: 500,
              padding: 10,
              textAlign: 'center',
              color: 'black',
            }}>
            {language == 'English'
              ? 'List device bluetooth'
              : 'Danh sách thiết bị bluetooth'}
          </Text>
          {(!printer ||
            !printer.listDevice ||
            printer.listDevice.length == 0) && (
            <Text
              style={{
                fontSize: 18,
                padding: 10,
                textAlign: 'center',
                color: 'black',
              }}>
              {language == 'English' ? 'Empty' : 'Danh sách rỗng'}
            </Text>
          )}
          <FlatList
            keyboardShouldPersistTaps="handled"
            data={!printer.listDevice ? [] : printer.listDevice}
            scrollEnabled={true}
            renderItem={renderListItem}
          />
        </View>
        <View>
          <Button
            fontSize={18}
            style={{marginTop: 20, marginHorizontal: 10, borderRadius: 5}}
            title={
              language == 'English' ? 'Scan device' : 'Quét thiết bị xung quanh'
            }
            backgroundColor={'#4EBDEC'}
            color={'black'}
            func={async () => {
              await ScanDevice();
            }}
          />
          {/* <Button style={{ marginTop: 10, marginHorizontal: 10, borderRadius: 5 }} title={language == "English" ? "Connect" : "Kết nối"} backgroundColor={"yellow"} color={"black"} /> */}
          {/* <Button style={{ marginTop: 10, marginHorizontal: 10, borderRadius: 5 }} title={language == "English" ? "Print" : "In"} backgroundColor={"blue"} color={"white"}
                        func={async () => await print_("9F985105-08C0-4D4F-4050-989A41B0D1CB")} /> */}
        </View>
      </SafeAreaView>
    </Modal>
  );
}
export default memo(HomePrinter);
