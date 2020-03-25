import React, { useState, useEffect } from "react";
import { Table, Button, Pagination, Input } from "antd";
import { queryGetListUsers } from "../../utils/queryUsers";
import { useLazyQuery, useQuery } from "@apollo/react-hooks";
import { Link } from "react-router-dom";
import "../../static/style/listUsers.css";

function Danhsach() {
  const [pageIndex, setPageIndex] = useState({
    currentPage: 1,
    search: "",
    type: 1,
    pageSize: 10,
    count: null
  });
  const [dataUsers, setData] = useState([
    { username: "", userId: "", coin: "", emai: "" }
  ]);
  const { currentPage, search, type, pageSize } = pageIndex;
  const [getData, { loading, data }] = useLazyQuery(queryGetListUsers, {
    onCompleted: data => {
      setData(data.listUsersByType.rows);
      setPageIndex({ ...pageIndex, count: data.listUsersByType.count });
    }
  });
  useEffect(() => {
    getData({
      variables: {
        currentPage: currentPage,
        type: 0,
        pageSize: pageSize,
        search: search
      }
    });
  }, []);
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
  const goPage = pageNumber => {
    setPageIndex({ ...pageIndex, currentPage: pageNumber });
    getData({
      variables: {
        currentPage: pageNumber,
        type: type,
        pageSize: pageSize,
        search: search
      }
    });
  };
  const getValueSearch = e => {
    setPageIndex({ ...pageIndex, search: e.target.value });
  };
  const onSearch = () => {
    getData({
      variables: {
        currentPage: currentPage,
        type: type,
        pageSize: pageSize,
        search: search
      }
    });
  };
  const resetSearch = () => {
    setPageIndex({
      ...pageIndex,
      currentPage: 1,
      pageSize: 10,
      type: 1,
      search: ""
    });
    getData({
      variables: {
        currentPage: 1,
        type: type,
        pageSize: 10,
        search: ""
      }
    });
  };
  return (
    <div className="container-listUser">
      <div className="title">
        <h2>Tổng quan về người dùng</h2>
        <div className="btn-search-users">
          <a onClick={resetSearch} style={{width:"100px",textAlign:'center'}}>reset</a>
          <Input onChange={e => getValueSearch(e)} value={search} onPressEnter={resetSearch}/>
          <Button onClick={onSearch}>Search</Button>
        </div>
      </div>

      <Table columns={columns} dataSource={dataUsers} pagination={false} />
      <Pagination
        current={pageIndex.currentPage}
        total={pageIndex.count}
        pageSize={10}
        onChange={goPage}
        className="pagination-listUser"
      />
    </div>
  );
}

// if (error) return `Error! ${error.message}`;
// const submitSearch=()=>{
//   useQuery(queryGetListUsers(currentPage,))
// }

export default Danhsach;
