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
const checkLogin = payload => {
  return {
    type: actions.CHECK_LOGIN,
    payload
  };
};
function dispatchCheckLogin(data) {
  store.dispatch(checkLogin(data));
}
export { dispatchCheckLogin };
