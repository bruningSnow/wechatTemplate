import Taro from "@tarojs/taro";
import React, { CSSProperties, useEffect, useState } from "react";
import { View } from "@tarojs/components";
import Classnames from "classnames";
import { useDispatch, useSelector } from "react-redux";
import { ConnectState } from "@/models/index";
import Menu, { MenuProps } from "../menu";
import { CertificateModal } from "..";

import styles from "./index.module.scss";

const defaultProps = {
  hasMenu: false,
  menuConfig: {},
};

export interface PageContainerProps {
  className?: string;
  style?: CSSProperties;
  hasMenu?: boolean;
  menuConfig?: MenuProps;
}

const PageContainer: React.FC<PageContainerProps> = (props) => {
  const dispatch = useDispatch();
  const { className, style, hasMenu, menuConfig } = props;
  const { user } = useSelector((state: ConnectState) => state.global);
  const [isOpened, setIsOpened] = useState<boolean>(false);

  /**
   * 获取路由相关信息
   * @returns
   */
  const getRouters = (): IObject => {
    const { options, route } = getCurrentPages()[0];
    const currentQueryStr = Object.keys(options).reduce((pre, key) => {
      pre += `&${key}=${options[key]}`;
      return pre.slice(1);
    }, "");
    let currentUrl = route;
    if (currentQueryStr) {
      currentUrl += `?${currentQueryStr}`;
    }

    return {
      currentPath: route,
      currentQueryStr,
      currentUrl,
      currentQuery: options,
    };
  };

  /**
   * 获取 local 中 open_id 等数据
   * @returns
   */
  const getLocalData = (): IObject => {
    const scene = Taro.getStorageSync("scene");
    const openId = Taro.getStorageSync("open_id");
    const sessionKey = Taro.getStorageSync("session_key");

    return { scene, openId, sessionKey };
  };

  /**
   * 获取当前网络
   */
  const getNetWork = (): Promise<IObject> => {
    return new Promise((resolve) => {
      Taro.getNetworkType({
        success: (res) => {
          resolve(res);
        },
      });
    });
  };

  /**
   * 获取当前用户信息
   */
  const getUserInformation = () => {
    setTimeout(() => {
      dispatch({
        type: "global/save",
        payload: { user: { ...user, phone: "" } },
      });
    }, 1000);
  };

  useEffect(() => {
    getNetWork().then(({ networkType }) => {
      dispatch({
        type: "global/save",
        payload: { networkType, ...getRouters(), ...getLocalData() },
      });
    });
    getUserInformation();
  }, []);

  return (
    <View className={Classnames(styles.index, className)} style={style}>
      <View
        className={styles.pageContent}
        style={{ minHeight: hasMenu ? "calc(100vh - 101px)" : "100vh" }}
      >
        {props.children}
        {!user.phone && (
          <View className={styles.mark} onClick={() => setIsOpened(true)} />
        )}
      </View>
      {hasMenu && <Menu {...menuConfig} />}
      <CertificateModal
        isOpened={isOpened}
        onClose={() => setIsOpened(false)}
        onConfirm={() => setIsOpened(false)}
      />
    </View>
  );
};

PageContainer.defaultProps = defaultProps;

export default PageContainer;
