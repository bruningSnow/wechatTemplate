import React, { CSSProperties, useState, useEffect } from "react";
import { View, Image } from "@tarojs/components";
import Classnames from "classnames";

import styles from "./index.module.scss";

const defaultProps = {
  img: "https://udh.oss-cn-hangzhou.aliyuncs.com/a4ef6161-e365-4412-97cd-d7f2f1bba3ed134basicprofile",
  text: "孤岛易设",
  needMember: true,
  isFixed: true,
};

export interface PageTitleProps {
  className?: string;
  style?: CSSProperties;
  img?: string;
  text?: string;
  needMember?: boolean;
  isFixed?: boolean;
}

const PageTitle: React.FC<PageTitleProps> = (props) => {
  const { className, style, img, text, needMember } = props;
  const [isMember, setIsMember] = useState<boolean>(false);

  useEffect(() => {
    setIsMember(false);
  }, []);

  return (
    <View
      className={Classnames(styles.index, className)}
      style={{ ...(style || {}), position: "fixed" }}
    >
      <View className={styles.pageTitle_left}>
        <Image className={styles.img} mode="aspectFill" src={img || ""} />
        <View className={styles.text}>{text}</View>
      </View>
      {needMember && (
        <>
          {isMember ? (
            <View className={styles.member}>xxx会员</View>
          ) : (
            <View className={styles.applyMember}>成为会员</View>
          )}
        </>
      )}
    </View>
  );
};

PageTitle.defaultProps = defaultProps;

export default PageTitle;
