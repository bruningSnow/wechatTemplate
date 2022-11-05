import React from "react";
import Taro from "@tarojs/taro";
import { Text, Button } from "@tarojs/components";
import { useSelector, useDispatch } from "react-redux";
import { ConnectState } from "@/models/index";
import { PageContainer } from "@/components/index";
import styles from "./index.module.scss";

const Index: React.FC<any> = () => {
  const gobalData = useSelector((state: ConnectState) => state.global);
  const dispatch = useDispatch();

  console.log("networkType =>", gobalData);

  return (
    <PageContainer hasMenu={true} className={styles.index}>
      <Text>Hello world!</Text>
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
