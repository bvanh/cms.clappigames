import React, { useState, useEffect, useMemo } from "react";
import { Row, Col, Modal, Icon } from "antd";
import { useLazyQuery, useMutation, useQuery } from "@apollo/react-hooks";
import "../../../../static/style/promotion.css";
import EventByItems from "./promotion/inputRewardItem";
import InputRewardByMoney from "./event/inputReward";
import MenuRewardEventByMoney from "./event/menuReward";
import { InputNameAndTypeArea, InputTimeArea } from "./nameAndTimePromo";
import { dispatchSwitchCreatePromo } from "../../../../redux/actions/index";
import MenuRewardByItem from "./promotion/menuRewardItem";
import { queryGetPlatform } from "../../../../utils/queryPlatform";
import { getListPartnerProducts } from "../../../../utils/queryPartnerProducts";
import moment from "moment";
import {
  initialIndexEventByMoney,
  initialIndexPromo,
  initialTypePromo
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
function CreatePromotion() {
  const [switchTypeEvent, setSwitchTypeEvent] = useState(true);
  const [indexPromoAndEvent, setIndexPromoAndEvent] = useState({
    name: '',
    platformId: "",
    server: "",
    status: "COMPLETE",
    type: "",
    timeTotal: [
      moment().format("YYYY-MM-DD HH:mm"),
      moment().format("YYYY-MM-DD HH:mm")
    ],
    dates: [],
    daily: [],
    startTime: "00:00:00",
    endTime: "00:00:00"
  });
  const [indexGameForPromo, setIndexGameForPromo] = useState({
    platformId: '',
    server: ''
  })
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
  const [indexEventByMoney, setIndexEventByMoney] = useState({
    paymentTypeByMoney: "",
    isPaymentTypeByCoin: false,
    itemsForEventByMoney: [{ productName: "", productId: "" }]
  });
  const [indexShop, setIndexShop] = useState(initialIndexShop);
  const { platformId, status, server } = indexPromoAndEvent;
  const { listGame, listItems, listServer } = typePromo;
  const { data } = useQuery(getListPartnerProducts(platformId), {
    onCompleted: data => {
      setTypePromo({ ...typePromo, listItems: data.listPartnerProducts });
    }
  });
  useQuery(queryGetPlatform, {
    onCompleted: data => {
      setTypePromo({ ...typePromo, listGame: data.listPartners });
    }
  })
  const { data2 } = useQuery(getListServer(platformId), {
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
    setTypePromo({
      ...typePromo,
      listServer: [
        {
          server: 0,
          serverName: "All server"
        }
      ],
    })
    setIndexPromoAndEvent({ ...indexPromoAndEvent, platformPromoId: "", server: "" })
  }
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
    setIndexPromoAndEvent({ ...indexPromoAndEvent, timeTotalPromo: dateString });
  };
  const setTimePromo = (timeString, val) => {
    if (val === "startTime") {
      setIndexPromoAndEvent({ ...indexPromoAndEvent, startTime: timeString !== "" ? timeString + ":00" : '' });
    } else {
      setIndexPromoAndEvent({ ...indexPromoAndEvent, endTime: timeString !== "" ? timeString + ":59" : '' });
    }
  };
  const handleChangeDaily = value => {
    setIndexPromoAndEvent({ ...indexPromoAndEvent, dailyPromo: value.sort((a, b) => a - b) });
  };
  const handleChangeDates = value => {
    setIndexPromoAndEvent({ ...indexPromoAndEvent, datesPromo: value.sort((a, b) => a - b) });
  };
  const handleChangeTypePromo = val => {
    setIndexPromoAndEvent({ ...indexPromoAndEvent, typePromo: val });
  };
  const successAlert = (val) => {
    Modal.confirm({
      title: "Tạo khuyến mãi thành công",
      okText: "Xem danh sách",
      cancelText: "Tiếp tục",
      onOk() {
        dispatchSwitchCreatePromo(true);
      },
      onCancel() {
        setSwitchTypeEvent(!switchTypeEvent)
      }
    });
  };
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
              typePromo={typePromo}
              indexPromoAndEvent={indexPromoAndEvent}
              setTypePromo={setTypePromo}
              status={status}
              setInfoPromo={setInfoPromo}
              resetGameAndServer={resetGameAndServer}
              switchTypeEvent={switchTypeEvent}
              setSwitchTypeEvent={setSwitchTypeEvent}
            />
            {/*router chọn game,server */}
            {switchTypeEvent ? (
              <MenuRewardByItem
                server={server}
                typePromo={typePromo}
                handleChangePlatformPromo={handleChangePlatformPromo}
                handleChangeTypePromo={handleChangeTypePromo}
                handleChangeServerPromo={handleChangeServerPromo}
              />
            ) : (
                <MenuRewardEventByMoney
                  switchTypeEvent={switchTypeEvent}
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
          indexPromoAndEvent={indexPromoAndEvent}
          onChangeDatePicker={onChangeDatePicker}
          handleChangeDaily={handleChangeDaily}
          handleChangeDates={handleChangeDates}
          setTimePromo={setTimePromo}
        />
        <Col md={24}>
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
                typePromo={typePromo}
                setIndexPromoAndEvent={setIndexPromoAndEvent}
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
