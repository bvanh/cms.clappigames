import React, { useState, useEffect } from "react";
import { Row, Col, Icon, Radio } from "antd";
import CreatePartnerItems from "./listPartnerProduct/createItems";
import ListPartnerChages from "./partnerCharges/listPartnerCharges";
import ChartPartnerChages from "./partnerCharges/chartPartnerChargesByDate";
import ListItems from "./listPartnerProduct/listItems";
import { nFormatter } from "../../../utils/configCharts";

function ItemsContainer() {
  const [isCreateItem, setIsCreateItem] = useState(false);
  const [totalIndex, setTotalIndex] = useState({
    totalMoney: 0,
    totalPurchase: 0
  });
  if (isCreateItem)
    return <CreatePartnerItems setIsCreateItem={setIsCreateItem} />;
  if (isCreateItem === false)
    return (
      <Row>
        <Col md={24}>
          <Col md={12} className="items-section">
            <Col md={12} style={{ paddingRight: ".5rem" }}>
              <h2>C.coin exchange Total</h2>
              <div className="total-revenue">
                <span>{nFormatter(totalIndex.totalMoney)}</span>
                <p>C.Coin</p>
              </div>
            </Col>
            <Col md={12} style={{ paddingLeft: ".5rem" }}>
              <h2>Total Purchase</h2>
              <div className="total-revenue">
                <span>{nFormatter(totalIndex.totalPurchase)}</span>
                <p>times</p>
              </div>
            </Col>
          </Col>
          <Col md={12} className="items-section">
            <ChartPartnerChages
              totalIndex={totalIndex}
              setTotalIndex={setTotalIndex}
            />
          </Col>
        </Col>
        <Col md={12} className="items-section">
          <ListItems setIsCreateItem={setIsCreateItem} />
        </Col>
        <Col md={12} className="items-section">
          <ListPartnerChages />
        </Col>
      </Row>
    );
}

export default ItemsContainer;
