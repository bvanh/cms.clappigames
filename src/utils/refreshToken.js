import fetch from "isomorphic-unfetch";
import { apiToken, apiLogin } from "../api/urlLogin";

const getRefreshToken = thisObj => {
  const userToken = JSON.parse(localStorage.getItem("tokenCms"));
  const currentTime = new Date().getTime();
  if (userToken === null || currentTime - userToken.timestamp > 75168000000) {
    thisObj.props.logInOut(false);
    return false;
  } else {
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
        localStorage.setItem(
          "accessTokenCms",
          JSON.stringify(userAccessToken)
        );
        return result;
      })
      .catch(function(error) {
        console.log("Request failed", error);
      });
    return db;
  }
};
export default getRefreshToken;
