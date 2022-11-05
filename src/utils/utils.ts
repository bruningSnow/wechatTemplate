import Taro from "@tarojs/taro";
import { get_sys_app } from "./sysConfigs";

const sys_app = get_sys_app();

/**
 * 轮询检测 open_id 是否存在storage 中
 * @returns Promise
 */
interface CheckOpenIdProps {
  maxCount?: number;
  interTime?: number;
}
export const checkOpenId = (props?: CheckOpenIdProps) => {
  const { maxCount, interTime } = props || {};
  let timer: any = null;
  let count = 0;

  return new Promise((resolve, reject) => {
    let open_id = Taro.getStorageSync("open_id");

    if (!open_id) {
      timer = setInterval(() => {
        if (count > (maxCount || 50) && !open_id) {
          clearInterval(timer);
          reject("暂无 open_id");
          return;
        } else if (open_id) {
          clearInterval(timer);
          resolve(open_id);
          return;
        }
        open_id = Taro.getStorageSync("open_id");
        count++;
      }, interTime || 200);
    } else {
      clearInterval(timer);
      resolve(open_id);
    }
  });
};

/**
 * 获取微信手机号
 * @param e
 * @param no_tip
 * @returns
 */
export const getPhoneNumber = (e, no_tip = false) => {
  return new Promise((resolve) => {
    if (e && e.detail && e.detail.iv) {
      // bindMobile({
      //   iv: e.detail.iv,
      //   encryptedData: e.detail.encryptedData,
      // })?.then((res: IObject) => {
      //   if (res.result) {
      //     let mobile = res.result.mobile;
      //     if (!no_tip) {
      //       Taro.showToast({
      //         title: "手机号绑定成功",
      //         icon: "none",
      //       });
      //     }
      //     resolve(mobile);
      //     return;
      //   }
      //   if (parseInt(res.code) === 20002) {
      //     Taro.showModal({
      //       title: "温馨提示",
      //       content: "用户信息已过期，需重新获取",
      //       confirmText: "确定",
      //       showCancel: false,
      //       success: () => {
      //         Taro.removeStorageSync("open_id");
      //         Taro.removeStorageSync("userInfo");
      //         sys_app.setOpenId();
      //       },
      //     });
      //   }
      // });
    }
  });
};
