import React, { useState, useEffect } from "react";
import "./App.css";
import Login from "./components/login";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Danhsach from "./components/users/listUsers";
import Detail from "./components/users/userDetail";

function App(props) {
  const [isLogin, setIsLogin] = useState("");
  if (isLogin === false || isLogin === null) {
    return (
      <Router>
        <Route path="/" render={() => <Login />} />
      </Router>
    );
  }
  return (
    <Router>
      <Route exact path="/" render={() => <Danhsach />} />
      <Route path="/users/detail" render={props => <Detail {...props} />} />
    </Router>
  );
}

export default App;
