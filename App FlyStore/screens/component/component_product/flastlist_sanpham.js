import React, {memo, useState, useEffect} from 'react';
import {
  StatusBar,
  ScrollView,
  FlatList,
  Text,
  View,
  TextInput,
  Image,
  TouchableOpacity,
  Dimensions,
  Modal,
  Animated,
  Alert,
} from 'react-native';
import styles from '../../styles';
import Entypo from 'react-native-vector-icons/Entypo';
const img = '../../img';
const image_source = {
  BAMP: require(img + '/product/BAMP.png'),
  BAMCHAT: require(img + '/product/BAMCHAT.png'),
  BAMWEB: require(img + '/product/BAMWEB.png'),
  BAMS: require(img + '/product/BAMS.png'),
  UP1: require(img + '/product/UP1.png'),
  UP2: require(img + '/product/UP2.png'),
  NONE: require(img + '/product/BAMS.png'),
};
const image_source1 = {
  BAMP: img + '/product/BAMP.png',
  BAMCHAT: img + '/product/BAMCHAT.png',
  BAMWEB: img + '/product/BAMWEB.png',
  BAMS: img + '/product/BAMS.png',
  UP1: img + '/product/UP1.png',
  UP2: img + '/product/UP2.png',
  NONE: img + '/product/BAMS.png',
};
function Flastlist_column3({
  onVoucherTypes,
  onCodeSanPham,
  onSetSanPham,
  onGetValueSP,
  onImage_source,
}) {
  const quality_column_flas = parseInt(
    (Dimensions.get('window').width - 10) / 110,
  );
  const [flipAnim, setFlipAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    const interval = setInterval(() => {
      Animated.sequence([
        Animated.timing(flipAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(flipAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <View
      style={{width: '100%', justifyContent: 'center', alignItems: 'center'}}>
      <View style={{width: '100%'}}>
        <FlatList
          keyboardShouldPersistTaps="handled"
          scrollEnabled={true}
          contentContainerStyle={{
            alignSelf: 'flex-start',
          }}
          horizontal={true}
          data={onVoucherTypes}
          keyExtractor={item => item.code}
          renderItem={({item, index}) => {
            let img = '';
            if (item.code in onImage_source) {
              img = image_source[item.code];
            } else {
              img = image_source.NONE;
            }

            return (
              <View key={index} style={{height: '100%'}}>
                <View style={{margin: 5, height: 132}}>
                  <TouchableOpacity
                    style={[styles.button_bam, styles.button_box_shadow]}
                    onPress={() => {
                      onSetSanPham(item.code);
                      onGetValueSP(item.code);
                    }}>
                    <TouchableOpacity
                      style={[
                        onCodeSanPham == item.code
                          ? {borderWidth: 2, borderColor: '#64AF53'}
                          : {},
                        styles.button_bam,
                        styles.button_box_shadow,
                        {
                          transform: [
                            {
                              rotateY:
                                item.code === 'KM_BAMWEB'
                                  ? flipAnim.interpolate({
                                      inputRange: [0, 1],
                                      outputRange: ['0deg', '360deg'],
                                    })
                                  : '0deg',
                            },
                          ],
                        },
                      ]}
                      onPress={() => {
                        onSetSanPham(item.code);
                        onGetValueSP(item.code);
                      }}>
                      <View style={{marginTop: 5}}>
                        <Image
                          source={img}
                          style={{height: 55, width: 55, padding: 5}}
                        />
                      </View>
                      {/* <Text style={{ color: 'black' }}>{image_source1['BAMCHAT']}</Text> */}
                      <View style={{}}>
                        <Text
                          style={{
                            textAlign: 'center',
                            marginTop: 5,
                            color: '#000000',
                            fontSize: 13,
                          }}>
                          {item.name}
                        </Text>
                      </View>
                    </TouchableOpacity>
                    {item.code == 'KM_BAMWEB' && (
                      <View
                        style={{
                          position: 'absolute',
                          top: 5,
                          left: 5,
                          backgroundColor: '#fff',
                          paddingHorizontal: 5,
                          borderRadius: 10,
                        }}>
                        <Entypo
                          name="star"
                          style={{color: 'red', fontSize: 15}}
                        />
                      </View>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            );
          }}
        />
      </View>
    </View>
  );
}

export default memo(Flastlist_column3);
