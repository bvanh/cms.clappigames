import React, { useState, useEffect } from "react";
import { Row, Col, DatePicker, Select, Icon } from "antd";
import { useLazyQuery, useMutation, useQuery } from "@apollo/react-hooks";
import "../../../../static/style/promotion.css";
import EventByItems from "./promotion/inputRewardItem";
import InputRewardByMoney from "./event/inputReward";
import MenuRewardEventByMoney from "./event/menuReward";
import { InputNameAndTypeArea, InputTimeArea } from "./nameAndTimePromo";
import MenuRewardByItem from "./promotion/menuRewardItem";
import { getPromotionType } from "../../../../utils/queryPaymentAndPromoType";
import { queryGetPlatform } from "../../../../utils/queryPlatform";
import { getListPartnerProducts } from "../../../../utils/queryPartnerProducts";
import moment from 'moment'
import {
  getListServer,
  getListItemsForEvent
} from "../../../../utils/query/promotion";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
function CreatePromotion() {
  const [switchTypeEvent, setSwitchTypeEvent] = useState(true);
  const [indexPromo, setIndexPromo] = useState({
    eventPaymentType: [],
    namePromo: null,
    platformPromoId: "",
    server: "",
    statusPromo: "COMPLETE",
    promoType: "",
    timeTotalPromo: [moment().format(" DD-MM-YYYY HH:mm"), moment().format(" DD-MM-YYYY HH:mm")],
    datesPromo: [],
    dailyPromo: [],
    startTime: "00:00",
    endTime: "00:00"
  });
  const [typePromo, setTypePromo] = useState({
    type: [{ name: "", description: "" }],
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
  const { platformPromoId, statusPromo, server } = indexPromo;
  const { type, listGame, listItems, listServer } = typePromo;
  const [getPromoType] = useLazyQuery(getPromotionType, {
    onCompleted: data => {
      setTypePromo({ ...typePromo, type: data.__type.enumValues });
    }
  });
  const [getPlatform] = useLazyQuery(queryGetPlatform, {
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
  const [getItemsForEventTypeMoney] = useLazyQuery(getListItemsForEvent, {
    onCompleted: data => {
      setIndexEventByMoney({
        ...indexEventByMoney,
        itemsForEventByMoney: data.listProducts
      });
    }
  });
  useEffect(() => {
    getPromoType();
    getPlatform();
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
    setIndexPromo({ ...indexPromo, server: e });
  };
  const onChangeDatePicker = (value, dateString) => {
    setIndexPromo({ ...indexPromo, timeTotalPromo: dateString });
  };
  const setTimePromo = (timeString, val) => {
    console.log(timeString)
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
    <Router>
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
              typePromo={typePromo}
              indexPromo={indexPromo}
              setTypePromo={setTypePromo}
              statusPromo={statusPromo}
              setInfoPromo={setInfoPromo}
              switchTypeEvent={switchTypeEvent}
              setSwitchTypeEvent={setSwitchTypeEvent}
            />
            {/*router chọn game,server */}
            {switchTypeEvent ? (
              <MenuRewardByItem
                server={server}
                typePromo={typePromo}
                handleChangePlatform={handleChangePlatform}
                handleChangeTypePromo={handleChangeTypePromo}
                handleChangeServer={handleChangeServer}
              />
            ) : (
              <MenuRewardEventByMoney
                indexEventByMoney={indexEventByMoney}
                setIndexEventByMoney={setIndexEventByMoney}
                getItemsForEventTypeMoney={getItemsForEventTypeMoney}
                server={server}
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
              listItems={listItems}
              indexPromo={indexPromo}
              setIndexPromo={setIndexPromo}
              indexEventByMoney={indexEventByMoney}
              setIndexEventByMoney={setIndexEventByMoney}
              getItemsForEventTypeMoney={getItemsForEventTypeMoney}
            />
          )}
        </Col>
      </Row>
    </Router>
  );
}
export default CreatePromotion;
