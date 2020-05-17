import React, { useState, useEffect, useMemo } from "react";
import { Button, Row, Col, Icon, Radio, Tabs, Select, Input } from "antd";
import { alertErrorServer } from "../../../../../utils/alertErrorAll";
import { connect } from "react-redux";
import { queryGetPlatform } from "../../../../../utils/queryPlatform";
import { getListPartnerProducts } from "../../../../../utils/queryPartnerProducts";
import { getListServer } from "../../../../../utils/query/promotion";
import { useQuery, useLazyQuery } from "react-apollo";
import { dispatchListPartner } from "../../../../../redux/actions/index";
const { Option } = Select;
function TypePromotion(props) {
  const [itemsForEventTypeItem, setItemForEventTypeItem] = useState([
    { productName: "", partnerProductId: "" },
  ]);
  const [listGame, setListGame] = useState([
    { partnerId: "", partnerName: "" },
  ]);
  const [listServer, setListServer] = useState([
    { server: 0, serverName: "All server" },
  ]);
  const { type, shop, gameId, serverId } = props.detailPromo;
  const [getListGame] = useLazyQuery(queryGetPlatform, {
    fetchPolicy: "cache-and-network",
    onCompleted: (data) => {
      setListGame(data.listPartners);
      dispatchListPartner(data.listPartners);
    },
    onError: (index) => alertErrorServer(index.message),
  });
  const [getServers] = useLazyQuery(getListServer(gameId), {
    fetchPolicy: "cache-and-network",
    onCompleted: (data) => {
      setListServer([
        {
          server: 0,
          serverName: "All server",
        },
        ...data.listPartnerServers,
      ]);
    },
    onError: (index) => alertErrorServer(index.message),
  });
  const [getPartnerProducts] = useLazyQuery(getListPartnerProducts(gameId), {
    fetchPolicy: "cache-and-network",
    onCompleted: (data) => {
      setItemForEventTypeItem(data.listPartnerProducts);
    },
    onError: (index) => alertErrorServer(index.message),
  });
  useMemo(() => getListGame(), [gameId]);
  useMemo(() => getServers(), [gameId]);
  useMemo(() => getPartnerProducts(), [gameId]);
  const printListItems = itemsForEventTypeItem.map((val, index) => (
    <Option
      value={`{"id":"${val.partnerProductId}","name":"${val.productName}"}`}
      key={index}
    >
      {val.productName}
    </Option>
  ));
  const tranformValue = (arr) => arr.map((val) => JSON.stringify(val));
  if (shop) {
    console.log(JSON.parse(shop));
    const { data } = JSON.parse(shop);
    const printStep = data.map(function (firtRow, index1) {
      const printDetailStep = firtRow.detail.map(function (secondRow, index2) {
        const printReward = secondRow.thresholds.map((thirdRow, index3) => (
          <div key={index3 + "a"} style={{ display: "flex" }}>
            {/* <Icon type="minus" onClick={() => reduceReward(index1, index2, index3)} style={{ fontSize: "16px", margin: '0 .25rem' }} className={lengthThreholds(index1, index2) - 1 === index3 ? 'showDeletePresent' : "hideDeletePresent"} /> */}
            <Input
              value={
                data[index1].detail[index2].thresholds[index3].quantity
              }
              placeholder="số"
              type="number"
              name="pucharseTimes"
              style={{ width: "20%" }}
            ></Input>
            <Select
              mode="multiple"
              placeholder="quà"
              // default
              value={tranformValue(
                data[index1].detail[index2].thresholds[index3].rewards
              )}
              style={{ width: "80%" }}
              dropdownClassName="dropdown-coin-event"
              showArrow={false}
            >
              {printListItems}
            </Select>{" "}
          </div>
        ));
        return (
          <Row md={20} key={index2 + "b"}>
            <Col md={8} style={{ display: "flex" }}>
              {/* <Icon type="minus" onClick={() => reduceStep(index1, index2)} style={{ fontSize: "16px", margin: '0 .25rem' }} /> */}
              <Input
                value={data[index1].detail[index2].requiredQuantity}
                placeholder="số lượng item"
                type="number"
                min={
                  index2 > 0
                    ? data[index1].detail[index2 - 1].requiredQuantity
                    : 0
                }
                name="pucharseTimes"
                // onChange={e => handleChooseNumbItems(index1, index2, e.target.value)}
                style={{ width: "100%" }}
              ></Input>
              <Input
                value={data[index1].detail[index2].description}
                placeholder="description"
                name="description"
                style={{ width: "100%" }}
              ></Input>
            </Col>
            <Col md={16}>{printReward}</Col>
          </Row>
        );
      });
      return (
        <div>
          <Col md={6} key={index1 + "c"} style={{ display: "flex" }}>
            {/* <Icon type="minus" onClick={() => reduceItems(index1)} style={{ fontSize: "16px", margin: '0 .25rem' }} className={data.length - 1 === index1 ? 'showDeletePresent' : "hideDeletePresent"} /> */}
            <Select
              placeholder="tên item"
              value={`{"id":"${data[index1].productId}","name":"${data[index1].productName}"}`}
              style={{ width: "100%" }}
              dropdownClassName="dropdown-coin-event"
              showArrow={false}
            >
              {printListItems}
            </Select>{" "}
          </Col>
          <Col md={18}>{printDetailStep}</Col>
        </div>
      );
    });
    // const printItem = indexShop.map(function (val, index1) {
    //   const printReward = val.rewards.map((valReward, index2) => (
    //     <div key={index2} className="more-reward-detail">
    //       <Input
    //         value={indexShop[index1].rewards[index2].numb}
    //         type="number"
    //         max="10"
    //         name="pucharseTimes"
    //         style={{ width: "19%", marginRight: "2%" }}
    //       ></Input>
    //       <Select
    //         mode="multiple"
    //         style={{ width: "79%" }}
    //         dropdownClassName="dropdown-coin-event"
    //         showArrow={false}
    //         value={indexShop[index1].rewards[index2].itemId}
    //       >
    //         {printListItems}
    //       </Select>{" "}
    //     </div>
    //   ));
    //   return (
    //     <div key={index1}>
    //       <Col md={12} className="more-items-detail">
    //         <Input
    //           value={indexShop[index1].purchaseTimes}
    //           type="number"
    //           max="10"
    //           name="pucharseTimes"
    //           style={{ width: "20%", marginRight: "2%" }}
    //         ></Input>
    //         <Select
    //           value={indexShop[index1].purchaseItemId}
    //           style={{ width: "78%" }}
    //           dropdownClassName="dropdown-coin-event"
    //           showArrow={false}
    //         >
    //           {printListItems}
    //         </Select>{" "}
    //       </Col>
    //       <Col md={12}>{printReward}</Col>
    //     </div>
    //   );
    // });
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
              value={gameId}
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
              value={serverId}
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
        {printStep}
      </Row>
    );
  } else {
    return <p>loadding...</p>;
  }
}

function mapStateToProps(state) {
  return {
    detailPromo: state.detailPromo,
  };
}
export default connect(mapStateToProps, null)(TypePromotion);
