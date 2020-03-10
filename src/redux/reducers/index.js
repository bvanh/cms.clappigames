import { actions } from "../action_types/index";
import { stateToHTML } from "draft-js-export-html";
import { act } from "react-dom/test-utils";
const newItem = [
  {
    point: 1,
    rewards: [],
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
  indexConfig: {
    item: newItem,
    coin: newItem,
    inkind: newItem
  }
};
export default (state = initialState, action) => {
  const newIndexConfig = { ...state.indexConfig };
  const initialItem = [
    {
      point: 1,
      rewards: [],
      itemsInkind: ""
    }
  ];
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
      };
    case actions.GET_DETAIL_PROMO:
      return {
        ...state,
        detailPromo: action.value
      };
    case actions.SWITCH_CREATE_PROMO:
      return {
        ...state,
        isCreatePromo: action.value
      };
    case actions.SET_DATA_TYPEPROMO:
      newIndexConfig[action.isType] = action.data;
      return {
        ...state,
        indexConfig: newIndexConfig
      };
    case actions.ADD_ITEM_PROMO:
      const newItem1 = [
        {
          point: 1,
          rewards: [],
        }
      ];
      newIndexConfig[action.isType] = [
        ...state.indexConfig[action.isType],
        ...newItem1
      ];
      return {
        ...state,
        indexConfig: newIndexConfig
      };
    case actions.REDUCE_ITEM_PROMO:
      const newItem = newIndexConfig[action.isType].filter(
        (value, index) => index !== action.val
      );
      newIndexConfig[action.isType] = newItem;
      return {
        ...state,
        indexConfig: newIndexConfig
      };
    case actions.SELECT_ITEM_PARNER:
      newIndexConfig["item"][action.positionItem].rewards = action.value;
      return {
        ...state,
        indexConfig: newIndexConfig
      };
    case actions.SELECT_NUMB_ITEM_PROMO:
      const { isType, positionItem, value } = action;
      newIndexConfig[isType][positionItem].point = value;
      return {
        ...state,
        indexConfig: newIndexConfig
      };
    case actions.SELECT_ITEM_INKIND:
      newIndexConfig.inkind[action.positionItem].rewards = [action.value];
      return {
        ...state,
        indexConfig: newIndexConfig
      };
    case actions.SELECT_COIN_EVENT:
      newIndexConfig.coin[action.positionItem].rewards = [action.value];
      return {
        ...state,
        indexConfig: newIndexConfig
      };
    case actions.RESET_ITEM_PARTNER:
      newIndexConfig.item = [
        {
          point: 1,
          rewards: [],
          itemsInkind: ""
        }
      ];
      return {
        ...state,
        indexConfig: newIndexConfig
      };
    case actions.SET_INITIAL_indexConfig:
      const newInitalIndexConfig = {
        item: initialItem,
        coin: initialItem,
        inkind: initialItem
      };
      return {
        ...state,
        indexConfig: newInitalIndexConfig
      };
    default:
      return state;
  }
};
