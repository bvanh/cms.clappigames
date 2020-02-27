import { actions } from "../action_types/index";
const initialState = {
  isLogin: true,
  dataNews: [],
  dataContent: [],
  userToken: null,
  userAccessToken: null,
  accessToken: JSON.parse(localStorage.getItem("accessTokenCms")),
  visibleModalNews: false,
  urlImg: "",
  typeEventByMoney: ""
};
export default (state = initialState, action) => {
  switch (action.type) {
    case actions.SET_TOKEN:
      return {
        ...state,
        userToken: action.userToken,
        userAccessToken: action.accessToken
      };
    case actions.SET_ACCESSTOKEN:
      return { ...state, accessToken: action.payload };
    case actions.SWITCH_LOGIN:
      if (action.payload === false) {
        localStorage.removeItem("tokenCms");
        localStorage.removeItem("accessTokenCms");
      }
      return { ...state, isLogin: action.payload };
    case actions.SHOW_IMAGES_NEWS:
      return {
        ...state,
        visibleModalNews: action.value
      };
    case actions.SET_URL_IMAGES:
      return {
        ...state,
        urlImg: action.value
      };
    case actions.SET_TYPE_EVENTMONEY:
      return {
        ...state,
        typeEventByMoney: action.value
      };
    default:
      return state;
  }
};
