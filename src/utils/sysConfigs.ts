import Taro from "@tarojs/taro";

interface IColorStatus {
  MAIN_COLOR: string;
  TAP_DEFAULT_COLOR: string;
  TAP_ACTIVE_COLOR: string;
  TAP_BACKGROUND_COLOR: string;
  HEADER_BACKGROUND_COLOR: string;
  HEADER_TEXT_COLOR: string;
}

interface IApp extends IObject {
  state: {};
  checkVersion: () => void;
  wxLogin: () => void;
  checkSession: () => void;
}

export const get_sys_app: () => IApp = () => {
  const App = Taro.getApp();
  return App ? App["$app"] : {};
};
