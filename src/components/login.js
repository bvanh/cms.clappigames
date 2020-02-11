import React, { useState } from "react";
import { Form, Icon, Input, Button } from "antd";
import { getTokenAndLogin, getDuoIndex } from "../utils/checkLogin";
import { connect } from "react-redux";
import {
  dispatchSwitchLogin,
  dispatchSetAccessToken
} from "../redux/actions/index";
import DuoWebSDK from "duo_web_sdk";
import { apiLogin } from "../api/urlLogin";
import "../App.css";
import "../static/style/login.css";
const SHOW_IFRAME = "SHOW_IFRAME";
function NormalLoginForm(props) {
  const [alertLogin, setAlertLogin] = useState("");
  const { getFieldDecorator } = props.form;
  const [duoAuthState, setDuoAuthState] = useState("");
  const handleSubmit = async e => {
    e.preventDefault();
    props.form.validateFields((err, values) => {
      if (!err) {
        let statusLogin = getTokenAndLogin(values.username, values.password);
        statusLogin.then(result => {
          if (result.status !== 1001 && result.status !== 1002) {
            let getSig = getDuoIndex(values.username);
            getSig.then(val => {
              // getTokenAndLogin(values.username, values.password);
              setDuoAuthState(SHOW_IFRAME);
              initDuoFrame(val);
            });
            localStorage.setItem("userNameCMS", values.username);
          }else{
            setAlertLogin(result.message)
          }
        });
      }
    });
  };
  function initDuoFrame(json) {
    console.log(json);
    // initialize the frame with the parameters
    // we have retrieved from the server
    DuoWebSDK.init({
      value: "dsaffa",
      iframe: "duo-frame",
      host: json.api_hostname,
      sig_request: json.sig_request,
      submit_callback: submitPostAction.bind(this)
    });
  }
  function submitPostAction(form) {
    fetch(apiLogin.checkLoginFinal, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      method: "POST",
      body: `sig_response=${form.sig_response.value}`
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          dispatchSwitchLogin(false);
          localStorage.removeItem("userNameCMS");
        }
      })
      .then(result => {
        let userToken = { token: result, timestamp: new Date().getTime() };
        let userAccessToken = {
          accessToken: result.accessToken,
          timestamp: new Date().getTime()
        };
        localStorage.setItem("tokenCms", JSON.stringify(userToken));
        localStorage.setItem("accessTokenCms", JSON.stringify(userAccessToken));
        dispatchSetAccessToken(userAccessToken);
        dispatchSwitchLogin(true);
      })
      .catch(error => console.log(error));
  }
  const goToForm = () => {
    setDuoAuthState("");
  };
  if (duoAuthState === SHOW_IFRAME) {
    return (
      <>
        <iframe id="duo-frame" />
        <span onClick={goToForm}>BACK</span>
      </>
    );
  }
  return (
    <div className="App">
      <Form onSubmit={handleSubmit} className="login-form">
        <Form.Item>
          {getFieldDecorator("username", {
            rules: [{ required: true, message: "Please input your username!" }]
          })(
            <Input
              prefix={<Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />}
              placeholder="Username"
            />
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator("password", {
            rules: [{ required: true, message: "Please input your Password!" }]
          })(
            <Input
              prefix={<Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />}
              type="password"
              placeholder="Password"
            />
          )}
        </Form.Item>
          <p className="res-login">{alertLogin}</p>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
          >
            Log in
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

const Login = Form.create({ name: "normal_login" })(NormalLoginForm);
function mapStateToProps(state) {
  return {
    userToken: state.userToken,
    accessToken: state.userAccessToken
  };
}
export default connect(mapStateToProps, null)(Login);
