import React, { CSSProperties, useEffect, useState, useMemo } from "react";
import Taro from "@tarojs/taro";
import { View } from "@tarojs/components";
import Classnames from "classnames";
import { AtModal, AtButton } from "taro-ui";
import { AtModalProps } from "taro-ui/types/modal";
import { useSelector } from "react-redux";
import { ConnectState } from "@/models/index";
// import { queryShopcarList } from "@/services/index";
import styles from "./index.module.scss";

export interface CertificateModalProps extends AtModalProps {}

type TTextItemValue =
  | string
  | {
      file: string;
      name: string;
      text: string;
      fileType: string;
    };

interface TextItemProps {
  value: TTextItemValue[];
  isChecked?: boolean;
  className?: string;
  style?: CSSProperties;
  onChange?: (isChecked: boolean) => void;
}

const TextItem: React.FC<TextItemProps> = (props) => {
  const { value, isChecked, className = "", style, onChange } = props;
  const [innerIsChecked, setInnerIsChecked] = useState<boolean>(false);

  useEffect(() => {
    setInnerIsChecked(Boolean(isChecked));
  }, [isChecked]);

  const goToPageUrl = (item: TTextItemValue) => {
    if (typeof item === "string") {
      return;
    }
    const host = Taro.getStorageSync("host");
    const word_src = host + "file/downloadWord" + "?url=" + item.file;
    Taro.downloadFile({
      url: word_src,
      success: (res) => {
        const filePath = res.filePath || res.tempFilePath;
        Taro.openDocument({
          filePath,
          fileType: item.fileType as any,
        });
      },
    });
  };

  return (
    <View className={Classnames(styles.textItem, className)} style={style}>
      <View
        onClick={() => {
          setInnerIsChecked(!innerIsChecked);
          onChange?.(!innerIsChecked);
        }}
        style={{ height: "100%" }}
      >
        <View
          className={Classnames(
            styles.textCheck,
            innerIsChecked ? styles.textCheck_active : ""
          )}
        />
      </View>
      <View className={styles.texts}>
        {value.map((item, itemIndex) => {
          const isString = typeof item === "string";
          return (
            <View
              key={itemIndex}
              className={
                isString
                  ? styles.text
                  : Classnames(styles.text_underline, styles.text)
              }
              onClick={() => !isString && goToPageUrl(item)}
            >
              {isString ? item : item.text}
            </View>
          );
        })}
      </View>
    </View>
  );
};

const textList: TextItemProps["value"][] = [
  [
    "我已阅读、理解并同意《",
    {
      text: "个人信息保护政策",
      file: "https://udh.oss-cn-hangzhou.aliyuncs.com/07c0369b-4e94-4607-a619-980182abe50f8607528712.docx",
      name: "个人信息保护政策.docx",
      fileType: "docx",
    },
    "》和《",
    {
      text: "销售条款",
      file: "https://udh.oss-cn-hangzhou.aliyuncs.com/29d5d6aa-7fe8-4e3c-adfe-3092903c84718607688416.docx",
      name: "销售条款.docx",
      fileType: "docx",
    },
    "》， 且同意注册成为xxx会员。",
  ],
  [
    "我同意并确认xxx可能会根据《",
    {
      text: "个人信息保护政策",
      file: "https://udh.oss-cn-hangzhou.aliyuncs.com/07c0369b-4e94-4607-a619-980182abe50f8607528712.docx",
      name: "个人信息保护政策.docx",
      fileType: "docx",
    },
    "》。",
  ],
];

const CertificateModal: React.FC<CertificateModalProps> = (props) => {
  const { className, onClose, onConfirm, ...rest } = props;
  const { openId } = useSelector((state: ConnectState) => state.global);
  const [checkedMap, setCcheckMap] = useState({
    0: false,
    1: false,
  });

  // 是否已勾选同意
  const passCheckout = useMemo(
    () => Object.values(checkedMap).every((item) => item),
    [checkedMap]
  );

  /**
   * 同意协议证书
   */
  const agreeCertificate = (e) => {
    if (passCheckout) {
      onConfirm?.(e);
      return;
    }
    Taro.showToast({
      title: "请勾选相关条框",
      icon: "error",
      duration: 2000,
    });
  };

  /**
   * 获取电话号码授权
   * https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/getPhoneNumber.html
   */
  const getPhoneNumber = (e) => {
    console.log(e.detail.code);
  };

  return (
    <AtModal
      className={Classnames(styles.certificateModal, className)}
      {...rest}
    >
      <View>温馨提示</View>
      <View className={styles.certificateModal_content}>
        <View className={styles.content_title}>
          为给您带来更好的会员服务礼遇，敬请阅读并同意如下条款:
        </View>
        {textList.map((text, textIndex) => (
          <TextItem
            value={text}
            key={textIndex}
            onChange={(value) =>
              setCcheckMap({ ...checkedMap, [textIndex]: value })
            }
            style={{
              marginBottom: "32rpx",
            }}
          />
        ))}
      </View>
      <View className={styles.certificateModal_footer}>
        <AtButton
          type="secondary"
          className={styles.certificateModal_footer_cancel}
          onClick={onClose}
        >
          不同意
        </AtButton>
        <AtButton
          type="primary"
          className={styles.certificateModal_footer_ok}
          openType={passCheckout ? "getPhoneNumber" : ("" as any)}
          onGetPhoneNumber={getPhoneNumber}
          onClick={agreeCertificate}
        >
          同意
        </AtButton>
      </View>
    </AtModal>
  );
};

export default CertificateModal;
