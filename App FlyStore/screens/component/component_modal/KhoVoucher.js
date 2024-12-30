import React, {memo, useState} from 'react';
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
} from 'react-native';
import styles from '../../styles';
import HeaderClose from '../ShortComponent/HeaderClose';
import Flastlist_sanpham_kho from '../component_product/flastlist_sanpham_kho';
import AntDesign from 'react-native-vector-icons/AntDesign';
// AntDesign.loadFont();
const type_responsive =
  Dimensions.get('window').width > 600 && Dimensions.get('window').height > 600
    ? 'ipad'
    : 'smartphone';
const height = type_responsive == 'ipad' ? 27 : 22;
const font_size_normal = type_responsive == 'ipad' ? 17 : 15;
const font_size_normal_small = type_responsive == 'ipad' ? 14 : 12;
const img = '../../img/';
function modalKhoVoucher({
  esim_voucher_types,
  esim_vouchers,
  language,
  json_language,
  formVoucherstore,
  setFormVoucherstore,
  wifi_voucher_types,
  wifi_vouchers,
  upgrade_tickets_voucher_types,
  upgrade_tickets_vouchers,
}) {
  // console.log('kho')
  // console.log(esim_voucher_types)
  const [hide, setHide] = useState({
    hide1: true,
    hide2: true,
    hide3: true,
  });
  return (
    <SafeAreaView>
      <Modal
        // animationType="slide-up"
        transparent={false}
        visible={formVoucherstore}
        onRequestClose={() => {
          setFormVoucherstore(false);
        }}>
        <StatusBar backgroundColor="rgba(0, 0, 0, 1)" />
        <SafeAreaView style={{flex: 1}}>
          <ScrollView>
            <View
              style={{
                fontSize: 14,
                minHeight: Dimensions.get('window').height,
                backgroundColor: '#ffffff',
              }}>
              <HeaderClose
                title={json_language.Kho[language]}
                func={() => setFormVoucherstore(false)}
              />
              <View>
                <TouchableOpacity
                  onPress={() => setHide({...hide, hide1: !hide.hide1})}
                  style={[
                    styles.Text2_row,
                    {padding: 8, backgroundColor: '#DDDFE1'},
                  ]}>
                  <Text
                    style={{
                      width: '80%',
                      paddingLeft: 10,
                      color: 'black',
                      fontSize: font_size_normal,
                    }}>
                    {json_language['Mã truy cập fly wifi'][language]}
                  </Text>
                </TouchableOpacity>

                {hide.hide1 && (
                  <Flastlist_sanpham_kho
                    vouchers={wifi_vouchers}
                    voucher_types={wifi_voucher_types}
                    language={language}
                  />
                )}

                <TouchableOpacity
                  onPress={() => setHide({...hide, hide2: !hide.hide2})}
                  style={[
                    styles.Text2_row,
                    {padding: 8, backgroundColor: '#DDDFE1'},
                  ]}>
                  <Text
                    style={{
                      width: '80%',
                      paddingLeft: 10,
                      color: 'black',
                      fontSize: font_size_normal,
                    }}>
                    {json_language['Mã nâng hạng'][language]}
                  </Text>
                </TouchableOpacity>
                {hide.hide2 && (
                  <Flastlist_sanpham_kho
                    vouchers={upgrade_tickets_vouchers}
                    voucher_types={upgrade_tickets_voucher_types}
                    language={language}
                  />
                )}
                <TouchableOpacity
                  onPress={() => setHide({...hide, hide3: !hide.hide3})}
                  style={[
                    styles.Text2_row,
                    {padding: 8, backgroundColor: '#DDDFE1'},
                  ]}>
                  <Text
                    style={{
                      width: '80%',
                      paddingLeft: 10,
                      color: 'black',
                      fontSize: font_size_normal,
                    }}>
                    Sim data
                  </Text>
                </TouchableOpacity>
                {hide.hide3 && (
                  <Flastlist_sanpham_kho
                    vouchers={esim_vouchers}
                    voucher_types={esim_voucher_types}
                    language={language}
                  />
                )}
                {/* {esim_vouchers && esim_vouchers.length != 0 && (<TouchableOpacity style={[styles.Text2_row, { padding: 10, color: 'black' }]}>
                                    <Text style={{ width: '90%', paddingLeft: 10, color: 'black', fontSize: font_size_normal }}>Sim data</Text>
                                    <TouchableOpacity style={{ borderRadius: 50, borderColor: '#E55451', height: height, width: height, borderWidth: 1, alignItems: 'center', backgroundColor: !esim_vouchers || esim_vouchers.length == 0 ? 'red' : '#4EBDEC', borderColor: !esim_vouchers || esim_vouchers.length == 0 ? '#DDDFE1' : "#DDDFE1", justifyContent: 'center' }}>
                                        <Text style={{ color: 'white', fontSize: font_size_normal_small, textAlign: 'center', padding: 0, fontWeight: 500 }}>{(esim_vouchers ? esim_vouchers.length : 0)}</Text>
                                    </TouchableOpacity>
                                </TouchableOpacity>)}
                                {!esim_vouchers || esim_vouchers.length == 0 && (<TouchableOpacity style={[styles.Text2_row, { padding: 10, color: 'black' }]}>
                                    <Text style={{ width: '90%', paddingLeft: 10, color: 'black', fontSize: font_size_normal }}>{language == "Vietnamese" ? "Kho rỗng" : "The store is empty"}</Text>
                                </TouchableOpacity>)} */}
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}
export default memo(modalKhoVoucher);
