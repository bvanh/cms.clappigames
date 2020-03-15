import React, { Component, useState } from "react";
import { Select } from "antd";
import { getPromotionType } from "../../../../../utils/queryPaymentAndPromoType";
import { queryGetPlatform } from "../../../../../utils/queryPlatform";
import { getListServer } from "../../../../../utils/query/promotion";
import { useQuery } from "@apollo/react-hooks";
import {connect} from 'react-redux'
const { Option } = Select;

function MenuRewardByItem(props) {
  const { platformId, server } = props.indexGameForPromo;
  const { type} = props.indexPromoAndEvent;
  const [listGame, setListGame] = useState([{}]);
  const [listServer, setListServer] = useState([
    {
      server: 0,
      serverName: "All server"
    }
  ]);
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
  useQuery(getListServer(platformId), {
    onCompleted: data => {
      setListServer([...listServer, ...data.listPartnerServers]);
    }
  });
  const printPromoType = listTypePromo.map((val, index) => (
    <Option value={val.name} key={index}>
      {val.description}
    </Option>
  ));
  const printPlatform = props.listPartners.map((val, i) => (
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
            onChange={props.handleChangePlatformPromo}
            placeholder="-Chọn game-"
            value={platformId}
          >
            {printPlatform}
          </Select>{" "}
        </div>
        <div className="promo-choose-platform-server">
          <h3>Server:</h3>
          <Select
            placeholder="-Chọn server-"
            style={{ width: "65%" }}
            onChange={props.handleChangeServerPromo}
            name="server"
            value={server}
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
          value={type}
        >
          {printPromoType}
        </Select>{" "}
      </div>
    </div>
  );
}
function mapStateToProps(state) {
  return {
    listPartners:state.listPartner
  };
}
export default connect(mapStateToProps, null)(MenuRewardByItem);
