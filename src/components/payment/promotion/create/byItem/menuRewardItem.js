import React, { Component } from "react";
import { Select } from "antd";
const { Option } = Select;

function MenuRewardByItem(props) {
  const { server } = props;

  const { type, listGame, listServer } = props.typePromo;
  const printPromoType = type.map((val, index) => (
    <Option value={val.name} key={index}>
      {val.description}
    </Option>
  ));
  const printPlatform = listGame.map((val, i) => (
    <Option value={val.partnerId} key={i}>
      {val.partnerName}
    </Option>
  ));
  const printListServer = listServer.map((val, index) => (
    <Option value={val.server} key={index}>
      {val.serverName}
    </Option>
  ));
  return (
    <div>
      <p className="promotion-title-field">Chọn game</p>
      <Select
        style={{ width: 120 }}
        onChange={props.handleChangePlatform}
        placeholder="-Chọn game-"
      >
        {printPlatform}
      </Select>{" "}
      <span>Hình thức</span>
      <Select style={{ width: 120 }} onChange={props.handleChaneIndexPromo}>
        {printPromoType}
      </Select>{" "}
      <span>Server</span>
      <Select
        placeholder="-Chọn server-"
        style={{ width: 120 }}
        onChange={props.handleChangeServer}
        name="server"
        value={server}
      >
        {printListServer}
      </Select>{" "}
    </div>
  );
}
export default MenuRewardByItem;
