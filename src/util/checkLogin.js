import fetch from "isomorphic-unfetch";
import apiLogin from "../api/urlLogin";

function checkUserName(username, password) {
  fetch(apiLogin.rootApiLogin, {
    headers: { "Content-Type": "application/json" },
    method: "POST",
    body: `username=${username}&password=${password}`
  })
    .then(response => {
      resStatus = response.status;
      return response.json();
    })
    .then(result => console.log(result))
    .catch(error => {
      console.log("Request failed", error);
    });
}
