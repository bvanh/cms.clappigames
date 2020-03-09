import { actions } from "../action_types/index";
const rootConfig = [
  {
    point: 1,
    rewards: [],
    itemsInkind: ""
  }
];
const initialState = {
  isLogin: true,
  dataNews: [],
  dataContent: [],
  userToken: null,
  userAccessToken: null,
  accessToken: JSON.parse(localStorage.getItem("accessTokenCms")),
  visibleModalNews: false,
  urlImg: "",
  typeEventByMoney: "",
  nameEventByMoney: "",
  // list game
  listPartner: [],
  // detail promo
  detailPromo: [],
  isCreatePromo: true,
  // 
  indexShop: {
    item: rootConfig,
    coin: rootConfig,
    inkind: rootConfig
  }
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
    case actions.SET_NAME_EVENT:
      return {
        ...state,
        nameEventByMoney: action.value
      };
    case actions.GET_LISTPARTNER:
      return {
        ...state,
        listPartner: action.value
      }
    case actions.GET_DETAIL_PROMO:
      return {
        ...state,
        detailPromo: action.value
      }
    case actions.SWITCH_CREATE_PROMO:
      return {
        ...state,
        isCreatePromo: action.value
      }
    case actions.SET_DATA_TYPEPROMO:
      const newIndexShop = { ...state.indexShop };
      // if (action.value.type === 'item') {
      newIndexShop[action.isType] = action.data
      console.log(newIndexShop)
      return {
        ...state,
        indexShop: newIndexShop
      }
      
    // } else if (action.value.type === 'coin') {
    //   newIndexShop.coin = action.value.data
    //   return {
    //     ...state,
    //     indexShop: newIndexShop
    //   }
    // } else {
    //   newIndexShop.inkind = action.value.data
    //   return {
    //     ...state,
    //     indexShop: newIndexShop
    //   }
    // }
    default:
      return state;
  }
};
