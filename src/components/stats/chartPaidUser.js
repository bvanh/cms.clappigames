import React, { useState, useEffect, useMemo } from "react";

import { Line } from "react-chartjs-2";
import { Link } from "react-router-dom";
import { useQuery, useLazyQuery } from "@apollo/react-hooks";
import { getDataPaidUsers } from "../../utils/query/stats";
import { optionLineForStats } from "../../utils/configCharts";
import { connect } from "react-redux";
import { Icon, DatePicker, Input, Select } from "antd";
import { dates } from "../../utils/dateInfo";
import { convertContent } from "./statsService";
import moment from "moment";
const { Option } = Select;
const listSelectDates = [
  { days: "3 days ago", variables: "THREE_DAY_AGO" },
  { days: "7 days ago", variables: "SEVENT_DAY_AGO" },
  { days: "14 days ago", variables: "FOURTEEN_DAY_AGO" },
  { days: "30 days ago", variables: "THIRTY_DAY_AGO" }
];
const ChartPaidUsersStats = props => {
  const [timeValue, setTimeValue] = useState({
    fromDate: dates.SEVENT_DAY_AGO,
    toDate: dates.TODAY,
    fromDateCustom: null,
    toDateCustom: null
  });
  const [isSelectDates, setIsSelectDates] = useState(false);
  const [valueDate,setValueDate]=useState("SEVENT_DAY_AGO")
  const { nameStats, partnerId } = props;
  // console.log(nameStats,partnerId)
  const { fromDate, toDate, fromDateCustom, toDateCustom } = timeValue;
  const [dataCharts, setDataCharts] = useState({
    xAxis: [],
    yAxis: []
  });
  const { TODAY } = dates;
  const [getData] = useLazyQuery(getDataPaidUsers, {
    fetchPolicy: "cache-and-network",
    onCompleted: data => {
      console.log(JSON.parse(data.chartPaidUserByDate.yAxis));
      setDataCharts({
        xAxis: JSON.parse(data.chartPaidUserByDate.xAxis),
        yAxis: JSON.parse(data.chartPaidUserByDate.yAxis)
      });
    }
  });
  useMemo(() => {
    setValueDate("SEVENT_DAY_AGO")
    getData({
      variables: {
        fromDate: dates.SEVENT_DAY_AGO,
        toDate: TODAY,
        game: partnerId
      }
    });
  }, [partnerId, nameStats]);
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
    setValueDate(value)
  };
  const showDateSelect = () => {
    setIsSelectDates(!isSelectDates);
  };
  const convertData = typeOs => {
    switch (typeOs) {
      case "npu":
        return dataCharts.yAxis.map((val, i) => val[0].dfpu);
      case "dpu":
        return dataCharts.yAxis.map((val, i) => val[0].dpu);
    //   case "mpu":
    //     return dataCharts.yAxis.map((val, i) => val[0].mpu);
      case "pr":
        return dataCharts.yAxis.map((val, i) => val[0].pr);
      case "arpdau":
        return dataCharts.yAxis.map((val, i) => val[0].arpdau);
      case "arppdau":
        return dataCharts.yAxis.map((val, i) => val[0].arppdau);
      default:
        break;
    }
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
        label: nameStats,
        fill: false,
        backgroundColor: "rgba(75,192,192,0.4)",
        borderColor: "rgba(75,192,192,0.4)",
        borderWidth: 2,
        hoverBackgroundColor: "rgba(255,99,132,0.4)",
        hoverBorderColor: "rgba(255,99,132,1)",
        data: convertData(nameStats.toLowerCase())
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
        <h2 style={{ margin: "0" }}>{nameStats}</h2>
        <span>{convertContent(nameStats)}</span>
      </div>
      <div className="chart-select-dates">
        <Select
          value={valueDate}
          style={{ width: 120, marginTop: "1.5rem" }}
          onChange={handleChangeRangeDates}
          className="select_dates-stats"
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

export default ChartPaidUsersStats;
