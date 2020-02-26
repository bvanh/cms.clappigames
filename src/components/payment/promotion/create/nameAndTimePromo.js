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
import EventByItems from "./byItem/inputRewardItem";
import InputRewardByMoney from "./byMoney/inputReward";
import MenuRewardEventByMoney from "./byMoney/menuReward";
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
function InputNameAndTypeArea(props) {
  const { statusPromo } = props;
  return (
    <div>
      <p className="promotion-title-field">Tên chương trình khuyến mãi</p>
      <Input
        placeholder="Vd: Chương trìn khuyến mãi mở server"
        onChange={props.setInfoPromo}
        name="namePromo"
      ></Input>
      <p className="promotion-title-field" style={{ paddingRight: ".5rem" }}>
        Trạng thái
      </p>
      <Radio.Group
        onChange={props.setInfoPromo}
        value={statusPromo}
        name="statusPromo"
      >
        <Radio value="COMPLETE">Kích hoạt</Radio>
        <Radio value="INPUT">Chưa áp dụng</Radio>
      </Radio.Group>
      <p className="promotion-title-field">Hình thức khuyến mãi</p>

      <Link to="/payment/promotion/create/byMoney">
        <Button value="EVENT" style={{ marginRight: "1%" }}>
          Khuyến mãi theo hóa đơn
        </Button>
      </Link>
      <Button value="ITEMS" style={{ marginLeft: "1%" }}>
        <Link to="/payment/promotion/create/byItem"> Khuyến mãi theo Item</Link>
      </Button>
    </div>
  );
}
// /////
function InputTimeArea(props) {
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
  } = props.indexPromo;
  const { dailyAlert, datesAlert, timeTotalAlert } = props.alertInfoPromo;
  const printAlertDailyPromo = dailyPromo.map(function(val, index) {
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
  return (
      <Col md={12} className="section2-promotion">
        <div>
          <p className="promotion-title-field">Thời gian áp dụng </p>
          <div>
            Thời gian:{" "}
            <RangePicker
              showTime={{ format: "HH:mm" }}
              format="HH:mm DD-MM-YYYY"
              placeholder={["-Thời gian bắt đầu", "- Thời gian kết thúc"]}
              onChange={props.onChangeDatePicker}
            />
          </div>
          <div>
            Theo ngày:{" "}
            <Select
              mode="multiple"
              style={{ width: "100%" }}
              placeholder="- Chọn ngày trong tháng diễn ra khuyến mãi"
              onChange={props.handleChangeDates}
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
              onChange={props.handleChangeDaily}
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
                props.setTimePromo(timeString, "startTime")
              }
            />
            <TimePicker
              format={"HH:mm"}
              placeholder="- Giờ kết thúc"
              onChange={(time, timeString) =>
                props.setTimePromo(timeString, "endTime")
              }
            />
          </div>
        </div>
        <div>
          Khuyến mãi diễn ra vào {startTime} {endTime} {printAlertDailyPromo}{" "}
          {printAlertDatesPromo} từ {timeTotalPromo[0]} đến {timeTotalPromo[1]}
        </div>
      </Col>
  );
}
export { InputTimeArea, InputNameAndTypeArea };
