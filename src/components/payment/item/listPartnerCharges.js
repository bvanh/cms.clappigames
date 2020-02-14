import React, { useState, useEffect } from "react";
import { Table, Button, Pagination, Input, Row, Col, Select } from "antd";
import {
  queryGetListPartnerCharges
} from "../../../utils/queryPartnerProducts";
import { useLazyQuery } from "@apollo/react-hooks";
import { Link } from "react-router-dom";

import "../../../static/style/listProducts.css";

const { Option } = Select;
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
        partnerId:partnerId
      }
    });
  }, []);
  const columns = [
    {
      title: "Id",
      dataIndex: "partnerChargeId",
      key: "chargeId"
    },
    {
      title: "UserName",
      dataIndex: "user",
      key: "userName",
      render: val => <span>{val !== null ? val.username : null}</span>
    },
    ,
    {
      title: "C.coin",
      dataIndex: "coin",
      key: "coin"
    },
    {
      title: "Game",
      dataIndex: "partner",
      key: "partner",
      render: partner => <span>{partner.partnerName}</span>
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
  const getValueSearch = e => {
    setPageIndex({ ...pageIndex, search: e.target.value });
  };
  // const onSearch = () => {
  //   getDataCharges({
  //     variables: {
  //       currentPage: currentPage,
  //       type: type,
  //       pageSize: pageSize
  //       // search: search
  //     }
  //   });
  // };
  if (loading) return "Loading...";
  return (
    <>
      {dataPartnerCharges && (
        <Table
          columns={columns}
          dataSource={dataPartnerCharges.listPartnerChargesByType.rows}
          pagination={false}
        />)}
    </>
  );
}

export default ListPartnerCharges;
