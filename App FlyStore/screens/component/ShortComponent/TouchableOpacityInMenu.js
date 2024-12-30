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
export default function TouchableOpacityInMenu({props}) {
  return (
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
  );
}
cons;
