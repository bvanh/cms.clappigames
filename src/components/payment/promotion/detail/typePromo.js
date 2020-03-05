import React, { useState, useEffect, useMemo } from "react";
import { Button, Row, Col, Icon, Radio, Tabs, Select, Input } from "antd";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { getDetailPromotion } from "../../../../utils/query/promotion";
import { getListPartnerProducts } from "../../../../utils/queryPartnerProducts";
import {
  dispatchDeatilPromo,
  dispatchDetailPromo
} from "../../../../redux/actions/index";
import { useQuery, useLazyQuery } from "react-apollo";
const { Option } = Select;
function TypePromotion(props) {
  const [itemsForEventTypeItem, setItemForEventTypeItem] = useState([
    { productName: "", partnerProductId: "" }
  ]);
  const { name, status, eventTime, type, shop, game } = props.detailPromo;
  const [getPartnerProducts] = useLazyQuery(getListPartnerProducts(game), {
    onCompleted: data => {
      setItemForEventTypeItem(data.listPartnerProducts);
    }
  });
  useMemo(() => getPartnerProducts(), [game]);
  const printListItems = itemsForEventTypeItem.map((val, index) => (
    <Option value={val.partnerProductId} key={index}>
      {val.productName}
    </Option>
  ));

  if (shop) {
    const indexShop = JSON.parse(shop);
    console.log(indexShop);
    const printItem = indexShop.map(function(val, index1) {
      const printReward = val.reward.map((valReward, index2) => (
        <div key={index2}>
          <Input
            value={indexShop[index1].reward[index2].numb}
            type="number"
            max="10"
            name="pucharseTimes"
            style={{ width: "10%" }}
          ></Input>
          <Select
            mode="multiple"
            style={{ width: "60%" }}
            value={indexShop[index1].reward[index2].itemId}
          >
            {printListItems}
          </Select>{" "}
        </div>
      ));
      return (
        <div key={index1}>
          <Col md={12}>
            <Input
              value={indexShop[index1].purchaseTimes}
              type="number"
              max="10"
              name="pucharseTimes"
              style={{ width: "10%" }}
            ></Input>
            <Select
              value={indexShop[index1].purchaseItemId}
              style={{ width: "90%" }}
            >
              {printListItems}
            </Select>{" "}
          </Col>
          <Col md={12}>{printReward}</Col>
        </div>
      );
    });
    return (
      <Row>
        <h3>Khuyến mãi theo hàng hóa (Item)</h3>
        <p>Hình thức : {type}</p>
        <div className="detail-game">
          <span style={{ marginRight: "1rem" }}>
            Game:{" "}
            <Select defaultValue="lucy" style={{ width: 120 }} disabled>
              <Option value="jack">Jack</Option>
              <Option value="lucy">Lucy</Option>
            </Select>
          </span>
          <span>
            Server:{" "}
            <Select defaultValue="lucy" style={{ width: 120 }} disabled>
              <Option value="jack">Jack</Option>
              <Option value="lucy">Lucy</Option>
            </Select>
          </span>
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
export default connect(mapStateToProps, null)(TypePromotion);
