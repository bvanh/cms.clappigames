import React, { useState, useEffect, useMemo } from "react";
import { Button, Row, Col, Icon, Radio, Tabs, Select, Input } from "antd";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { queryGetPlatform } from "../../../../../utils/queryPlatform";
import { getDetailPromotion } from "../../../../../utils/query/promotion";
import { getListPartnerProducts } from "../../../../../utils/queryPartnerProducts";
import { getListServer } from "../../../../../utils/query/promotion";
import { useQuery, useLazyQuery } from "react-apollo";
const { Option } = Select;
function TypePromotion(props) {
  const [itemsForEventTypeItem, setItemForEventTypeItem] = useState([
    { productName: "", partnerProductId: "" }
  ]);
  const [listGame, setListGame] = useState([
    { partnerId: "", partnerName: "" }
  ]);
  const [listServer, setListServer] = useState([
    { server: 0, serverName: "All server" }
  ]);
  const {
    name,
    status,
    eventTime,
    type,
    shop,
    game,
    server
  } = props.detailPromo;
  const [getListGame] = useLazyQuery(queryGetPlatform, {
    fetchPolicy:"cache-and-network",
    onCompleted: data => setListGame(data.listPartners)
  });
  const [getServers] = useLazyQuery(getListServer(game), {
    fetchPolicy:"cache-and-network",
    onCompleted: data => {
      setListServer([
        {
          server: 0,
          serverName: "All server"
        },
        ...data.listPartnerServers
      ]);
    }
  });
  const [getPartnerProducts] = useLazyQuery(getListPartnerProducts(game), {
    fetchPolicy:"cache-and-network",
    onCompleted: data => {
      setItemForEventTypeItem(data.listPartnerProducts);
    }
  });
  useMemo(() => getListGame(), [game]);
  useMemo(() => getServers(), [game]);
  useMemo(() => getPartnerProducts(), [game]);
  const printListItems = itemsForEventTypeItem.map((val, index) => (
    <Option value={val.partnerProductId} key={index}>
      {val.productName}
    </Option>
  ));

  if (shop) {
    const indexShop = JSON.parse(shop);
    const printItem = indexShop.map(function(val, index1) {
      const printReward = val.rewards.map((valReward, index2) => (
        <div key={index2} className="more-reward-detail">
          <Input
            value={indexShop[index1].rewards[index2].numb}
            type="number"
            max="10"
            name="pucharseTimes"
            style={{ width: "19%", marginRight: "2%" }}
          ></Input>
          <Select
            mode="multiple"
            style={{ width: "79%" }}
            dropdownClassName="dropdown-coin-event"
            showArrow={false}
            value={indexShop[index1].rewards[index2].itemId}
          >
            {printListItems}
          </Select>{" "}
        </div>
      ));
      return (
        <div key={index1}>
          <Col md={12} className="more-items-detail">
            <Input
              value={indexShop[index1].purchaseTimes}
              type="number"
              max="10"
              name="pucharseTimes"
              style={{ width: "20%", marginRight: "2%" }}
            ></Input>
            <Select
              value={indexShop[index1].purchaseItemId}
              style={{ width: "78%" }}
              dropdownClassName="dropdown-coin-event"
              showArrow={false}
            >
              {printListItems}
            </Select>{" "}
          </Col>
          <Col md={12}>{printReward}</Col>
        </div>
      );
    });
    const printListGame = listGame.map((val, i) => (
      <Option value={val.partnerId} key={i}>
        {val.partnerName}
      </Option>
    ));
    const printListServer = listServer.map((val, i) => (
      <Option value={val.server} key={i}>
        {val.serverName}
      </Option>
    ));
    return (
      <Row>
        <h3>Promotion for Item</h3>
        <p>Type of present : {type}</p>
        <div className="detail-game">
          <span style={{ marginRight: "1rem" }}>
            Platform:{" "}
            <Select
              value={game}
              dropdownClassName="dropdown-coin-event"
              showArrow={false}
              size="large"
              className="select-disable-detail"
            >
              {printListGame}
            </Select>
          </span>
          <span>
            Server:{" "}
            <Select
              value={server}
              dropdownClassName="dropdown-coin-event"
              showArrow={false}
              size="large"
              className="select-disable-detail"
            >
              {printListServer}
            </Select>
            
          </span>
        </div>
        <div style={{ width: "100%" }} className="section4-promotion-title">
          <div style={{ width: "50%", display: "flex" }}>
            <div style={{ width: "22%" }}>The mount of item</div>
            <div style={{ width: "78%" }}>Item</div>
          </div>
          <div style={{ width: "50%", display: "flex", paddingLeft: "1.5rem" }}>
            <div style={{ width: "22%" }}>Amount</div>
            <div style={{ width: "78%" }}>Present</div>
          </div>
        </div>
        {printItem}
      </Row>
    );
  } else {
    return <p>loadding...</p>;
  }
}

function mapStateToProps(state) {
  return {
    detailPromo: state.detailPromo
  };
}
export default connect(mapStateToProps, null)(TypePromotion);
