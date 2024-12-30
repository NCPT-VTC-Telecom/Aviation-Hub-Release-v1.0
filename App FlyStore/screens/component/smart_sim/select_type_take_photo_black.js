import React, {useState} from 'react';
import {
  Text,
  Alert,
  StatusBar,
  Dimensions,
  SafeAreaView,
  useColorScheme,
} from 'react-native';
import RNBounceable from '@freakycoder/react-native-bounceable';
import PickerModal from './lib/PickerModal';
// import PickerModal from "@freakycoder/react-native-picker-modal";
import useStateWithCallback from '@freakycoder/react-use-state-with-callback';

const {width: ScreenWidth} = Dimensions.get('screen');

const mockData = ['Select from album', 'Take a photo'];
const mockTitle =
  'You can either take a picture or select one from your album.';

const dayMockData = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];
const mockDayTitle = 'Select a day from the picker';

const App = ({
  photo,
  set_photo,
  screenHeight,
  screenWidth,
  language,
  open_select_type,
  set_open_select_type,
  set_select_type_take_photo,
  type,
  takePhoto,
  choosePhoto,
}) => {
  const isDarkMode = useColorScheme() === 'white';
  const [isVisible, setVisible] = useState(false);

  const OpenPickerButton = () => (
    <RNBounceable
      style={{
        height: 50,
        width: ScreenWidth * 0.9,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#059',
      }}
      onPress={() => {
        setVisible(true);
      }}>
      <Text style={{color: '#fff'}}>Image Picker Modal</Text>
    </RNBounceable>
  );

  const OpenDayPickerButton = () => (
    <RNBounceable
      style={{
        height: 50,
        width: ScreenWidth * 0.9,
        borderRadius: 16,
        marginTop: 16,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#26b463',
      }}
      onPress={() => {
        setDayModalVisible(true);
      }}>
      <Text style={{color: '#fff'}}>Day Picker Modal</Text>
    </RNBounceable>
  );

  return (
    <SafeAreaView
      style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <StatusBar barStyle={!isDarkMode ? 'light-content' : 'dark-content'} />
      <PickerModal
        title={mockTitle}
        isVisible={open_select_type}
        data={mockData}
        onPress={(selectedItem, index) => {
          if (index == 0) {
            if (type === 'front_cccd') {
              choosePhoto('front', set_photo);
            } else if (type === 'back_cccd') {
              choosePhoto('back', set_photo);
            } else {
              choosePhoto('selfies', set_photo);
            }
          } else {
            if (type === 'front_cccd') {
              takePhoto('front', set_photo);
            } else if (type === 'back_cccd') {
              takePhoto('back', set_photo);
            } else {
              takePhoto('selfies', set_photo);
            }
          }
        }}
        onCancelPress={() => {
          set_open_select_type(false);
        }}
        onBackdropPress={() => {
          set_open_select_type(false);
        }}
      />
    </SafeAreaView>
  );
};

export default App;
