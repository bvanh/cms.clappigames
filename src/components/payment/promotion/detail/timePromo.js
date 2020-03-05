import React, { useState, useEffect, useMemo } from "react";
import { Button, Row, Col, TimePicker, Select, Input, DatePicker } from "antd";
import { Link } from "react-router-dom";
import moment from 'moment'
import { connect } from "react-redux";
import { getDetailPromotion } from "../../../../utils/query/promotion";
import { getListPartnerProducts } from "../../../../utils/queryPartnerProducts";
import {
    dispatchDeatilPromo,
    dispatchDetailPromo
} from "../../../../redux/actions/index";
import { useQuery, useLazyQuery } from "react-apollo";
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
function TimePromo(props) {
    const { name, status, eventTime, type, shop, game } = props.detailPromo;

    // const printAlertDailyPromo = dailyPromo.map(function (val, index) {
    //     switch (val) {
    //         case 0:
    //             return <span>Monday</span>;
    //         case 1:
    //             return <span>Tuesday</span>;
    //         case 2:
    //             return <span>Wednesday</span>;
    //         case 3:
    //             return <span>Thursday</span>;
    //         case 4:
    //             return <span>Friday</span>;
    //         case 5:
    //             return <span>Saturday</span>;
    //         case 6:
    //             return <span>Sunday</span>;
    //         default:
    //             break;
    //     }
    // });
    if (eventTime) {
        const timePromo = JSON.parse(eventTime)
        // const printAlertDatesPromo = datesPromo.map((val, i) => <>{val}</>);
        // const printAlertTimeTotalPromo = timeTotalAlert.map((val, i) => <>{val}</>);
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
                        value={[moment(timePromo.startTime),moment(timePromo.endTime)]}

                        />
                    </div>
                    <div>
                        Theo ngày:{" "}
                        <Select
                            mode="multiple"
                            style={{ width: "100%" }}
                            placeholder="- Chọn ngày trong tháng diễn ra khuyến mãi"

                        // disabled={dailyPromo.length !== 0 ? true : false}
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

                        // disabled={datesPromo.length !== 0 ? true : false}
                        >
                            {childrenDaily}
                        </Select>
                    </div>
                    <div>
                        Theo giờ:
                <TimePicker
                            format={"HH:mm"}
                            placeholder="- Giờ bắt đầu"
                        />
                        <TimePicker
                            format={"HH:mm"}
                            placeholder="- Giờ kết thúc"

                        />
                    </div>
                </div>
                {/* <div>
                    Khuyến mãi diễn ra vào {startTime} {endTime} {printAlertDailyPromo}{" "}
                    {printAlertDatesPromo} từ {timeTotalPromo[0]} đến {timeTotalPromo[1]}
                </div> */}
            </Col>
        );

    } else {
        return <p>Loadding...</p>
    }


}

function mapStateToProps(state) {
    return {
        detailPromo: state.detailPromo
    };
}
export default connect(mapStateToProps, null)(TimePromo);
