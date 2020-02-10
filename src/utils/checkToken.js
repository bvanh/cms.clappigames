import { dispatchSwitchLogin } from "../redux/actions/index";
import { apiToken, apiLogin } from "../api/urlLogin";

function checkToken() {
  const oldAccessToken = JSON.parse(localStorage.getItem("accessTokenCms"));
  const currentTime = new Date().getTime();
  if (oldAccessToken === null) {
    dispatchSwitchLogin(false);
  } else if (currentTime - oldAccessToken.timestamp > 3300000) {
    console.log("can refresh");
    return true;
  } else {
    console.log("k can refresh");
    return true;
  }
}
const getRefreshToken = () => {
  const userToken = JSON.parse(localStorage.getItem("tokenCms"));
  const currentTime = new Date().getTime();
  if (userToken === null || currentTime - userToken.timestamp > 75168000000) {
    dispatchSwitchLogin(false);
    return false;
  } else {
    const token = JSON.parse(localStorage.getItem("accessTokenCms"));
    const db = fetch(apiToken.REFRESHTOKEN, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      body: `refreshToken=${userToken.token.refreshToken}`
    })
      .then(response => response.json())
      .then(result => {
        let userAccessToken = {
          accessToken: result.accessToken,
          timestamp: new Date().getTime()
        };
        localStorage.setItem("accessTokenCms", JSON.stringify(userAccessToken));
        return result;
      })
      .catch(function(error) {
        console.log("Request failed", error);
      });
      console.log(token)
    return db;
  }
};
function checkTokenFinal() {
  if (checkToken()) {
   let demo= getRefreshToken();
   return demo;
  }
}
export default checkTokenFinal;
