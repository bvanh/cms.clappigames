import React, { useState, useEffect, Fragment } from "react";
import { Table, Button, Pagination, Input, Tooltip, Icon, Select } from "antd";
import { queryGetListUsers } from "../../utils/queryUsers";
import { useLazyQuery, useQuery } from "@apollo/react-hooks";
import ReactExport from "react-export-excel";
import { Link } from "react-router-dom";
import { moment } from "moment";
import { importImage } from "../../utils/importImg";
import "../../static/style/listUsers.css";
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;
const { Option } = Select;
const listType = [
  { nameType: "By UserName", id: 4 },
  { nameType: "By chargeId", id: 1 },
  { nameType: "By UserId", id: 2 }
  // { nameType: "Theo kiểu thanh toán", id: 3 }
];
function Danhsach() {
  const [pageIndex, setPageIndex] = useState({
    currentPage: 1,
    search: "",
    type: 1,
    pageSize: 10,
    count: null
  });
  const [dataExport, setDataExport] = useState([]);
  const [dataUsers, setData] = useState([
    { username: "", userId: "", coin: "", emai: "", mobile: "" }
  ]);
  const { currentPage, search, type, pageSize } = pageIndex;
  const [getData, { loading, data }] = useLazyQuery(queryGetListUsers, {
    onCompleted: data => {
      console.log(data);
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
  const rowSelection = {
    onChange: (selectRowsKeys, selectedRows) => {
      setDataExport(selectedRows);
    }
  };
  const columns = [
    {
      title: "Name",
      dataIndex: "username",
      width: "20%"
    },
    {
      title: "User Id",
      dataIndex: "fakeId",
      width: "10%",
      render: index => <span className="convert-col">{index}</span>
    },
    {
      title: "C.coin",
      dataIndex: "coin",
      width: "10%"
    },
    {
      title: "Email",
      dataIndex: "email",
      width: "23%",
      render: (index, record) =>  (
        <Fragment>      
          {index !=="" ? (
            <span className="email-verify">
              <img src={importImage["tick-email.png"]} alt="tick-email" />
              {index}
            </span>
          ) : (
            <span>{index}</span>
          )}
        </Fragment>
      )
    },
    {
      title: "Mobile",
      dataIndex: "mobile",
      width: "17%"
    },
    {
      title: "Status",
      dataIndex: "status",
      width: "10%",
      render: index => <span>{index === "INPUT" ? "Inactive" : "Active"}</span>
    },
    {
      title: "Action",
      key: "action",
      width: "10%",
      render: (text, record) => (
        <span>
          <Link to={`users/detail?userId=${record.userId}`}>Detail</Link>
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
  const handleChangeType = val => {
    setPageIndex({ ...pageIndex, type: val });
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
        type: 1,
        pageSize: 10,
        search: ""
      }
    });
  };
  const printTypePayment = listType.map((val, i) => (
    <Option value={val.id} key={i}>
      {val.nameType}
    </Option>
  ));
  return (
    <div className="container-listUser">
      <h2>Users</h2>
      <div className="btn-search-charges">
        <div>
          <Input
            placeholder={`Search by Username, ChargeId...`}
            onChange={e => getValueSearch(e)}
            value={search}
            style={{ marginRight: ".2rem" }}
            suffix={
              <Tooltip
                title="reset"
                className={search !== "" ? "reset-btn-show" : "reset-btn-hide"}
              >
                <Icon
                  type="close"
                  style={{ color: "rgba(0,0,0,.45)" }}
                  onClick={resetSearch}
                />
              </Tooltip>
            }
          />
          <Select
            value={type}
            style={{ width: "25%", marginRight: "1%" }}
            onChange={handleChangeType}
          >
            {printTypePayment}
          </Select>
          <Button
            onClick={onSearch}
            style={{ marginLeft: ".25rem", width: "15%" }}
          >
            Search
          </Button>
        </div>
        <ExcelFile
          className="btn-export"
          style={{ width: "8%", marginLeft: "2%" }}
          element={
            <Button
              icon="file-excel"
              type="primary"
              id="btn_export_excel"
              disabled={dataExport.length > 0 ? false : true}
            >
              Export Excel
            </Button>
          }
          filename="Lịch sử giao dịch C.COIN"
        >
          <ExcelSheet data={dataExport} name="Lịch sử giao dịch C.coin">
            <ExcelColumn label="Name" value="username" />
            <ExcelColumn label="Id" value="userId" />
            <ExcelColumn label="C.coin" value="coin" />
            <ExcelColumn label="Email" value="email" />
            <ExcelColumn label="mobile" value="mobile" />
          </ExcelSheet>
        </ExcelFile>
      </div>
      <h3>
        Total: <span style={{ color: "#1890ff" }}>{pageIndex.count} Users</span>
      </h3>
      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={dataUsers}
        pagination={false}
      />
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
