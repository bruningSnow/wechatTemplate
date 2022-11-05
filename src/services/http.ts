import Taro from "@tarojs/taro";

type TRequest = Parameters<typeof Taro.request<any, any>>[0] & {
  otherHttp?: boolean;
  need_loading?: boolean;
  need_scene?: boolean;
  need_openId?: boolean;
};

const request = (par: Omit<TRequest, "success" | "fail">) => {
  const host = Taro.getStorageSync("host");
  const click_id = Taro.getStorageSync("click_id");
  const recmd = Taro.getStorageSync("recmd");
  const link_id = Taro.getStorageSync("link_id");
  const userInfo = Taro.getStorageSync("userInfo");
  const scene = Taro.getStorageSync("scene");
  const open_id = Taro.getStorageSync("open_id");
  const {
    data = {},
    header = {},
    url,
    method,
    otherHttp,
    need_loading,
    need_scene = true,
    need_openId = true,
    ...rest
  } = par || {};
  const innerHeader = {
    ...header,
    "content-type": "application/json", // 默认值
  };
  let innerUrl = (host || "") + url;
  let innerData = data || {};

  // 是否为 埋点 接口
  if (otherHttp) {
    innerUrl = innerUrl.replace("xiaodian", "xiaodian_track");
  }

  /**
   * 参数配置
   */
  if (innerData.hasOwnProperty("open_id") && !innerData.open_id) {
    console.log(innerData);
    return;
  }
  //广告入口接口多传click_id字段
  if (click_id) {
    try {
      let pages = Taro.getCurrentPages();
      if (pages.length) {
        let currentPage = pages[pages.length - 1], //获取当前页面的对象
          url = currentPage.route; //当前页面url
        innerData.click_id = click_id;
        innerData.url = `http://www.${url}`;
      }
    } catch (error) {}
  }
  //一叠微书入口多传recmd字段
  if (recmd) {
    innerData.recmd = recmd;
  }
  //记录推广link_id
  if (link_id && !innerData.link_id) {
    innerData.link_id = link_id;
  }
  //记录union_id
  if (userInfo && userInfo.union_id) {
    innerData.union_id = userInfo.union_id;
  }
  //接口加上场景值
  if (need_scene && scene) {
    innerData.scene = parseInt(scene);
  }
  //接口加上open_id
  if (need_openId && open_id) {
    innerData.open_id = open_id;
  }
  /******* 参数配置结束 */

  // 开始请求
  return new Promise((resolve, reject) => {
    if (need_loading) {
      Taro.showLoading({
        title: "加载中",
      });
    }

    Taro.request({
      url: innerUrl,
      data: innerData,
      header: innerHeader,
      method: method || "POST",
      ...rest,
      mode: "cors",
      success: (successCallbackResult) => {
        if (need_loading) {
          Taro.hideLoading();
        }

        const data = successCallbackResult.data;
        if (data && !data.success && data.msg) {
          Taro.showToast({
            title: data.msg,
            icon: "error",
          });
        }
        resolve(successCallbackResult.data);
      },
      fail: (failCallbackResult: IObject) => {
        if (need_loading) {
          Taro.hideLoading();
        }

        if (failCallbackResult.status !== 200) {
          Taro.showToast({
            title: failCallbackResult.data.msg,
            icon: "error",
          });
        }
        reject(failCallbackResult.data);
      },
    });
  });
};

export default request;
