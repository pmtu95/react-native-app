import DeviceInfo from 'react-native-device-info';

export class AppInfoService {
  static getVersion = () => {
    return DeviceInfo.getVersion();
  };

  static getBuildNumber = () => {
    return DeviceInfo.getBuildNumber();
  };
}
