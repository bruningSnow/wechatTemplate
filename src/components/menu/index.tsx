import React, { CSSProperties, useEffect, useState, useMemo } from "react";
import Taro, { useDidShow } from "@tarojs/taro";
import { View, Image } from "@tarojs/components";
import Classnames from "classnames";
import { AtModal, AtButton } from "taro-ui";
// import { queryShopcarList } from "@/services/index";
import { checkOpenId } from "@/utils/utils";
import styles from "./index.module.scss";

type TMenuItem = {
  path_url: string;
  thumbnail_url: string;
  active: string;
  activity_id?: number;
  page_name?: string;
  target_type?: string;
};

const defaultProps = {
  menuList: [
    {
      activity_id: 16633,
      page_name: "首页",
      path_url: "pages/home/index",
      target_type: "homePages",
      thumbnail_url:
        "https://udh.oss-cn-hangzhou.aliyuncs.com/7ef19958-1e10-4f90-b335-81db0ecd14548854770icon.svg",
      active:
        "https://udh.oss-cn-hangzhou.aliyuncs.com/c0dc10ad-a978-4ed8-8286-b4502c166da2878813icon1.svg",
    },
    {
      activity_id: 16634,
      page_name: "产品分类",
      path_url: "pages/category/index",
      target_type: "categoryPages",
      thumbnail_url:
        "https://udh.oss-cn-hangzhou.aliyuncs.com/155e204b-4a90-47d5-b6ec-a024f7f4b79603367icon2x.png",
      active:
        "https://udh.oss-cn-hangzhou.aliyuncs.com/2a9f5afc-bd79-466e-90a7-1c6e108d5f3e53793icon2x.png",
    },
    {
      activity_id: 16635,
      page_name: "购物袋",
      path_url: "pages/shopcar/index",
      target_type: "shopcarPages",
      thumbnail_url:
        "https://udh.oss-cn-hangzhou.aliyuncs.com/573cbe76-53b4-48a4-ac9c-ba86e3df94f0696309icon1.svg",
      active:
        "https://udh.oss-cn-hangzhou.aliyuncs.com/a404247b-486d-4444-a692-4db4ad727bdc875166icon2.svg",
    },
    {
      activity_id: 77777,
      page_name: "客服",
      path_url: "",
      target_type: "customerService",
      thumbnail_url:
        "https://udh.oss-cn-hangzhou.aliyuncs.com/847c7885-5d6c-4b9d-8fbc-83a2f574cb66237351icon2.svg",
      active: "",
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
    "》， 且同意注册成为MCM会员。",
  ],
  [
    "我同意并确认MCM可能会根据《",
    {
      text: "个人信息保护政策",
      file: "https://udh.oss-cn-hangzhou.aliyuncs.com/07c0369b-4e94-4607-a619-980182abe50f8607528712.docx",
      name: "个人信息保护政策.docx",
      fileType: "docx",
    },
    "》与位于境外的关联公司和合作伙伴分享我的个人信息，并将我的个人信息跨境存储在境外服务器上。",
  ],
];

const Menu: React.FC<MenuProps> = (props) => {
  const { className, style, menuList } = props;
  const [isOpened, setIsOpened] = useState<boolean>(true);
  const [currentQuery, setCurrentQuery] = useState<IObject>({});
  const [currentUrl, setCurrentUrl] = useState<string>("");
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
   * 获取当前路由 query 参数及 url
   */
  const getCurrentQuery = () => {
    const pages = Taro.getCurrentPages(); //获取加载的页面
    const currentPage = pages[pages.length - 1]; //获取当前页面的对象
    const { route, query } = currentPage.__displayReporter;

    setCurrentQuery(query);
    setCurrentUrl(route);
  };

  /**
   * 获取购物车列表
   */
  const fetchShopCarList = () => {
    checkOpenId().then(async (open_id) => {
      // queryShopcarList({ open_id });
    });
  };

  useDidShow(() => {
    getCurrentQuery();
    fetchShopCarList();
  });

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
            onGetPhoneNumber={() => {}}
            onClick={() => {
              console.log("ttttt =>", Taro.getApp());
            }}
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
