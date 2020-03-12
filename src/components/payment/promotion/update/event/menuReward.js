import React, { useState, useEffect,useMemo } from "react";
import { DatePicker, Select, TimePicker } from "antd";
import { useLazyQuery, useMutation, useQuery } from "@apollo/react-hooks";
import "../../../../../static/style/promotion.css";
import { queryGetPlatform } from "../../../../../utils/queryPlatform";
import {
  getPromotionType,
  getEventPaymentType
} from "../../../../../utils/queryPaymentAndPromoType";
import { connect } from "react-redux";
import {
  dispatchTypeEventByMoney,
  dispatchNameEventByMoney,
  dispatchResetItemRewards
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
  const { paymentType, config } = props.detailPromo;
  const { game, server, type } = JSON.parse(config);
  const { listServer } = props.typePromo;
  const { platformPromoId, serverGame } = props.indexPromo
  const [eventByMoneyIndex, setEventByMoneyIndex] = useState({
    eventType: [],
    eventPaymentType: [],
    value: type,
  });
  const [listGame, setListGame] = useState([{}])
  useQuery(queryGetPlatform, {
    onCompleted: data => {
      setListGame(data.listPartners);
    }
  });
  useEffect(() => {
    props.setIndexPromo({ ...props.indexPromo, platformPromoId: game, serverGame: server })
    if (paymentType === "COIN") {
      dispatchNameEventByMoney(paymentType);
      setEventByMoneyIndex({
        ...eventByMoneyIndex,
        eventPaymentType: eventCointype,
        value: "ITEM"
      });
      dispatchTypeEventByMoney("ITEM");
    } else if (paymentType === 'MONEY') {
      dispatchNameEventByMoney(paymentType);
      setEventByMoneyIndex({
        ...eventByMoneyIndex,
        eventPaymentType: eventMoneyType,
      });
      dispatchTypeEventByMoney(type);
    }
  }, []);
  const { eventType, eventPaymentType, value } = eventByMoneyIndex;
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
      props.setIndexEventByMoney({
        ...props.indexEventByMoney,
        isPaymentTypeByCoin: true
      });
      setEventByMoneyIndex({
        ...eventByMoneyIndex,
        eventPaymentType: eventCointype,
        value: "ITEM"
      });
      dispatchTypeEventByMoney("ITEM");
    }
  };
  const handleChanePaymentTypeByMoney = async val => {
    if (val === "COIN") {
      //   props.getItemsForEventTypeMoney();
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
  const printPlatform = listGame.map((val, index) => (
    <Option value={val.partnerId} key={index}>
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
        value={props.nameEventByMoney}
        style={{ width: 120 }}
        onChange={handleChangePaymentType}
        placeholder="-Chọn game-"
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
      {props.indexEventByMoney.isPaymentTypeByCoin &&
        <div>
          <p className="promotion-title-field">Chọn game</p>
          <Select
            style={{ width: 120 }}
            onChange={props.handleChangePlatform}
            value={platformPromoId}
          >
            {printPlatform}
          </Select>{" "}
          <span>Server</span>
          <Select
            placeholder="-Chọn server-"
            style={{ width: 120 }}
            onChange={props.handleChangeServer}
            name="server"
            value={serverGame}
          >
            {printListServer}
          </Select>{" "}
        </div>
      }
    </div>
  );
};
function mapStateToProps(state) {
  return {
    typeEventByMoney: state.typeEventByMoney,
    nameEventByMoney: state.nameEventByMoney,
    detailPromo: state.detailPromo
  };
}
export default connect(mapStateToProps, null)(MenuRewardEventByMoney);
