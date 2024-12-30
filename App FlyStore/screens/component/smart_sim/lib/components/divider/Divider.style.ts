import {ViewStyle, StyleSheet} from 'react-native';

interface Style {
  dividerStyle: ViewStyle;
}

export default StyleSheet.create<Style>({
  dividerStyle: {
    height: 1,
    width: '100%',
    backgroundColor: '#rgba(0,0,0,0.4)',
  },
});
