import { Reducer } from "redux";
export interface IState extends IObject {
  logo: string;
  scene: string | number;
  openId: string;
  sessionKey: string;
  networkType: string;
  currentPath: string;
  currentQueryStr: string;
  currentUrl: string;
  currentQuery: IObject;
}

export interface IReducers {
  save: Reducer;
}

export interface IGlobalModel extends IModel<"global", IState, IReducers> {}

const globalModel: IGlobalModel = {
  namespace: "global",
  state: {
    logo: "",
    scene: "",
    openId: "",
    sessionKey: "",
    networkType: "none",
    currentPath: "",
    currentQueryStr: "",
    currentUrl: "",
    currentQuery: {},
  },

  reducers: {
    save(state = globalModel.state, { payload }) {
      return { ...state, ...payload };
    },
  },
};

export default globalModel;
