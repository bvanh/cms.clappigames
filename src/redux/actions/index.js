import { actions } from "../action_types/index";
import store from "../store/index";

// const getData = payload => {
//   return {
//     type: actions.GET_DATA,
//     payload
//   };
// };
// const getContentNews = payload => {
//   return {
//     type: actions.GET_CONTENT,
//     payload
//   };
// };
// function dispatchGetData(data) {
//   store.dispatch(getData(data));
// }
// function dispatchGetContentNews(data) {
//   store.dispatch(getContentNews(data));
// }
const switchLogin = payload => {
  return {
    type: actions.SWITCH_LOGIN,
    payload
  };
};
function dispatchSwitchLogin(data) {
  store.dispatch(switchLogin(data));
}
export { dispatchSwitchLogin };
