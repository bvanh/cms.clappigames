import React, { useState, useEffect, useMemo } from "react";
import { Row, Col, DatePicker, Select, Icon, Modal, Input, Button } from "antd";
import { useLazyQuery, useMutation, useQuery } from "@apollo/react-hooks";
import {
  deleteEvents,
  deletePromotion,
} from "../../../../../utils/mutation/promotion";
import ListImagesForNews from "../../../../news/modalImageUrl/imgsUrl";
import "../../../../../static/style/promotion.css";
import EventByItems from "./inputRewardItem";
import MenuRewardByItem from "./menuRewardItem";
import InputRewardForShowByMoney from "../../create/event/inputReward";
import MenuRewardEventByMoney from "../../create/event/menuReward";
import {
  InputNameAndTypeArea,
  InputTimeArea,
} from "../../create/nameAndTimePromo";
import {
  dispatchResetItemRewards,
  dispatchInititalIndexConfig,
  dispatchShowImagesNews,
  dispatchSetUrlImageThumbnail,
} from "../../../../../redux/actions/index";
import { queryGetPlatform } from "../../../../../utils/queryPlatform";
import { getListPartnerProducts2 } from "../../../../../utils/queryPartnerProducts";
import {
  getListServer,
  getListItemsForEvent,
} from "../../../../../utils/query/promotion";
import { checkTime, indexAllServer } from "../../promoService";
import moment from "moment";
import { connect } from "react-redux";
import { BrowserRouter as Router, Link, useHistory } from "react-router-dom";
function UpdatePromotion(props) {
  const history = useHistory();
  const {
    name,
    id,
    game,
    status,
    eventTime,
    shop,
    type,
    config,
    paymentType,
    linkUrl,
    prefix,
    imageUrl,
  } = props.detailPromo;
  const { startTime, endTime, dates, days, hours } = JSON.parse(eventTime);
  const isTimeInPromo = checkTime(startTime);
  const [switchTypeEvent, setSwitchTypeEvent] = useState(shop ? true : false);
  const [isCreateEvent, setIsCreateEvent] = useState(false);
  const [indexShop, setIndexShop] = useState(shop ? JSON.parse(shop) : "");
  const [indexPromoAndEvent, setIndexPromoAndEvent] = useState({
    name: name,
    platformId: "",
    server: "",
    status: status,
    type: type,
    timeTotal: [startTime, endTime],
    dates: dates,
    daily: days,
    startTime: hours[0],
    endTime: hours[1],
    linkUrlUpdate: linkUrl,
    prefixPromo: prefix,
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
  const [indexGameForPromo, setIndexGameForPromo] = useState({
    platformId: game,
    server: props.detailPromo.server,
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
  const { platformId, server } = indexGameForPromo;
  const { linkUrlUpdate } = indexPromoAndEvent;
  const { listItems } = listPartner;
  const [getListPartnerByPlatform] = useLazyQuery(getListPartnerProducts2, {
    onCompleted: (data) => {
      setListPartner({ ...listPartner, listItems: data.listPartnerProducts });
    },
  });
  useQuery(queryGetPlatform, {
    onCompleted: (data) => {
      setListPartner({ ...listPartner, listGame: data.listPartners });
    },
  });
  const [deleteEvent] = useMutation(deleteEvents, {
    variables: {
      ids: props.idCreatePromoAndEvent,
    },
    onCompleted: (data) => {
      console.log(data);
    },
  });
  const [deletePromo] = useMutation(deletePromotion, {
    variables: {
      ids: [id],
    },
    onCompleted: (data) => console.log(data),
  });
  useQuery(getListServer(platformId), {
    onCompleted: (data) => {
      setListPartner({
        ...listPartner,
        listServer: data.listPartnerServers,
      });
    },
  });
  useQuery(getListItemsForEvent, {
    onCompleted: (data) => {
      setIndexEventByMoney({
        ...indexEventByMoney,
        itemsForEventByMoney: data.listProducts,
      });
    },
  });
  useEffect(() => {
    dispatchSetUrlImageThumbnail(imageUrl);
  }, []);
  useMemo(
    () =>
      getListPartnerByPlatform({
        variables: {
          partnerId: config ? JSON.parse(config).game : "",
        },
      }),
    [switchTypeEvent]
  );
  const resetGameAndServer = () => {};

  const handleChangePlatform = async (e) => {
    dispatchResetItemRewards();
    await setIndexPromoAndEvent({
      ...indexPromoAndEvent,
      platformId: e,
      server: 0,
    });
    setListPartner({
      ...listPartner,
      listServer: [],
    });
    await getListPartnerByPlatform({
      variables: {
        partnerId: e,
      },
    });
  };
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
  const setInfoPromo = (e) => {
    setIndexPromoAndEvent({
      ...indexPromoAndEvent,
      [e.target.name]: e.target.value,
    });
  };
  const handleChangeServerPromo = (e) => {
    setIndexGameForPromo({ ...indexGameForPromo, server: e });
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
  // const successAlert = (val) => {
  //   setIsCreateEvent(val);
  //   setAlertUpdateSuccess(true);
  // };
  const confirmAlert = () => {
    Modal.confirm({
      title: "Do you want continue update this promotion ?!",
      okText: "No",
      cancelText: "Yes",
      onOk() {
        dispatchInititalIndexConfig();
        if (isCreateEvent) {
          deletePromo();
          history.push(
            `/payment/promotion/detail/event?id=${props.idCreatePromoAndEvent}`
          );
        } else {
          viewDetail();
        }
      },
    });
  };
  const successAlert = (isCreateEvent) => {
    setIsCreateEvent(isCreateEvent);
    Modal.confirm({
      title: "Update promotion successful ?!",
      okText: "Back",
      cancelText: "Continue",
      onOk() {
        if (isCreateEvent) {
          deletePromo();
          history.push(
            `/payment/promotion/detail/event?id=${props.idCreatePromoAndEvent}`
          );
        } else {
          viewDetail();
        }
      },
    });
  };
  const viewDetail = () => {
    deleteEvent();
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
          <a onClick={confirmAlert}>
            <Icon type="arrow-left" style={{ paddingRight: ".2rem" }} />
            Back
          </a>
          <h2>Update promotion</h2>
        </div>
      </div>
      <Col md={12} className="section1-promotion">
        <div>
          <InputNameAndTypeArea
            // alertUpdateSuccess={alertUpdateSuccess}
            resetGameAndServer={resetGameAndServer}
            indexPromoAndEvent={indexPromoAndEvent}
            listPartner={listPartner}
            setListPartner={setListPartner}
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
              handleChangelistPartner={handleChangeTypePromo}
              handleChangeServerPromo={handleChangeServerPromo}
              isTimeInPromo={isTimeInPromo}
            />
          ) : (
            <MenuRewardEventByMoney
              indexPromoAndEvent={indexPromoAndEvent}
              setIndexPromoAndEvent={setIndexPromoAndEvent}
              indexEventByMoney={indexEventByMoney}
              setIndexEventByMoney={setIndexEventByMoney}
              server={indexPromoAndEvent.server}
              listPartner={listPartner}
              handleChangePlatform={handleChangePlatform}
              handleChangeServer={handleChangeServer}
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
      <Col md={18} className="input-gift-container">
        {switchTypeEvent ? (
          <EventByItems
            listItems={listItems}
            indexPromoAndEvent={indexPromoAndEvent}
            indexShop={indexShop}
            setIndexShop={setIndexShop}
            indexGameForPromo={indexGameForPromo}
            successAlert={successAlert}
            isTimeInPromo={isTimeInPromo}
          />
        ) : (
          <InputRewardForShowByMoney
            successAlert={successAlert}
            listPartner={listPartner}
            listItems={listItems}
            indexPromoAndEvent={indexPromoAndEvent}
            setIndexPromoAndEvent={setIndexPromoAndEvent}
            indexEventByMoney={indexEventByMoney}
            setIndexEventByMoney={setIndexEventByMoney}
            isUpdate={props.isUpdate}
          />
        )}
        <Button
          className="btn-update-promo"
          disabled={isTimeInPromo}
          onClick={() => deletePromo()}
        >
          Delete
        </Button>
      </Col>
      <Col md={6} style={{ margin: ".5rem 0" }}>
        <div className="addLink">
          <h3>Link post</h3>
          <Input
            placeholder="Get link post..."
            style={{ width: "100%" }}
            value={linkUrlUpdate}
            name="linkUrlUpdate"
            onChange={getLinkUrlAndPrefix}
          />
        </div>
        <div className="select-image-promotion">
          <p className="select-image-promotion-title">
            Select thumbnail promotion
          </p>
          <div style={{ width: "100%", padding: ".5rem" }}>
            {props.urlImgThumbnail === null ? (
              <i>Thumbnail image is emtry</i>
            ) : (
              <img src={props.urlImgThumbnail} width="100%" height="100%" />
            )}
          </div>
          <a
            onClick={() => dispatchShowImagesNews(true)}
            style={{ paddingLeft: ".5rem" }}
          >
            Select
          </a>
        </div>
        <ListImagesForNews isThumbnail={true} />
      </Col>
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
export default connect(mapStateToProps, null)(UpdatePromotion);
