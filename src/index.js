import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { Provider } from "react-redux";
import store from "./redux/store/index";
import { ApolloProvider } from "@apollo/react-hooks";
import ApolloClient from "apollo-boost";
import { gql } from "apollo-boost";
const client = new ApolloClient({
  uri: "https://api.cms.cubegame.vn/graphql",
  headers: {
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiaWF0IjoxNTgwODA5NTkxLCJleHAiOjE1ODA4MTMxOTF9.Z1PALRzN9jGX7zGjpEGEyK0krQrw2NtE_fOr8BUw0gw"
  }
});
// client
//   .query({
//     query: gql`
//       {
//         listUsers {
//           userId
//           username
//           fakeId
//           type
//           nickname
//           coin
//           email
//           identifyCard
//         }
//       }
//     `
//   })
//   .then(result => console.log(result));
ReactDOM.render(
  <ApolloProvider client={client}>
    <Provider store={store}>
      <App />
    </Provider>
  </ApolloProvider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
