import { actions } from "../action_types/index";
import { stateToHTML } from "draft-js-export-html";
import { act } from "react-dom/test-utils";
const newItem = [
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
    item: newItem,
    coin: newItem,
    inkind: newItem
  }
};
export default (state = initialState, action) => {
  const newIndexShop = { ...state.indexShop };
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
      newIndexShop[action.isType] = action.data;
      return {
        ...state,
        indexShop: newIndexShop
      };
    case actions.ADD_ITEM_PROMO:
      const newItem1 = [
        {
          point: 1,
          rewards: [],
          itemsInkind: ""
        }
      ];
      newIndexShop[action.isType] = [
        ...state.indexShop[action.isType],
        newItem1
      ];
      return {
        ...state,
        indexShop: newIndexShop
      };
    case actions.REDUCE_ITEM_PROMO:
      const newItem = newIndexShop[action.isType].filter(
        (value, index) => index !== action.val
      );
      newIndexShop[action.isType] = newItem;
      return {
        ...state,
        indexShop: newIndexShop
      };
    case actions.SELECT_ITEM_PARNER:
      newIndexShop.item[action.positionItem].rewards = action.value;
      return {
        ...state,
        indexShop: newIndexShop
      };
    case actions.SELECT_NUMB_ITEM_PROMO:
      const { isType, positionItem, value } = action;
      newIndexShop[isType][positionItem].point = value;
      return {
        ...state,
        indexShop: newIndexShop
      };
    case actions.SELECT_ITEM_INKIND:
      newIndexShop.inkind[action.positionItem].itemsInkind = action.value;
      return {
        ...state,
        indexShop: newIndexShop
      };
    case actions.SELECT_COIN_EVENT:
      newIndexShop.coin[action.positionItem].rewards = [action.value];
      return {
        ...state,
        indexShop: newIndexShop
      };
    case actions.RESET_ITEM_PARTNER:
      newIndexShop.item = [
        {
          point: 1,
          rewards: [],
          itemsInkind: ""
        }
      ];
      return {
        ...state,
        indexShop: newIndexShop
      };
    default:
      return state;
  }
};
