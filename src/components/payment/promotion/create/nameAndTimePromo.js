import React, { useState, useEffect } from "react";
import {
  Input,
  Row,
  Col,
  Radio,
  DatePicker,
  Select,
  TimePicker,
  Button,
} from "antd";
import moment from "moment";
import { printAlertDailyPromo, daily0 } from "../promoService";
const { Option } = Select;
const { RangePicker } = DatePicker;
function InputNameAndTypeArea(props) {
  const { switchTypeEvent } = props;
  const { name, status, prefixPromo } = props.indexPromoAndEvent;
  return (
    <div className="add-name-info">
      <div>
        <div className="addPromoName">
          <h3 className="promotion-title-field">Promotion Name</h3>
          <Input
            placeholder="Ex: Promotion for open new server..."
            onChange={props.setInfoPromo}
            name="name"
            style={{ width: "100%" }}
            value={name}
          ></Input>
        </div>
        <div className="addPromoId">
          <h3>Promotion Id</h3>
          <Input
            placeholder="Promotion id..."
            style={{ width: "100%" }}
            value={prefixPromo}
            name="prefixPromo"
            onChange={props.setInfoPromo}
          />
        </div>
      </div>
      <div className="promotion-title-status">
        <h3>Status</h3>
        <Radio.Group onChange={props.setInfoPromo} value={status} name="status">
          <Radio value="COMPLETE">Active</Radio>
          <Radio value="INPUT">Plan</Radio>
        </Radio.Group>
      </div>
      <h3>Method</h3>
      <Radio.Group
        disabled={props.isTimeInPromo ? props.isTimeInPromo : false}
        value={switchTypeEvent}
        buttonStyle="solid"
        onChange={(e) => {
          props.setSwitchTypeEvent(e.target.value);
          props.resetGameAndServer();
        }}
        className="promotion-choose-typeEvent"
      >
        <Radio.Button value={false}>Promotion for purchase</Radio.Button>
        <Radio.Button value={true}>Promotion for Item</Radio.Button>
      </Radio.Group>
    </div>
  );
}
// /////
function InputTimeArea(props) {
  const [isOpenTimePicker, setIsOpenTime] = useState(false);
  const {
    dates,
    daily,
    server,
    startTime,
    endTime,
    timeTotal,
  } = props.indexPromoAndEvent;
  const alertDaily = printAlertDailyPromo(daily);
  const printAlertDates = dates.map((val, i) => <>{val}rd, </>);
  // const printAlertTimeTotalPromo = timeTotalAlert.map((val, i) => <>{val}</>);
  const childrenDates = [];
  for (let i = 1; i <= 31; i++) {
    childrenDates.push(
      <Option key={i} value={i}>
        {i < 10 ? "0" + i : i}
      </Option>
    );
  }
  const childrenDaily = daily0.map((val, index) => (
    <Option key={index} value={index}>
      {val}
    </Option>
  ));
  const disabledEndDate = (endValue) => {
    const startValue = moment(timeTotal[0]).format("x");
    return endValue.valueOf() <= Number(startValue);
  };
  const pickAllDay = () => {
    setIsOpenTime(false);
    props.pickAllDay();
  };
  const openPickTime = () => {
    setIsOpenTime(true);
  };
  const closePickTime = () => {
    setIsOpenTime(false);
  };
  return (
    <Col md={12} className="section2-promotion">
      <div>
        <h3 className="promotion-title-field">Set timeline </h3>
        <div className="section2-promotion-pickTime">
          <h3 style={{ width: "25%" }}>Time: </h3>
          <div style={{ width: "75%" }}>
            <DatePicker
              showTime={{ format: "HH:mm" }}
              format="YYYY-MM-DD HH:mm"
              defaultValue={moment(timeTotal[0], "YYYY-MM-DD HH:mm")}
              placeholder="Start"
              style={{ width: "49.5%", marginRight: ".5%", minWidth: "0" }}
              allowClear={false}
              onChange={props.handleStartTimeTotal}
              disabled={props.isTimeInPromo}
            />
            <DatePicker
              disabledDate={disabledEndDate}
              style={{ width: "49.5%", marginLeft: ".5%", minWidth: "0" }}
              showTime={{ format: "HH:mm" }}
              format="YYYY-MM-DD HH:mm"
              defaultValue={moment(timeTotal[1], "YYYY-MM-DD HH:mm")}
              placeholder="End"
              allowClear={false}
              onChange={props.handleEndTimeTotal}
            />
          </div>
        </div>
        <div className="section2-promotion-pickTime">
          <h3 style={{ width: "25%" }}>By day of the month: </h3>
          <Select
            mode="multiple"
            style={{ width: "75%" }}
            placeholder="- Choose what day of the month the promotion is..."
            onChange={props.handleChangeDates}
            disabled={daily.length !== 0 ? true : false}
            value={dates}
          >
            {childrenDates}
          </Select>
        </div>
        <div className="section2-promotion-pickTime">
          <h3 style={{ width: "25%" }}>By day of the week:</h3>
          <Select
            mode="multiple"
            style={{ width: "75%" }}
            placeholder="- Choose what day of the week the promotion is..."
            onChange={props.handleChangeDaily}
            disabled={dates.length !== 0 ? true : false}
            value={daily}
          >
            {childrenDaily}
          </Select>
        </div>
        <div className="section2-promotion-pickTime">
          <h3 style={{ width: "25%" }}>By hours of the day:</h3>
          <div style={{ width: "75%" }}>
            <TimePicker
              allowClear={false}
              open={isOpenTimePicker}
              minuteStep={10}
              format="HH:mm"
              placeholder="- Giờ bắt đầu"
              onOpenChange={openPickTime}
              onChange={(time, timeString) =>
                props.setTimePromo(timeString, "startTime")
              }
              value={startTime === "" ? null : moment(startTime, "HH:mm")}
              style={{ width: "49.5%", marginRight: ".5%" }}
              addon={() => (
                <Button size="small" type="primary" onClick={pickAllDay}>
                  24h
                </Button>
              )}
            />
            <TimePicker
              open={isOpenTimePicker}
              allowClear={false}
              minuteStep={10}
              value={endTime === "" ? null : moment(endTime, "HH:mm")}
              style={{ width: "49.5%", marginLeft: ".5%" }}
              format={"HH:mm"}
              placeholder="- Giờ kết thúc"
              onOpenChange={openPickTime}
              onChange={(time, timeString) => {
                props.setTimePromo(timeString, "endTime");
              }}
              addon={() => (
                <div className="pickTime-footer">
                  <Button size="small" type="primary" onClick={pickAllDay}>
                    24h
                  </Button>
                  <a onClick={closePickTime}>close</a>
                </div>
              )}
            />
          </div>
        </div>
      </div>
      <div className="section2-promotion-footer">
        Promotion's timeline will be on{" "}
        {endTime === "00:00:00" ? "" : `${startTime} to ${endTime}`}{" "}
        {alertDaily}
        {printAlertDates} from {timeTotal[0]} to {timeTotal[1]}
      </div>
    </Col>
  );
}
export { InputTimeArea, InputNameAndTypeArea };
