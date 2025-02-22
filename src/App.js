import React, { useState, useEffect } from "react";
import Login from "./components/login";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import { connect } from "react-redux";
import Danhsach from "./components/users/listUsers";
import Detail from "./components/users/userDetail";
import NewsEditor from "./components/news/newsEdit";
import ListNews from "./components/news/index";
import AddNews from "./components/news/addnews";
import ListImages from "./components/media/index";
import Album from "./components/media/album/album";
import UpdateAlbum from "./components/media/album/update";
import CoinsContainer from "./components/payment/coin/index";
import ItemsContainer from "./components/payment/item/index";
import EditProductCoin from "./components/payment/coin/listCoin/editCoin";
import EditPartnerProductItem from "./components/payment/item/listPartnerProduct/editItems";
import CreatePromotion from "./components/payment/promotion/create/index";
import Stats from "./components/stats/index";
import Partner from "./components/partner/index";
import ListPromoAndEvent from "./components/payment/promotion/list/index";
import DetailPromotion from "./components/payment/promotion/detail/promotion/index";
import DetailEvent from "./components/payment/promotion/detail/event/index";
import ListChargesDetail from "./components/payment/coin/listCharges/detail";
import ListPartnerChargesDetail from "./components/payment/item/partnerCharges/detail";
import routers from "./components/routers";
import { ApolloProvider } from "@apollo/react-hooks";
import ApolloClient from "apollo-boost";
import { importImage } from "./utils/importImg";
import checkTokenFinal from "./utils/checkToken";
import { dispatchSwitchLogin } from "./redux/actions/index";
import { Layout, Menu, Icon, Dropdown } from "antd";
import "./static/style/menu.css";
import { is } from "immutable";
const { SubMenu } = Menu;
const { Header, Content, Footer, Sider } = Layout;
checkTokenFinal();
function App(props) {
  checkTokenFinal();
  setInterval(checkTokenFinal, 3300000);
  const userName = localStorage.getItem("userNameCMS");
  if (props.isLogin === false || props.isLogin === null) {
    return (
      <Router>
        <Route path="/" render={() => <Login />} />
      </Router>
    );
  }
  const client = new ApolloClient({
    uri: "https://api.cms.cubegame.vn/graphql",
    headers: {
      Authorization: `Bearer ${props.token.accessToken}`,
    },
  });
  const converPathname = () => {
    const pathName = window.location.pathname.slice(1);
    const checkPathName = pathName.indexOf("/");
    if (checkPathName > 0) {
      return checkPathName;
    } else {
      return pathName.length;
    }
  };
  const pathName = window.location.pathname.slice(1);
  const isMenu = pathName.slice(0, converPathname());
  const menu = (
    <Menu>
      <Menu.Item>
        <Link to="/" onClick={() => dispatchSwitchLogin(false)}>
          <Icon type="logout" />
          <span className="nav-text">LogOut</span>
        </Link>
      </Menu.Item>
    </Menu>
  );
  const printRouters = routers.map((val, index) => (
    <Route
      key={index}
      path={val.path}
      exact={val.exact}
      render={(props) => val.main(props)}
    />
  ));
  return (
    <ApolloProvider client={client}>
      <Router>
        <Layout>
          <Sider
            collapsedWidth="0"
            style={{
              overflow: "auto",
              height: "100vh",
              position: "fixed",
              left: 0,
            }}
            onBreakpoint={(broken) => {
              console.log(broken);
            }}
            onCollapse={(collapsed, type) => {
              console.log(collapsed, type);
            }}
          >
            <div className="logo">
              <img src={importImage["logoclappigames.png"]} width="100%" />
            </div>
            <Menu
              theme="dark"
              mode="inline"
              defaultSelectedKeys={isMenu === "" ? ["users"] : [isMenu]}
            >
              <Menu.Item key="users">
                <Link to="/">
                  <Icon type="idcard" />
                  <span className="nav-text">USERS</span>
                </Link>
              </Menu.Item>
              <Menu.Item key="news">
                <Link to="/news">
                  <Icon type="read" />
                  <span className="nav-text">NEWS</span>
                </Link>
              </Menu.Item>
              <Menu.Item key="media">
                <Link to="/media">
                  <Icon type="picture" />
                  <span className="nav-text">MEDIA</span>
                </Link>
              </Menu.Item>
              <SubMenu
                key="payment"
                title={
                  <span>
                    <Icon type="transaction" />
                    <span>Payment</span>
                  </span>
                }
              >
                <Menu.Item key="5">
                  <Link to="/payment/coin">C.coin</Link>
                </Menu.Item>
                <Menu.Item key="6">
                  <Link to="/payment/items">Item </Link>
                </Menu.Item>
                <Menu.Item key="7">
                  {" "}
                  <Link to="/payment/promotion">Promotion</Link>
                </Menu.Item>
              </SubMenu>
              <Menu.Item key="stats">
                <Link to="/stats">
                  <Icon type="line-chart" />
                  <span className="nav-text">STATS</span>
                </Link>
              </Menu.Item>
              <Menu.Item key="partner">
                <Link to="/partner">
                  <Icon type="cluster" />
                  <span className="nav-text">PARTNER</span>
                </Link>
              </Menu.Item>
              <Menu.Item key="logout">
                <Link to="/" onClick={() => dispatchSwitchLogin(false)}>
                  <Icon type="logout" />
                  <span className="nav-text">LogOut</span>
                </Link>
              </Menu.Item>
            </Menu>
          </Sider>
          <Layout style={{ marginLeft: 200 }}>
            <Header style={{ background: "#E5E5E5", padding: 0 }}>
              <Dropdown overlay={menu}>
                <a className="user-avatar">
                  {userName} <Icon type="caret-down" />
                </a>
              </Dropdown>
            </Header>
            <Content
              style={{
                overflow: "initial",
                padding: "2rem 2rem",
                background: "white",
              }}
            >
              {printRouters}
            </Content>
            <Footer style={{ textAlign: "center", bottom: "0", width: "100%" }}>
              LUSSOM ©2020
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
    token: state.accessToken,
  };
}
export default connect(mapStateToProps, null)(App);
