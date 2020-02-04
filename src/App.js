import React, { useState, useEffect } from "react";
import "./App.css";
import Login from "./components/login";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { connect } from "react-redux";
import Danhsach from "./components/users/listUsers";
import Detail from "./components/users/userDetail";
import UpdateInforUser from './components/users/updateUser'
import { ApolloProvider } from "@apollo/react-hooks";
import ApolloClient from "apollo-boost";
import checkTokenFinal from "./utils/checkToken";

checkTokenFinal();
function App(props) {
  if (props.isLogin === false || props.isLogin === null) {
    return (
      <Router>
        <Route path="/" render={() => <Login />} />
      </Router>
    );
  }
  const token = JSON.parse(localStorage.getItem("accessTokenCms"));
  const client = new ApolloClient({
    uri: "https://api.cms.cubegame.vn/graphql",
    headers: {
      Authorization: `Bearer ${token.accessToken}`
    }
  });
  return (
    <ApolloProvider client={client}>
      <Router>
        <Route exact path="/" render={() => <Danhsach />} />
        <Route exact path="/users/detail" render={props => <Detail {...props} />} />
        <Route exact path="/users/detail/update" render={props => <UpdateInforUser {...props} />} />
      </Router>
    </ApolloProvider>
  );
}
function mapStateToProps(state) {
  return {
    isLogin: state.isLogin
  };
}
export default connect(mapStateToProps, null)(App);
