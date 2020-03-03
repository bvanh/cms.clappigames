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
import optionLine from "../../../../utils/configCharts";
import { connect } from "react-redux";
import { Icon, DatePicker, Input, Select } from "antd";
const { Option } = Select;

const ChartPartnerCharges = props => {
  const [timeValue, setTimeValue] = useState({
    fromDate: "2019-07-01",
    toDate: "2019-08-01"
  });
  const [listPartner, setListPartner] = useState({
    list: [{ partnerId: "", partnerName: "" }],
    id: `{"id":"469D8A83-2F3D-48DF-927B-7F40B602FCA3","name":"lqmt"}`
  });
  const [dataCharts, setDataCharts] = useState({
    xAxis: [],
    yAxis: []
  });
  const { fromDate, toDate } = timeValue;
  const { list, id } = listPartner;
  useQuery(queryGetPlatform, {
    onCompleted: data =>
      setListPartner({ ...listPartner, list: data.listPartners })
  });
  useQuery(getListPartnerCharges, {
    variables: {
      fromDate: fromDate,
      toDate: toDate,
      partnerId: JSON.parse(id).id
    },
    onCompleted: data => {
      setDataCharts({ xAxis: JSON.parse(data.listCachePartnerChargesByDate.xAxis), yAxis: JSON.parse(data.listCachePartnerChargesByDate.yAxis) })
    }
  });
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
    const newValue = JSON.parse(val)
    setListPartner({ ...listPartner, id: `{"id":"${newValue.id}","name":"${newValue.name}"}` });
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
    <Option value={`{"id":"${val.partnerId}","name":"${val.partnerName}"}`} key={i}>
      {val.partnerName}
    </Option>
  ));
  return (
    <div className="line_chart">
      <Select
        value={id}
        style={{ width: 120 }}
        onChange={handleChangeParnterCharges}
      >
        {printOptionPartner}
      </Select>
      <Line data={dataChart} width={100} height={50} options={optionLine} />
    </div>
  );
};
function mapStateToProps(state) {
  return {
    listPartner: state.listPartner
  };
}
export default connect(mapStateToProps, null)(ChartPartnerCharges);
