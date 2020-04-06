import React, { useState, useEffect, useMemo, Fragment } from "react";
import { Button, Row, Col, TimePicker, Select, Input, DatePicker } from "antd";
import { Link } from "react-router-dom";
import moment from "moment";
import { connect } from "react-redux";
import { printAlertDailyPromo, daily0 } from "../promoService";
import { getDetailPromotion } from "../../../../utils/query/promotion";
import { getListPartnerProducts } from "../../../../utils/queryPartnerProducts";
import {
  dispatchDeatilPromo,
  dispatchDetailPromo
} from "../../../../redux/actions/index";
import { useQuery, useLazyQuery } from "react-apollo";
const { Option } = Select;
const { RangePicker } = DatePicker;

function TimePromo(props) {
  const { name, status, eventTime, type, shop, game } = props.detailPromo;
  if (eventTime) {
    const { startTime, endTime, hour, dates, daily } = JSON.parse(eventTime);
    const printAlertDatesPromo = dates.map((val, i) => (
      <Fragment key={i}> {val}rd,</Fragment>
    ));
    const alertDailyPromo = printAlertDailyPromo(daily);
    console.log(eventTime);
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
    console.log(endTime);
    return (
      <Col md={12} className="section2-promotion">
        <div>
          <p className="promotion-title-field">Timeline </p>
          <div className="section2-promotion-pickTime">
            <h3>Date:</h3>
            <RangePicker
              showTime={{ format: "HH:mm" }}
              format="DD-MM-YYYY HH:mm"
              value={[
                moment(startTime, "DD-MM-YYYY HH:mm"),
                moment(endTime, "DD-MM-YYYY HH:mm")
              ]}
            />
          </div>
          <div className="section2-promotion-pickTime">
            <h3>By day of the month:</h3>
            <Select
              mode="multiple"
              style={{ width: "80%" }}
              placeholder="- Choose what day of the month the promotion is..."
              value={dates}
              dropdownClassName="dropdown-coin-event"
              disabled={daily.length !== 0 ? true : false}
            >
              {childrenDates}
            </Select>
          </div>
          <div className="section2-promotion-pickTime">
            <h3>By day of the week:</h3>
            <Select
              mode="multiple"
              style={{ width: "80%" }}
              placeholder="- Choose what day of the week the promotion is..."
              value={daily}
              dropdownClassName="dropdown-coin-event"
              disabled={dates.length !== 0 ? true : false}
            >
              {childrenDaily}
            </Select>
          </div>
          <div className="section2-promotion-pickTime">
            <h3>Time:</h3>
            <div style={{width:"80%"}}>
            <TimePicker
              format={"HH:mm"}
              style={{width:"50%"}}
              defaultValue={moment(hour[0], "HH:mm")}
              showClear={false}
              placeholder="- Giờ bắt đầu"
            />
            <TimePicker
              format={"HH:mm"}
              style={{width:"50%"}}
              defaultValue={moment(hour[1], "HH:mm")}
              placeholder="- Giờ kết thúc"
              showClear={false}
            />
            </div>
          </div>
        </div>
        <div style={{ background: "whitesmoke", color: "red" }}>
         Promotion's timeline will be on {hour[0]==='00:00:00'?"":`${hour[0]} 'to' ${hour[1]}`} {alertDailyPromo}
          {printAlertDatesPromo} from {startTime} to {endTime}
        </div>
      </Col>
    );
  } else {
    return <p>Loadding...</p>;
  }
}

function mapStateToProps(state) {
  return {
    detailPromo: state.detailPromo
  };
}
export default connect(mapStateToProps, null)(TimePromo);
