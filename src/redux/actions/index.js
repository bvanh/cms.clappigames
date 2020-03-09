import { actions } from "../action_types/index";
import store from "../store/index";

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
  }
}
const setNameEventByMoney = value => {
  return {
    type: actions.SET_NAME_EVENT,
    value
  }
}
const setListPartner = value => {
  return {
    type: actions.GET_LISTPARTNER,
    value
  }
}
const getDetailPromo = value => {
  return {
    type: actions.GET_DETAIL_PROMO,
    value
  }
}
const switchCreatePromo = value => {
  return {
    type: actions.SWITCH_CREATE_PROMO,
    value
  }
}
const setDataTypePromo = value => {
  return {
    type: actions.SET_DATA_TYPEPROMO,
    ...value
  }
}
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
  store.dispatch(setDataTypePromo(value))
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
  dispatchSetDataTypePromo
};
