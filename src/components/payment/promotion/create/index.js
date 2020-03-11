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
  const [indexPromo, setIndexPromo] = useState({
    eventPaymentType: [],
    namePromo: '',
    platformPromoId: "",
    server: "",
    statusPromo: "COMPLETE",
    promoType: "",
    timeTotalPromo: [
      moment().format("YYYY-MM-DD HH:mm"),
      moment().format("YYYY-MM-DD HH:mm")
    ],
    datesPromo: [],
    dailyPromo: [],
    startTime: "00:00:00",
    endTime: "00:00:00"
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
  const [indexEventByMoney, setIndexEventByMoney] = useState({
    paymentTypeByMoney: "",
    isPaymentTypeByCoin: false,
    itemsForEventByMoney: [{ productName: "", productId: "" }]
  });
  const [indexShop, setIndexShop] = useState(initialIndexShop);
  const { platformPromoId, statusPromo, server } = indexPromo;
  const { listGame, listItems, listServer } = typePromo;
  const { data } = useQuery(getListPartnerProducts(platformPromoId), {
    onCompleted: data => {
      setTypePromo({ ...typePromo, listItems: data.listPartnerProducts });
    }
  });
  useQuery(queryGetPlatform, {
    onCompleted: data => {
      setTypePromo({ ...typePromo, listGame: data.listPartners });
    }
  })
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
  const handleChangePlatform = e => {
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
    setIndexPromo({
      ...indexPromo,
      platformPromoId: e,
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
    setIndexPromo({...indexPromo,platformPromoId:"",server:""})
  }
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
    console.log(timeString);
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
    setIndexPromo({ ...indexPromo, promoType: val });
  };
  const successAlert = () => {
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
              indexPromo={indexPromo}
              setTypePromo={setTypePromo}
              statusPromo={statusPromo}
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
                handleChangePlatform={handleChangePlatform}
                handleChangeTypePromo={handleChangeTypePromo}
                handleChangeServer={handleChangeServer}
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
          indexPromo={indexPromo}
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
              indexPromo={indexPromo}
              indexShop={indexShop}
              setIndexShop={setIndexShop}
            />
          ) : (
              <InputRewardByMoney
                listItems={listItems}
                successAlert={successAlert}
                indexShop={indexShop}
                setIndexShop={setIndexShop}
                indexPromo={indexPromo}
                typePromo={typePromo}
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
