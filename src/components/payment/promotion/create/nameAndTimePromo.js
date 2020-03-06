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
import { printAlertDailyPromo, daily0 } from "../promoService";
const { Option } = Select;
const { RangePicker } = DatePicker;
function InputNameAndTypeArea(props) {
  const { statusPromo, switchTypeEvent } = props;
  return (
    <div>
      <h3 className="promotion-title-field">Tên chương trình khuyến mãi</h3>
      <Input
        placeholder="Vd: Chương trìn khuyến mãi mở server"
        onChange={props.setInfoPromo}
        name="namePromo"
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
        onChange={e => props.setSwitchTypeEvent(e.target.value)}
        className='promotion-choose-typeEvent'
      >
        <Radio.Button value={false} >Khuyến mãi theo hóa đơn</Radio.Button>
        <Radio.Button value={true} >Khuyến mãi theo Item</Radio.Button>
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
    hourPromo,
    server,
    startTime,
    endTime,
    timeTotalPromo
  } = props.indexPromo;
  const { dailyAlert, datesAlert, timeTotalAlert } = props.alertInfoPromo;
  const alertDailyPromo = printAlertDailyPromo(dailyPromo);
  const printAlertDatesPromo = datesPromo.map((val, i) => (
    <>ngày mùng {val}, </>
  ));
  // const printAlertTimeTotalPromo = timeTotalAlert.map((val, i) => <>{val}</>);
  const childrenDates = [];
  for (let i = 1; i <= 31; i++) {
    childrenDates.push(<Option key={i}>{i < 10 ? "0" + i : i}</Option>);
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
        <div className='section2-promotion-pickTime'>
          <h3>Thời gian: </h3>
          <RangePicker
            showTime={{ format: "HH:mm" }}
            style={{ width: "80%" }}
            format=" DD-MM-YYYY HH:mm"
            placeholder={["-Thời gian bắt đầu", "- Thời gian kết thúc"]}
            onChange={props.onChangeDatePicker}
          />
        </div>
        <div className='section2-promotion-pickTime'>
          <h3>Theo ngày: </h3>
          <Select
            mode="multiple"
            style={{ width: "80%" }}
            placeholder="- Chọn ngày trong tháng diễn ra khuyến mãi"
            onChange={props.handleChangeDates}
            disabled={dailyPromo.length !== 0 ? true : false}
          >
            {childrenDates}
          </Select>
        </div>
        <div className='section2-promotion-pickTime'>
          <h3>Theo thứ:</h3>
          <Select
            mode="multiple"
            style={{ width: "80%" }}
            placeholder="- Chọn thứ trong tuần diễn ra khuyến mãi"
            onChange={props.handleChangeDaily}
            disabled={datesPromo.length !== 0 ? true : false}
          >
            {childrenDaily}
          </Select>
        </div>
        <div className='section2-promotion-pickTime'>
          <h3>Theo giờ:</h3>
          <div style={{width:'80%'}}>
            <TimePicker
              minuteStep={10}
              format={"HH:mm"}
              placeholder="- Giờ bắt đầu"
              onChange={(time, timeString) =>
                props.setTimePromo(timeString, "startTime")
              }
              style={{width:'50%'}}
            />
            <TimePicker
              minuteStep={10}
              style={{width:'50%'}}
              format={"HH:mm"}
              placeholder="- Giờ kết thúc"
              onChange={(time, timeString) =>
                props.setTimePromo(timeString, "endTime")
              }
            />
          </div>
        </div>
      </div>
      <div className='section2-promotion-footer'>
        Khuyến mãi diễn ra vào {startTime} {endTime} {alertDailyPromo}{" "}
        {printAlertDatesPromo} từ {timeTotalPromo[0]} đến {timeTotalPromo[1]}
      </div>
    </Col>
  );
}
export { InputTimeArea, InputNameAndTypeArea };
