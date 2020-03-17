import React, { useState, useEffect, useMemo } from "react";

import { Line } from "react-chartjs-2";
import { Link } from "react-router-dom";
import { useQuery, useLazyQuery } from "@apollo/react-hooks";
import { getDataDau } from "../../utils/query/stats";
import { optionLineForStats } from "../../utils/configCharts";
import { connect } from "react-redux";
import { Icon, DatePicker, Input, Select } from "antd";
const { Option } = Select;

const ChartStats = props => {
    const [timeValue, setTimeValue] = useState({
        fromDate: "2020-03-01",
        toDate: "2020-03-29"
    });
    const { nameStats, partnerId } = props;
    const { fromDate, toDate } = timeValue;
    const [dataCharts, setDataCharts] = useState({
        xAxis: [],
        yAxis: []
    });
    const [getData] = useLazyQuery(getDataDau, {
        onCompleted: data => {
            setDataCharts({
                xAxis: JSON.parse(data.chartDau.xAxis),
                yAxis: JSON.parse(data.chartDau.yAxis)
            })
            console.log(JSON.parse(data.chartDau.yAxis))
        }
    });
    useMemo(() =>
        getData({
            variables: {
                fromDate: fromDate,
                toDate: toDate,
                game: partnerId
            }
        }), [partnerId]
    );
    const convertData = (typeOs) => {
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
    const dataChart = {
        labels: dataCharts.xAxis,
        datasets: [
            {
                label: 'ALL',
                fill: false,
                backgroundColor: "rgba(75,192,192,0.4)",
                borderColor: "rgba(75,192,192,0.4)",
                borderWidth: 2,
                hoverBackgroundColor: "rgba(255,99,132,0.4)",
                hoverBorderColor: "rgba(255,99,132,1)",
                data: convertData('ALL')
            },
            {
                label: "WEB",
                fill: false,
                backgroundColor: "#ffd54f",
                borderColor: "#ffd54f",
                borderWidth: 2,
                hoverBackgroundColor: "rgba(255,99,132,0.4)",
                hoverBorderColor: "rgba(255,99,132,1)",
                data: convertData('web')
            },
            {
                label: "ANDROID",
                fill: false,
                backgroundColor: "#fcaf18",
                borderColor: "#fcaf18",
                borderWidth: 2,
                hoverBackgroundColor: "rgba(255,99,132,0.4)",
                hoverBorderColor: "rgba(255,99,132,1)",
                data: convertData('android')
            },
            {
                label: "IOS",
                fill: false,
                backgroundColor: "#4280ad",
                borderColor: "#4280ad",
                borderWidth: 2,
                hoverBackgroundColor: "rgba(255,99,132,0.4)",
                hoverBorderColor: "rgba(255,99,132,1)",
                data: convertData('ios')
            }
        ]
    };
    return (
        <div style={{ width: '85%' }}>
            <div className='title-stats'>
                <h2>{nameStats}</h2>
                <span>Daily active users</span>
            </div>
            <Line data={dataChart} width={100} height={50} options={optionLineForStats} />
        </div>
    );
};

export default ChartStats;
