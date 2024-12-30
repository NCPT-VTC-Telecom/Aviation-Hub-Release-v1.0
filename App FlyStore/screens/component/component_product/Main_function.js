import React, {memo, useState, useEffect} from 'react';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  Alert,
  Animated,
} from 'react-native';
import styles from '../../styles';
const img = '../../img/';
import ButtonMenu from '../ShortComponent/ButtonMenu';
import AlertTwoButtom from './AlertTwoButtom';
import SimpleLineIcons from '../../../node_modules/react-native-vector-icons/SimpleLineIcons';
import FontAwesome5 from '../../../node_modules/react-native-vector-icons/FontAwesome5';
import Loading_animation from '../component_modal/Loading_animation';
import ButtonMenuIcon from '../ShortComponent/ButtonMenuIcon';
function MenuHome({
  language,
  json_language,
  onOpenBanMaTCWifi,
  onSetFormMatruycap,
  onOpenNangHang,
  onSetFormNanghang,
  onSetFormVoucherstore,
  onOpenDaBan,
  onSetFormFlightorder,
  onSync,
  wifi_vouchers,
  upgrade_tickets_vouchers,
  setOpenEsim,
  eventOpenEsim,
  esim_vouchers,
  checkSync,
  setSoLuong,
  canClick,
}) {
  // console.log(checkSync)
  const [open_alert, set_open_alert] = useState(false);
  const [flipAnim] = useState(new Animated.Value(0));
  function splitQRCode(code) {
    const splitCode = code.split('$');
    console.log(splitCode);
  }
  const openWifiVoucherFunc = async () => {
    if (!canClick) {
      return;
    }
    await onOpenBanMaTCWifi();
    wifi_vouchers && wifi_vouchers.length > 0 ? onSetFormMatruycap(true) : {};
    setSoLuong('1');
  };
  const openUpgradeTicketsFunc = async () => {
    if (!canClick) {
      return;
    }
    await onOpenNangHang();
    upgrade_tickets_vouchers && upgrade_tickets_vouchers.length > 0
      ? onSetFormNanghang(true)
      : {};
    setSoLuong('1');
  };
  const openSimDataFunc = async () => {
    if (!canClick) {
      return;
    }
    await eventOpenEsim();
    // console.log(esim_vouchers)
    esim_vouchers && esim_vouchers.length > 0 ? setOpenEsim(true) : {};
    setSoLuong('1');
  };
  const openSoldFunc = () => {
    if (!canClick) {
      return;
    }
    onSetFormFlightorder(true);
    onOpenDaBan();
  };
  const openSyncFunc = () => {
    if (!canClick) {
      return;
    }
    Platform.OS != 'ios'
      ? set_open_alert(true)
      : Alert.alert(
          json_language['Xác nhận thông tin hành trình'][language],
          json_language[
            'Vui lòng [bỏ qua] thông báo này nếu bạn đã cập nhật hành trình chuyến bay để tiếp tục đồng bộ. \nXin cảm ơn!'
          ][language],
          [
            {
              text: json_language['Hủy'][language],
              style: 'cancel',
            },
            {
              text: json_language['Đồng bộ'][language],
              onPress: () => onSync(),
            },
          ],
          {
            cancelable: true,
            onDismiss: () => {
              // Xử lý khi thông báo bị đóng
            },
            // Các thuộc tính style dưới đây sẽ giúp bạn tùy chỉnh giao diện của thẻ alert
            titleStyle: {fontWeight: 'bold', fontSize: 18},
            messageStyle: {fontSize: 16},
            containerStyle: {backgroundColor: 'white'},
            // Nếu bạn muốn tùy chỉnh từng nút trong alert, bạn có thể sử dụng các thuộc tính style cho từng button
            buttonTextStyle: {color: 'red'},
            buttonStyle: {backgroundColor: 'transparent'},
          },
        );
  };
  const openVoucherStoreFunc = () => {
    if (!canClick) {
      return;
    }
    onSetFormVoucherstore(true);
  };
  useEffect(() => {
    const interval = setInterval(() => {
      Animated.sequence([
        Animated.timing(flipAnim, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(flipAnim, {
          toValue: 0,
          duration: 900,
          useNativeDriver: true,
        }),
      ]).start();
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  return (
    <View>
      <AlertTwoButtom
        open_statusBar={true}
        open_alert={open_alert}
        set_open_alert={set_open_alert}
        type={'thuchien'}
        language={language}
        color="#1589FF"
        status={json_language['Xác nhận thông tin hành trình'][language]}
        message={
          json_language[
            'Vui lòng [bỏ qua] thông báo này nếu bạn đã cập nhật hành trình chuyến bay để tiếp tục đồng bộ. \nXin cảm ơn!'
          ][language]
        }
        button_message_close={json_language['Hủy'][language]}
        button_message_func={json_language['Tiếp tục'][language]}
        func={onSync}
      />
      <Text
        style={{
          marginHorizontal: 10,
          fontWeight: 600,
          marginTop: 20,
          marginBottom: 5,
          backgroundColor: '#AAD69F',
          fontSize: 20,
          borderRadius: 10,
          padding: 10,
          color: '#00558F',
          paddingLeft: 20,
        }}>
        {json_language['Chức năng chính'][language]}
      </Text>
      <View
        style={{
          flexDirection: 'row',
          width: Dimensions.get('window').width,
          flexWrap: 'wrap',
        }}>
        <ButtonMenu
          sizeImage={'90%'}
          title={json_language['Mã truy cập'][language]}
          linkImage={require(img + 'icon/wifionboard.png')}
          func={openWifiVoucherFunc}
        />
        <ButtonMenu
          title={json_language['Nâng hạng'][language]}
          linkImage={require(img + 'icon/premium-content.png')}
          func={openUpgradeTicketsFunc}
        />
        <ButtonMenuIcon
          title={'Sim data'}
          func={openSimDataFunc}
          nameIcon={'FontAwesome5'}
        />
        <ButtonMenu
          title={json_language['Đã bán'][language]}
          linkImage={require(img + 'icon/sold-out.png')}
          func={openSoldFunc}
        />
        {checkSync == false ? (
          <Animated.View
            style={[
              styles.button_menu,
              {
                transform: [
                  {
                    rotateY: flipAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0deg', '360deg'],
                    }),
                  },
                ],
              },
            ]}>
            <TouchableOpacity
              style={styles.button_menu_tou}
              onPress={openSyncFunc}>
              <Image
                source={require(img + 'icon/sync.png')}
                style={styles.img_in_tou_menu}
              />
            </TouchableOpacity>
            <Text style={styles.button_menu_text}>
              {' '}
              {json_language['Đồng bộ'][language]}{' '}
            </Text>
          </Animated.View>
        ) : (
          <ButtonMenu
            title={json_language['Đồng bộ'][language]}
            linkImage={require(img + 'icon/sync.png')}
            func={openSyncFunc}
          />
        )}
        <ButtonMenu
          title={json_language['Kho voucher'][language]}
          linkImage={require(img + 'icon/gift-card.png')}
          func={openVoucherStoreFunc}
        />
      </View>
    </View>
  );
}

export default memo(MenuHome);
