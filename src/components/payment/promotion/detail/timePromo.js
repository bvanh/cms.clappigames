import React, { useState, useEffect, useMemo } from "react";
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
    const printAlertDatesPromo = dates.map((val, i) => <>{val}</>);
    const alertDailyPromo = printAlertDailyPromo(daily);
    console.log(printAlertDailyPromo(daily))
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
    console.log(endTime)
    return (
      <Col md={12} className="section2-promotion">
        <div>
          <p className="promotion-title-field">Thời gian áp dụng </p>
          <div>
            Thời gian:{" "}
            <RangePicker
              showTime={{ format: "HH:mm" }}
              format="DD-MM-YYYY HH:mm"
              value={[moment(startTime,"DD-MM-YYYY HH:mm"), moment(endTime,"DD-MM-YYYY HH:mm")]}
            />
          </div>
          <div>
            Theo ngày:{" "}
            <Select
              mode="multiple"
              style={{ width: "100%" }}
              placeholder="- Ngày diễn ra khuyến mãi"
              value={dates}
              disabled={daily.length !== 0 ? true : false}
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
              value={daily}
              disabled={dates.length !== 0 ? true : false}
            >
              {childrenDaily}
            </Select>
          </div>
          <div>
            Theo giờ:
            <TimePicker
              format={"HH:mm"}
              defaultValue={moment(hour[0], "HH:mm")}
              placeholder="- Giờ bắt đầu"
            />
            <TimePicker
              format={"HH:mm"}
              defaultValue={moment(hour[1], "HH:mm")}
              placeholder="- Giờ kết thúc"
            />
          </div>
        </div>
        <div>
          Khuyến mãi diễn ra vào {hour[0]} {hour[1]} {alertDailyPromo}
          {printAlertDatesPromo} từ {startTime} đến {endTime}
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
