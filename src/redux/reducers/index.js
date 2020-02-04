import { actions } from "../action_types/index";
const initialState = {
  isLogin: "",
  dataNews: [],
  dataContent: []
};
export default (state = initialState, action) => {
  switch (action.type) {
    // case actions.GET_DATA:
    //   return { ...state, dataNews: action.payload.data.content };
    // case actions.GET_CONTENT:
    //   return { ...state, dataContent: action.payload.data };
    case actions.CHECK_LOGIN:
      return { ...state, isLogin: action.payload };
    default:
      return state;
  }
};
