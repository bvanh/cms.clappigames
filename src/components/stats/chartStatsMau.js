import React, { useState, useEffect, useMemo } from "react";

import { Line } from "react-chartjs-2";
import { Link } from "react-router-dom";
import { useQuery, useLazyQuery } from "@apollo/react-hooks";
import { getDataDAU, getDataMAU } from "../../utils/query/stats";
import { optionLineForStats } from "../../utils/configCharts";
import { connect } from "react-redux";
import { Icon, DatePicker, Input, Select } from "antd";
import { months } from "../../utils/dateInfo";
import moment from "moment";
const { Option } = Select;
const { MonthPicker } = DatePicker
const listSelectmonths = [
    { days: "3 months ago", variables: "THREE_MONTHS_AGO" },
    { days: "6 months ago", variables: "SIX_MONTHS_AGO" },
    { days: "1 years ago", variables: "ONE_YEAR_AGO" },
];
const ChartStatsMau = props => {
    const [timeValue, setTimeValue] = useState({
        fromMonth: months.THREE_MONTHS_AGO,
        toMonth: months.THISMONTH,
        fromMonthCustom: null,
        toMonthCustom: null,
        defaulSelectMonth: 'THREE_MONTHS_AGO'
    });
    const [isSelectMonths, setIsSelectMonths] = useState(false);
    const { nameStats, partnerId } = props;
    const { fromMonth, toMonth, fromMonthCustom, toMonthCustom, defaulSelectMonth } = timeValue;
    const [dataCharts, setDataCharts] = useState({
        xAxis: [],
        yAxis: []
    });
    const { THISMONTH } = months;
    const [getDataMau] = useLazyQuery(getDataMAU, {
        onCompleted: data => {
            setDataCharts({
                xAxis: JSON.parse(data.chartMau.xAxis),
                yAxis: JSON.parse(data.chartMau.yAxis)
            });
        }
    });
    useMemo(() => {
        getDataMau({
            variables: {
                fromMonth: months.THREE_MONTHS_AGO,
                toMonth: THISMONTH,
                game: partnerId
            }
        });
        setTimeValue({ ...timeValue, defaulSelectMonth: "THREE_MONTHS_AGO" })
    }, [partnerId]);
    const disabledDate = current => {
        if (fromMonthCustom != null) {
            return (
                (current &&
                    current <
                    moment(fromMonthCustom)
                        .subtract(1, "months")
                        .endOf("months")) ||
                current > moment().endOf("month")
            );
        }
    };

    const changemonths = val => {
        console.log(val)
        setTimeValue({ ...timeValue, fromMonth: months[val], toMonth: THISMONTH, defaulSelectMonth: val });
        getDataMau({
            variables: {
                fromMonth: months[val],
                toMonth: THISMONTH,
                game: partnerId
            }
        });
    };
    const handleChangeRangemonths = value => {
        changemonths(value);
    };
    const showmonthselect = () => {
        setIsSelectMonths(!isSelectMonths);
    };
    const convertData = typeOs => {
        const demo = [];
        const dataAll = dataCharts.yAxis.map((val, i) =>
            val.map((val2, i) => {
                if (val2.os === typeOs) {
                    demo.push(val2.mau);
                }
            })
        );
        return demo;
    };
    const changeRangemonths = value => {
        if (fromMonthCustom == null) {
            setTimeValue({ ...timeValue, fromMonthCustom: value });
        } else {
            setTimeValue({
                ...timeValue,
                toMonthCustom: moment(value).format("YYYY-MM-DD")
            });
        }
    };
    const submitDateCustom = () => {
        getDataMau({
            variables: {
                fromMonth: fromMonthCustom,
                toMonth: toMonthCustom,
                game: partnerId
            }
        });
        setIsSelectMonths(!isSelectMonths);
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
    const printOptionmonths = listSelectmonths.map((val, i) => (
        <Option value={val.variables} key={i}>
            {val.days}
        </Option>
    ));
    return (
        <div style={{ width: "85%" }} className="chart-stats">
            <div className="title-stats">
                <h2 style={{ margin: "0" }}>{nameStats}</h2>
                <span>Daily active users</span>
            </div>
            <div className="chart-select-months">
                <Select
                    value={defaulSelectMonth}
                    style={{ width: 120, marginTop: "1.5rem" }}
                    onChange={handleChangeRangemonths}
                    className="select_months-stats"
                >
                    {printOptionmonths}
                    <Option value="5" onClick={showmonthselect}>
                        Custom...
          </Option>
                </Select>
                {isSelectMonths && (
                    <div className="modal_datepicker">
                        <MonthPicker
                            allowClear={false}
                            disabledDate={disabledDate}
                            format="YYYY-MM-DD"
                            value={
                                fromMonthCustom == null
                                    ? null
                                    : moment(fromMonthCustom, "YYYY-MM-DD")
                            }
                            placeholder="StartMonth"
                            onChange={e => changeRangemonths(e)}
                            className="input_month_chart"
                            open={true}
                            dropdownClassName="calendar-selectmonth-stats"
                            renderExtraFooter={() => (
                                <div className="datepicker_footer">
                                    <span
                                        onClick={() =>
                                            setTimeValue({
                                                ...timeValue,
                                                fromMonthCustom: null,
                                                toMonthCustom: null
                                            })
                                        }
                                    >
                                        CLEAR
                  </span>
                                    <span onClick={showmonthselect}>CANCEL</span>
                                    <span style={{ color: "#0085ff" }} onClick={submitDateCustom}>
                                        APPLY
                  </span>
                                </div>
                            )}
                        />
                        <Input
                            open={true}
                            value={toMonthCustom}
                            placeholder="EndMonth"
                            suffix={<Icon type="calendar" style={{ color: "#9e9e9e" }} />}
                            className="input_month_chart"
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

export default ChartStatsMau;
