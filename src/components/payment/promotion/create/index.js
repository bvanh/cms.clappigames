import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Pagination,
  Input,
  Row,
  Col,
  Radio,
  DatePicker,
  Select,
  TimePicker
} from "antd";
import { useLazyQuery, useMutation, useQuery } from "@apollo/react-hooks";
import "../../../../static/style/promotion.css";
import EventByItems from "./byItem";
import InputRewardByMoney from './byMoney/inputReward'
import MenuRewardEventByMoney from './byMoney/menuReward'
import { getPromotionType, getEventPaymentType } from "../../../../utils/queryPaymentAndPromoType";
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
    isTypePromo: "ITEMS",
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
    },
    byEvent: {
      name: "",
    }
  });
  const [alertIinfoPromo, setAlertInfoPromo] = useState({
    dailyAlert: ["moday,d"],
    datesAlert: [],
    timeTotalAlert: []
  });
  const {
    platformPromoId,
    statusPromo,
    datesPromo,
    dailyPromo,
    hourPromo,
    server,
    startTime,
    endTime,
    timeTotalPromo
  } = indexPromo;
  const { dailyAlert, datesAlert, timeTotalAlert } = alertIinfoPromo;
  const { isTypePromo, promoType, listGame, listItems, listServer } = typePromo;
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
  const switchPromoAndEvent = e => {
    setTypePromo({ ...typePromo, isTypePromo: e.target.value });
    if (e.target.value === "ITEMS") {
      getPromoType();
    } else if (e.target.value === "EVENT") {
      console.log("demo");
    }
  };
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
  const handleChaneIndexPromo = (val, track) => {
    switch (track) {
      case "setPromoType":
        setIndexPromo({ ...indexPromo, promoType: val });
        break;
      default:
        break;
    }
  };
  const printAlertDailyPromo = dailyPromo.map(function (val, index) {
    switch (val) {
      case 0:
        return <span>Monday</span>;
      case 1:
        return <span>Tuesday</span>;
      case 2:
        return <span>Wednesday</span>;
      case 3:
        return <span>Thursday</span>;
      case 4:
        return <span>Friday</span>;
      case 5:
        return <span>Saturday</span>;
      case 6:
        return <span>Sunday</span>;
      default:
        break;
    }
  });
  const printAlertDatesPromo = datesPromo.map((val, i) => <>{val}</>);
  const printAlertTimeTotalPromo = timeTotalAlert.map((val, i) => <>{val}</>);
  const childrenDates = [];
  for (let i = 1; i <= 31; i++) {
    childrenDates.push(<Option key={i}>{i < 10 ? "0" + i : i}</Option>);
  }
  const childrenDaily = daily.map((val, index) => (
    <Option key={index} value={index}>
      {val}
    </Option>
  ));
  const printPromoType = typePromo.type.map((val, index) => (
    <Option value={val.name} key={index}>
      {val.description}
    </Option>
  ));
  const printPlatform = listGame.map((val, i) => (
    <Option value={val.partnerId} key={i}>
      {val.partnerName}
    </Option>
  ));
  const printListServer = listServer.map((val, index) => (
    <Option value={val.server} key={index}>
      {val.serverName}
    </Option>
  ));
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
            <div>
              <p className="promotion-title-field">
                Tên chương trình khuyến mãi
              </p>
              <Input
                placeholder="Vd: Chương trìn khuyến mãi mở server"
                onChange={setInfoPromo}
                name="namePromo"
              ></Input>
              <p
                className="promotion-title-field"
                style={{ paddingRight: ".5rem" }}
              >
                Trạng thái
              </p>
              <Radio.Group
                onChange={setInfoPromo}
                value={statusPromo}
                name="statusPromo"
              >
                <Radio value="COMPLETE">Kích hoạt</Radio>
                <Radio value="INPUT">Chưa áp dụng</Radio>
              </Radio.Group>
              <p className="promotion-title-field">Hình thức khuyến mãi</p>

              <Link to='/payment/promotion/create/byMoney'>
                <Button value="EVENT" style={{ marginRight: "1%" }}>
                  Khuyến mãi theo hóa đơn
                </Button>
              </Link>
              <Button value="ITEMS" style={{ marginLeft: "1%" }}>
                <Link to='/payment/promotion/create/byItem'> Khuyến mãi theo Item</Link>
              </Button>
            </div>
            <div>
              {/*router chọn game,server */}
              <Route
                exact
                path="/payment/promotion/create/byItem"
                render={() => (
                  <div>
                    <p className="promotion-title-field">Chọn game</p>
                    <Select
                      style={{ width: 120 }}
                      onChange={handleChangePlatform}
                      placeholder="-Chọn game-"
                    >
                      {printPlatform}
                    </Select>{" "}
                    <span>Hình thức</span>
                    <Select
                      style={{ width: 120 }}
                      onChange={val => handleChaneIndexPromo(val, "setPromoType")}
                    >
                      {printPromoType}
                    </Select>{" "}
                    <span>Server</span>
                    <Select
                      placeholder="-Chọn server-"
                      style={{ width: 120 }}
                      onChange={handleChangeServer}
                      name="server"
                      value={server}
                    >
                      {printListServer}
                    </Select>{" "}
                  </div>
                )}
              />
              <Route
                exact
                path="/payment/promotion/create/byMoney"
                render={() => (
                  <MenuRewardEventByMoney />
                )}
              />
            </div>
          </div>
        </Col>
        <Col md={12} className="section2-promotion">
          <div>
            <p className="promotion-title-field">Thời gian áp dụng </p>
            <div>
              Thời gian:{" "}
              <RangePicker
                showTime={{ format: "HH:mm" }}
                format="HH:mm DD-MM-YYYY"
                placeholder={["-Thời gian bắt đầu", "- Thời gian kết thúc"]}
                onChange={onChangeDatePicker}
              />
            </div>
            <div>
              Theo ngày:{" "}
              <Select
                mode="multiple"
                style={{ width: "100%" }}
                placeholder="- Chọn ngày trong tháng diễn ra khuyến mãi"
                onChange={handleChangeDates}
                disabled={dailyPromo.length !== 0 ? true : false}
              >
                {childrenDates}
              </Select>
            </div>
            <div>
              Theo thứ:{" "}
              <Select
                mode="multiple"
                style={{ width: "100%" }}
                placeholder="- Chọn thứ trong tuần diễn ra khuyến mãi"
                onChange={handleChangeDaily}
                disabled={datesPromo.length !== 0 ? true : false}
              >
                {childrenDaily}
              </Select>
            </div>
            <div>
              Theo giờ:
              <TimePicker
                format={"HH:mm"}
                placeholder="- Giờ bắt đầu"
                onChange={(time, timeString) =>
                  setTimePromo(timeString, "startTime")
                }
              />
              <TimePicker
                format={"HH:mm"}
                placeholder="- Giờ kết thúc"
                onChange={(time, timeString) =>
                  setTimePromo(timeString, "endTime")
                }
              />
            </div>
          </div>
          <div>
            Khuyến mãi diễn ra vào {startTime} {endTime} {printAlertDailyPromo}{" "}
            {printAlertDatesPromo} từ {timeTotalPromo[0]} đến{" "}
            {timeTotalPromo[1]}
          </div>
        </Col>
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
              <InputRewardByMoney listItems={listItems} indexPromo={indexPromo} />
            )}
          />
        </Col>
      </Row>
    </Router>
  );
}
export default CreatePromotion;
