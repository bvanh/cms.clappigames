import React, { useState, useEffect, useMemo } from "react";
import { Button, Row, Col, Icon, Radio, Tabs, Select, Input } from "antd";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { queryGetPlatform } from '../../../../../utils/queryPlatform'
import { getDetailPromotion } from "../../../../../utils/query/promotion";
import { getListItemsForEvent } from '../../../../../utils/query/promotion'
import { getListPartnerProducts } from "../../../../../utils/queryPartnerProducts";
import { isTypeEvent } from '../../promoService'
import {
  dispatchDeatilPromo,
  dispatchDetailPromo
} from "../../../../../redux/actions/index";
import { useQuery, useLazyQuery } from "react-apollo";
const { Option } = Select;
function TypeEvent(props) {
  const [productsEventTypeItem, setProductsEventTypeItem] = useState([
    { productName: "", partnerProductId: "" }
  ]);
  const [itemsEvent, setItemsEvent] = useState([
    { productName: "", productId: "" }
  ]);
  const [listGame, setListGame] = useState([{ partnerId: "", partnerName: "" }])
  const [listServer, setListServer] = useState()
  const { name, status, eventTime, config, paymentType } = props.detailPromo;
  const { data } = useQuery(getListPartnerProducts(props.demo.game), {
    onCompleted: data => {
      setProductsEventTypeItem(data.listPartnerProducts)
    }
  });
  useQuery(queryGetPlatform, {
    onCompleted: data => setListGame(data.listPartners)
  })
  useQuery(getListItemsForEvent, {
    fetchPolicy: 'cache-and-network',
    onCompleted: data => {
      setItemsEvent(data.listProducts)
    }
  })
  const printListItems = productsEventTypeItem.map((val, index) => (
    <Option value={val.partnerProductId} key={index}>
      {val.productName}
    </Option>
  ));
  const printItemsEvent = itemsEvent.map((val, i) => (
    <Option value={val.productId} key={i}>
      {val.productName}
    </Option>
  ))
  if (config) {
    const indexShop = JSON.parse(config);
    const printPlatform = listGame.map((val, i) => (
      <Option value={val.partnerId} key={i}>
        {val.partnerName}
      </Option>
    ));
    const printItem = indexShop.data.map(function (val, index1) {
      return (
        <div key={index1}>
          <Col md={24}>
            TỪ
            <Input
              value={val.point}
              type="number"
              name="pucharseTimes"

              style={{ width: "10%" }}
            ></Input>
            ...
            {indexShop.type === "INKIND" && (
              <Input
                value={val.rewards[0]}
                placeholder="-Điền quà out game-"
                name="pucharseTimes"

                style={{ width: "10%" }}
              ></Input>
            )}
            {indexShop.type === "COIN" && (
              <>
                <Select
                  mode="multiple"
                  value={val.rewards}
                  style={{ width: "90%" }}
                // onChange={value => handleChooseItem(index1, value)}
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
                  style={{ width: "90%" }}

                >
                  {printListItems}
                </Select>{" "}
                {/* <span
                  onClick={() =>
                    setListItemForEvent({ ...listItemForEvent, isShow: true })
                  }
                >
                  show item
                </span> */}
              </>
            )}
          </Col>
        </div>
      );
    });
    return (
      <Row>
        <h3>Khuyến mãi theo hóa đơn</h3>
        {/* <p>Hình thức : {type}</p> */}
        <div className="detail-game">
          <span style={{ marginRight: "1rem" }}>
            Loại hóa đơn:  {paymentType}
          </span>
          <span style={{ marginRight: "1rem" }}>
            Hình thức :  {isTypeEvent(indexShop.type)}
          </span>
          {indexShop.game &&
            <>
              <span style={{ marginRight: "1rem" }}>
                Game:{" "}
                <Select defaultValue={indexShop.game} style={{ width: 120 }} disabled>
                  {printPlatform}
                </Select>
              </span>
              <span>
                Server:{" "}
                <Select defaultValue="lucy" style={{ width: 120 }} disabled>
                  <Option value="jack">lqmt</Option>
                  <Option value="lucy">test 1</Option>
                </Select>
              </span>
            </>
          }
        </div>
        <div className="detail-bill-title">
          <h3 style={{ width: "30%" }}>Số lượng Item mua</h3>
          <h3 style={{ width: "70%" }}>Tặng Item</h3>
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
    detailPromo: state.detailPromo
  };
}
export default connect(mapStateToProps, null)(TypeEvent);
