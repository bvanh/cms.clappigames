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
    id,
    name,
    status,
    eventTime,
    config,
    paymentType
  } = props.detailPromo;
  const { startTime, endTime, dates, daily, hour } = JSON.parse(eventTime);
  const { game, server, type } = JSON.parse(config);
  const [alertUpdateSuccess, setAlertUpdateSuccess] = useState(false);
  const [switchTypeEvent, setSwitchTypeEvent] = useState(config ? false : true);
  const [indexShop, setIndexShop] = useState(initialIndexShop);
  const [isCreatePromo, setIsCreatePromo] = useState(false);
  const [indexPromoAndEvent, setIndexPromoAndEvent] = useState({
    eventPaymentType: [],
    name: name,
    platformId: game,
    server: server,
    status: status,
    type: type ? type : "",
    timeTotal: [startTime, endTime],
    dates: dates,
    daily: daily,
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
  const [indexGameForPromo, setIndexGameForPromo] = useState({
    platformId: "",
    server: ""
  });
  const { platformId } = indexPromoAndEvent;
  console.log(platformId)
  const { listItems } = typePromo;
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
  const [getListPartnerByPlatform] = useLazyQuery(getListPartnerProducts2, {
    onCompleted: data => {
      setTypePromo({ ...typePromo, listItems: data.listPartnerProducts });
    }
  });
  useQuery(getListServer(platformId), {
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
  const handleChangePlatformPromo = async e => {
    console.log(e)
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
      ...indexGameForPromo,
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
    setTypePromo({
      ...typePromo,
      listServer: [
        {
          server: 0,
          serverName: "All server"
        }
      ]
    });
    setIndexPromoAndEvent({ ...indexPromoAndEvent, platformId: "", server: "" });
  };
  const setInfoPromo = e => {
    setIndexPromoAndEvent({ ...indexPromoAndEvent, [e.target.name]: e.target.value });
  };
  const handleChangeServer = e => {
    setIndexPromoAndEvent({ ...indexPromoAndEvent, server: e });
  };
  const handleChangeServerPromo = e => {
    setIndexGameForPromo({ ...indexGameForPromo, server: e });
  };
  const onChangeDatePicker = (value, dateString) => {
    console.log(dateString);
    setIndexPromoAndEvent({ ...indexPromoAndEvent, timeTotal: dateString });
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
    setIndexPromoAndEvent({ ...indexPromoAndEvent, daily: value.sort((a, b) => a - b) });
  };
  const handleChangeDates = value => {
    setIndexPromoAndEvent({ ...indexPromoAndEvent, dates: value.sort((a, b) => a - b) });
  };
  const handleChangeTypePromo = val => {
    setIndexPromoAndEvent({ ...indexPromoAndEvent, typePromo: val });
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
            indexPromoAndEvent={indexPromoAndEvent}
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
              indexPromoAndEvent={indexPromoAndEvent}
              typePromo={typePromo}
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
                typePromo={typePromo}
                handleChangePlatform={handleChangePlatform}
                handleChangeServer={handleChangeServer}
              />
            )}
        </div>
      </Col>
      <InputTimeArea
        indexPromoAndEvent={indexPromoAndEvent}
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
            indexPromoAndEvent={indexPromoAndEvent}
            indexShop={indexShop}
            setIndexShop={setIndexShop}
            isUpdate={props.isUpdate}
            successAlert={successAlert}
            indexGameForPromo={indexGameForPromo}
          />
        ) : (
            <InputRewardForShowByMoney
              alertUpdateSuccess={successAlert}
              setIsCreatePromo={setIsCreatePromo}
              typePromo={typePromo}
              listItems={listItems}
              indexPromoAndEvent={indexPromoAndEvent}
              setIndexPromoAndEvent={setIndexPromoAndEvent}
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
  console.log(state.idPromoAndEventCreateInUpdate);
  return {
    detailPromo: state.detailPromo,
    idCreatePromoAndEvent: state.idPromoAndEventCreateInUpdate
  };
}
export default connect(mapStateToProps, null)(UpdateEvent);
