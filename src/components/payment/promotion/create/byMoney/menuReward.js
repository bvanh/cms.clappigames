import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Pagination,
  Input,
  Row,
  Col,
  Radio,
  DatePicker,
  Select,
  TimePicker
} from "antd";
import { useLazyQuery, useMutation, useQuery } from "@apollo/react-hooks";
import "../../../../../static/style/promotion.css";
import {
  getPromotionType,
  getEventPaymentType
} from "../../../../../utils/queryPaymentAndPromoType";
import { queryGetPlatform } from "../../../../../utils/queryPlatform";
import { getListPartnerProducts } from "../../../../../utils/queryPartnerProducts";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
const { Option } = Select;
const { RangePicker } = DatePicker;

const eventMoneyType = [
  {
    value: "COIN",
    description: "Tặng C.Coin"
  },
  {
    value: "INKIND",
    description: "Tặng quà out game"
  }
];
const eventCointype = [
  {
    value: "ITEM",
    description: "Tặng bằng vật phẩm trong game"
  }
];
const MenuRewardEventByMoney = props => {
  const [eventByMoneyIndex, setEventByMoneyIndex] = useState({
    typeEvent: [{name:""}]
  });
  const {typeEvent}=eventByMoneyIndex
  useQuery(getEventPaymentType, {
    onCompleted: data =>
      setEventByMoneyIndex({
        ...eventByMoneyIndex,
        type: data.__type.enumValues
      })
  });
  const printEventMoneyType = eventMoneyType.map((val, i) => (
    <Option key={i} value={val.name}>
      {val.description}
    </Option>
  ));
  const printEventType=typeEvent.map((val,index)=>(
      <Option key={index} value={val.name}>{val.name}</Option>
  ))
  return (
    <div>
      <p className="promotion-title-field">Chọn loại hóa đơn</p>
      <Select
        style={{ width: 120 }}
        // onChange={handleChangePlatform}
        placeholder="-Chọn game-"
      >
        {printEventType}
      </Select>{" "}
      <span>Hình thức</span>
      <Select
        style={{ width: 120 }}
        // onChange={val => props.handleChaneIndexPromo(val, "setPromoType")}
      >
        {printEventMoneyType}
      </Select>{" "}
      {/* <span>Server</span>
        <Select
          placeholder="-Chọn server-"
          style={{ width: 120 }}
          onChange={handleChangeServer}
          name="server"
          value={server}
        >
          {printListServer}
        </Select>{" "} */}
    </div>
  );
};
export default MenuRewardEventByMoney;
