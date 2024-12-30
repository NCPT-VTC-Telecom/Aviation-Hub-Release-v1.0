import {ActivityIndicator, View, Modal, Text, StatusBar} from 'react-native';
import {memo} from 'react';
function Loading_animation({
  onLoading,
  onAction,
  open_StatusBar,
  off_message_background,
}) {
  return (
    <Modal
      transparent={true}
      animationType={'none'}
      visible={onLoading}
      style={{zIndex: 1100}}
      onRequestClose={() => {}}>
      <StatusBar
        translucent={open_StatusBar ? true : false}
        backgroundColor={
          open_StatusBar ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0,0,0,1)'
        }
      />
      {off_message_background ? (
        <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
          <View style={{width: 120, borderRadius: 10}}>
            <ActivityIndicator
              animating={onLoading}
              color="#0000ff"
              size="large"
              style={{padding: 5}}
            />
          </View>
        </View>
      ) : (
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
          }}>
          <View
            style={{
              width: 120,
              backgroundColor: 'rgba(0,0,0, 0.6)',
              borderRadius: 10,
            }}>
            {onAction && (
              <Text
                style={{
                  color: 'white',
                  textAlign: 'center',
                  padding: 10,
                  paddingLeft: 20,
                  paddingRight: 20,
                }}>
                {onAction}
              </Text>
            )}
            <ActivityIndicator
              animating={onLoading}
              color="#0000ff"
              size="large"
              style={{padding: 5}}
            />
          </View>
        </View>
      )}
    </Modal>
  );
}
export default memo(Loading_animation);
