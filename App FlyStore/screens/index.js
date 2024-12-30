import * as React from 'react';
import {
  useCallback,
  useEffect,
  useState,
  memo,
  useRoute,
  createContext,
} from 'react';
import {
  View,
  Text,
  Button,
  Image,
  TouchableOpacity,
  Alert,
  ToastAndroid,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
// import { createNativeTabNavigator } from '@react-navigation/native-Tab';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
// import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import Home from './menu';
import Notification from './notification';
import styles from './styles';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import json_language from './json/language.json';
import {status_module_smart_sim} from '../config';
export const MyContext = createContext(null);
const font_size = Dimensions.get('window').height > 900 ? 18 : 14;
function Sync({navigation}) {
  const handleSync = () => {
    navigation.navigate('Home', {action: 'sync'});
  };
  setTimeout(() => {
    handleSync();
  }, 0);
  useEffect(() => {
    const unsubscribe = navigation.addListener('tabPress', e => {
      setTimeout(() => {
        handleSync();
      }, 0);
    });
    return unsubscribe;
  }, [navigation]);
}
function Screen1({navigation}) {
  return (
    <TouchableOpacity onPress={() => navigation.navigate('Screen2')}>
      <Text>Xin chào màn hình 1</Text>
    </TouchableOpacity>
  );
}
function Screen2({navigation}) {
  return (
    <TouchableOpacity onPress={() => navigation.navigate('Screen1')}>
      <Text>Xin chào màn hình 2</Text>
    </TouchableOpacity>
  );
}
// const Stack = createStackNavigator();
function HomeScreen() {
  return (
    <Stack.Navigator initialRouteName="Sreen1" options={{headerShown: false}}>
      <Stack.Screen
        name="Screen1"
        component={Screen1}
        options={{headerShown: true}}
      />
      <Stack.Screen
        name="Screen2"
        component={Screen2}
        options={{headerShown: true}}
      />
    </Stack.Navigator>
  );
}
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
function BottomTab() {
  const [language, set_language] = useState('Vietnamese');
  AsyncStorage.getItem('language')
    .then(async data => {
      const myData = JSON.parse(data);
      //console.log('in')
      if (myData) {
        // console.log(myData)
        await set_language(myData);
      } else {
        await set_language('Vietnamese');
      }
    })
    .catch(err => console.log(err));
  const [status_module_smart_sim_, set_status_module_smart_sim_] = useState(
    status_module_smart_sim,
  );
  return (
    <MyContext.Provider
      value={{language, set_language, status_module_smart_sim_}}>
      <Tab.Navigator
        initialRouteName="Home"
        screenOptions={{
          tabBarStyle: [
            styles.tabBarStyle,
            {
              backgroundColor: '#ffffff',
              height:
                Dimensions.get('window').height > 480 &&
                Dimensions.get('window').width > 480
                  ? 65
                  : Platform.OS == 'ios'
                  ? 75
                  : 55,
            },
          ],
          tabBarShowLabel: false,
        }}>
        <Tab.Screen
          options={({route}) => ({
            tabBarVisible: route.state && route.state.index === 0, // Ẩn thanh bottom tabs khi chuyển đến Screen2
            headerShown: false,
            tabBarIcon: ({focused}) => {
              return (
                <View
                  style={[
                    styles.button_default,
                    {
                      textAlign: 'center',
                      width: Dimensions.get('window').width / 3,
                      borderColor: '#00558F',
                      borderBottomWidth: focused ? 2 : 0,
                    },
                    Platform.OS == 'ios' && {height: 70},
                  ]}>
                  {/* <Image source={require('./img/home1.png')} style={{ height: 25, width: 25, tintColor: focused ? '#ffffff' : '#696969' }} /> */}
                  <Entypo
                    name="home"
                    size={23}
                    style={{color: focused ? '#00558F' : '#696969'}}
                  />
                  <Text
                    style={{
                      fontSize: font_size,
                      color: focused ? '#00558F' : '#696969',
                    }}>
                    {json_language['Trang chủ'][language]}
                  </Text>
                </View>
              );
            },
          })}
          name="Home"
          component={Home}
        />
        <Tab.Screen
          tabBarActiveTintColor={'blue'}
          options={({route}) => ({
            tabBarVisible: false, // Ẩn thanh bottom tabs khi chuyển đến Screen2
            headerShown: false,
            tabBarIcon: ({focused}) => {
              return (
                <View
                  style={[
                    styles.button_default,
                    {
                      textAlign: 'center',
                      width: Dimensions.get('window').width / 3,
                      borderColor: '#00558F',
                      borderBottomWidth: focused ? 2 : 0,
                    },
                    Platform.OS == 'ios' && {height: 70},
                  ]}>
                  {/* <Image source={require('./img/sync.jpg')} style={{ height: 25, width: 25, tintColor: focused ? '#ffffff' : '#696969' }} /> */}
                  <AntDesign
                    name="sync"
                    size={23}
                    style={{color: focused ? '#00558F' : '#696969'}}
                  />
                  <Text
                    style={{
                      fontSize: font_size,
                      color: focused ? '#00558F' : '#696969',
                    }}>
                    {' '}
                    {json_language['Đồng bộ'][language]}
                  </Text>
                </View>
              );
            },
          })}
          name="Sync"
          component={Sync}
        />
        <Tab.Screen
          options={({route}) => ({
            tabBarVisible: route.state && route.state.index === 0, // Ẩn thanh bottom tabs khi chuyển đến Screen2
            headerShown: false,
            tabBarIcon: ({focused}) => {
              return (
                <View
                  style={[
                    styles.button_default,
                    {
                      textAlign: 'center',
                      width: Dimensions.get('window').width / 3,
                      borderColor: '#00558F',
                      borderBottomWidth: focused ? 2 : 0,
                    },
                    Platform.OS == 'ios' && {height: 70},
                  ]}>
                  {/* <Image source={require('./img/bell.png')} style={{ height: 25, width: 25, tintColor: focused ? '#ffffff' : '#696969' }} /> */}
                  <Ionicons
                    name="md-notifications-sharp"
                    size={23}
                    style={{color: focused ? '#00558F' : '#696969'}}
                  />

                  <Text
                    style={{
                      fontSize: font_size,
                      color: focused ? '#00558F' : '#696969',
                    }}>
                    {' '}
                    {json_language['Thông báo'][language]}
                  </Text>
                </View>
              );
            },
          })}
          name="Notification"
          component={Notification}
        />
        {/* thêm nút cài đặt trên navigation */}
        {/* <Tab.Screen options={{
                    headerShown: false,
                    tabBarIcon: ({ focused }) => {
                        return (
                            <View style={[styles.button_default, { textAlign: 'center', borderBottomWidth: focused ? 1 : 0, borderBottomColor: 'white' }]}>
                                <Feather name="settings" size={23} style={{ color: focused ? '#00558F' : '#696969' }} />

                                <Text style={{ fontSize: 13, color: focused ? '#00558F' : '#696969' }}> {json_language['Cài đặt'][language]}</Text>
                            </View>)
                    }
                }} name="Setting" component={Index_setting} /> */}
      </Tab.Navigator>
    </MyContext.Provider>
  );
}
function App() {
  return (
    <NavigationContainer>
      <BottomTab />
    </NavigationContainer>
  );
}

export default App;
