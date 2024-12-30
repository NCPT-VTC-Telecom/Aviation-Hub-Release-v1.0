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
import AlertTwoButtom from './AlertTwoButtom';
import Loading_animation from '../component_modal/Loading_animation';

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
}) {
  const [open_alert, set_open_alert] = useState(false);
  const [flipAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    const interval = setInterval(() => {
      Animated.sequence([
        Animated.timing(flipAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(flipAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    }, 5000);

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
        <Animated.View
          style={[
            styles.button_menu,
            {
              transform: [
                {
                  rotateY: flipAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '180deg'],
                  }),
                },
              ],
            },
          ]}>
          <TouchableOpacity
            style={[styles.button_menu_tou, styles.shadow]}
            onPress={async () => {
              await onOpenBanMaTCWifi();
              upgrade_tickets_vouchers && upgrade_tickets_vouchers.length > 0
                ? onSetFormMatruycap(true)
                : {};
            }}>
            <Image
              source={require(img + 'icon/wifionboard.png')}
              style={[styles.img_in_tou_menu, {height: '90%', width: '90%'}]}
            />
          </TouchableOpacity>
          <Text style={styles.button_menu_text}>
            {json_language['Mã truy cập'][language]}
          </Text>
        </Animated.View>
        <Animated.View
          style={[
            styles.button_menu,
            {
              transform: [
                {
                  rotateY: flipAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '180deg'],
                  }),
                },
              ],
            },
          ]}>
          <TouchableOpacity
            style={styles.button_menu_tou}
            onPress={async () => {
              await onOpenNangHang();
              wifi_vouchers && wifi_vouchers.length > 0
                ? onSetFormNanghang(true)
                : {};
            }}>
            <Image
              source={require(img + 'icon/premium-content.png')}
              style={styles.img_in_tou_menu}
            />
          </TouchableOpacity>
          <Text style={styles.button_menu_text}>
            {json_language['Nâng hạng'][language]}
          </Text>
        </Animated.View>
        {/* Rest of the code */}
      </View>
    </View>
  );
}

export default memo(MenuHome);
