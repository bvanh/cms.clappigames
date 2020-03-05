import React, { useState, useEffect } from "react";
import Login from "./components/login";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { connect } from "react-redux";
import Danhsach from "./components/users/listUsers";
import Detail from "./components/users/userDetail";
import NewsEditor from "./components/news/newsEdit";
import ListNews from "./components/news/index";
import AddNews from "./components/news/addnews";
import ListImages from "./components/media/index";
import Album from './components/media/album/album'
import UpdateAlbum from './components/media/album/update'
import ListCoin from './components/payment/coin/listCoin/listCoin'
import ListPartnerItems from "./components/payment/item/listPartnerProduct/index";
import EditProductCoin from './components/payment/coin/listCoin/editCoin'
import EditPartnerProductItem from './components/payment/item/listPartnerProduct/editItems'
import CreatePromotion from './components/payment/promotion/create/index'
import ListPromoAndEvent from './components/payment/promotion/list/index'
import DetailPromotion from './components/payment/promotion/detail/index'
import { ApolloProvider } from "@apollo/react-hooks";
import ApolloClient from "apollo-boost";
import { importImage } from "./utils/importImg";
import checkTokenFinal from "./utils/checkToken";
import { dispatchSwitchLogin, dispatchListPartner } from "./redux/actions/index";
import { Layout, Menu, Icon, Dropdown } from "antd";
import "./static/style/menu.css";
import CreateProductCoin from "./components/payment/coin/listCoin/addnewCoin";
const { SubMenu } = Menu;
const { Header, Content, Footer, Sider } = Layout;
checkTokenFinal();
function App(props) {
  const userName = localStorage.getItem("userNameCMS");
  if (props.isLogin === false || props.isLogin === null) {
    return (
      <Router>
        <Route path="/" render={() => <Login />} />
      </Router>
    );
  }
  checkTokenFinal();
  const client = new ApolloClient({
    uri: "https://api.cms.cubegame.vn/graphql",
    headers: {
      Authorization: `Bearer ${props.token.accessToken}`
    }
  });
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
              left: 0
            }}
            onBreakpoint={broken => {
              console.log(broken);
            }}
            onCollapse={(collapsed, type) => {
              console.log(collapsed, type);
            }}
          >
            <div className="logo">
              <img src={importImage["logoclappigames.png"]} width="100%" />
            </div>
            <Menu theme="dark" mode="inline" defaultSelectedKeys={["1"]}>
              <Menu.Item key="1">
                <Link to="/">
                  <Icon type="idcard" />
                  <span className="nav-text">USERS</span>
                </Link>
              </Menu.Item>
              <Menu.Item key="2">
                <Link to="/news">
                  <Icon type="read" />
                  <span className="nav-text">NEWS</span>
                </Link>
              </Menu.Item>
              <Menu.Item key="3">
                <Link to="/media">
                  <Icon type="picture" />
                  <span className="nav-text">MEDIA</span>
                </Link>
              </Menu.Item>
              <SubMenu
                key="sub1"
                title={
                  <span>
                    <Icon type="line-chart" />
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
                <Menu.Item key="7"> <Link to="/payment/promotion">Promotion</Link></Menu.Item>
              </SubMenu>
              <Menu.Item key="9">
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
                padding: "2.5rem 2rem",
                background: "white"
              }}
            >
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
              <Route exact path="/media" render={() => <ListImages />} />
              <Route exact path="/media/album" render={() => <Album />} />
              <Route exact path="/media/album/edit" render={() => <UpdateAlbum />} />
              <Route
                exact
                path="/payment/items"
                render={() => <ListPartnerItems />}
              />
              <Route
                exact
                path="/payment/items/edit"
                render={() => <EditPartnerProductItem />}
              />
              <Route
                exact
                path="/payment/coin"
                render={() => <ListCoin />}
              />
              <Route
                exact
                path="/payment/coin/edit"
                render={() => <EditProductCoin />}
              />
               <Route
                path="/payment/promotion/create"
                render={() => <CreatePromotion />}
              />
              <Route
                exact
                path="/payment/promotion"
                render={() => <ListPromoAndEvent />}
              />
              <Route
                path="/payment/promotion/detail/promotion"
                render={() => <DetailPromotion />}
              />
            </Content>
            <Footer style={{ textAlign: "center", bottom: '0', width: '100%' }}>LUSSOM ©2020</Footer>
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
