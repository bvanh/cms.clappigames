import React, { useState, useEffect } from "react";
import "./App.css";
import Login from "./components/login";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { connect } from "react-redux";
import Danhsach from "./components/users/listUsers";
import Detail from "./components/users/userDetail";
import NewsEditor from "./components/news/newsEdit";
import ListNews from "./components/news/index";
import AddNews from "./components/news/addnews";
import Media from "./components/media/index";
import { ApolloProvider } from "@apollo/react-hooks";
import ApolloClient from "apollo-boost";
import checkTokenFinal from "./utils/checkToken";
import { Layout, Menu, Icon } from "antd";

const { Header, Content, Footer, Sider } = Layout;
checkTokenFinal();
function App(props) {
  if (props.isLogin === false || props.isLogin === null) {
    return (
      <Router>
        <Route path="/" render={() => <Login />} />
      </Router>
    );
  }
  
  // const token = JSON.parse(localStorage.getItem("accessTokenCms"));
  // // console.log(token);
  // // let demo = null;
  // let getToken = checkTokenFinal();
  // console.log(getToken)
  // // getToken.then(val => console.log(val));
  // // console.log(getToken)
  // // if (getToken === "none refresh") {
  // //   setAccessToken(token);
  // // } else {
  // //   getToken.then(val => setAccessToken(val.accessToken));
  // // }
  checkTokenFinal();
  const client = new ApolloClient({
    uri: "https://api.cms.cubegame.vn/graphql",
    headers: {
      Authorization: `Bearer ${props.token.accessToken}`
    }
  });
  return (
    <ApolloProvider client={client}>
      <Router>
        <Layout>
          <Sider
            collapsedWidth="0"
            style={{
              overflow: "auto"
              // height: '170vh',
              // position: 'fixed',
              // left: 0,
            }}
            onBreakpoint={broken => {
              console.log(broken);
            }}
            onCollapse={(collapsed, type) => {
              console.log(collapsed, type);
            }}
          >
            <div className="logo" />
            <Menu theme="dark" mode="inline" defaultSelectedKeys={["1"]}>
              <Menu.Item key="1">
                <Link to="/">
                  <Icon type="user" />
                  <span className="nav-text">USERS</span>
                </Link>
              </Menu.Item>
              <Menu.Item key="2">
                <Link to="/news">
                  <Icon type="video-camera" />
                  <span className="nav-text">NEWS</span>
                </Link>
              </Menu.Item>
              <Menu.Item key="3">
                <Link to="/media">
                  <Icon type="upload" />
                  <span className="nav-text">MEDIA</span>
                </Link>
              </Menu.Item>
              <Menu.Item key="4">
                <Icon type="user" />
                <span className="nav-text">CHARGES</span>
              </Menu.Item>
            </Menu>
          </Sider>
          <Layout>
            <Header style={{ background: "#fff", padding: 0 }} />
            <Content style={{ margin: "24px 16px 0" }}>
              <Route exact path="/" render={() => <Danhsach />} />
              <Route
                exact
                path="/users/detail"
                render={props => <Detail {...props} />}
              />
              <Route exact path="/news" render={() => <ListNews />} />
              <Route
                exact
                path="/news/edit"
                render={props => <NewsEditor {...props} />}
              />
              <Route exact path="/news/addnews" render={() => <AddNews />} />
              <Route exact path="/media" render={() => <Media />} />
            </Content>
            <Footer style={{ textAlign: "center" }}>
              Ant Design ©2018 Created by Ant UED
            </Footer>
          </Layout>
        </Layout>
      </Router>
    </ApolloProvider>
  );
}
function mapStateToProps(state) {
  return {
    isLogin: state.isLogin,
    token: state.accessToken
  };
}
export default connect(mapStateToProps, null)(App);
