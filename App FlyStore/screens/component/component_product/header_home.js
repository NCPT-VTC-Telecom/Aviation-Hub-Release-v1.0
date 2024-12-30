import React, {memo, useState, useEffect} from 'react';
import {
  Text,
  View,
  Image,
  Dimensions,
  ImageBackground,
  Pressable,
  Animated,
  Easing,
  Button,
} from 'react-native';
import styles from '../../styles';
const img = '../../img';
import json_language from '../../json/language.json';
import Fontisto from 'react-native-vector-icons/Fontisto';
// Fontisto.loadFont();
function New_in({
  fullname,
  set_openXemTTChangBay,
  language,
  font_size,
  openXemTTChangBay,
  screenHeight,
  screenWidth,
  canClick,
}) {
  // console.log(screenHeight, screenWidth)
  const [translateY] = useState(new Animated.Value(0));

  const moveDownAndReset = () => {
    Animated.sequence([
      Animated.timing(translateY, {
        toValue: 20, //xuống 100 pixel
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: false,
      }),
      Animated.timing(translateY, {
        toValue: 0, // Quay lại
        duration: 0, // thời gian trễ
        useNativeDriver: false,
      }),
    ]).start(() => {
      setTimeout(moveDownAndReset, 20);
    });
  };
  const splitName = () => {};

  // useEffect(() => {
  //     // Khởi đầu hoạt động sau khi màn hình được tạo
  //     setTimeout(moveDownAndReset, 20);
  // }, []);

  return (
    <ImageBackground
      source={require(img + '/background_flywifi.jpg')}
      resizeMode="cover"
      style={
        screenWidth > screenHeight
          ? {
              width: screenWidth,
              height:
                screenHeight > 480 && screenWidth > 480
                  ? 0.39 * screenWidth
                  : 0.496 * screenWidth,
            }
          : {
              width: screenWidth,
              height:
                screenHeight > 480 && screenWidth > 480
                  ? 0.46 * screenWidth
                  : 0.72 * screenWidth,
            }
      }>
      <View style={styles.image}>
        {/* responsive cho logo cũng theo chiều ngang và dọc, điện thoại và tablet */}
        <Image
          source={require(img + '/logo2.png')}
          style={{
            height:
              screenWidth < screenHeight
                ? 0.17 * screenWidth
                : 0.1823 * screenWidth,
            width: '90%',
            marginHorizontal: '5%',
            marginBottom: 10,
            marginTop:
              screenWidth > screenHeight
                ? 10
                : screenHeight > 480 && screenWidth > 480
                ? 20
                : 20,
          }}
        />
      </View>
      <Text
        style={{textAlign: 'center', color: '#ffffff', fontSize: font_size}}>
        {json_language['Xin chào'][language]},
      </Text>
      {fullname ? (
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <Text
            style={{
              width: '80%',
              textAlign: 'center',
              color: '#ffffff',
              fontSize: fullname.length > 14 ? 25 : 32,
              marginTop: 5,
            }}>
            {fullname.toUpperCase()}
          </Text>
        </View>
      ) : (
        <Text />
      )}
      <Pressable
        style={[styles.buttonOpen]}
        onPress={() => {
          if (canClick) {
            set_openXemTTChangBay(true);
          }
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 10,
          }}>
          <Text
            style={{
              textAlign: 'center',
              color: '#6AFB92',
              fontSize: font_size,
            }}>
            {json_language['Xem thông tin chặng bay'][language]}{' '}
          </Text>
          <Fontisto name="plane" size={15} color="#6AFB92" />
        </View>
        <View style={{alignItems: 'center', justifyContent: 'flex-start'}}>
          <Animated.View style={{transform: [{translateY}]}}>
            {openXemTTChangBay ? (
              <Text />
            ) : (
              <View style={{alignItems: 'center'}}>
                <Image
                  source={require(img + '/down.png')}
                  style={{
                    height: 15,
                    width: 15,
                    tintColor: 'white',
                    marginTop: 10,
                  }}
                />
              </View>
            )}
          </Animated.View>
        </View>
      </Pressable>
    </ImageBackground>
  );
}
export default memo(New_in);
