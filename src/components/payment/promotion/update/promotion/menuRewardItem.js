import React, { Component, useState } from "react";
import { useQuery } from "@apollo/react-hooks";
import "../../../../../static/style/promotion.css";
import { queryGetPlatform } from "../../../../../utils/queryPlatform";
import { getPromotionType } from "../../../../../utils/queryPaymentAndPromoType";
import { Select } from "antd";
const { Option } = Select;

function MenuRewardByItem(props) {
  const { serverGame, platformPromoId, typePromo } = props.indexPromo;
  const { listServer } = props.typePromo;
  const [listType, setListType] = useState([{ name: "", description: "" }]);
  const [listGame, setListGame] = useState([{}]);
  useQuery(queryGetPlatform, {
    onCompleted: data => {
      setListGame(data.listPartners);
    }
  });
  useQuery(getPromotionType, {
    onCompleted: data => {
      setListType(data.__type.enumValues);
    }
  });
  const printPromoType = listType.map((val, index) => (
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
            value={platformPromoId}
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
            value={serverGame}
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
          value={typePromo}
        >
          {printPromoType}
        </Select>{" "}
      </div>
    </div>
  );
}
export default MenuRewardByItem;
