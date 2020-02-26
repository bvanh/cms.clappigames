import React, { useState, useEffect } from "react";
import { Row, Col, DatePicker, Select } from "antd";
import { useLazyQuery, useMutation, useQuery } from "@apollo/react-hooks";
import "../../../../static/style/promotion.css";
import EventByItems from "./byItem/inputRewardItem";
import InputRewardByMoney from "./byMoney/inputReward";
import MenuRewardEventByMoney from "./byMoney/menuReward";
import { InputNameAndTypeArea, InputTimeArea } from "./nameAndTimePromo";
import MenuRewardByItem from "./byItem/menuRewardItem";
import {
  getPromotionType,
  getEventPaymentType
} from "../../../../utils/queryPaymentAndPromoType";
import { queryGetPlatform } from "../../../../utils/queryPlatform";
import { getListPartnerProducts } from "../../../../utils/queryPartnerProducts";
import { getListServer } from "../../../../utils/query/promotion";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
const { Option } = Select;
const { RangePicker } = DatePicker;
const daily = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday"
];
function CreatePromotion() {
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
        productName: ""
      }
    ],
    byItems: {
      listGame: "",
      typePromo: "",
      serverPromo: ""
    }
  });
  const [alertInfoPromo, setAlertInfoPromo] = useState({
    dailyAlert: ["moday,d"],
    datesAlert: [],
    timeTotalAlert: []
  });
  const {
    platformPromoId,
    statusPromo,
    server,
  } = indexPromo;
  const { type, listGame, listItems, listServer } = typePromo;
  const [getPromoType] = useLazyQuery(getPromotionType, {
    onCompleted: data => {
      setTypePromo({ ...typePromo, type: data.__type.enumValues });
    }
  });
  // useQuery(getEventPaymentType, {
  //   onCompleted: data => setTypePromo({})
  // })
  const [getPlatform] = useLazyQuery(queryGetPlatform, {
    onCompleted: data => {
      setTypePromo({ ...typePromo, listGame: data.listPartners });
    }
  });
  const { data } = useQuery(getListPartnerProducts(platformPromoId), {
    onCompleted: data =>
      setTypePromo({ ...typePromo, listItems: data.listPartnerProducts })
  });
  const { data2 } = useQuery(getListServer(platformPromoId), {
    onCompleted: data => {
      setTypePromo({
        ...typePromo,
        listServer: [...listServer, ...data.listPartnerServers]
      });
    }
  });
  useEffect(() => {
    getPromoType();
    getPlatform();
  }, []);
  const handleChangePlatform = e => {
    setIndexPromo({ ...indexPromo, platformPromoId: e });
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
              statusPromo={statusPromo}
              setInfoPromo={setInfoPromo}
            />
            <div>
              {/*router chọn game,server */}
              <Route
                exact
                path="/payment/promotion/create/byItem"
                render={() => (
                  <MenuRewardByItem
                    server={server}
                    typePromo={typePromo}
                    handleChangePlatform={handleChangePlatform}
                    handleChangeIndexPromo={handleChangeIndexPromo}
                    handleChangeServer={handleChangeServer}
                  />
                )}
              />
              <Route
                exact
                path="/payment/promotion/create/byMoney"
                render={() => <MenuRewardEventByMoney />}
              />
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
          <Route
            exact
            path="/payment/promotion/create/byItem"
            render={() => (
              <EventByItems listItems={listItems} indexPromo={indexPromo} />
            )}
          />
          <Route
            exact
            path="/payment/promotion/create/byMoney"
            render={() => (
              <InputRewardByMoney
                listItems={listItems}
                indexPromo={indexPromo}
              />
            )}
          />
        </Col>
      </Row>
    </Router>
  );
}
export default CreatePromotion;
