import React, { useState } from "react";
import moment from "moment";
import { Line } from "react-chartjs-2";
import { Link } from "react-router-dom";
import { useQuery } from "@apollo/react-hooks";
import { getListChartCharges } from "../../../../utils/query/chart";
import optionLine from '../../../../utils/configCharts'
import { Icon, DatePicker, Input, Select } from "antd";
const { Option } = Select;

const ChartCharges = props => {
    const [timeValue, setTimeValue] = useState({
        fromDate: "2019-12-23",
        toDate: "2020-01-05"
    });
    const [dataCharts, setDataCharts] = useState({ xAxis: [], yAxis: [] });

    const { fromDate, toDate } = timeValue;
    const { data } = useQuery(getListChartCharges(fromDate, toDate), {
        onCompleted: data =>
            setDataCharts({
                xAxis: JSON.parse(data.listCacheChargesByDate.xAxis),
                yAxis: JSON.parse(data.listCacheChargesByDate.yAxis)
            })
    });
    const converData = (paymentType) => {
        const demo = [];
        const dataAll = dataCharts.yAxis.map((val, i) =>
            val.map((val2, i) => {
                if (val2.paymentType === paymentType) {
                    demo.push(val2.money);
                }
            })
        );
        return demo;
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
                data: converData('ALL')
            },
            {
                label: "GATE",
                fill: false,
                backgroundColor: "#ffd54f",
                borderColor: "#ffd54f",
                borderWidth: 2,
                hoverBackgroundColor: "rgba(255,99,132,0.4)",
                hoverBorderColor: "rgba(255,99,132,1)",
                data: converData('GATE')
            },
            {
                label: "MOMO",
                fill: false,
                backgroundColor: "#fcaf18",
                borderColor: "#fcaf18",
                borderWidth: 2,
                hoverBackgroundColor: "rgba(255,99,132,0.4)",
                hoverBorderColor: "rgba(255,99,132,1)",
                data: converData('MOMO')
            },
            {
                label: "NGANLUONG",
                fill: false,
                backgroundColor: "#4280ad",
                borderColor: "#4280ad",
                borderWidth: 2,
                hoverBackgroundColor: "rgba(255,99,132,0.4)",
                hoverBorderColor: "rgba(255,99,132,1)",
                data: converData('NGANLUONG')
            }
        ]
    };
    return (
        <div className="line_chart">
            <Line
                data={dataChart}
                width={100}
                height={50}
                options={optionLine}
            />
        </div>
    );
};
export default ChartCharges;
