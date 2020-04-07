import React, { useState, useEffect, useMemo } from "react";
import { Row, Col, Modal, Icon, Input } from "antd";
import { useLazyQuery, useMutation, useQuery } from "@apollo/react-hooks";
import "../../../../static/style/promotion.css";
import EventByItems from "./promotion/inputRewardItem";
import InputRewardByMoney from "./event/inputReward";
import MenuRewardEventByMoney from "./event/menuReward";
import ListImagesForNews from "../../../news/modalImageUrl/imgsUrl";
import {
  dispatchShowImagesNews,
  dispatchSetUrlImageThumbnail
} from "../../../../redux/actions/index";
import { InputNameAndTypeArea, InputTimeArea } from "./nameAndTimePromo";
import { dispatchSwitchCreatePromo } from "../../../../redux/actions/index";
import MenuRewardByItem from "./promotion/menuRewardItem";
import { queryGetPlatform } from "../../../../utils/queryPlatform";
import { getListPartnerProducts } from "../../../../utils/queryPartnerProducts";
import { connect } from 'react-redux'
import moment from "moment";
import {
  initialIndexEventByMoney,
  initialIndexPromo,
  initiallistPartner
} from "../promoService";
import {
  getListServer,
  getListItemsForEvent
} from "../../../../utils/query/promotion";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

