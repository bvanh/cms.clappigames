import React, { useState, useEffect } from "react";
import { Table, Button, Pagination } from "antd";
import { gql } from "apollo-boost";
import { useQuery, useMutation } from "@apollo/react-hooks";
import {Link} from 'react-router-dom'

function Danhsach() {
  const [selectedRowKeys, setSelectRowKeys] = useState([]);
  const [pageIndex, setPageIndex] = useState({ currentPage: 1 });
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
  const { loading, error, data } = useQuery(AppQuery);
  const [loading2, setLoading] = useState(false);
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
          <Link to={`users/detail?fakeId=${record.fakeId}`}>Chi tiết</Link>
        </span>
       
      )
    }
  ];
  if (loading) return "Loading...";
  if (error) return `Error! ${error.message}`;
  const onSelectChange = selectedRowKeys => {
    console.log("selectedRowKeys changed: ", selectedRowKeys);
    setSelectRowKeys(selectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange
  };
  const hasSelected = selectedRowKeys.length > 0;
  const goPage = pageNumber => {
    setPageIndex({ currentPage: pageNumber });
  };
  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button
          type="primary"
          // onClick={this.start}
          disabled={!hasSelected}
          loading={loading2}
        >
          Reload
        </Button>
        <span style={{ marginLeft: 8 }}>
          {hasSelected ? `Selected ${selectedRowKeys.length} items` : ""}
        </span>
      </div>
      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={data.listUsersByType.rows}
        pagination={false}
      />
      <Pagination
        defaultCurrent={1}
        total={data.listUsersByType.count}
        pageSize={10}
        onChange={goPage}
      />
    </div>
  );
}

export default Danhsach;
