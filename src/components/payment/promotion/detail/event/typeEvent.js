import React, { useState, useEffect, useMemo } from "react";
import { Button, Row, Col, Icon, Radio, Tabs, Select, Input } from "antd";
import { alertErrorServer } from "../../../../../utils/alertErrorAll";
import { connect } from "react-redux";
import { queryGetPlatform } from "../../../../../utils/queryPlatform";
import { getDetailPromotion } from "../../../../../utils/query/promotion";
import { getListServer } from "../../../../../utils/query/promotion";
import { getListItemsForEvent } from "../../../../../utils/query/promotion";
import { getListPartnerProducts } from "../../../../../utils/queryPartnerProducts";
import { isTypeEvent } from "../../promoService";
import { dispatchListPartner } from "../../../../../redux/actions/index";
import { useQuery, useLazyQuery } from "react-apollo";
const { Option } = Select;
function TypeEvent(props) {
  const [productsEventTypeItem, setProductsEventTypeItem] = useState([
    { productName: "", partnerProductId: "" },
  ]);
  const [itemsEvent, setItemsEvent] = useState([
    { productName: "", productId: "" },
  ]);
  const [listGame, setListGame] = useState([
    { partnerId: "", partnerName: "" },
  ]);
  const [listServer, setListServer] = useState([
    { server: 0, serverName: "All server" },
  ]);
  const { config, paymentType } = props.detailPromo;
  const [getListGame] = useLazyQuery(queryGetPlatform, {
    fetchPolicy: "cache-and-network",
    onCompleted: (data) => {
      dispatchListPartner(data.listPartners);
      setListGame(data.listPartners);
    },
    onError: (index) => alertErrorServer(index.message),
  });
  const [getServers] = useLazyQuery(getListServer(props.dataDetail.game), {
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

  const [getPartnerProducts] = useLazyQuery(
    getListPartnerProducts(props.dataDetail.game),
    {
      fetchPolicy: "cache-and-network",
      onCompleted: (data) => {
        setProductsEventTypeItem(data.listPartnerProducts);
      },
      onError: (index) => alertErrorServer(index.message),
    }
  );
  useQuery(getListItemsForEvent, {
    fetchPolicy: "cache-and-network",
    onCompleted: (data) => {
      setItemsEvent(data.listProducts);
    },
    onError: (index) => alertErrorServer(index.message),
  });
  useMemo(() => getListGame(), [props.dataDetail.game]);
  useMemo(() => getServers(), [props.dataDetail.game]);
  useMemo(() => getPartnerProducts(), [props.dataDetail.game]);
  const printListItems = productsEventTypeItem.map((val, index) => (
    <Option value={val.partnerProductId} key={index}>
      {val.productName}
    </Option>
  ));
  const printItemsEvent = itemsEvent.map((val, i) => (
    <Option value={val.productId} key={i}>
      {val.productName}
    </Option>
  ));
  if (config) {
    const indexShop = JSON.parse(config);
    const printPlatform = listGame.map((val, i) => (
      <Option value={val.partnerId} key={i}>
        {val.partnerName}
      </Option>
    ));
    const printListServer = listServer.map((val, i) => (
      <Option value={val.server} key={i}>
        {val.serverName}
      </Option>
    ));
    const printItem = indexShop.data.map(function (val, index1) {
      return (
        <div key={index1}>
          <Col
            md={24}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              padding: "1rem",
              border: "1px solid #eeeeee",
            }}
          >
            <div
              style={{
                width: "28%",
                display: "flex",
                alignItems: "center",
                marginRight: "2%",
              }}
            >
              <span style={{ marginRight: "1%" }}>From</span>
              <Input
                value={val.point}
                type="number"
                name="pucharseTimes"
              ></Input>
              <span style={{ marginLeft: ".2rem" }}>
                {paymentType === "MONEY" ? "VNĐ" : "C.COIN"}
              </span>
            </div>
            {indexShop.type === "INKIND" && (
              <Input
                value={val.rewards[0]}
                placeholder="-Điền quà out game-"
                name="pucharseTimes"
                style={{ width: "70%" }}
              ></Input>
            )}
            {indexShop.type === "COIN" && (
              <>
                <Select
                  mode="multiple"
                  value={val.rewards}
                  style={{ width: "70%" }}
                  dropdownClassName="dropdown-coin-event"
                >
                  {printItemsEvent}
                </Select>{" "}
              </>
            )}
            {indexShop.type === "ITEM" && (
              <>
                <Select
                  mode="multiple"
                  value={val.rewards}
                  style={{ width: "70%" }}
                  dropdownClassName="dropdown-coin-event"
                >
                  {printListItems}
                </Select>
              </>
            )}
          </Col>
        </div>
      );
    });
    return (
      <Row>
        <h3>Promotion for purchase</h3>
        {/* <p>Hình thức : {type}</p> */}
        <div className="detail-game">
          <span style={{ marginRight: "1rem" }}>
            Type of purchase: By {paymentType} ( {paymentType} exchange)
          </span>
          <span style={{ marginRight: "1rem" }}>
            Type of present : {isTypeEvent(indexShop.type)}
          </span>
        </div>
        <div>
          {indexShop.game && (
            <div>
              <span style={{ marginRight: "1rem" }}>
                Game:{" "}
                <Select
                  defaultValue={indexShop.game}
                  dropdownClassName="dropdown-coin-event"
                  showArrow={false}
                  size="large"
                  className="select-disable-detail"
                >
                  {printPlatform}
                </Select>
              </span>
              <span>
                Server:{" "}
                <Select
                  value={indexShop.server}
                  dropdownClassName="dropdown-coin-event"
                  showArrow={false}
                  size="large"
                  className="select-disable-detail"
                >
                  {printListServer}
                </Select>
              </span>
            </div>
          )}
        </div>
        <div
          style={{ width: "100%", marginTop: "1rem" }}
          className="section4-promotion-title"
        >
          <h3 style={{ width: "30%" }}>The mount of item</h3>
          <h3 style={{ width: "70%" }}>Present</h3>
        </div>
        <div>{printItem}</div>
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
export default connect(mapStateToProps, null)(TypeEvent);
