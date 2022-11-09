import React, { CSSProperties, useEffect, useState, useMemo } from "react";
import Taro from "@tarojs/taro";
import { View, Image } from "@tarojs/components";
import Classnames from "classnames";
import { AtModal, AtButton } from "taro-ui";
import { useSelector } from "react-redux";
import { ConnectState } from "@/models/index";
// import { queryShopcarList } from "@/services/index";
import styles from "./index.module.scss";

type TMenuItem = {
  path_url: string;
  thumbnail_url: string;
  active: string;
  activity_id?: number;
  page_name?: string;
  target_type?: string;
  style?: CSSProperties;
};

const defaultProps = {
  menuList: [
    {
      activity_id: 16633,
      page_name: "首页",
      path_url: "pages/home/index",
      target_type: "homePages",
      thumbnail_url:
        "https://udh.oss-cn-hangzhou.aliyuncs.com/31420c49-bc20-414e-877b-7964639971c978359980891.png",
      active:
        "https://udh.oss-cn-hangzhou.aliyuncs.com/720d635d-e969-4cf2-813a-76ac5b166dd167835998017.png",
      style: {
        width: "25px",
        height: "11px",
        marginTop: "2px",
      },
    },
    {
      activity_id: 16635,
      page_name: "商城",
      path_url: "pages/shopcar/index",
      target_type: "shopPages",
      thumbnail_url:
        "https://udh.oss-cn-hangzhou.aliyuncs.com/53c5f076-41eb-43dc-8fc7-74bb2ba26baf78359980851.png",
      active:
        "https://udh.oss-cn-hangzhou.aliyuncs.com/9b318ee1-8682-46d2-958f-9d8ddaa5670167835998058.png",
      style: {
        width: "25px",
        height: "11px",
        marginTop: "2px",
      },
    },
    {
      activity_id: 16634,
      page_name: "上传",
      path_url: "pages/category/index",
      target_type: "uploadPages",
      thumbnail_url:
        "https://udh.oss-cn-hangzhou.aliyuncs.com/49a6b00c-855a-4d68-8c98-7a6526ab30a878359980011.png",
      active:
        "https://udh.oss-cn-hangzhou.aliyuncs.com/21f55c02-b507-4866-9c3a-d2d5562b777b67835998076.png",
      style: {
        width: "30px",
        height: "30px",
      },
    },
    {
      activity_id: 16636,
      page_name: "个人中心",
      path_url: "pages/my/index",
      target_type: "myPages",
      thumbnail_url:
        "https://udh.oss-cn-hangzhou.aliyuncs.com/171412fd-76da-40ed-955d-0d24edc0c9209710328icon.svg",
      active:
        "https://udh.oss-cn-hangzhou.aliyuncs.com/43cce627-3b40-4e52-b0b3-ad7ca7bcb8c4872295icon1.svg",
    },
  ],
};

export interface MenuProps {
  className?: string;
  style?: CSSProperties;
  menuList?: TMenuItem[];
}

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

const Menu: React.FC<MenuProps> = (props) => {
  const { className, style, menuList } = props;
  const { openId, currentUrl, user } = useSelector(
    (state: ConnectState) => state.global
  );
  const [isOpened, setIsOpened] = useState<boolean>(false);
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
  const agreeCertificate = () => {
    if (passCheckout) {
      setIsOpened(false);
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

  useEffect(() => {
    setIsOpened(Boolean(user.phone));
  }, [user]);

  return (
    <View className={Classnames(styles.index, className)} style={style}>
      <View className={styles.menuList_container}>
        {(menuList || []).map((menuItem, menuItemIndex: number) => (
          <View
            className={styles.menu}
            key={menuItemIndex}
            onClick={() =>
              menuItem.path_url &&
              Taro.redirectTo({ url: "/" + menuItem.path_url })
            }
          >
            <Image
              className={styles.img}
              mode="widthFix"
              style={menuItem.style || {}}
              src={
                currentUrl === menuItem.path_url
                  ? menuItem.active
                  : menuItem.thumbnail_url
              }
            />
            <View
              className={styles.text}
              style={{
                color: currentUrl === menuItem.path_url ? "#000000" : "#C3C3C3",
              }}
            >
              {menuItem.page_name}
            </View>
          </View>
        ))}
      </View>
      <AtModal className={styles.menuModal} isOpened={isOpened}>
        <View>温馨提示</View>
        <View className={styles.menuModal_content}>
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
        <View className={styles.menuModal_footer}>
          <AtButton
            type="secondary"
            className={styles.menuModal_footer_cancel}
            onClick={() => setIsOpened(false)}
          >
            不同意
          </AtButton>
          <AtButton
            type="primary"
            className={styles.menuModal_footer_ok}
            openType={passCheckout ? "getPhoneNumber" : ("" as any)}
            onGetPhoneNumber={getPhoneNumber}
            onClick={agreeCertificate}
          >
            同意
          </AtButton>
        </View>
      </AtModal>
    </View>
  );
};

Menu.defaultProps = defaultProps;

export default Menu;
