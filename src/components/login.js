import React, { useState } from "react";
import { Form, Icon, Input, Button, Checkbox } from "antd";
import { getToken, getDuoIndex, chekDuo } from "../utils/checkLogin";
import DuoWebSDK from "duo_web_sdk";
import apiLogin from "../api/urlLogin";
import "../App.css";
const STATE_AUTH_PASSED = "STATE_AUTH_PASSED";
const STATE_AUTH_FAILED = "STATE_AUTH_FAILED";
const STATE_AUTH_PENDING = "STATE_AUTH_PENDING";
const SHOW_IFRAME = "SHOW_IFRAME";
function NormalLoginForm(props) {
  const { getFieldDecorator } = props.form;
  const [getSigRequest, setSigRequest] = useState("");
  const [duoAuthState, setDuoAuthState] = useState(STATE_AUTH_PENDING);
  const handleSubmit = async e => {
    e.preventDefault();
    props.form.validateFields((err, values) => {
      if (!err) {
        getToken(values.username, values.password);
        let getSig = getDuoIndex(values.username);
        getSig.then(val => {
          setDuoAuthState(SHOW_IFRAME);
          initDuoFrame(val);
        });
      }
    });
  };
  function initDuoFrame(json) {
    console.log(json);
    // initialize the frame with the parameters
    // we have retrieved from the server
    DuoWebSDK.init({
      iframe: "duo-frame",
      host: json.api_hostname,
      sig_request: json.sig_request,
      submit_callback: submitPostAction.bind(this)
    });
  }
  function submitPostAction(form) {
    console.log("form");
    // // Submit the signed response to our backend for verification.
    // const data = JSON.stringify({ signedResponse: form.sig_response.value });
    fetch(apiLogin.checkLoginFinal, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      method: "POST",
      body: `sig_response=${form.sig_response.value}`
    })
      .then(response => {
        console.log(response);
        if (response.ok) {
          setDuoAuthState(STATE_AUTH_PASSED);
          console.log(response);
        } else {
          setDuoAuthState(STATE_AUTH_FAILED);
        }
      })
      .catch(error => console.log(error));
  }
  let content = "";
  switch (duoAuthState) {
    case STATE_AUTH_PASSED:
      content = <h3>Successfully passed Duo Authentication!</h3>;
      break;
    case STATE_AUTH_FAILED:
      content = <h3>fail</h3>;
      break;
    case SHOW_IFRAME:
      content = <iframe id="duo-frame" />;
      break;
    default:
      content = (
        <Form onSubmit={handleSubmit} className="login-form">
          <Form.Item>
            {getFieldDecorator("username", {
              rules: [
                { required: true, message: "Please input your username!" }
              ]
            })(
              <Input
                prefix={
                  <Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />
                }
                placeholder="Username"
              />
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator("password", {
              rules: [
                { required: true, message: "Please input your Password!" }
              ]
            })(
              <Input
                prefix={
                  <Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />
                }
                type="password"
                placeholder="Password"
              />
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator("remember", {
              valuePropName: "checked",
              initialValue: true
            })(<Checkbox>Remember me</Checkbox>)}
            <a className="login-form-forgot" href="">
              Forgot password
            </a>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
            >
              Log in
            </Button>
            Or <a href="">register now!</a>
          </Form.Item>
        </Form>
      );
      break;
  }
  return <div className="App">{content}</div>;
}

const Login = Form.create({ name: "normal_login" })(NormalLoginForm);
export default Login;
