import React, { Component, useState } from "react";
import { Select } from "antd";
import { getPromotionType } from "../../../../../utils/queryPaymentAndPromoType";
import { queryGetPlatform } from "../../../../../utils/queryPlatform";
import { getListServer } from "../../../../../utils/query/promotion";
import { useQuery } from "@apollo/react-hooks";
import { connect } from "react-redux";
import { indexAllServer } from "../../promoService";
import { alertErrorServer } from "../../../../../utils/alertErrorAll";
const { Option } = Select;

function MenuRewardByItem(props) {
  const { platformId, server } = props.indexGameForPromo;
  const { type } = props.indexPromoAndEvent;
  const [listGame, setListGame] = useState([{}]);
  const [listServer, setListServer] = useState([indexAllServer]);
  const [listTypePromo, setListTypePromo] = useState([
    { name: "", description: "" }
  ]);
  useQuery(getPromotionType, {
    fetchPolicy:"cache-and-network",
    onCompleted: data => {
      setListTypePromo(data.__type.enumValues);
    },
    onError: (index) =>
      alertErrorServer(index.message)
  });
  useQuery(queryGetPlatform, {
    onCompleted: data => {
      setListGame(data.listPartners);
    },
    onError: (index) =>
      alertErrorServer(index.message)
  });
  useQuery(getListServer(platformId), {
    onCompleted: data => {
      setListServer([...data.listPartnerServers, indexAllServer]);
    },
    onError: (index) =>
      alertErrorServer(index.message)
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
        <div>
          <div className="promo-choose-platform-name">
            <p>Platform:</p>
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
            <p>Server:</p>
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
          <p>Type of present :</p>
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
    </div>
  );
}
function mapStateToProps(state) {
  return {
    listPartners: state.listPartner
  };
}
export default connect(mapStateToProps, null)(MenuRewardByItem);
