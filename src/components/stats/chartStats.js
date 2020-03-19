import React, { useState, useEffect, useMemo } from "react";

import { Line } from "react-chartjs-2";
import { Link } from "react-router-dom";
import { useQuery, useLazyQuery } from "@apollo/react-hooks";
import { getDataDAU, getDataMAU } from "../../utils/query/stats";
import { optionLineForStats } from "../../utils/configCharts";
import { connect } from "react-redux";
import { Icon, DatePicker, Input, Select } from "antd";
import { dates } from "../../utils/dateInfo";
import moment from "moment";
const { Option } = Select;
const listSelectDates = [
    { days: "3 days ago", variables: "THREE_DAY_AGO" },
    { days: "7 days ago", variables: "SEVENT_DAY_AGO" },
    { days: "14 days ago", variables: "FOURTEEN_DAY_AGO" },
    { days: "30 days ago", variables: "THIRTY_DAY_AGO" }
];
const ChartStats = props => {
    const [timeValue, setTimeValue] = useState({
        fromDate: dates.SEVENT_DAY_AGO,
        toDate: dates.TODAY,
        fromDateCustom: null,
        toDateCustom: null
    });
    const [isSelectDates, setIsSelectDates] = useState(false);
    const { nameStats, partnerId } = props;
    // console.log(nameStats,partnerId)
    const { fromDate, toDate, fromDateCustom, toDateCustom } = timeValue;
    const [dataCharts, setDataCharts] = useState({
        xAxis: [],
        yAxis: []
    });
    const { TODAY } = dates;
    const [getData] = useLazyQuery(getDataDAU, {
        onCompleted: data => {
            setDataCharts({
                xAxis: JSON.parse(data.chartDau.xAxis),
                yAxis: JSON.parse(data.chartDau.yAxis)
            });
        }
    });
    useMemo(
        () => {
            switch (nameStats) {
                case 'DAU':
                    getData({
                        variables: {
                            fromDate: fromDate,
                            toDate: toDate,
                            game: partnerId
                        }
                    })
                    break;
                default:
                    break;
            }
        },
        [partnerId]
    );
    const disabledDate = current => {
        if (fromDateCustom != null) {
            return (
                (current &&
                    current <
                    moment(fromDateCustom)
                        .subtract(1, "days")
                        .endOf("day")) ||
                current > moment().endOf("day")
            );
        }
    };

    const changeDates = val => {
        setTimeValue({ fromDate: dates[val], toDate: TODAY });
        getData({
            variables: {
                fromDate: dates[val],
                toDate: TODAY,
                game: partnerId
            }
        });
    };
    const handleChangeRangeDates = value => {
        changeDates(value);
    };
    const showDateSelect = () => {
        setIsSelectDates(!isSelectDates);
    };
    const convertData = typeOs => {
        const demo = [];
        const dataAll = dataCharts.yAxis.map((val, i) =>
            val.map((val2, i) => {
                if (val2.os === typeOs) {
                    demo.push(val2.dau);
                }
            })
        );
        return demo;
    };
    const changeRangeDates = value => {
        if (fromDateCustom == null) {
            setTimeValue({ ...timeValue, fromDateCustom: value });
        } else {
            setTimeValue({
                ...timeValue,
                toDateCustom: moment(value).format("YYYY-MM-DD")
            });
        }
    };
    const submitDateCustom = () => {
        getData({
            variables: {
                fromDate: fromDateCustom,
                toDate: toDateCustom,
                game: partnerId
            }
        });
        setIsSelectDates(!isSelectDates);
    };
    const dataChart = {
        labels: dataCharts.xAxis,
        datasets: [
            {
                label: "ALL",
                fill: false,
                backgroundColor: "rgba(75,192,192,0.4)",
                borderColor: "rgba(75,192,192,0.4)",
                borderWidth: 2,
                hoverBackgroundColor: "rgba(255,99,132,0.4)",
                hoverBorderColor: "rgba(255,99,132,1)",
                data: convertData("ALL")
            },
            {
                label: "WEB",
                fill: false,
                backgroundColor: "#ffd54f",
                borderColor: "#ffd54f",
                borderWidth: 2,
                hoverBackgroundColor: "rgba(255,99,132,0.4)",
                hoverBorderColor: "rgba(255,99,132,1)",
                data: convertData("web")
            },
            {
                label: "ANDROID",
                fill: false,
                backgroundColor: "#fcaf18",
                borderColor: "#fcaf18",
                borderWidth: 2,
                hoverBackgroundColor: "rgba(255,99,132,0.4)",
                hoverBorderColor: "rgba(255,99,132,1)",
                data: convertData("android")
            },
            {
                label: "IOS",
                fill: false,
                backgroundColor: "#4280ad",
                borderColor: "#4280ad",
                borderWidth: 2,
                hoverBackgroundColor: "rgba(255,99,132,0.4)",
                hoverBorderColor: "rgba(255,99,132,1)",
                data: convertData("ios")
            }
        ]
    };
    const printOptionDates = listSelectDates.map((val, i) => (
        <Option value={val.variables} key={i}>
            {val.days}
        </Option>
    ));
    return (
        <div style={{ width: "85%" }} className="chart-stats">
            <div className="title-stats">
                <h2 style={{ margin: '0' }}>{nameStats}</h2>
                <span>Daily active users</span>
            </div>
            <div className="chart-select-dates">
                <Select
                    defaultValue="SEVENT_DAY_AGO"
                    style={{ width: 120, marginTop: '1.5rem' }}
                    onChange={handleChangeRangeDates}
                    className='select_dates-stats'
                >
                    {printOptionDates}
                    <Option value="5" onClick={showDateSelect}>
                        Custom...
          </Option>
                </Select>
                {isSelectDates && (
                    <div className="modal_datepicker">
                        <DatePicker
                            allowClear={false}
                            disabledDate={disabledDate}
                            format="YYYY-MM-DD"
                            value={
                                fromDateCustom == null
                                    ? null
                                    : moment(fromDateCustom, "YYYY-MM-DD")
                            }
                            placeholder="StartDate"
                            onChange={e => changeRangeDates(e)}
                            className="input_date_chart"
                            open={true}
                            dropdownClassName="calendar-select-stats"
                            renderExtraFooter={() => (
                                <div className="datepicker_footer">
                                    <span
                                        onClick={() =>
                                            setTimeValue({
                                                ...timeValue,
                                                fromDateCustom: null,
                                                toDateCustom: null
                                            })
                                        }
                                    >
                                        CLEAR
                  </span>
                                    <span onClick={showDateSelect}>CANCEL</span>
                                    <span style={{ color: "#0085ff" }} onClick={submitDateCustom}>
                                        APPLY
                  </span>
                                </div>
                            )}
                        />
                        <Input
                            open={true}
                            value={toDateCustom}
                            placeholder="EndDate"
                            suffix={<Icon type="calendar" style={{ color: "#9e9e9e" }} />}
                            className="input_date_chart"
                        />
                    </div>
                )}
            </div>
            <Line
                data={dataChart}
                width={100}
                height={50}
                options={optionLineForStats}
            />
        </div>
    );
};

export default ChartStats;
