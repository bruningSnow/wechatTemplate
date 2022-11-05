import React from "react";
import Taro from "@tarojs/taro";
import { Text, Button } from "@tarojs/components";
import { useSelector, useDispatch } from "react-redux";
import { ConnectState } from "@/models/index";
import { get_sys_app } from "@/utils/sysConfigs";
import { PageContainer } from "@/components/index";
import styles from "./index.module.scss";

const sys_app = get_sys_app();

const Index: React.FC<any> = () => {
  const { access_token } = useSelector((state: ConnectState) => state.global);
  const dispatch = useDispatch();

  console.log("networkType =>", sys_app.state.networkType);

  return (
    <PageContainer hasMenu={true} className={styles.index}>
      <Text>Hello world!{access_token}</Text>
      <Button
        onClick={() => {
          dispatch({ type: "global/save", payload: { access_token: "444" } });
          Taro.navigateTo({ url: "/pages/index/index" });
        }}
      >
        Increment counter
      </Button>
    </PageContainer>
  );
};

export default Index;
