import {Dimensions} from 'react-native';
export const typeResponsive =
  Dimensions.get('window').width > 600 && Dimensions.get('window').height > 600
    ? 'ipad'
    : 'smartphone';
export const fontSizeNormal = typeResponsive == 'ipad' ? 18 : 15;
export const fontSizeMedium = typeResponsive == 'ipad' ? 19 : 17;
