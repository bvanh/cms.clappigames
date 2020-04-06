import React, { useState, useEffect } from "react";
import { Table, Tooltip, Select, Icon } from "antd";
import { queryGetListPartnerCharges } from "../../../../utils/queryPartnerProducts";
import moment from "moment";
import { useLazyQuery } from "@apollo/react-hooks";
import { Link } from "react-router-dom";

import "../../../../static/style/listProducts.css";
import { dates } from "../../../../utils/dateInfo";
const { Option } = Select;
const listSelectDates = [
  { days: "Last 3 days", variables: "THREE_DAY_AGO" },
  { days: "Last 7 days", variables: "SEVENT_DAY_AGO" },
  { days: "Last 14 days", variables: "FOURTEEN_DAY_AGO" },
  { days: "Last 30 days", variables: "THIRTY_DAY_AGO" }
];
function ListPartnerCharges() {
  const [pageIndex, setPageIndex] = useState({
    currentPage: 1,
    type: 1,
    pageSize: 10,
    search: "",
    fromDate: "",
    toDate: "",
    userType: "",
    partnerId: "",
    os: ""
  });
  const [dataPartnerCharges, setDataCharges] = useState(null);
  const {
    currentPage,
    pageSize,
    type,
    userType,
    os,
    partnerId,
    search,
    fromDate,
    toDate
  } = pageIndex;
  const { TODAY } = dates;
  const [getDataPartnerCharges, { loading, data }] = useLazyQuery(
    queryGetListPartnerCharges,
    {
      onCompleted: data => {
        setDataCharges(data);
      }
    }
  );
  useEffect(() => {
    getDataPartnerCharges({
      variables: {
        currentPage: currentPage,
        type: type,
        pageSize: pageSize,
        search: search,
        fromDate: fromDate,
        toDate: toDate,
        userType: userType,
        os: os,
        partnerId: partnerId
      }
    });
  }, []);
  const changeDates = val => {
    setPageIndex({ ...pageIndex, fromDate: dates[val], toDate: TODAY });
    getDataPartnerCharges({
      variables: {
        fromDate: dates[val],
        toDate: TODAY,
        currentPage: currentPage,
        type: type,
        pageSize: pageSize,
        search: search,
        userType: userType,
        os: os,
        partnerId: partnerId
      }
    });
  };
  const handleChangeRangeDates = value => {
    changeDates(value);
  };
  const columns = [
    {
      title: "Purchase Item ID",
      dataIndex: "partnerChargeCode",
      key: "chargeId",
      width: "18%",
      render: index => <span className="convert-col">{index}</span>
    },
    {
      title: "UserName",
      dataIndex: "user",
      key: "userName",
      width: "15%",
      render: val => <span>{val !== null ? val.username : null}</span>
    },
    {
      title: "C.coin",
      dataIndex: "coin",
      key: "coin",
      width: "15%"
    },
    {
      title: "Game",
      dataIndex: "partner",
      key: "partner",
      width: "17%",
      render: partner => <span>{partner.partnerName}</span>
    },
    {
      title: "Time",
      dataIndex: "createAt",
      key: "createAt",
      width: "20%",
      render: time => (
        <Tooltip title={moment.utc(Number(time)).format("HH:mm DD-MM-YYYY")}>
          <span className="convert-col">{moment.utc(Number(time)).format("HH:mm DD-MM-YYYY")}</span>
        </Tooltip>
      )
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: "15%",
      render: index => <span className="convert-col">{index === "INPUT" ? "PENDING" : "DONE"}</span>
    }
  ];
  const getValueSearch = e => {
    setPageIndex({ ...pageIndex, search: e.target.value });
  };
  const printOptionDates = listSelectDates.map((val, i) => (
    <Option value={val.variables} key={i}>
      {val.days}
    </Option>
  ));
  if (loading) return "Loading...";
  return (
    <>
      <div className="products-title">
        <div>
          <h2>History purchase</h2>
          <div className="view-more">
            <Link to="/payment/item/charges/detail" className="btn-view-more">
              Detail <Icon type="double-right" />
            </Link>
            <Select
              defaultValue="SEVENT_DAY_AGO"
              style={{ width: 120 }}
              onChange={handleChangeRangeDates}
              className="select-charges-date"
            >
              {printOptionDates}
            </Select>
          </div>
        </div>
      </div>
      {dataPartnerCharges && (
        <Table
          columns={columns}
          dataSource={dataPartnerCharges.listPartnerChargesByType.rows}
          pagination={false}
          //
        />
      )}
    </>
  );
}

export default ListPartnerCharges;
