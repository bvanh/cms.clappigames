import React, { useState, useEffect } from "react";
import { Table, Button, Pagination, Input } from "antd";
import { gql } from "apollo-boost";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { Link } from "react-router-dom";
import "../../static/style/listUsers.css";

function Danhsach() {
  const [pageIndex, setPageIndex] = useState({ currentPage: 1, search: "" });
  const AppQuery = gql`
    query {
      listUsersByType(currentPage: ${pageIndex.currentPage}, pageSize: 10, type: 0, search: "") {
        count
        rows {
          userId
          username
          coin
          email,
          fakeId
        }
      }
    }
  `;
  const { loading, error, data, refetch } = useQuery(AppQuery);
  const columns = [
    {
      title: "Name",
      dataIndex: "username"
    },
    {
      title: "Age",
      dataIndex: "userId"
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
  const goPage = pageNumber => {
    setPageIndex({ ...pageIndex, currentPage: pageNumber });
  };
  const getValueSearch = e => {
    setPageIndex({ ...pageIndex, search: e.target.value });
  };
  return (
    <div className="container-listUser">
      <div className="title">
        <h2>Tổng quan về người dùng</h2>
        <div className="btn-search-users">
          <Input onChange={e => getValueSearch(e)} />
          <Button onClick={() => refetch()}>Search</Button>
        </div>
      </div>
      <Table
        columns={columns}
        dataSource={data.listUsersByType.rows}
        pagination={false}
      />
      <Pagination
        current={pageIndex.currentPage}
        total={data.listUsersByType.count}
        pageSize={10}
        onChange={goPage}
        className="pagination-listUser"
      />
    </div>
  );
}

export default Danhsach;
