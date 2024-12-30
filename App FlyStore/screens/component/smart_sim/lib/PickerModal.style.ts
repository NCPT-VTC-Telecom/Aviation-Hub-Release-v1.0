import {Dimensions, TextStyle, ViewStyle, StyleSheet} from 'react-native';

const {width: ScreenWidth} = Dimensions.get('screen');

interface Style {
  container: ViewStyle;
  mainContent: ViewStyle;
  cancelButtonStyle: ViewStyle;
  cancelButtonTextStyle: TextStyle;
  titleTextStyle: TextStyle;
  titleTextContainer: ViewStyle;
}

export default StyleSheet.create<Style>({
  container: {
    bottom: 32,
    position: 'absolute',
  },
  mainContent: {
    width: ScreenWidth * 0.9,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingTop: 16,
  },
  titleTextStyle: {
    color: '#000',
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
    paddingBottom: 16,
  },
  titleTextContainer: {
    width: ScreenWidth * 0.7,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  cancelButtonStyle: {
    height: 50,
    width: ScreenWidth * 0.9,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginTop: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonTextStyle: {
    fontSize: 16,
    color: '#00BFFF',
    fontWeight: '500',
  },
});
