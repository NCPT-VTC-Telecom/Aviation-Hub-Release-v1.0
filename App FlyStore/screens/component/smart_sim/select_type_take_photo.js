import React, {memo, useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  FlatList,
  Text,
  View,
  TextInput,
  Image,
  TouchableOpacity,
  Dimensions,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import styles from '../../styles';
import {Center} from 'native-base';

function SelectTypeTakePhoto({
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
}) {
  const closeModal = () => {
    set_open_select_type(false);
  };
  return (
    <View>
      <Modal
        animationType="slide-down"
        transparent={true}
        visible={open_select_type}
        onRequestClose={closeModal}>
        <TouchableWithoutFeedback onPress={closeModal}>
          <SafeAreaView
            style={{
              flex: 1,
              justifyContent: 'flex-end',
              backgroundColor: 'rgba(0,0,0,0.3)',
            }}>
            <View style={{height: 220, marginHorizontal: 10, marginBottom: 30}}>
              <View style={{backgroundColor: 'white', borderRadius: 10}}>
                <Text
                  style={{
                    padding: 12,
                    fontSize: 13,
                    textAlign: 'center',
                    paddingHorizontal: 30,
                    color: 'black',
                    borderBottomWidth: 1,
                    borderBottomColor: 'rgba(0,0,0,0.3)',
                  }}>
                  You can either take a picture or select one from your album
                </Text>
                <TouchableOpacity
                  style={{height: 50}}
                  onPress={() => {
                    // set_select_type_take_photo("Library")
                    closeModal();
                    if (type === 'front_cccd') {
                      choosePhoto('front', set_photo);
                    } else if (type === 'back_cccd') {
                      choosePhoto('back', set_photo);
                    } else {
                      choosePhoto('selfies', set_photo);
                    }
                  }}>
                  <Text
                    style={{
                      fontWeight: 500,
                      padding: 14,
                      color: 'black',
                      fontSize: 16,
                      textAlign: 'center',
                      borderBottomWidth: 1,
                      borderBottomColor: 'rgba(0,0,0,0.3)',
                    }}>
                    Select from album
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{height: 50}}
                  onPress={() => {
                    // set_select_type_take_photo("Library")
                    closeModal();
                    if (type === 'front_cccd') {
                      takePhoto('front', set_photo);
                    } else if (type === 'back_cccd') {
                      takePhoto('back', set_photo);
                    } else {
                      takePhoto('selfies', set_photo);
                    }
                  }}>
                  <Text
                    style={{
                      fontWeight: 500,
                      padding: 12,
                      color: 'black',
                      fontSize: 16,
                      textAlign: 'center',
                    }}>
                    Take photo
                  </Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={{
                  marginTop: 10,
                  backgroundColor: 'white',
                  borderRadius: 10,
                }}
                onPress={() => {
                  closeModal();
                }}>
                <Text
                  style={{
                    fontWeight: 500,
                    padding: 14,
                    color: '#00BFFF',
                    fontSize: 16,
                    textAlign: 'center',
                  }}>
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

export default memo(SelectTypeTakePhoto);
