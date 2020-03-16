import React, { Component, useState } from "react";
import { useQuery } from "@apollo/react-hooks";
import "../../../../../static/style/promotion.css";
import { connect } from "react-redux";
import { queryGetPlatform } from "../../../../../utils/queryPlatform";
import { getPromotionType } from "../../../../../utils/queryPaymentAndPromoType";
import { Select } from "antd";
const { Option } = Select;

function MenuRewardByItem(props) {
  const { type } = props.indexPromoAndEvent;
  const { server, platformId } = props.indexGameForPromo;
  const { listServer } = props.listPartner;
  const [listType, setListType] = useState([{ name: "", description: "" }]);
  const [listGame, setListGame] = useState([{}]);
  const { data } = useQuery(queryGetPlatform, {
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
              disabled={props.isTimeInPromo}
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
              disabled={props.isTimeInPromo}
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
            value={type}
            disabled={props.isTimeInPromo}
          >
            {printPromoType}
          </Select>{" "}
        </div>
      </div>
    );
}
function mapStateToProps(state) {
  return {
    detailPromo: state.detailPromo,
    listPartners:state.listPartner
  };
}
export default connect(mapStateToProps, null)(MenuRewardByItem);
