import React, { useState, useEffect, useMemo } from "react";
import { Row, Col, Input, Icon, Modal, Button } from "antd";
import { useLazyQuery, useMutation, useQuery } from "@apollo/react-hooks";
import {
  deleteEvents,
  deletePromotion,
} from "../../../../../utils/mutation/promotion";
import "../../../../../static/style/promotion.css";
import EventByItems from "../../create/promotion/inputRewardItem";
import MenuRewardByItem from "../../create/promotion/menuRewardItem";
import InputRewardForShowByMoney from "./inputReward";
import MenuRewardEventByMoney from "./menuReward";
import {
  InputNameAndTypeArea,
  InputTimeArea,
} from "../../create/nameAndTimePromo";
import ListImagesForNews from "../../../../news/modalImageUrl/imgsUrl";
import {
  dispatchResetItemRewards,
  dispatchInititalIndexConfig,
  dispatchTypeEventByMoney,
  dispatchSetDataTypePromo,
  dispatchShowImagesNews,
  dispatchSetUrlImageThumbnail,
} from "../../../../../redux/actions/index";
import { initialIndexShop } from "../../promoService";
import { getListPartnerProducts2 } from "../../../../../utils/queryPartnerProducts";
import {
  getListServer,
  getListItemsForEvent,
} from "../../../../../utils/query/promotion";
import { checkTime, indexAllServer } from "../../promoService";
import moment from "moment";

import { connect } from "react-redux";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

