import React, { useState, useEffect } from "react";
import { Table, Button, Pagination, Row, Col } from "antd";
import { gql } from "apollo-boost";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { Link } from "react-router-dom";

function ListCoin() {
  const [selectedRowKeys, setSelectRowKeys] = useState([]);
  const [pageIndex, setPageIndex] = useState({ currentPage: 1 });

  const { loading, error, data } = useQuery(AppQuery);
  const columns = [
    {
      title: "Name",
      dataIndex: "username"
    },
    {
      title: "C.coin",
      dataIndex: "coin"
    },
    {
      title: "Email",
      dataIndex: "email"
    },
    {
      title: "Action",
      key: "action",

      render: (text, record) => (
        <span>
          <Link to={`users/detail?userId=${record.userId}`}>Chi tiết</Link>
        </span>
      )
    }
  ];
  if (loading) return "Loading...";
  if (error) return `Error! ${error.message}`;
  // const onSelectChange = selectedRowKeys => {
  //   console.log("selectedRowKeys changed: ", selectedRowKeys);
  //   setSelectRowKeys(selectedRowKeys);
  // };
  // const rowSelection = {
  //   selectedRowKeys,
  //   onChange: onSelectChange
  // };
  // const hasSelected = selectedRowKeys.length > 0;
  return (
    <Row>
      <Col md={12}>
        quản lý c.coin
      </Col>
      <Col md={12}>
        doanh thu
        
      </Col>
    </Row>
  );
}

export default ListCoin;
