import React, { useState, useEffect } from "react";
import { Row, Col, DatePicker, Select, Icon } from "antd";
import { useLazyQuery, useMutation, useQuery } from "@apollo/react-hooks";
import "../../../../static/style/promotion.css";
import EventByItems from "./promotion/inputRewardItem";
import InputRewardByMoney from "./event/inputReward";
import MenuRewardEventByMoney from "./event/menuReward";
import {
  InputNameAndTypeArea,
  InputTimeArea
} from "../create/nameAndTimePromo";
import MenuRewardByItem from "./promotion/menuRewardItem";
import { getPromotionType } from "../../../../utils/queryPaymentAndPromoType";
import { queryGetPlatform } from "../../../../utils/queryPlatform";
import { getListPartnerProducts } from "../../../../utils/queryPartnerProducts";
import {
  getListServer,
  getListItemsForEvent
} from "../../../../utils/query/promotion";
import { connect } from "react-redux";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
function UpdatePromotionAndEvent(props) {
  const {
    name,
    game,
    status,
    eventTime,
    server,
    shop,
    type,
    config
  } = props.detailPromo;

  const { startTime, endTime, dates, daily, hour } = JSON.parse(eventTime);
  const [switchTypeEvent, setSwitchTypeEvent] = useState(shop ? true : false);
  const [indexPromo, setIndexPromo] = useState({
    eventPaymentType: [],
    namePromo: name,
    platformPromoId: game,
    serverGame: server,
    statusPromo: status,
    typePromo: type,
    timeTotalPromo: [startTime, endTime],
    datesPromo: dates,
    dailyPromo: daily,
    startTime: hour[0],
    endTime: hour[1]
  });
  const [typePromo, setTypePromo] = useState({
    listType: [{ name: "", description: "" }],
    eventPaymentType: [],
    listGame: [{}],
    listServer: [
      {
        server: 0,
        serverName: "All server"
      }
    ],
    listItems: [
      {
        productId: "",
        partnerProductId: ""
      }
    ]
  });
  const [alertInfoPromo, setAlertInfoPromo] = useState({
    dailyAlert: [],
    datesAlert: [],
    timeTotalAlert: []
  });
  const [indexEventByMoney, setIndexEventByMoney] = useState({
    paymentTypeByMoney: "",
    isPaymentTypeByCoin: false,
    itemsForEventByMoney: [{ productName: "", productId: "" }]
  });
  const { platformPromoId, statusPromo, serverGame } = indexPromo;
  const { listType, listGame, listItems, listServer } = typePromo;
  const [getPromoType] = useLazyQuery(getPromotionType, {
    onCompleted: data => {
      setTypePromo({ ...typePromo, listType: data.__type.enumValues });
    }
  });
  useQuery(queryGetPlatform, {
    onCompleted: data => {
      setTypePromo({ ...typePromo, listGame: data.listPartners });
    }
  });
  const { data } = useQuery(getListPartnerProducts(platformPromoId), {
    onCompleted: data => {
      setTypePromo({ ...typePromo, listItems: data.listPartnerProducts });
    }
  });
  const { data2 } = useQuery(getListServer(platformPromoId), {
    onCompleted: data => {
      setTypePromo({
        ...typePromo,
        listServer: [
          {
            server: 0,
            serverName: "All server"
          },
          ...data.listPartnerServers
        ]
      });
    }
  });
  useQuery(getListItemsForEvent, {
    onCompleted: data => {
      setIndexEventByMoney({
        ...indexEventByMoney,
        itemsForEventByMoney: data.listProducts
      });
    }
  });
  useEffect(() => {
    getPromoType();
  }, []);
  const handleChangePlatform = e => {
    setIndexPromo({
      ...indexPromo,
      platformPromoId: e,
      server: ""
    });
  };
  const setInfoPromo = e => {
    setIndexPromo({ ...indexPromo, [e.target.name]: e.target.value });
  };
  const handleChangeServer = e => {
    setIndexPromo({ ...indexPromo, serverGame: e });
  };
  const onChangeDatePicker = (value, dateString) => {
    console.log("Selected Time: ", value);
    setIndexPromo({ ...indexPromo, timeTotalPromo: dateString });
  };
  const setTimePromo = (timeString, val) => {
    if (val === "startTime") {
      setIndexPromo({ ...indexPromo, startTime: timeString });
    } else {
      setIndexPromo({ ...indexPromo, endTime: timeString });
    }
  };
  const handleChangeDaily = value => {
    setIndexPromo({ ...indexPromo, dailyPromo: value });
  };
  const handleChangeDates = value => {
    setIndexPromo({ ...indexPromo, datesPromo: value });
  };
  const handleChangeTypePromo = val => {
    console.log(val);
    setIndexPromo({ ...indexPromo, promoType: val });
  };
  return (
    <Row className="container-promotion">
      <div>
        <div>
          <Link to="/payment/promotion">
            <span>
              <Icon type="arrow-left" style={{ paddingRight: ".2rem" }} />
              Quay lại
            </span>
          </Link>
          <h2>Thêm mới khuyến mãi</h2>
        </div>
      </div>
      <Col md={12} className="section1-promotion">
        <div>
          <InputNameAndTypeArea
            indexPromo={indexPromo}
            typePromo={typePromo}
            setTypePromo={setTypePromo}
            setInfoPromo={setInfoPromo}
            switchTypeEvent={switchTypeEvent}
            setSwitchTypeEvent={setSwitchTypeEvent}
          />
          {/*router chọn game,server */}
          {switchTypeEvent ? (
            <MenuRewardByItem
              indexPromo={indexPromo}
              typePromo={typePromo}
              handleChangePlatform={handleChangePlatform}
              handleChangeTypePromo={handleChangeTypePromo}
              handleChangeServer={handleChangeServer}
            />
          ) : (
            <MenuRewardEventByMoney
              indexEventByMoney={indexEventByMoney}
              setIndexEventByMoney={setIndexEventByMoney}
              // getItemsForEventTypeMoney={getItemsForEventTypeMoney}
              server={serverGame}
              typePromo={typePromo}
              handleChangePlatform={handleChangePlatform}
              handleChangeServer={handleChangeServer}
            />
          )}
        </div>
      </Col>
      <InputTimeArea
        indexPromo={indexPromo}
        alertInfoPromo={alertInfoPromo}
        onChangeDatePicker={onChangeDatePicker}
        handleChangeDaily={handleChangeDaily}
        handleChangeDates={handleChangeDates}
        setTimePromo={setTimePromo}
      />
      <Col md={24}>
        {switchTypeEvent ? (
          <EventByItems listItems={listItems} indexPromo={indexPromo} />
        ) : (
          <InputRewardByMoney
            typePromo={typePromo}
            listItems={listItems}
            indexPromo={indexPromo}
            setIndexPromo={setIndexPromo}
            indexEventByMoney={indexEventByMoney}
            setIndexEventByMoney={setIndexEventByMoney}
            // getItemsForEventTypeMoney={getItemsForEventTypeMoney}
          />
        )}
      </Col>
    </Row>
  );
}
function mapStateToProps(state) {
  return {
    detailPromo: state.detailPromo
  };
}
export default connect(mapStateToProps, null)(UpdatePromotionAndEvent);
