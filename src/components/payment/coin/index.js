import React, { useState, useEffect } from "react";
import { Row, Col } from "antd";
import { queryGetPaymentType } from "../../../utils/queryPaymentAndPromoType";
import { useLazyQuery, useMutation, useQuery } from "@apollo/react-hooks";
import { Link } from "react-router-dom";
import "../../../static/style/listProducts.css";
import ChartCharges from "./listCharges/chartCacheCharges";
import ListCharges from "./listCharges/listCharges";
import CreateProductCoin from "./listCoin/addnewCoin";
import ListCoin from "./listCoin/listCoin";
import { nFormatter } from "../../../utils/configCharts";
import { deleteCoinProduct } from "../../../utils/mutation/productCoin";
function CoinsContainer(props) {
  const [isCreateCoin, setIsCreateCoin] = useState(false);
  const [totalIndex, setTotalIndex] = useState({
    totalMoney: 0,
    totalPurchase: 0
  });
  const { data } = useQuery(queryGetPaymentType);
  console.log(isCreateCoin)
  if (isCreateCoin)
    return <CreateProductCoin setIsCreateCoin={setIsCreateCoin} data={data} />;
  if (isCreateCoin === false)
    return (
      <Row>
        <Col md={24}>
          <Col md={12} className="items-section">
            <Col md={12} style={{ paddingRight: ".5rem" }}>
              <h2>C.coin exchange Total</h2>
              <div className="total-revenue">
                <span>{nFormatter(totalIndex.totalMoney)}</span>
                <p>VNĐ</p>
              </div>
            </Col>
            <Col md={12} style={{ paddingLeft: ".5rem" }}>
              <h2>Total Purchase times</h2>
              <div className="total-revenue">
                <span>{nFormatter(totalIndex.totalPurchase)}</span>
                <p>times</p>
              </div>
            </Col>
          </Col>
          <Col md={12} className="items-section">
            <ChartCharges
              setTotalIndex={setTotalIndex}
              totalIndex={totalIndex}
            />
          </Col>
        </Col>
        <Col md={12} className="items-section">
          <ListCoin setIsCreateCoin={setIsCreateCoin} />
        </Col>
        <Col md={12} className="items-section">
          <ListCharges setTotalIndex={setTotalIndex} totalIndex={totalIndex} />
        </Col>
      </Row>
    );
}

export default CoinsContainer;
