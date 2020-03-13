import React, { useState, useEffect, useMemo } from "react";
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
import {
  getListServer,
} from "../../../../../utils/query/promotion";
import { connect } from "react-redux";
import {
  dispatchTypeEventByMoney,
  dispatchNameEventByMoney
} from "../../../../../redux/actions";
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
  const { server } = props;
  const {listGame } = props.typePromo;
  const { platformId } = props.indexPromoAndEvent
  const [eventByMoneyIndex, setEventByMoneyIndex] = useState({
    eventType: [],
    eventPaymentType: [],
    value: ""
  });
  const [listServer, setListServer] = useState([
    {
      server: 0,
      serverName: "All server"
    }
  ]);
  const { eventType, eventPaymentType, value } = eventByMoneyIndex;
  useQuery(getListServer(platformId), {
    onCompleted: data => {
      setListServer(data.listPartnerServers);
    }
  });
  useMemo(() => {
    dispatchNameEventByMoney("MONEY");
    setEventByMoneyIndex({
      ...eventByMoneyIndex,
      eventPaymentType: eventMoneyType,
      value: "INKIND"
    });
    dispatchTypeEventByMoney("INKIND");
    props.setIndexEventByMoney({
      ...props.indexEventByMoney,
      isPaymentTypeByCoin: false
    });
  }, [props.switchTypeEvent]);
  useQuery(getEventPaymentType, {
    onCompleted: data =>
      setEventByMoneyIndex({
        ...eventByMoneyIndex,
        eventType: data.__type.enumValues
      })
  });
  const handleChangePaymentType = async val => {
    if (val === "MONEY") {
      dispatchNameEventByMoney(val);
      setEventByMoneyIndex({
        ...eventByMoneyIndex,
        eventPaymentType: eventMoneyType,
        value: "INKIND"
      });
      dispatchTypeEventByMoney("INKIND");
      props.setIndexEventByMoney({
        ...props.indexEventByMoney,
        isPaymentTypeByCoin: false
      });
    } else if (val === "COIN") {
      dispatchNameEventByMoney(val);
      setEventByMoneyIndex({
        ...eventByMoneyIndex,
        eventPaymentType: eventCointype,
        value: "ITEM"
      });
      dispatchTypeEventByMoney("ITEM");
      props.setIndexEventByMoney({
        ...props.indexEventByMoney,
        isPaymentTypeByCoin: true
      });
    }
  };
  const handleChanePaymentTypeByMoney = async val => {
    if (val === "COIN") {
      // props.getItemsForEventTypeMoney();
    }
    await setEventByMoneyIndex({ ...eventByMoneyIndex, value: val });
    dispatchTypeEventByMoney(val);
  };
  const printEventMoneyType = eventPaymentType.map((val, i) => (
    <Option key={i} value={val.value}>
      {val.description}
    </Option>
  ));
  const printEventType = eventType.map((val, index) => (
    <Option key={index} value={val.name}>
      {val.name}
    </Option>
  ));
  const printPlatform = listGame.map((val, i) => (
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
    <div>
      <p className="promotion-title-field">Chọn loại hóa đơn</p>
      <Select
        style={{ width: 120 }}
        onChange={handleChangePaymentType}
        placeholder="-Chọn game-"
        value={props.nameEventByMoney}
      >
        {printEventType}
      </Select>{" "}
      <span>Hình thức</span>
      <Select
        value={value}
        style={{ width: 120 }}
        onChange={handleChanePaymentTypeByMoney}
      >
        {printEventMoneyType}
      </Select>
      {props.indexEventByMoney.isPaymentTypeByCoin && (
        <div>
          <p className="promotion-title-field">Chọn game</p>
          <Select
            style={{ width: 120 }}
            onChange={props.handleChangePlatform}
            placeholder="-Chọn game-"
          >
            {printPlatform}
          </Select>{" "}
          <span>Server</span>
          <Select
            placeholder="-Chọn server-"
            style={{ width: 120 }}
            onChange={props.handleChangeServer}
            name="server"
            value={server}
          >
            {printListServer}
          </Select>{" "}
        </div>
      )}
    </div>
  );
};
function mapStateToProps(state) {
  return {
    typeEventByMoney: state.typeEventByMoney,
    nameEventByMoney: state.nameEventByMoney
  };
}
export default connect(mapStateToProps, null)(MenuRewardEventByMoney);
