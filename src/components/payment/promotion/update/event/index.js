import React, { useState, useEffect, useMemo } from "react";
import { Row, Col, DatePicker, Select, Icon, Modal } from "antd";
import { useLazyQuery, useMutation, useQuery } from "@apollo/react-hooks";
import moment from "moment";
import "../../../../../static/style/promotion.css";
import EventByItems from "../../create/promotion/inputRewardItem";
import MenuRewardByItem from "../../create/promotion/menuRewardItem";
import InputRewardForShowByMoney from "./inputReward";
import MenuRewardEventByMoney from "./menuReward";
import {
  InputNameAndTypeArea,
  InputTimeArea
} from "../../create/nameAndTimePromo";
import {
  dispatchResetItemRewards,
  dispatchInititalIndexConfig
} from "../../../../../redux/actions/index";
import { initialIndexShop } from "../../promoService";
import { getListPartnerProducts2 } from "../../../../../utils/queryPartnerProducts";
import {
  getListServer,
  getListItemsForEvent
} from "../../../../../utils/query/promotion";
import { connect } from "react-redux";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

function UpdateEvent(props) {
  const {
    name,
    game,
    status,
    eventTime,
    server,
    type,
    config,
    paymentType
  } = props.detailPromo;
  const { startTime, endTime, dates, daily, hour } = JSON.parse(eventTime);
  const [alertUpdateSuccess, setAlertUpdateSuccess] = useState(false);
  const [switchTypeEvent, setSwitchTypeEvent] = useState(config ? false : true);
  const [indexShop, setIndexShop] = useState(initialIndexShop);
  const [isCreatePromo, setIsCreatePromo] = useState(false);
  const [indexPromo, setIndexPromo] = useState({
    eventPaymentType: [],
    namePromo: name,
    platformPromoId: game,
    serverGame: server,
    statusPromo: status,
    typePromo: type ? type : "",
    timeTotalPromo: [startTime, endTime],
    datesPromo: dates,
    dailyPromo: daily,
    startTime: hour[0],
    endTime: hour[1]
  });
  const [typePromo, setTypePromo] = useState({
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
    isPaymentTypeByCoin: paymentType === "COIN" ? true : false,
    itemsForEventByMoney: [{ productName: "", productId: "" }]
  });
  const { platformPromoId, statusPromo, serverGame } = indexPromo;
  const { listGame, listItems, listServer } = typePromo;
  const [getListPartnerByPlatform] = useLazyQuery(getListPartnerProducts2, {
    onCompleted: data => {
      setTypePromo({ ...typePromo, listItems: data.listPartnerProducts });
    }
  });
  useQuery(getListServer(platformPromoId), {
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
  useMemo(
    () =>
      getListPartnerByPlatform({
        variables: {
          partnerId: config ? JSON.parse(config).game : ""
        }
      }),
    [switchTypeEvent]
  );
  const handleChangePlatform = async e => {
    dispatchResetItemRewards();
    setIndexShop([
      {
        purchaseTimes: 1,
        purchaseItemId: [],
        rewards: [
          {
            numb: 1,
            itemId: []
          }
        ]
      }
    ]);
    await setIndexPromo({
      ...indexPromo,
      platformPromoId: e,
      serverGame: 0
    });
    await getListPartnerByPlatform({
      variables: {
        partnerId: e
      }
    });
  };
  const resetGameAndServer = () => {
    setTypePromo({
      ...typePromo,
      listServer: [
        {
          server: 0,
          serverName: "All server"
        }
      ]
    });
    setIndexPromo({ ...indexPromo, platformPromoId: "", server: "" });
  };
  const setInfoPromo = e => {
    setIndexPromo({ ...indexPromo, [e.target.name]: e.target.value });
  };
  const handleChangeServer = e => {
    setIndexPromo({ ...indexPromo, serverGame: e });
  };
  const onChangeDatePicker = (value, dateString) => {
    console.log(dateString);
    setIndexPromo({ ...indexPromo, timeTotalPromo: dateString });
  };
  const setTimePromo = (timeString, val) => {
    if (val === "startTime") {
      setIndexPromo({
        ...indexPromo,
        startTime: timeString !== "" ? timeString + ":00" : ""
      });
    } else {
      setIndexPromo({
        ...indexPromo,
        endTime: timeString !== "" ? timeString + ":59" : ""
      });
    }
  };
  const handleChangeDaily = value => {
    setIndexPromo({ ...indexPromo, dailyPromo: value.sort((a, b) => a - b) });
  };
  const handleChangeDates = value => {
    setIndexPromo({ ...indexPromo, datesPromo: value.sort((a, b) => a - b) });
  };
  const handleChangeTypePromo = val => {
    setIndexPromo({ ...indexPromo, typePromo: val });
  };
  const successAlert = value => {
    setIsCreatePromo(value);
    setAlertUpdateSuccess(true);
  };
  return (
    <Row className="container-promotion">
      <div>
        <div>
          <Link
            to="/payment/promotion"
            onClick={() => dispatchInititalIndexConfig()}
          >
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
            alertUpdateSuccess={alertUpdateSuccess}
            indexPromo={indexPromo}
            typePromo={typePromo}
            setTypePromo={setTypePromo}
            resetGameAndServer={resetGameAndServer}
            setInfoPromo={setInfoPromo}
            switchTypeEvent={switchTypeEvent}
            setSwitchTypeEvent={setSwitchTypeEvent}
          />
          {switchTypeEvent ? (
            <MenuRewardByItem
              indexShop={indexShop}
              setIndexShop={setIndexShop}
              indexPromo={indexPromo}
              typePromo={typePromo}
              handleChangePlatform={handleChangePlatform}
              handleChangeTypePromo={handleChangeTypePromo}
              handleChangeServer={handleChangeServer}
            />
          ) : (
            <MenuRewardEventByMoney
              indexPromo={indexPromo}
              setIndexPromo={setIndexPromo}
              indexEventByMoney={indexEventByMoney}
              setIndexEventByMoney={setIndexEventByMoney}
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
          <EventByItems
            listItems={listItems}
            indexPromo={indexPromo}
            indexShop={indexShop}
            setIndexShop={setIndexShop}
            isUpdate={props.isUpdate}
            successAlert={successAlert}
          />
        ) : (
          <InputRewardForShowByMoney
            setAlertUpdateSuccess={successAlert}
            typePromo={typePromo}
            listItems={listItems}
            indexPromo={indexPromo}
            setIndexPromo={setIndexPromo}
            indexEventByMoney={indexEventByMoney}
            setIndexEventByMoney={setIndexEventByMoney}
          />
        )}
      </Col>
      <Modal
        title={<Icon type="check-circle" />}
        visible={alertUpdateSuccess}
        onCancel={() => setAlertUpdateSuccess(false)}
        onOk={() => {
          isCreatePromo ? deleteEvent() : deletePromo();
        }}
        okText={<Link to="/payment/promotion">Xem danh sách</Link>}
        cancelText="Hủy bỏ"
      ></Modal>
    </Row>
  );
}
function mapStateToProps(state) {
  return {
    detailPromo: state.detailPromo
  };
}
export default connect(mapStateToProps, null)(UpdateEvent);
