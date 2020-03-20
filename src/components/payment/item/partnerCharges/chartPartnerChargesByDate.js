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
import { optionLine } from "../../../../utils/configCharts";
import { connect } from "react-redux";
import { Icon, DatePicker, Input, Select } from "antd";
import { dates } from "../../../../utils/dateInfo";
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
  const [listPartner, setListPartner] = useState({
    list: [{ partnerId: "", partnerName: "" }],
    id: `{"id":"469D8A83-2F3D-48DF-927B-7F40B602FCA3","name":"lqmt"}`
  });
  const [isSelectDates, setIsSelectDates] = useState(false);
  const [dataCharts, setDataCharts] = useState({
    xAxis: [],
    yAxis: []
  });
  const { fromDate, toDate, fromDateCustom, toDateCustom } = timeValue;
  const { list, id } = listPartner;
  const { TODAY } = dates;
  useQuery(queryGetPlatform, {
    onCompleted: data =>
      setListPartner({ ...listPartner, list: data.listPartners })
  });
  const [getData] = useLazyQuery(getListPartnerCharges, {
    onCompleted: data => {
      console.log(data);
      setDataCharts({
        xAxis: JSON.parse(data.listCachePartnerChargesByDate.xAxis),
        yAxis: JSON.parse(data.listCachePartnerChargesByDate.yAxis)
      });
    }
  });
  useEffect(() => {
    getData({
      variables: {
        fromDate: fromDate,
        toDate: toDate,
        partnerId: JSON.parse(id).id
      }
    });
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
        partnerId: JSON.parse(id).id
      }
    });
  };
  const handleChangeRangeDates = value => {
    changeDates(value);
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
        partnerId: JSON.parse(id).id
      }
    });
    setIsSelectDates(!isSelectDates);
  };
  const converData = () => {
    const demo = [];
    const dataAll = dataCharts.yAxis.map((val, i) =>
      val.map((val2, i) => {
        demo.push(val2.coin);
      })
    );
    return demo;
  };
  const handleChangeParnterCharges = val => {
    const newValue = JSON.parse(val);
    setListPartner({
      ...listPartner,
      id: `{"id":"${newValue.id}","name":"${newValue.name}"}`
    });
    getData({
      variables: {
        fromDate: fromDate,
        toDate: toDate,
        partnerId: newValue.id
      }
    });
  };
  const dataChart = {
    labels: dataCharts.xAxis,
    datasets: [
      {
        label: ` Game ${JSON.parse(id).name}`,
        fill: false,
        backgroundColor: "rgba(75,192,192,0.4)",
        borderColor: "rgba(75,192,192,0.4)",
        borderWidth: 2,
        hoverBackgroundColor: "rgba(255,99,132,0.4)",
        hoverBorderColor: "rgba(255,99,132,1)",
        data: converData()
      }
    ]
  };
  const printOptionPartner = list.map((val, i) => (
    <Option
      value={`{"id":"${val.partnerId}","name":"${val.partnerName}"}`}
      key={i}
    >
      {val.partnerName}
    </Option>
  ));
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
            // value={id}
            placeholder='Chọn game'
            style={{ width: 120,marginRight:"1rem" }}
            onChange={handleChangeParnterCharges}
          >
            {printOptionPartner}
          </Select>
          <Select
            defaultValue="SEVENT_DAY_AGO"
            style={{ width: 120}}
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
