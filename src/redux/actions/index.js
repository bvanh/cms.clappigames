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
function dispatchDetailPromo(value) {
  store.dispatch(getDetailPromo(value));
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
  dispatchDetailPromo
};
