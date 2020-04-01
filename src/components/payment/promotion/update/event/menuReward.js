import React, { useState, useEffect, useMemo } from "react";
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
  const { listServer } = props.listPartner;
  const { platformId, server, type } = props.indexPromoAndEvent;
  const [eventByMoneyIndex, setEventByMoneyIndex] = useState({
    eventType: [],
    eventPaymentType: [],
    value: JSON.parse(config).type
  });
  const [listGame, setListGame] = useState([{}]);
  useQuery(queryGetPlatform, {
    onCompleted: data => {
      setListGame(data.listPartners);
    }
  });
  useMemo(() => {
    // props.setIndexPromoAndEvent({ ...props.indexPromoAndEvent, platformId: platformId, server: server })
    if (paymentType === "COIN") {
      dispatchNameEventByMoney(paymentType);
      setEventByMoneyIndex({
        ...eventByMoneyIndex,
        eventPaymentType: eventCointype,
        value: "ITEM"
      });
      dispatchTypeEventByMoney("ITEM");
    } else if (paymentType === "MONEY") {
      dispatchNameEventByMoney(paymentType);
      setEventByMoneyIndex({
        ...eventByMoneyIndex,
        eventPaymentType: eventMoneyType
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
  const printPlatform = props.listPartners.map((val, index) => (
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
    <div className="promo-section2">
      <div className="promo-choose-platform">
      <div>
        <div className="promo-choose-platform-name">
          <p>Type of Purchase</p>
          <Select
            value={props.nameEventByMoney}
            style={{ width: 120 }}
            onChange={handleChangePaymentType}
            placeholder="-Chọn game-"
            disabled={props.isTimeInPromo}
          >
            {printEventType}
          </Select>
        </div>
        <div className="promo-choose-platform-server">
          <span>Type of present: </span>
          <Select
            value={value}
            style={{ width: 120 }}
            onChange={handleChanePaymentTypeByMoney}
            disabled={props.isTimeInPromo}
          >
            {printEventMoneyType}
          </Select>
        </div>
      </div>
      {props.nameEventByMoney === "COIN" && (
        <div>
          <p className="promotion-title-field">Platform</p>
          <Select
            style={{ width: 120 }}
            onChange={props.handleChangePlatform}
            value={platformId}
            disabled={props.isTimeInPromo}
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
            disabled={props.isTimeInPromo}
          >
            {printListServer}
          </Select>{" "}
        </div>
      )}
      </div>
    </div>
  );
};
function mapStateToProps(state) {
  return {
    typeEventByMoney: state.typeEventByMoney,
    nameEventByMoney: state.nameEventByMoney,
    detailPromo: state.detailPromo,
    listPartners: state.listPartner
  };
}
export default connect(mapStateToProps, null)(MenuRewardEventByMoney);
