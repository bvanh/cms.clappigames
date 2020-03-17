import React, { useState, useEffect, useMemo } from "react";
import { Row, Col, DatePicker, Select, Icon, Modal } from "antd";
import { useLazyQuery, useMutation, useQuery } from "@apollo/react-hooks";
import {
  deleteEvents,
  deletePromotion
} from "../../../../../utils/mutation/promotion";
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
  dispatchInititalIndexConfig,
  dispatchTypeEventByMoney,
  dispatchSetDataTypePromo
} from "../../../../../redux/actions/index";
import { initialIndexShop } from "../../promoService";
import { getListPartnerProducts2 } from "../../../../../utils/queryPartnerProducts";
import {
  getListServer,
  getListItemsForEvent
} from "../../../../../utils/query/promotion";
import { checkTime } from "../../promoService";
import moment from 'moment'

import { connect } from "react-redux";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

function UpdateEvent(props) {
  const {
    id,
    name,
    status,
    eventTime,
    config,
    paymentType
  } = props.detailPromo;
  const { startTime, endTime, dates, daily, hour } = JSON.parse(eventTime);
  const isTimeInPromo = checkTime(startTime)
  const [alertUpdateSuccess, setAlertUpdateSuccess] = useState(false);
  const [switchTypeEvent, setSwitchTypeEvent] = useState(config ? false : true);
  const [indexShop, setIndexShop] = useState(initialIndexShop);
  const [isCreatePromo, setIsCreatePromo] = useState(false);
  const { game, server, data, type } = JSON.parse(config);
  console.log(endTime)
  const [indexPromoAndEvent, setIndexPromoAndEvent] = useState({
    id: id,
    name: name,
    platformId: game,
    server: server,
    status: status,
    type: '',
    timeTotal: [startTime,endTime],
    dates: dates,
    daily: daily,
    startTime: hour[0],
    endTime: hour[1]
  });
  const [listPartner, setListPartner] = useState({
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
  const [indexGameForPromo, setIndexGameForPromo] = useState({
    platformId: "",
    server: ""
  });
  const [getListPartnerByPlatform] = useLazyQuery(getListPartnerProducts2, {
    onCompleted: data => {
      setListPartner({ ...listPartner, listItems: data.listPartnerProducts });
    }
  });
  useEffect(() => {
    dispatchTypeEventByMoney(type);
    dispatchSetDataTypePromo({ isType: type.toLowerCase(), data: data });
    getListPartnerByPlatform({
      variables: {
        partnerId: game
      }
    });
  }, []);
  const { platformId } = indexPromoAndEvent;
  const { listGame, listItems, listServer } = listPartner;
  const [deleteEvent] = useMutation(deleteEvents, {
    variables: {
      ids: [id]
    },
    onCompleted: data => console.log(data)
  });
  const [deletePromo] = useMutation(deletePromotion, {
    variables: {
      ids: props.idCreatePromoAndEvent
    },
    onCompleted: data => console.log(data)
  });
  useQuery(getListServer(platformId), {
    onCompleted: data => {
      setListPartner({
        ...listPartner,
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
    fetchPolicy:'cache-and-network',
    onCompleted: data => {
      setIndexEventByMoney({
        ...indexEventByMoney,
        itemsForEventByMoney: data.listProducts
      });
    }
  });
  const handleChangePlatform = async e => {
    dispatchResetItemRewards();
    await setIndexPromoAndEvent({
      ...indexPromoAndEvent,
      platformId: e,
      server: 0
    });
    await getListPartnerByPlatform({
      variables: {
        partnerId: e
      }
    });
  };
  const resetGameAndServer = () => {
  };
  const handleChangePlatformPromo = async e => {
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
    await setIndexGameForPromo({
      platformId: e,
      server: 0
    });
    await getListPartnerByPlatform({
      variables: {
        partnerId: e
      }
    });
  };
  const handleChangeServerPromo = e => {
    setIndexGameForPromo({ ...indexGameForPromo, server: e });
  };
  const setInfoPromo = e => {
    setIndexPromoAndEvent({
      ...indexPromoAndEvent,
      [e.target.name]: e.target.value
    });
  };
  const handleChangeServer = e => {
    setIndexPromoAndEvent({ ...indexPromoAndEvent, server: e });
  };
  const handleStartTimeTotal = value => {
    const newTimetotal = indexPromoAndEvent.timeTotal;
    newTimetotal[0] = moment(value).format("YYYY-MM-DD hh:mm") + ":00";
    setIndexPromoAndEvent({
      ...indexPromoAndEvent,
      timeTotal: newTimetotal
    });
  };
  const handleEndTimeTotal = value => {
    const newTimetotal = indexPromoAndEvent.timeTotal;
    newTimetotal[1] = moment(value).format("YYYY-MM-DD hh:mm") + ":59";
    setIndexPromoAndEvent({
      ...indexPromoAndEvent,
      timeTotal: newTimetotal
    });
  };
  const pickAllDay = () => {
    setIndexPromoAndEvent({
      ...indexPromoAndEvent,
      startTime: "00:00:00",
      endTime: "23:59:59"
    });
  };
  const setTimePromo = (timeString, val) => {
    if (val === "startTime") {
      setIndexPromoAndEvent({
        ...indexPromoAndEvent,
        startTime: timeString !== "" ? timeString + ":00" : ""
      });
    } else {
      setIndexPromoAndEvent({
        ...indexPromoAndEvent,
        endTime: timeString !== "" ? timeString + ":59" : ""
      });
    }
  };
  const handleChangeDaily = value => {
    setIndexPromoAndEvent({
      ...indexPromoAndEvent,
      daily: value.sort((a, b) => a - b)
    });
  };
  const handleChangeDates = value => {
    setIndexPromoAndEvent({
      ...indexPromoAndEvent,
      dates: value.sort((a, b) => a - b)
    });
  };
  const handleChangeTypePromo = val => {
    setIndexPromoAndEvent({ ...indexPromoAndEvent, type: val });
  };
  const successAlert = value => {
    setIsCreatePromo(value);
    setAlertUpdateSuccess(true);
  };
  const backToList = () => {
    dispatchInititalIndexConfig();
    isCreatePromo ? deleteEvent() : console.log(null);
  };

  return (
    <Row className="container-promotion">
      <div>
        <div>
          <Link to="/payment/promotion" onClick={backToList}>
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
            indexPromoAndEvent={indexPromoAndEvent}
            resetGameAndServer={resetGameAndServer}
            setInfoPromo={setInfoPromo}
            switchTypeEvent={switchTypeEvent}
            setSwitchTypeEvent={setSwitchTypeEvent}
            isTimeInPromo={isTimeInPromo}
          />
          {switchTypeEvent ? (
            <MenuRewardByItem
              indexShop={indexShop}
              setIndexShop={setIndexShop}
              indexPromoAndEvent={indexPromoAndEvent}
              indexGameForPromo={indexGameForPromo}
              listPartner={listPartner}
              handleChangePlatformPromo={handleChangePlatformPromo}
              handleChangeTypePromo={handleChangeTypePromo}
              handleChangeServerPromo={handleChangeServerPromo}
            />
          ) : (
              <MenuRewardEventByMoney
                indexPromoAndEvent={indexPromoAndEvent}
                setIndexPromoAndEvent={setIndexPromoAndEvent}
                indexEventByMoney={indexEventByMoney}
                setIndexEventByMoney={setIndexEventByMoney}
                server={server}
                listPartner={listPartner}
                handleChangePlatform={handleChangePlatform}
                handleChangeServer={handleChangeServer}
                isTimeInPromo={isTimeInPromo}
              />
            )}
        </div>
      </Col>
      <InputTimeArea
        indexPromoAndEvent={indexPromoAndEvent}
        alertInfoPromo={alertInfoPromo}
        handleStartTimeTotal={handleStartTimeTotal}
        handleEndTimeTotal={handleEndTimeTotal}
        pickAllDay={pickAllDay}
        handleChangeDaily={handleChangeDaily}
        handleChangeDates={handleChangeDates}
        setTimePromo={setTimePromo}
        isTimeInPromo={isTimeInPromo}
      />
      <Col md={24}>
        {switchTypeEvent ? (
          <EventByItems
            listItems={listItems}
            indexPromoAndEvent={indexPromoAndEvent}
            indexGameForPromo={indexGameForPromo}
            indexShop={indexShop}
            setIndexShop={setIndexShop}
            isUpdate={props.isUpdate}
            successAlert={successAlert}
          />
        ) : (
            <InputRewardForShowByMoney
              successAlert={successAlert}
              listPartner={listPartner}
              listItems={listItems}
              switchTypeEvent={switchTypeEvent}
              indexPromoAndEvent={indexPromoAndEvent}
              setIndexPromoAndEvent={setIndexPromoAndEvent}
              indexEventByMoney={indexEventByMoney}
              setIndexEventByMoney={setIndexEventByMoney}
              setIsCreatePromo={setIsCreatePromo}
              isTimeInPromo={isTimeInPromo}
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
        cancelText="Tiếp tục"
      ></Modal>
    </Row>
  );
}
function mapStateToProps(state) {
  return {
    detailPromo: state.detailPromo,
    idCreatePromoAndEvent: state.idPromoAndEventCreateInUpdate
  };
}
export default connect(mapStateToProps, null)(UpdateEvent);
