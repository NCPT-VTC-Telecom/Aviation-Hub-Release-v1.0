import React, {memo, useState, useEffect, useContext} from 'react';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import styles from '../../styles';
const img = '../../img/';
import SimpleLineIcons from '../../../node_modules/react-native-vector-icons/SimpleLineIcons';
// SimpleLineIcons.loadFont();
import CaiDat from '../component_setting/CaiDat';
import SmartSimHome from '../smart_sim/SmartSimHome';
import HomeJoytel from '../joytel/Home';
import {setDataLocal} from '../../menu_function';
const font_size = Dimensions.get('window').height > 900 ? 15 : 13.5;
import {MyContext} from '../../index';
import ButtonMenuIcon from '../ShortComponent/ButtonMenuIcon';

function OrderFunction({
  set_list_goicuoc,
  wifi_vouchers,
  upgrade_tickets_vouchers,
  user,
  total_sim_sold_today,
  set_total_sim_sold_today,
  listDataCustomerSync,
  setListDataCustomerSync,
  setListDataCustomerTotal,
  listDataCustomerTotal,
  setListDataCustomerUnsync,
  isConnected,
  listPhoneSim,
  set_listPhoneSim,
  listDataCustomerUnsync,
  list_goicuoc,
  navigation,
  set_language,
  language,
  json_language,
  setIsLogin,
  setDataLocal,
  cccd_info,
  set_cccd_info,
  getDataLocal,
  printer,
  setPrinter,
  token,
  checkSync,
  canClick,
  setListEsim,
  listEsim,
  listCusBoughtEsim,
  setListCusBoughtEsim,
  total_esim_sold_today,
  set_total_esim_sold_today,
}) {
  //console.log('home')
  const [open_setting, set_open_setting] = useState(false);
  const [smart_sim_home, set_smart_sim_home] = useState(false);
  const [open_joytel, set_open_joytel] = useState(false);
  const {status_module_smart_sim_} = useContext(MyContext);
  return (
    <View style={{marginBottom: Platform.OS == 'ios' ? 80 : 30}}>
      <Text
        style={{
          marginHorizontal: 10,
          fontWeight: 600,
          marginTop: 30,
          marginBottom: 5,
          backgroundColor: '#AAD69F',
          fontSize: 20,
          borderRadius: 10,
          padding: 10,
          color: '#00558F',
          paddingLeft: 20,
        }}>
        {json_language['Chức năng khác'][language]}
      </Text>
      <View
        style={{
          flexDirection: 'row',
          width: Dimensions.get('window').width,
          flexWrap: 'wrap',
        }}>
        <ButtonMenuIcon
          nameIcon={'SimpleLineIcons'}
          title={json_language['Cài đặt'][language]}
          func={async () => {
            if (!canClick) {
              return;
            }
            set_open_setting(true);
          }}
        />
        {status_module_smart_sim_ && (
          <View style={styles.button_menu}>
            {/* B0E2FF */}
            <TouchableOpacity
              style={[
                styles.button_menu_tou,
                styles.shadow,
                {backgroundColor: '#00558F'},
              ]}
              onPress={async () => {
                if (!canClick) {
                  return;
                }
                set_smart_sim_home(true);
                // onSetFormMatruycap(true);
              }}>
              <View
                style={{
                  height:
                    (Dimensions.get('window').width - 80) / 3 >= 200
                      ? 100 * 0.65
                      : ((Dimensions.get('window').width - 80) * 0.65) / 3,
                  width:
                    (Dimensions.get('window').width - 80) / 3 >= 200
                      ? 100 * 0.65
                      : ((Dimensions.get('window').width - 80) * 0.65) / 3,
                  backgroundColor: 'white',
                  borderRadius: 50,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Image
                  source={require('../../assets/logos/smart-sim.jpg')}
                  style={[
                    styles.img_in_tou_menu,
                    {height: '90%', width: '90%'},
                  ]}
                />
              </View>
            </TouchableOpacity>
            <Text
              style={[
                styles.button_menu_text,
                {color: 'black', marginBottom: 10},
              ]}>
              {json_language['Quản lý sim'][language]}{' '}
            </Text>
          </View>
        )}
        {/* <View style={styles.button_menu}>
                    <TouchableOpacity style={[styles.button_menu_tou, styles.shadow, { backgroundColor: '#00558F' }]}
                        onPress={async () => {
                            set_open_joytel(true)
                            // onSetFormMatruycap(true);
                        }}
                    >
                        <View style={{
                            height: (Dimensions.get('window').width - 80) / 3 >= 200 ? 100 * 0.65 : (Dimensions.get('window').width - 80) * 0.65 / 3, width: (Dimensions.get('window').width - 80) / 3 >= 200 ? 100 * 0.65 : (Dimensions.get('window').width - 80) * 0.65 / 3,
                            backgroundColor: 'white', borderRadius: 50, justifyContent: 'center', alignItems: 'center'
                        }}>
                            <Image source={require('../../assets/logos/smart-sim.jpg')} style={[styles.img_in_tou_menu, { height: '90%', width: '90%' }]} />
                        </View>
                    </TouchableOpacity>
                    <Text style={[styles.button_menu_text, { color: 'black', marginBottom: 10 }]}>Esim</Text>
                </View> */}
      </View>

      {open_setting && (
        <CaiDat
          upgrade_tickets_vouchers={upgrade_tickets_vouchers}
          wifi_vouchers={wifi_vouchers}
          checkSync={checkSync}
          user={user}
          open_setting={open_setting}
          set_open_setting={set_open_setting}
          set_language={set_language}
          json_language={json_language}
          language={language}
          setIsLogin={setIsLogin}
          setDataLocal={setDataLocal}
          cccd_info={cccd_info}
          set_cccd_info={set_cccd_info}
          getDataLocal={getDataLocal}
          printer={printer}
          setPrinter={setPrinter}
          isConnected={isConnected}
          token={token}
        />
      )}

      {/* <SmartSimHome set_list_goicuoc={set_list_goicuoc} setDataLocal={setDataLocal}
                total_sim_sold_today={total_sim_sold_today} set_total_sim_sold_today={set_total_sim_sold_today}
                listPhoneSim={listPhoneSim} set_listPhoneSim={set_listPhoneSim} smart_sim_home={smart_sim_home} set_smart_sim_home={set_smart_sim_home} json_language={json_language} language={language}
                cccd_info={cccd_info} set_cccd_info={set_cccd_info} getDataLocal={getDataLocal} list_goicuoc={list_goicuoc}
                listDataCustomerUnsync={listDataCustomerUnsync} isConnected={isConnected}
                setListDataCustomerUnsync={setListDataCustomerUnsync} setListDataCustomerTotal={setListDataCustomerTotal}
                listDataCustomerTotal={listDataCustomerTotal} setListDataCustomerSync={setListDataCustomerSync} listDataCustomerSync={listDataCustomerSync} /> */}

      {/* <HomeJoytel set_list_goicuoc={set_list_goicuoc} setDataLocal={setDataLocal}
                total_esim_sold_today={total_esim_sold_today} set_total_esim_sold_today={set_total_esim_sold_today}
                listPhoneSim={listPhoneSim} set_listPhoneSim={set_listPhoneSim} open_joytel={open_joytel} set_open_joytel={set_open_joytel} json_language={json_language} language={language}
                cccd_info={cccd_info} set_cccd_info={set_cccd_info} getDataLocal={getDataLocal} list_goicuoc={list_goicuoc}
                listDataCustomerUnsync={listDataCustomerUnsync} isConnected={isConnected}
                setListDataCustomerUnsync={setListDataCustomerUnsync} setListDataCustomerTotal={setListDataCustomerTotal}
                listDataCustomerTotal={listDataCustomerTotal} setListDataCustomerSync={setListDataCustomerSync} listDataCustomerSync={listDataCustomerSync}
                listEsim={listEsim} setListEsim={setListEsim} setListCusBoughtEsim={setListCusBoughtEsim} listCusBoughtEsim={listCusBoughtEsim}
            /> */}
    </View>
  );
}
export default memo(OrderFunction);
