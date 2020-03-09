import { actions } from "../action_types/index";
import store from "../store/index";
import { isType } from "graphql";

const setAccessToken = payload => {
  return {
    type: actions.SET_ACCESSTOKEN,
    payload
  };
};
const switchLogin = payload => {
  return {
    type: actions.SWITCH_LOGIN,
    payload
  };
};
const setToken = (userToken, accessToken) => {
  return {
    type: actions.SET_TOKEN,
    userToken,
    accessToken
  };
};
const showImagesNews = value => {
  return {
    type: actions.SHOW_IMAGES_NEWS,
    value
  };
};
const setUrlImage = value => {
  return {
    type: actions.SET_URL_IMAGES,
    value
  };
};
const setTypeEventByMoney = value => {
  return {
    type: actions.SET_TYPE_EVENTMONEY,
    value
  };
};
const setNameEventByMoney = value => {
  return {
    type: actions.SET_NAME_EVENT,
    value
  };
};
const setListPartner = value => {
  return {
    type: actions.GET_LISTPARTNER,
    value
  };
};
const getDetailPromo = value => {
  return {
    type: actions.GET_DETAIL_PROMO,
    value
  };
};
const switchCreatePromo = value => {
  return {
    type: actions.SWITCH_CREATE_PROMO,
    value
  };
};
const setDataTypePromo = value => {
  return {
    type: actions.SET_DATA_TYPEPROMO,
    ...value
  };
};
const addItemPromo = isType => {
  return {
    type: actions.ADD_ITEM_PROMO,
    isType
  };
};
const reduceItemPromo = value => {
  return {
    type: actions.REDUCE_ITEM_PROMO,
    ...value
  };
};
const handleSelectItemPartner = value => {
  return {
    type: actions.SELECT_ITEM_PARNER,
    ...value
  };
};
const handleSelectNumbItemPromo = value => {
  return {
    type: actions.SELECT_NUMB_ITEM_PROMO,
    ...value
  };
};
const handleSelectItemInkind = value => {
  return {
    type: actions.SELECT_ITEM_INKIND,
    ...value
  };
};
const handleSelectCoinEvent = value => {
  return {
    type: actions.SELECT_COIN_EVENT,
    ...value
  };
};
const resetItemRewards = () => {
  return {
    type: actions.RESET_ITEM_PARTNER
  };
};
function dispatchSwitchLogin(data) {
  store.dispatch(switchLogin(data));
}
function dispatchSetAccessToken(data) {
  store.dispatch(setAccessToken(data));
}
function dispatchSetToken(userToken, accessToken) {
  store.dispatch(setToken(userToken, accessToken));
}
function dispatchShowImagesNews(value) {
  store.dispatch(showImagesNews(value));
}
function dispatchSetUrlImage(value) {
  store.dispatch(setUrlImage(value));
}
function dispatchTypeEventByMoney(value) {
  store.dispatch(setTypeEventByMoney(value));
}
function dispatchNameEventByMoney(value) {
  store.dispatch(setNameEventByMoney(value));
}
function dispatchListPartner(value) {
  store.dispatch(setListPartner(value));
}
function dispatchDetailPromoAndEvent(value) {
  store.dispatch(getDetailPromo(value));
}
function dispatchSwitchCreatePromo(value) {
  store.dispatch(switchCreatePromo(value));
}
function dispatchSetDataTypePromo(value) {
  store.dispatch(setDataTypePromo(value));
}
function dispatchAddItemPromo(value) {
  store.dispatch(addItemPromo(value));
}
function dispatchReduceItemPromo(value) {
  store.dispatch(reduceItemPromo(value));
}
function dispatchSeclectItemPartnerPromo(value) {
  store.dispatch(handleSelectItemPartner(value));
}
function dispatchSeclectNumbItem(value) {
  store.dispatch(handleSelectNumbItemPromo(value));
}
function dispatchSelectItemInkind(value) {
  store.dispatch(handleSelectItemInkind(value));
}
function dispatchSelectCoinEent(value) {
  store.dispatch(handleSelectCoinEvent(value));
}
function dispatchResetItemRewards() {
  store.dispatch(resetItemRewards());
}
export {
  dispatchSwitchLogin,
  dispatchSetAccessToken,
  dispatchSetToken,
  dispatchShowImagesNews,
  dispatchSetUrlImage,
  dispatchTypeEventByMoney,
  dispatchNameEventByMoney,
  dispatchListPartner,
  dispatchDetailPromoAndEvent,
  dispatchSwitchCreatePromo,
  dispatchSetDataTypePromo,
  dispatchAddItemPromo,
  dispatchReduceItemPromo,
  dispatchSeclectItemPartnerPromo,
  dispatchSeclectNumbItem,
  dispatchSelectItemInkind,
  dispatchSelectCoinEent,
  dispatchResetItemRewards
};
