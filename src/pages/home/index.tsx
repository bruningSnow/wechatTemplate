import React from "react";
import Taro from "@tarojs/taro";
import { Text, Button } from "@tarojs/components";
import { useSelector, useDispatch } from "react-redux";
import { ConnectState } from "@/models/index";
import { PageContainer, PageTitle } from "@/components/index";
import styles from "./index.module.scss";

const Index: React.FC<any> = () => {
  const gobalData = useSelector((state: ConnectState) => state.global);
  const dispatch = useDispatch();

  console.log("networkType =>", gobalData);

  return (
    <PageContainer hasMenu={true} className={styles.index}>
      <PageTitle />
    </PageContainer>
  );
};

export default Index;
