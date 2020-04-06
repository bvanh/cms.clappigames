const ROOT_URL = "https://api.cms.cubegame.vn/auth";
const apiLogin = {
  rootApiLogin: ROOT_URL + "/login/test",
  getSig: ROOT_URL + "/duo/call?username=",
  checkLoginFinal: ROOT_URL + "/duo/verify"
};
const apiToken = {
  REFRESHTOKEN: ROOT_URL + "/token/renew"
};
export { apiLogin, apiToken };
