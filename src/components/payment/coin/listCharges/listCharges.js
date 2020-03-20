import React, { useState, useEffect } from "react";
import { Table, Button, Pagination, Input, Row, Col, Select,Icon} from "antd";
import {
  queryGetListCoin,
  queryGetListCharges
} from "../../../../utils/queryCoin";
import { useLazyQuery } from "@apollo/react-hooks";
import { dates } from "../../../../utils/dateInfo";
import { Link } from "react-router-dom";

import "../../../../static/style/listProducts.css";

const { Option } = Select;
const listSelectDates = [
  { days: "Last 3 days", variables: "THREE_DAY_AGO" },
  { days: "Last 7 days", variables: "SEVENT_DAY_AGO" },
  { days: "Last 14 days", variables: "FOURTEEN_DAY_AGO" },
  { days: "Last 30 days", variables: "THIRTY_DAY_AGO" }
];
function ListCharges() {
  const [pageIndex, setPageIndex] = useState({
    currentPage: 1,
    type: 1,
    pageSize: 5,
    search: "",
    fromDate: "",
    toDate: ""
  });
  const [dataCharges, setDataCharges] = useState(null);
  const { currentPage, pageSize, type, search, fromDate, toDate } = pageIndex;
  const { TODAY } = dates;
  const [getDataCharges, { loading, data }] = useLazyQuery(
    queryGetListCharges,
    {
      onCompleted: data => {
          console.log(data)
        setDataCharges(data);
      }
    }
  );
  useEffect(() => {
    getDataCharges({
      variables: {
        currentPage: currentPage,
        type: type,
        pageSize: pageSize,
        search: search,
        fromDate: fromDate,
        toDate: toDate
      }
    });
  }, []);
  const changeDates = val => {
    setPageIndex({ ...pageIndex, fromDate: dates[val], toDate: TODAY });
    getDataCharges({
      variables: {
        fromDate: dates[val],
        toDate: TODAY,
        currentPage: currentPage,
        type: type,
        pageSize: pageSize,
        search: search
      }
    });
  };
  const handleChangeRangeDates = value => {
    changeDates(value);
  };
  const columns = [
    {
      title: "Id",
      dataIndex: "chargeId",
      key: "chargeId"
    },
    {
      title: "C.coin",
      dataIndex: "baseCoin",
      key: "baseCoin"
    },
    {
      title: "UserName",
      dataIndex: "user",
      key: "userName",
      render: val => <span>{val !== null ? val.username : null}</span>
    },
    {
      title: "Type",
      dataIndex: "paymentType",
      key: "paymenttype"
    },
    {
      title: "Time",
      dataIndex: "createAt",
      key: "createAt"
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status"
    }
  ];
  const printOptionDates = listSelectDates.map((val, i) => (
    <Option value={val.variables} key={i}>
      {val.days}
    </Option>
  ));
  if (loading) return "Loading...";
  return (
    <>
      <div className="list-charges-title">
        <h2>Lịch sử giao dịch</h2>
        <div className='view-more'>
                <a className='btn-view-more'>Chi tiết <Icon type="double-right" /></a>
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
      {dataCharges && (
        <Table
          columns={columns}
          dataSource={dataCharges.listChargesByType.rows}
          pagination={false}
        />
      )}
    </>
  );
}

export default ListCharges;