function UpdateEvent(props) {
  const {
    id,
    name,
    status,
    eventTime,
    config,
    paymentType,
    linkUrl,
    imageUrl,
    prefix,
  } = props.detailPromo;
  const { startTime, endTime, dates, daily, hour } = JSON.parse(eventTime);
  const isTimeInPromo = checkTime(startTime);
  const [alertUpdateSuccess, setAlertUpdateSuccess] = useState(false);
  const [switchTypeEvent, setSwitchTypeEvent] = useState(config ? false : true);
  const [indexShop, setIndexShop] = useState(initialIndexShop);
  const [isCreatePromo, setIsCreatePromo] = useState(false);
  const { game, server, data, type } = JSON.parse(config);
  const [indexPromoAndEvent, setIndexPromoAndEvent] = useState({
    id: id,
    name: name,
    platformId: game,
    server: server,
    status: status,
    type: "",
    timeTotal: [startTime, endTime],
    dates: dates,
    daily: daily,
    startTime: hour[0],
    endTime: hour[1],
    linkUrlUpdate: linkUrl,
    prefixUpdate: prefix,
  });
  const [listPartner, setListPartner] = useState({
    listGame: [{}],
    listServer: [indexAllServer],
    listItems: [
      {
        productId: "",
        partnerProductId: "",
      },
    ],
  });
  const [alertInfoPromo, setAlertInfoPromo] = useState({
    dailyAlert: [],
    datesAlert: [],
    timeTotalAlert: [],
  });
  const [indexEventByMoney, setIndexEventByMoney] = useState({
    paymentTypeByMoney: "",
    isPaymentTypeByCoin: paymentType === "COIN" ? true : false,
    itemsForEventByMoney: [{ productName: "", productId: "" }],
  });
  const [indexGameForPromo, setIndexGameForPromo] = useState({
    platformId: "",
    server: "",
  });
  const [getListPartnerByPlatform] = useLazyQuery(getListPartnerProducts2, {
    onCompleted: (data) => {
      setListPartner({ ...listPartner, listItems: data.listPartnerProducts });
    },
  });
  useEffect(() => {
    dispatchSetUrlImageThumbnail(imageUrl);
    dispatchTypeEventByMoney(type);
    dispatchSetDataTypePromo({ isType: type.toLowerCase(), data: data });
    getListPartnerByPlatform({
      variables: {
        partnerId: game,
      },
    });
  }, []);
  const { platformId, linkUrlUpdate, prefixUpdate } = indexPromoAndEvent;
  const { listGame, listItems, listServer } = listPartner;
  const [deleteEvent] = useMutation(deleteEvents, {
    variables: {
      ids: [id],
    },
    onCompleted: (data) => console.log(data),
  });
  const [deletePromo] = useMutation(deletePromotion, {
    variables: {
      ids: props.idCreatePromoAndEvent,
    },
    onCompleted: (data) => console.log(data),
  });
  useQuery(getListServer(platformId), {
    onCompleted: (data) => {
      setListPartner({
        ...listPartner,
        listServer: [indexAllServer, ...data.listPartnerServers],
      });
    },
  });
  useQuery(getListItemsForEvent, {
    fetchPolicy: "cache-and-network",
    onCompleted: (data) => {
      setIndexEventByMoney({
        ...indexEventByMoney,
        itemsForEventByMoney: data.listProducts,
      });
    },
  });
  const handleChangePlatform = async (e) => {
    dispatchResetItemRewards();
    await setIndexPromoAndEvent({
      ...indexPromoAndEvent,
      platformId: e,
      server: 0,
    });
    await getListPartnerByPlatform({
      variables: {
        partnerId: e,
      },
    });
  };
  const resetGameAndServer = () => {};
  const handleChangePlatformPromo = async (e) => {
    dispatchResetItemRewards();
    setIndexShop([
      {
        purchaseTimes: 1,
        purchaseItemId: [],
        rewards: [
          {
            numb: 1,
            itemId: [],
          },
        ],
      },
    ]);
    await setIndexGameForPromo({
      platformId: e,
      server: 0,
    });
    await getListPartnerByPlatform({
      variables: {
        partnerId: e,
      },
    });
  };
  const handleChangeServerPromo = (e) => {
    setIndexGameForPromo({ ...indexGameForPromo, server: e });
  };
  const setInfoPromo = (e) => {
    setIndexPromoAndEvent({
      ...indexPromoAndEvent,
      [e.target.name]: e.target.value,
    });
  };
  const handleChangeServer = (e) => {
    setIndexPromoAndEvent({ ...indexPromoAndEvent, server: e });
  };
  const handleStartTimeTotal = (value) => {
    const newTimetotal = indexPromoAndEvent.timeTotal;
    newTimetotal[0] = moment(value).format("YYYY-MM-DD HH:mm") + ":00";
    setIndexPromoAndEvent({
      ...indexPromoAndEvent,
      timeTotal: newTimetotal,
    });
  };
  const handleEndTimeTotal = (value) => {
    const newTimetotal = indexPromoAndEvent.timeTotal;
    newTimetotal[1] = moment(value).format("YYYY-MM-DD HH:mm") + ":59";
    setIndexPromoAndEvent({
      ...indexPromoAndEvent,
      timeTotal: newTimetotal,
    });
  };
  const pickAllDay = () => {
    setIndexPromoAndEvent({
      ...indexPromoAndEvent,
      startTime: "00:00:00",
      endTime: "23:59:59",
    });
  };
  const setTimePromo = (timeString, val) => {
    if (val === "startTime") {
      setIndexPromoAndEvent({
        ...indexPromoAndEvent,
        startTime: timeString !== "" ? timeString + ":00" : "",
      });
    } else {
      setIndexPromoAndEvent({
        ...indexPromoAndEvent,
        endTime: timeString !== "" ? timeString + ":59" : "",
      });
    }
  };
  const handleChangeDaily = (value) => {
    setIndexPromoAndEvent({
      ...indexPromoAndEvent,
      daily: value.sort((a, b) => a - b),
    });
  };
  const handleChangeDates = (value) => {
    setIndexPromoAndEvent({
      ...indexPromoAndEvent,
      dates: value.sort((a, b) => a - b),
    });
  };
  const handleChangeTypePromo = (val) => {
    setIndexPromoAndEvent({ ...indexPromoAndEvent, type: val });
  };
  const successAlert = (value) => {
    setIsCreatePromo(value);
    setAlertUpdateSuccess(true);
  };
  const backToList = () => {
    dispatchInititalIndexConfig();
    isCreatePromo ? deleteEvent() : viewDetail();
  };
  const viewDetail = () => {
    deletePromo();
    props.backToDetail();
  };
  const getLinkUrlAndPrefix = (e) => {
    setIndexPromoAndEvent({
      ...indexPromoAndEvent,
      [e.target.name]: e.target.value,
    });
  };
  return (
    <Row className="container-promotion">
      <div>
        <div>
          {isCreatePromo ? (
            <Link
              to={`/payment/promotion/detail/promotion?id=${props.idCreatePromoAndEvent}`}
              onClick={backToList}
            >
              Back
            </Link>
          ) : (
            <a onClick={backToList}>
              <Icon type="arrow-left" style={{ paddingRight: ".2rem" }} />
              Back
            </a>
          )}
          <h2>Update promotion</h2>
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
      <Col md={18}>
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
        <Button>demo</Button>
      </Col>
      <Col md={6}>
        <div className="addLink">
          <h3>Link post</h3>
          <Input
            placeholder="Get link post..."
            style={{ width: "100%" }}
            value={linkUrlUpdate}
            name="linkUrl"
            onChange={getLinkUrlAndPrefix}
          />
        </div>
        <div className="addPrefix">
          <h3>Prefix</h3>
          <Input
            placeholder="Get prefix..."
            style={{ width: "100%" }}
            value={prefixUpdate}
            name="prefix"
            onChange={getLinkUrlAndPrefix}
          />
        </div>
        <div>
          <p>Select thumbnail promotion</p>
          <div style={{ width: "100%" }}>
            {props.urlImgThumbnail === null ? (
              <i>Thumbnail image is emtry</i>
            ) : (
              <img src={props.urlImgThumbnail} width="100%" />
            )}
          </div>
          <a onClick={() => dispatchShowImagesNews(true)}>Select</a>
        </div>
        <ListImagesForNews isThumbnail={true} />
      </Col>
      <Modal
        title={<Icon type="check-circle" />}
        visible={alertUpdateSuccess}
        onCancel={() => setAlertUpdateSuccess(false)}
        onOk={() => {
          isCreatePromo ? deleteEvent() : viewDetail();
        }}
        okText={
          isCreatePromo ? (
            <Link
              to={`/payment/promotion/detail/promotion?id=${props.idCreatePromoAndEvent}`}
            >
              Back
            </Link>
          ) : (
            <span>Back</span>
          )
        }
        cancelText="Next"
      ></Modal>
    </Row>
  );
}
function mapStateToProps(state) {
  return {
    detailPromo: state.detailPromo,
    idCreatePromoAndEvent: state.idPromoAndEventCreateInUpdate,
    visible: state.visibleModalNews,
    urlImgThumbnail: state.urlImgThumbnail,
  };
}
export default connect(mapStateToProps, null)(UpdateEvent);
