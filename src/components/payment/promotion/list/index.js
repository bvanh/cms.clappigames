import React, { useState, useEffect } from "react";
import { Table, Button, Pagination, Input, Radio } from "antd";
import { useLazyQuery, useQuery } from "@apollo/react-hooks";
import ListPromo from "./listPromo";
import ListEvents from './listEvents'
import { Link } from "react-router-dom";
import "../../../../static/style/listUsers.css";

function ListPromoAndEvent() {
  const [isPromo, setIsPromo] = useState('promo');
  const switchPromoAndEvent = e => {
    setIsPromo(e.target.value)
  }
  return (
    <div className="container-listPromo">
      <div className="title">
        <h2>Quản lý khuyến mãi</h2>
      </div>
      <div>
        <Radio.Group value={isPromo} buttonStyle="solid" onChange={switchPromoAndEvent}>
          <Radio.Button
            value="promo"
            className="btn-switch-listPromo"
            style={{ marginRight: ".5rem" }}
          >
            Khuyến mãi theo hàng hóa (Item)
          </Radio.Button>
          <Radio.Button value="event" className="btn-switch-listPromo">
            Khuyến mãi theo hóa đơn (VNĐ)
          </Radio.Button>
        </Radio.Group>
      </div>
      {isPromo === 'promo' ? <ListPromo /> : <ListEvents isPromo={isPromo} />}
    </div>
  );
}

export default ListPromoAndEvent;
