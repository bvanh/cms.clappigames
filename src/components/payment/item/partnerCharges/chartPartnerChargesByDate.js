import React, { useState, useEffect } from "react";
import moment from "moment";
import { Line } from "react-chartjs-2";
import { Link } from "react-router-dom";
import { queryGetPlatform } from "../../../../utils/queryPlatform";
import { useQuery, useLazyQuery } from "@apollo/react-hooks";
import {
  getListChartCharges,
  getListPartnerCharges
} from "../../../../utils/query/chart";
import {
  queryGetListPartnerCharges
} from "../../../../utils/queryPartnerProducts";
import { optionLine } from "../../../../utils/configCharts";
import { connect } from "react-redux";
import { Icon, DatePicker, Input, Select } from "antd";
import { dates } from "../../../../utils/dateInfo";
import { platform } from "chart.js";
const { Option } = Select;

const listSelectDates = [
  { days: "3 days ago", variables: "THREE_DAY_AGO" },
  { days: "7 days ago", variables: "SEVENT_DAY_AGO" },
  { days: "14 days ago", variables: "FOURTEEN_DAY_AGO" },
  { days: "30 days ago", variables: "THIRTY_DAY_AGO" }
];
const ChartPartnerCharges = props => {
  const [timeValue, setTimeValue] = useState({
    fromDate: dates.SEVENT_DAY_AGO,
    toDate: dates.TODAY,
    fromDateCustom: null,
    toDateCustom: null
  });
  const [isSelectDates, setIsSelectDates] = useState(false);
  const [dataCharts, setDataCharts] = useState({
    xAxis: [],
    yAxis: []
  });
  const { fromDate, toDate, fromDateCustom, toDateCustom } = timeValue;
  const { TODAY } = dates;
  const [getData] = useLazyQuery(getListPartnerCharges, {
    onCompleted: data => {
      setDataCharts({
        xAxis: JSON.parse(data.chartCachePartnerChargeByDates.xAxis),
        yAxis: JSON.parse(data.chartCachePartnerChargeByDates.yAxis)
      });
      let arrCoin = JSON.parse(data.chartCachePartnerChargeByDates.yAxis).map((val, i) => val[0].coin);
      const totalCoin = arrCoin.reduce((a, b) => a + b)
      props.setTotalIndex({ ...props.totalIndex, totalMoney: totalCoin })
    }
  });
  const [getDataPartnerCharges] = useLazyQuery(
    queryGetListPartnerCharges, {
    onCompleted: data => {
      console.log(data)
      props.setTotalIndex({ ...props.totalIndex, totalPurchase: data.listPartnerChargesByType.count })
    }
  }
  );
  useEffect(() => {
    getData({
      variables: {
        fromDate: fromDate,
        toDate: toDate,
      }
    });
    getDataPartnerCharges({
      variables: {
        currentPage: 1,
        type: 1,
        pageSize: 10,
        search: '',
        fromDate: fromDate,
        toDate: toDate,
        userType: '',
        os: '',
        partnerId: ''
      }
    })
  }, []);
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
    setTimeValue({ ...timeValue, fromDate: dates[val], toDate: TODAY });
    getData({
      variables: {
        fromDate: dates[val],
        toDate: TODAY,
      }
    });
    getDataPartnerCharges({
      variables: {
        currentPage: 1,
        type: 1,
        pageSize: 10,
        search: '',
        fromDate: dates[val],
        toDate: TODAY,
        userType: '',
        os: '',
        partnerId: ''
      }
    })
  };
  const handleChangeRangeDates = value => {
    if(value!=="5"){
      changeDates(value);
    }
  };
  const showDateSelect = () => {
    setIsSelectDates(!isSelectDates);
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
      }
    });
    getDataPartnerCharges({
      variables: {
        currentPage: 1,
        type: 1,
        pageSize: 10,
        search: '',
        fromDate: fromDateCustom,
        toDate: toDateCustom,
        userType: '',
        os: '',
        partnerId: ''
      }
    })
    setIsSelectDates(!isSelectDates);
  };
  const convertData = platform => {
    const demo = [];
    const dataAll = dataCharts.yAxis.map((val, i) =>
      val.map((val2, i) => {
        if (val2.partner === platform) {
          demo.push(val2.coin);
        }
      })
    );
    return demo;
  };
  const dataChart = {
    labels: dataCharts.xAxis,
    datasets: [
      {
        label: 'Total',
        fill: false,
        backgroundColor: "rgba(75,192,192,0.4)",
        borderColor: "rgba(75,192,192,0.4)",
        borderWidth: 2,
        hoverBackgroundColor: "rgba(255,99,132,0.4)",
        hoverBorderColor: "rgba(255,99,132,1)",
        data: convertData("Total")
      },
      {
        label: "3Q Zombie",
        fill: false,
        backgroundColor: "#ffd54f",
        borderColor: "#ffd54f",
        borderWidth: 2,
        hoverBackgroundColor: "rgba(255,99,132,0.4)",
        hoverBorderColor: "rgba(255,99,132,1)",
        data: convertData("3Q Zombie")
      },
      {
        label: "Liên Quân Ma Thuật",
        fill: false,
        backgroundColor: "#fcaf18",
        borderColor: "#fcaf18",
        borderWidth: 2,
        hoverBackgroundColor: "rgba(255,99,132,0.4)",
        hoverBorderColor: "rgba(255,99,132,1)",
        data: convertData("Liên Quân Ma Thuật")
      },
      {
        label: "Wara Store",
        fill: false,
        backgroundColor: "#4280ad",
        borderColor: "#4280ad",
        borderWidth: 2,
        hoverBackgroundColor: "rgba(255,99,132,0.4)",
        hoverBorderColor: "rgba(255,99,132,1)",
        data: convertData("Wara Store")
      }
    ]
  };
  const printOptionDates = listSelectDates.map((val, i) => (
    <Option value={val.variables} key={i}>
      {val.days}
    </Option>
  ));
  return (
    <div className="line_chart">
      <div className="chart-charges-title">
        <h2>Xu hướng Item</h2>
        <div>
          <Select
            defaultValue="SEVENT_DAY_AGO"
            style={{ width: 120 }}
            onChange={handleChangeRangeDates}
            className="select_dates-stats"
          >
            {printOptionDates}
            <Option value="5" onClick={showDateSelect}>
              Custom...
            </Option>
          </Select>
          {isSelectDates && (
            <div className="modal_datepicker-chartCoin">
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
                dropdownClassName="calendar-select-chartsCoin"
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
                    <span
                      style={{ color: "#0085ff" }}
                      onClick={submitDateCustom}
                    >
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
      </div>
      <Line data={dataChart} width={100} height={40} options={optionLine} />
    </div>
  );
};
function mapStateToProps(state) {
  return {
    listPartner: state.listPartner
  };
}
export default connect(mapStateToProps, null)(ChartPartnerCharges);
