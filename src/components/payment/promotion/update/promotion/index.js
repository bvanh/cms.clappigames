import React, { useState, useEffect, useMemo } from "react";
import { Row, Col, DatePicker, Select, Icon, Modal } from "antd";
import { useLazyQuery, useMutation, useQuery } from "@apollo/react-hooks";
import { deleteEvents, deletePromotion } from '../../../../../utils/mutation/promotion'
import "../../../../../static/style/promotion.css";
import EventByItems from "./inputRewardItem";
import MenuRewardByItem from "./menuRewardItem";
import InputRewardForShowByMoney from "../../create/event/inputReward";
import MenuRewardEventByMoney from "../../create/event/menuReward";
import {
  InputNameAndTypeArea,
  InputTimeArea
} from "../../create/nameAndTimePromo";
import {
  dispatchResetItemRewards,
  dispatchInititalIndexConfig
} from "../../../../../redux/actions/index";
import { queryGetPlatform } from "../../../../../utils/queryPlatform";
import { getListPartnerProducts2 } from "../../../../../utils/queryPartnerProducts";
import {
  getListServer,
  getListItemsForEvent
} from "../../../../../utils/query/promotion";
import { connect } from "react-redux";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
function UpdatePromotion(props) {
  const {
    name,
    id,
    game,
    status,
    eventTime,
    shop,
    type,
    config,
    paymentType
  } = props.detailPromo;
  const { startTime, endTime, dates, daily, hour } = JSON.parse(eventTime);
  const [alertUpdateSuccess, setAlertUpdateSuccess] = useState(false);
  const [switchTypeEvent, setSwitchTypeEvent] = useState(shop ? true : false);
  const [isCreateEvent, setIsCreateEvent] = useState(false);
  const [indexShop, setIndexShop] = useState(shop ? JSON.parse(shop) : "");
  const [indexPromoAndEvent, setIndexPromoAndEvent] = useState({
    name: name,
    platformId: game,
    server: '',
    status: status,
    type: type,
    timeTotal: [startTime, endTime],
    dates: dates,
    daily: daily,
    startTime: hour[0],
    endTime: hour[1]
  });
  const [typePromo, setTypePromo] = useState({
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
  const [indexGameForPromo, setIndexGameForPromo] = useState({
    platformId: game,
    server: props.detailPromo.server
  })
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
  const { platformId, server } = indexGameForPromo;
  const {listItems} = typePromo;
  const [getListPartnerByPlatform] = useLazyQuery(getListPartnerProducts2, {
    onCompleted: data => {
      setTypePromo({ ...typePromo, listItems: data.listPartnerProducts });
    }
  });
  useQuery(queryGetPlatform, {
    onCompleted: data => {
      setTypePromo({ ...typePromo, listGame: data.listPartners });
    }
  })
  const [deleteEvent] = useMutation(deleteEvents, {
    variables: {
      ids: props.idCreatePromoAndEvent
    },
    onCompleted: data => console.log(data)
  })
  const [deletePromo] = useMutation(deletePromotion, {
    variables: {
      ids: [id]
    },
    onCompleted: data => console.log(data)
  })
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
  const resetGameAndServer = () => {
    // setTypePromo({
    //   ...typePromo,
    //   listServer: [
    //     {
    //       server: 0,
    //       serverName: "All server"
    //     }
    //   ]
    // });
    // setindexPromoAndEvent({ ...indexPromoAndEvent, platformPromoId: "", server: "" });
  };
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
  const setInfoPromo = e => {
    setIndexPromoAndEvent({ ...indexPromoAndEvent, [e.target.name]: e.target.value });
  };
  const handleChangeServerPromo = e => {
    setIndexGameForPromo({ ...indexGameForPromo, server: e });
  };
  const handleChangeServer = e => {
    setIndexPromoAndEvent({ ...indexPromoAndEvent, serverGame: e });
  };
  const onChangeDatePicker = (value, dateString) => {
    console.log(dateString)
    setIndexPromoAndEvent({ ...indexPromoAndEvent, timeTotal: dateString });
  };
  const setTimePromo = (timeString, val) => {

    if (val === "startTime") {
      setIndexPromoAndEvent({ ...indexPromoAndEvent, startTime: timeString !== "" ? timeString + ":00" : '' });
    } else {
      setIndexPromoAndEvent({ ...indexPromoAndEvent, endTime: timeString !== "" ? timeString + ":59" : '' });
    }
  };
  const handleChangeDaily = value => {
    setIndexPromoAndEvent({ ...indexPromoAndEvent, daily: value.sort((a, b) => a - b) });
  };
  const handleChangeDates = value => {
    setIndexPromoAndEvent({ ...indexPromoAndEvent, dates: value.sort((a, b) => a - b) });
  };
  const handleChangeTypePromo = val => {
    setIndexPromoAndEvent({ ...indexPromoAndEvent, promoType: val });
  };
  const successAlert = value => {
    setIsCreateEvent(value);
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
            resetGameAndServer={resetGameAndServer}
            indexPromoAndEvent={indexPromoAndEvent}
            typePromo={typePromo}
            setTypePromo={setTypePromo}
            setInfoPromo={setInfoPromo}
            switchTypeEvent={switchTypeEvent}
            setSwitchTypeEvent={setSwitchTypeEvent}
          />
          {switchTypeEvent ? (
            <MenuRewardByItem
              indexShop={indexShop}
              setIndexShop={setIndexShop}
              indexPromoAndEvent={indexPromoAndEvent}
              indexGameForPromo={indexGameForPromo}
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
            indexGameForPromo={indexGameForPromo}
          />
        ) : (
            <InputRewardForShowByMoney
              alertUpdateSuccess={successAlert}
              typePromo={typePromo}
              listItems={listItems}
              indexPromoAndEvent={indexPromoAndEvent}
              setIndexPromoAndEvent={setIndexPromoAndEvent}
              indexEventByMoney={indexEventByMoney}
              setIndexEventByMoney={setIndexEventByMoney}
              isUpdate={props.isUpdate}
            />
          )}
      </Col>
      <Modal
        title={<Icon type="check-circle" />}
        visible={alertUpdateSuccess}
        onCancel={() => setAlertUpdateSuccess(false)}
        onOk={() => {
          isCreateEvent ? deletePromo() : deleteEvent();
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
export default connect(mapStateToProps, null)(UpdatePromotion);
