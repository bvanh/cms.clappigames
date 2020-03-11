import React, { useState, useEffect } from "react";
import { Input, Row, Col, Radio, DatePicker, Select, TimePicker } from "antd";
import moment from "moment";
import { useLazyQuery, useMutation, useQuery } from "@apollo/react-hooks";
import "../../../../static/style/promotion.css";
import EventByItems from "./promotion/inputRewardItem";
import InputRewardByMoney from "./event/inputReward";
import MenuRewardEventByMoney from "./event/menuReward";
import {
  getPromotionType,
  getEventPaymentType
} from "../../../../utils/queryPaymentAndPromoType";
import { queryGetPlatform } from "../../../../utils/queryPlatform";
import { getListPartnerProducts } from "../../../../utils/queryPartnerProducts";
import { getListServer } from "../../../../utils/query/promotion";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { printAlertDailyPromo, daily0 } from "../promoService";
const { Option } = Select;
const { RangePicker } = DatePicker;
function InputNameAndTypeArea(props) {
  const { switchTypeEvent } = props;
  const {
    namePromo,
    statusPromo,
  } = props.indexPromo;
  return (
    <div>
      <h3 className="promotion-title-field">Tên chương trình khuyến mãi</h3>
      <Input
        placeholder="Vd: Chương trìn khuyến mãi mở server"
        onChange={props.setInfoPromo}
        name="namePromo"
        value={namePromo}
      ></Input>
      <div className="promotion-title-status">
        <h3>Trạng thái</h3>
        <Radio.Group
          onChange={props.setInfoPromo}
          value={statusPromo}
          name="statusPromo"
        >
          <Radio value="COMPLETE">Kích hoạt</Radio>
          <Radio value="INPUT">Chưa áp dụng</Radio>
        </Radio.Group>
      </div>
      <h3>Hình thức khuyến mãi</h3>
      <Radio.Group
        value={switchTypeEvent}
        buttonStyle="solid"
        onChange={e => {
          props.setSwitchTypeEvent(e.target.value);
          props.resetGameAndServer();
        }}
        className="promotion-choose-typeEvent"
      >
        <Radio.Button value={false}>Khuyến mãi theo hóa đơn</Radio.Button>
        <Radio.Button value={true}>Khuyến mãi theo Item</Radio.Button>
      </Radio.Group>
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
    server,
    startTime,
    endTime,
    timeTotalPromo
  } = props.indexPromo;
  const alertDailyPromo = printAlertDailyPromo(dailyPromo);
  const printAlertDatesPromo = datesPromo.map((val, i) => (
    <>ngày mùng {val}, </>
  ));
  // const printAlertTimeTotalPromo = timeTotalAlert.map((val, i) => <>{val}</>);
  const childrenDates = [];
  for (let i = 1; i <= 31; i++) {
    childrenDates.push(<Option key={i} value={i}>{i < 10 ? "0" + i : i}</Option>);
  }
  const childrenDaily = daily0.map((val, index) => (
    <Option key={index} value={index}>
      {val}
    </Option>
  ));
  return (
    <Col md={12} className="section2-promotion">
      <div>
        <h3 className="promotion-title-field">Thời gian áp dụng </h3>
        <div className="section2-promotion-pickTime">
          <h3>Thời gian: </h3>
          <RangePicker
            showTime={{ format: "HH:mm" }}
            style={{ width: "80%" }}
            format="YYYY-MM-DD HH:mm"
            placeholder={["-Thời gian bắt đầu", "- Thời gian kết thúc"]}
            onChange={props.onChangeDatePicker}
            value={[
              moment(timeTotalPromo[0], "YYYY-MM-DD HH:mm"),
              moment(timeTotalPromo[1], "YYYY-MM-DD HH:mm")
            ]}
          />
        </div>
        <div className="section2-promotion-pickTime">
          <h3>Theo ngày: </h3>
          <Select
            mode="multiple"
            style={{ width: "80%" }}
            placeholder="- Chọn ngày trong tháng diễn ra khuyến mãi"
            onChange={props.handleChangeDates}
            disabled={dailyPromo.length !== 0 ? true : false}
            value={datesPromo}
          >
            {childrenDates}
          </Select>
        </div>
        <div className="section2-promotion-pickTime">
          <h3>Theo thứ:</h3>
          <Select
            mode="multiple"
            style={{ width: "80%" }}
            placeholder="- Chọn thứ trong tuần diễn ra khuyến mãi"
            onChange={props.handleChangeDaily}
            disabled={datesPromo.length !== 0 ? true : false}
            value={dailyPromo}
          >
            {childrenDaily}
          </Select>
        </div>
        <div className="section2-promotion-pickTime">
          <h3>Theo giờ:</h3>
          <div style={{ width: "80%" }}>
            <TimePicker
              minuteStep={10}
              format={"HH:mm:ss"}
              placeholder="- Giờ bắt đầu"
              onChange={(time, timeString) =>
                props.setTimePromo(timeString, "startTime")
              }
              value={moment(startTime, "HH:mm:ss")}
              style={{ width: "50%" }}
            />
            <TimePicker
              minuteStep={10}
              value={moment(endTime, "HH:mm:ss")}
              style={{ width: "50%" }}
              format={"HH:mm:ss"}
              placeholder="- Giờ kết thúc"
              onChange={(time, timeString) => {
                props.setTimePromo(timeString, "endTime");
              }}
            />
          </div>
        </div>
      </div>
      <div className="section2-promotion-footer">
        Khuyến mãi diễn ra vào {startTime} đến {endTime} {alertDailyPromo}
        {printAlertDatesPromo} từ {timeTotalPromo[0]} đến {timeTotalPromo[1]}
      </div>
    </Col>
  );
}
export { InputTimeArea, InputNameAndTypeArea };
