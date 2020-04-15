import React, { useState, useEffect, useMemo } from "react";
import {
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
import { alertErrorServer } from '../../../../../utils/alertErrorAll'
import { getListServer } from "../../../../../utils/query/promotion";
import { indexAllServer } from "../../promoService";
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
    description: "C.Coin"
  },
  {
    value: "INKIND",
    description: "Gift's out game"
  }
];
const eventCointype = [
  {
    value: "ITEM",
    description: "Gift's in game"
  }
];
const MenuRewardEventByMoney = props => {
  const { server } = props;
  const { listGame } = props.listPartner;
  const { platformId } = props.indexPromoAndEvent;
  const [eventByMoneyIndex, setEventByMoneyIndex] = useState({
    eventType: [],
    eventPaymentType: [],
    value: ""
  });
  const [listServer, setListServer] = useState([indexAllServer]);
  const { eventType, eventPaymentType, value } = eventByMoneyIndex;
  const [getListPaymentType] = useLazyQuery(getEventPaymentType, {
    fetchPolicy:"cache-and-network",
    onCompleted: data => {
      setEventByMoneyIndex({
        ...eventByMoneyIndex,
        eventType: data.__type.enumValues
      })
    },
    onError: index => alertErrorServer(index.networkError.result.errors[0].message)
  });
  const [getListServe] = useLazyQuery(getListServer(platformId), {
    fetchPolicy:"cache-and-network",
    onCompleted: data => {
      setListServer([...data.listPartnerServers, indexAllServer]);
    },
    onError: index => alertErrorServer(index.networkError.result.errors[0].message)
  });
  useEffect(()=>{
    getListPaymentType();
    getListServe();
  },[])
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
      By {val.name} ( {val.name} exchange)
    </Option>
  ));
  const printPlatform = props.listPartners.map((val, i) => (
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
    <div className="promo-section2">
      <div className="promo-choose-platform">
        <div>
          <div className="promo-choose-platform-name">
            <p>Type of Purchase</p>
            <Select
              style={{ width: "64%" }}
              onChange={handleChangePaymentType}
              placeholder="-Chọn game-"
              value={props.nameEventByMoney}
            >
              {printEventType}
            </Select>{" "}
          </div>
          <div className="promo-choose-platform-server">
            <span>Type of present: </span>
            <Select
              value={value}
              style={{ width: "65%" }}
              onChange={handleChanePaymentTypeByMoney}
            >
              {printEventMoneyType}
            </Select>
          </div>
        </div>
        {props.indexEventByMoney.isPaymentTypeByCoin && (
          <div style={{ width: "100%" }}>
            <div className="promo-choose-platform-name">
              <p className="promotion-title-field">Platform</p>
              <Select
                style={{ width: "65%" }}
                onChange={props.handleChangePlatform}
                placeholder="-Choose Platform-"
              >
                {printPlatform}
              </Select>{" "}
            </div>
            <div className="promo-choose-platform-server">
              <span>Server</span>
              <Select
                placeholder="-Chọn server-"
                style={{ width: "65%" }}
                onChange={props.handleChangeServer}
                name="server"
                value={server}
              >
                {printListServer}
              </Select>{" "}
            </div>
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
    listPartners: state.listPartner
  };
}
export default connect(mapStateToProps, null)(MenuRewardEventByMoney);
