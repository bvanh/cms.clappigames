import React, { Component, useState } from "react";
import { Select } from "antd";
import { getPromotionType } from "../../../../../utils/queryPaymentAndPromoType";
import { queryGetPlatform } from "../../../../../utils/queryPlatform";
import { useQuery } from "@apollo/react-hooks";
const { Option } = Select;

function MenuRewardByItem(props) {
  const { server } = props;

  const { listServer } = props.typePromo;
  const [listGame, setListGame] = useState([{}])
  const [listTypePromo, setListTypePromo] = useState([
    { name: "", description: "" }
  ]);
  useQuery(getPromotionType, {
    onCompleted: data => {
      setListTypePromo(data.__type.enumValues);
    }
  });
  useQuery(queryGetPlatform, {
    onCompleted: data => {
      setListGame(data.listPartners);
    }
  });
  const printPromoType = listTypePromo.map((val, index) => (
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
    <div className="promo-section2">
      <div className="promo-choose-platform">
        <div className="promo-choose-platform-name">
          <h3>Chọn game:</h3>
          <Select
            style={{ width: "65%" }}
            onChange={props.handleChangePlatform}
            placeholder="-Chọn game-"
          >
            {printPlatform}
          </Select>{" "}
        </div>
        <div className="promo-choose-platform-server">
          <h3>Server:</h3>
          <Select
            placeholder="-Chọn server-"
            style={{ width: "65%" }}
            onChange={props.handleChangeServer}
            name="server"
          >
            {printListServer}
          </Select>{" "}
        </div>
      </div>
      <div className="promo-choose-platform-name">
        <h3 style={{ marginRight: "1.5rem" }}>Hình thức:</h3>
        <Select
          style={{ width: "65%" }}
          onChange={props.handleChangeTypePromo}
          placeholder="-Tặng quà-"
        >
          {printPromoType}
        </Select>{" "}
      </div>
    </div>
  );
}
export default MenuRewardByItem;
