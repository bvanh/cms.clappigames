import React, { useState, useEffect } from "react";
import { Table, Button, Pagination, Input, Row, Col, Select, Icon } from "antd";
import moment from "moment";
import {
  queryGetListCharges
} from "../../../../utils/queryCoin";
import { useLazyQuery } from "@apollo/react-hooks";
import {connect} from 'react-redux'
import { dates } from "../../../../utils/dateInfo";
import { alertErrorServer } from '../../../../utils/alertErrorAll'
import { convertPaymentType } from '../service'
import { Link } from "react-router-dom";

import "../../../../static/style/listProducts.css";

const { Option } = Select;
const listSelectDates = [
  { days: "Last 3 days", variables: "THREE_DAY_AGO" },
  { days: "Last 7 days", variables: "SEVENT_DAY_AGO" },
  { days: "Last 14 days", variables: "FOURTEEN_DAY_AGO" },
  { days: "Last 30 days", variables: "THIRTY_DAY_AGO" }
];
function ListCharges(props) {
  const [pageIndex, setPageIndex] = useState({
    currentPage: 1,
    type: 1,
    pageSize: 10,
    search: "",
    fromDate: "",
    toDate: ""
  });
  const [dataCharges, setDataCharges] = useState(null);
  const { currentPage, pageSize, type, search, fromDate, toDate } = pageIndex;
  const { TODAY } = dates;
  const [getDataCharges, { loading, data, error }] = useLazyQuery(
    queryGetListCharges,
    {
      onCompleted: data => {
        console.log(data);
        setDataCharges(data);
      },
      onError: index => alertErrorServer(index.networkError.result.errors[0].message)
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
  // const changeDates = val => {
  //   setPageIndex({ ...pageIndex, fromDate: dates[val], toDate: TODAY });
  //   getDataCharges({
  //     variables: {
  //       fromDate: dates[val],
  //       toDate: TODAY,
  //       currentPage: currentPage,
  //       type: type,
  //       pageSize: pageSize,
  //       search: search
  //     }
  //   });
  // };
  // const handleChangeRangeDates = value => {
  //   changeDates(value);
  // };
  const columns = [
    {
      title: "Purchase Coin ID",
      dataIndex: "chargeId",
      key: "chargeId",
      width: "14%",
      render: index => <span className="convert-col">{index}</span>
    },
    {
      title: "C.coin",
      dataIndex: "baseCoin",
      key: "baseCoin",
      width: "10%"
    },
    {
      title: "UserName",
      dataIndex: "user",
      key: "userName",
      width: "20%",
      render: val => <span>{val !== null ? val.username : null}</span>
    },
    {
      title: "Type",
      dataIndex: "paymentType",
      key: "paymenttype",
      width: "18%",
      render: index => <span>{convertPaymentType(props.listPaymentType, index)}</span>,
    },
    {
      title: "Time",
      dataIndex: "createAt",
      key: "createAt",
      width: "23%",
      render: time => (
        <span>{moment.utc(Number(time)).format("HH:mm DD-MM-YYYY")}</span>
      )
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: "15%"
    }
  ];
  // const printOptionDates = listSelectDates.map((val, i) => (
  //   <Option value={val.variables} key={i}>
  //     {val.days}
  //   </Option>
  // ));
  if (loading) return "Loading...";
  return (
    <>
      <div className="products-title">
        <div>
          <h2>History Purchase</h2>
          <div className="view-more">
            <Link className="btn-view-more" to="/payment/coin/charges/detail">
              Detail <Icon type="double-right" className='icon-detail' />
            </Link>
            {/* <Select
              defaultValue="SEVENT_DAY_AGO"
              style={{ width: 120 }}
              onChange={handleChangeRangeDates}
              className="select-charges-date"
            >
              {printOptionDates}
            </Select> */}
          </div>
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
function mapStateToProps(state) {
  return {
    listPaymentType: state.listPaymentType
  };
}
export default connect(mapStateToProps, null)(ListCharges);