const initialIndexShop = [
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
];
function CreatePromotion(props) {
  const [switchTypeEvent, setSwitchTypeEvent] = useState(true);
  const [indexPromoAndEvent, setIndexPromoAndEvent] = useState({
    name: "",
    platformId: "",
    server: "",
    status: "INPUT",
    type: "",
    typeEvent: "",
    timeTotal: [
      moment()
        .format("YYYY-MM-DD HH:mm:ss"),
      moment()
        .format("YYYY-MM-DD HH:mm:ss")
    ],
    dates: [],
    daily: [],
    startTime: "00:00:00",
    endTime: "00:00:00",
    linkUrl: null
  });
  const [indexGameForPromo, setIndexGameForPromo] = useState({
    platformId: "",
    server: ""
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
  const [indexEventByMoney, setIndexEventByMoney] = useState({
    paymentTypeByMoney: "",
    isPaymentTypeByCoin: false,
    itemsForEventByMoney: [{ productName: "", productId: "" }]
  });
  const [indexShop, setIndexShop] = useState(initialIndexShop);
  useEffect(() => {
    dispatchSetUrlImageThumbnail(null);
  }, []);
  const isTimeInPromo = null;
  const { platformId, status, server, linkUrl } = indexPromoAndEvent;
  const { listGame, listItems, listServer } = listPartner;
  const { data } = useQuery(getListPartnerProducts(platformId), {
    onCompleted: data => {
      setListPartner({ ...listPartner, listItems: data.listPartnerProducts });
    }
  });
  useQuery(queryGetPlatform, {
    onCompleted: data => {
      setListPartner({ ...listPartner, listGame: data.listPartners });
    }
  });
  const { data2 } = useQuery(getListServer(platformId), {
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
  const [getItemsForEventTypeMoney] = useLazyQuery(getListItemsForEvent, {
    onCompleted: data => {
      setIndexEventByMoney({
        ...indexEventByMoney,
        itemsForEventByMoney: data.listProducts
      });
    }
  });
  const handleChangePlatform = e => {
    setIndexPromoAndEvent({
      ...indexPromoAndEvent,
      platformId: e,
      server: ""
    });
  };
  const handleChangePlatformPromo = e => {
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
    setIndexGameForPromo({
      ...indexGameForPromo,
      platformId: e,
      server: ""
    });
  };
  const resetGameAndServer = () => {
    setListPartner({
      ...listPartner,
      listServer: [
        {
          server: 0,
          serverName: "All server"
        }
      ]
    });
    setIndexPromoAndEvent({
      ...indexPromoAndEvent,
      platformPromoId: "",
      server: ""
    });
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
  const handleChangeServerPromo = e => {
    setIndexGameForPromo({ ...indexGameForPromo, server: e });
  };
  const handleStartTimeTotal = value => {
    const newTimetotal = indexPromoAndEvent.timeTotal;
    newTimetotal[0] = moment(value).format("YYYY-MM-DD HH:mm") + ":00";
    const numbEndTime = Number(moment(newTimetotal[1]).format("x"));
    if (value.valueOf() - numbEndTime > 0) {
      newTimetotal[1] = moment(value)
        .add(10, "days")
        .format("YYYY-MM-DD hh:mm");
    }
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
  const handleChangeTypePromo = val => {
    setIndexPromoAndEvent({ ...indexPromoAndEvent, type: val });
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
  const handleChangelistPartner = val => {
    setIndexPromoAndEvent({ ...indexPromoAndEvent, listPartner: val });
  };
  const successAlert = val => {
    Modal.confirm({
      title: "Tạo khuyến mãi thành công",
      okText: "Xem danh sách",
      cancelText: "Tiếp tục",
      onOk() {
        dispatchSwitchCreatePromo(true);
      },
      onCancel() {
        setSwitchTypeEvent(!switchTypeEvent);
      }
    });
  };
  const getLinkUrl = e => {
    setIndexPromoAndEvent({ ...indexPromoAndEvent, linkUrl: e.target.value })
  }
  return (
    <Router>
      <Row className="container-promotion">
        <div>
          <div>
            <Link
              to="/payment/promotion"
              onClick={() => dispatchSwitchCreatePromo(true)}
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
              listPartner={listPartner}
              indexPromoAndEvent={indexPromoAndEvent}
              setListPartner={setListPartner}
              status={status}
              setInfoPromo={setInfoPromo}
              resetGameAndServer={resetGameAndServer}
              switchTypeEvent={switchTypeEvent}
              setSwitchTypeEvent={setSwitchTypeEvent}
            />
            {/*router chọn game,server */}
            {switchTypeEvent ? (
              <MenuRewardByItem
                indexGameForPromo={indexGameForPromo}
                listPartner={listPartner}
                handleChangeTypePromo={handleChangeTypePromo}
                indexPromoAndEvent={indexPromoAndEvent}
                handleChangePlatformPromo={handleChangePlatformPromo}
                handleChangelistPartner={handleChangelistPartner}
                handleChangeServerPromo={handleChangeServerPromo}
              />
            ) : (
                <MenuRewardEventByMoney
                  switchTypeEvent={switchTypeEvent}
                  indexPromoAndEvent={indexPromoAndEvent}
                  indexEventByMoney={indexEventByMoney}
                  setIndexEventByMoney={setIndexEventByMoney}
                  getItemsForEventTypeMoney={getItemsForEventTypeMoney}
                  server={server}
                  listPartner={listPartner}
                  handleChangePlatform={handleChangePlatform}
                  handleChangeServer={handleChangeServer}
                />
              )}
          </div>
        </Col>
        <InputTimeArea
          indexPromoAndEvent={indexPromoAndEvent}
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
              successAlert={successAlert}
              listItems={listItems}
              indexPromoAndEvent={indexPromoAndEvent}
              indexGameForPromo={indexGameForPromo}
              indexShop={indexShop}
              setIndexShop={setIndexShop}
            />
          ) : (
              <InputRewardByMoney
                listItems={listItems}
                successAlert={successAlert}
                indexShop={indexShop}
                setIndexShop={setIndexShop}
                indexPromoAndEvent={indexPromoAndEvent}
                listPartner={listPartner}
                setIndexPromoAndEvent={setIndexPromoAndEvent}
                indexEventByMoney={indexEventByMoney}
                setIndexEventByMoney={setIndexEventByMoney}
                getItemsForEventTypeMoney={getItemsForEventTypeMoney}
              />
            )}
        </Col>
        <Col md={6} style={{ margin: ".5rem 0" }}>
          <h3>Link post</h3>
          <Input placeholder="Get link post..." style={{ width: "100%" }} value={linkUrl} onChange={getLinkUrl} />
          <div>
            <p className='select-image-promotion'>Select thumbnail promotion</p>
            <div style={{ width: "100%" }}>
              {props.urlImgThumbnail === null ? <i>Thumbnail image is emtry</i> : <img src={props.urlImgThumbnail} style={{ maxHeight: "100%", maxWidth: "100%" }} />}
            </div>
            <a onClick={() => dispatchShowImagesNews(true)}>Select</a>
          </div>
          <ListImagesForNews isThumbnail={true} />
        </Col>
      </Row>
    </Router>
  );
}
function mapStateToProps(state) {
  return {
    visible: state.visibleModalNews,
    urlImgThumbnail: state.urlImgThumbnail
  };
}
export default connect(mapStateToProps, null)(CreatePromotion);