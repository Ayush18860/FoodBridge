import { Alert, Linking, Platform } from 'react-native';

export const openAddressInMaps = async (address: string) => {
  try {
    const encoded = encodeURIComponent(address);

    // Android
    const googleMapsUrl = `geo:0,0?q=${encoded}`;

    // iOS
    const appleMapsUrl = `http://maps.apple.com/?q=${encoded}`;

    // Web fallback
    const browserUrl = `https://www.google.com/maps/search/?api=1&query=${encoded}`;

    let url =
      Platform.OS === 'android'
        ? googleMapsUrl
        : Platform.OS === 'ios'
        ? appleMapsUrl
        : browserUrl;

    const supported = await Linking.canOpenURL(url);

      if (supported) {
        await Linking.openURL(url);
      } else {
        // Always fall back to browser
        await Linking.openURL(browserUrl);
      }
    } catch (error) {
    console.error(error);
    Alert.alert('Error', 'Unable to open Maps.');
  }
};
