import React, { useState, useEffect } from "react";
import { Row, Col, DatePicker, Select } from "antd";
import { useLazyQuery, useMutation, useQuery } from "@apollo/react-hooks";
import "../../../../static/style/promotion.css";
import EventByItems from "./byItem/inputRewardItem";
import InputRewardByMoney from "./byMoney/inputReward";
import MenuRewardEventByMoney from "./byMoney/menuReward";
import { InputNameAndTypeArea, InputTimeArea } from "./nameAndTimePromo";
import MenuRewardByItem from "./byItem/menuRewardItem";
import { getPromotionType } from "../../../../utils/queryPaymentAndPromoType";
import { queryGetPlatform } from "../../../../utils/queryPlatform";
import { getListPartnerProducts } from "../../../../utils/queryPartnerProducts";
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
    server: "-Chọn server-",
    statusPromo: "COMPLETE",
    promoType: "",
    timeTotalPromo: ["", ""],
    datesPromo: [],
    dailyPromo: [],
    startTime: "",
    endTime: ""
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
    dailyAlert: ["moday,d"],
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
    console.log(e);
    setIndexPromo({
      ...indexPromo,
      platformPromoId: e,
      server: "-Chọn server-"
    });
  };
  const setInfoPromo = e => {
    setIndexPromo({ ...indexPromo, [e.target.name]: e.target.value });
  };
  const handleChangeServer = e => {
    setIndexPromo({ ...indexPromo, server: e });
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
  const handleChangeIndexPromo = val => {
    setIndexPromo({ ...indexPromo, promoType: val });
  };
  return (
    <Router>
      <Row className="container-promotion">
        <div className="title">
          <div>
            <span>quay lai</span>
            <h3>Thêm mới khuyến mãi</h3>
          </div>
        </div>
        <Col md={12} className="section1-promotion">
          <div>
            <InputNameAndTypeArea
              typePromo={typePromo}
              setTypePromo={setTypePromo}
              statusPromo={statusPromo}
              setInfoPromo={setInfoPromo}
              setSwitchTypeEvent={setSwitchTypeEvent}
            />
            <div>
              {/*router chọn game,server */}
              {switchTypeEvent ? (
                <MenuRewardByItem
                  server={server}
                  typePromo={typePromo}
                  handleChangePlatform={handleChangePlatform}
                  handleChangeIndexPromo={handleChangeIndexPromo}
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
                    handleChangeIndexPromo={handleChangeIndexPromo}
                    handleChangeServer={handleChangeServer}
                  />
                )}
            </div>
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
