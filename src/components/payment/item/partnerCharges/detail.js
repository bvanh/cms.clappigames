import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Pagination,
  Input,
  Row,
  Select,
  Icon,
  DatePicker
} from "antd";
import moment from "moment";
import { queryGetListPartnerCharges } from "../../../../utils/queryPartnerProducts";
import { useLazyQuery } from "@apollo/react-hooks";
import { dates } from "../../../../utils/dateInfo";
import ReactExport from "react-export-excel";
import { Link } from "react-router-dom";
import "../../../../static/style/listProducts.css";
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;
const { Option } = Select;
const listSelectDates = [
  { days: "Last 3 days", variables: "THREE_DAY_AGO" },
  { days: "Last 7 days", variables: "SEVENT_DAY_AGO" },
  { days: "Last 14 days", variables: "FOURTEEN_DAY_AGO" },
  { days: "Last 30 days", variables: "THIRTY_DAY_AGO" }
];
const listType = [
  { nameType: "Theo tên", id: 3 },
  { nameType: "Theo mã giao dịch", id: 1 },
  { nameType: "Theo userId", id: 2 }
  // { nameType: "Theo kiểu thanh toán", id: 3 }
];
function ListChargesDetail() {
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
  const [dataCharges, setDataCharges] = useState(null);
  const [dataExport, setDataExport] = useState([]);
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
  const [getDataPartnerCharges] = useLazyQuery(queryGetListPartnerCharges, {
    fetchPolicy: "cache-and-network",
    onCompleted: data => {
      console.log(data);
      setDataCharges(data);
    }
  });
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
  const disabledDate = current => {
    return current && current > moment().endOf("day");
  };
  const disabledEndDate = current => {
    if (fromDate !== "") {
      return (
        (current &&
          current <
          moment(fromDate)
            .subtract(1, "days")
            .endOf("day")) ||
        current > moment().endOf("day")
      );
    }
  };
  const handleChangeFromDates = (value, dateString) => {
    setPageIndex({ ...pageIndex, fromDate: dateString });
  };
  const handleChangeToDates = (value, dateString) => {
    setPageIndex({ ...pageIndex, toDate: dateString });
  };
  const handleChangeType = val => {
    setPageIndex({ ...pageIndex, type: val });
  };
  const getProductName = e => {
    setPageIndex({ ...pageIndex, search: e.target.value });
  };
  const rowSelection = {
    onChange: (selectRowsKeys, selectedRows) => {
      //   const itemsIdForDelete = selectedRows.map((val, index) => val.productId);
      //   setItemsForDelete(itemsIdForDelete);
      console.log(selectedRows);
      setDataExport(selectedRows);
    }
  };
  const goPage = value => {
    setPageIndex({ ...pageIndex, currentPage: value });
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
  };
  const onSearch = () => {
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
  };
  const reset = () => {
    setPageIndex({
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
    getDataPartnerCharges({
      variables: {
        currentPage: 1,
        type: 1,
        pageSize: 10,
        search: "",
        fromDate: "",
        toDate: "",
        userType: "",
        partnerId: "",
        os: ""
      }
    });
  };
  const columns = [
    {
      title: "Id",
      dataIndex: "partnerChargeCode",
      key: "partnerChargeId",
      render: index => <span className="convert-col">{index}</span>
    },
    {
      title: "UserName",
      dataIndex: "user",
      key: "user",
      render: index => <span>{index === null ? "" : index.username}</span>
    },
    {
      title: "Tên nhân vật",
      dataIndex: "payload",
      key: "gameUserName",
      render: index => <span>{JSON.parse(index).gameUserName === null ? "" : JSON.parse(index).gameUserName}</span>
    },
    {
      title: "Item",
      dataIndex: "partnerProduct",
      key: "item",
      render: index => <span>{index === null ? "" : index.productName}</span>
    },
    {
      title: "C.Coin",
      dataIndex: "coin",
      key: "coin"
    },
    {
      title: "Server",
      dataIndex: "",
      key: "server"
    },
    {
      title: "Game",
      dataIndex: "partner",
      key: "partnername",
      render: index => <span>{index.partnerName}</span>
    },
    {
      title: "Khuyến mãi",
      dataIndex: "promotion",
      key: "promotion",
      render: index => <span>{index === null ? 'NONE' : index.name}</span>
    },
    {
      title: "Time",
      dataIndex: "createAt",
      key: "createAt",
      render: time => (
        <span>{moment.utc(Number(time)).format("HH:mm:ss DD-MM-YYYY")}</span>
      )
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: index => <span>{index === "INPUT" ? "PENDING" : "DONE"}</span>
    }
  ];
  const printTypePayment = listType.map((val, i) => (
    <Option value={val.id} key={i}>
      {val.nameType}
    </Option>
  ));
  return (
    <Row>
      <div>
        <Link to="/payment/items">
          <Icon type="double-left" />
          Quay lại
        </Link>
        <h2>Lịch sử giao dịch</h2>
        <div className="btn-search-charges">
          <div>
            <Input
              value={search}
              placeholder="Tìm kiếm theo tên c.coin"
              onChange={getProductName}
              style={{ width: "30%", marginRight: "2%" }}
              suffix={
                <Icon
                  className={
                    search !== "" ? "reset-btn-show" : "reset-btn-hide"
                  }
                  type="close"
                  style={{ color: "rgba(0,0,0,.45)" }}
                  onClick={reset}
                />
              }
            />
            <Select
              value={type}
              style={{ width: "15%", marginRight: "2%" }}
              onChange={handleChangeType}
            >
              {printTypePayment}
            </Select>
            <div
              style={{ width: "15%", marginRight: "1%", position: "relative" }}
            >
              <DatePicker
                allowClear={false}
                value={fromDate === "" ? null : moment(fromDate, "YYYY-MM-DD")}
                onChange={handleChangeFromDates}
                disabledDate={disabledDate}
                style={{ width: "100%" }}
                placeholder="FromDate"
                className="date-picker-search"
              />
              <Icon
                className={
                  toDate !== "" ? "icon-reset-date" : "icon-reset-date-hide"
                }
                type="close"
                style={{ color: "rgba(0,0,0,.45)" }}
                onClick={reset}
              />
            </div>
            <div
              style={{ width: "15%", marginRight: "2%", position: "relative" }}
            >
              <DatePicker
                allowClear={false}
                value={toDate === "" ? null : moment(toDate, "YYYY-MM-DD")}
                placeholder="ToDate"
                onChange={handleChangeToDates}
                disabledDate={disabledEndDate}
                style={{ width: "100%" }}
                className="date-picker-search"
              />
              <Icon
                className={
                  toDate !== "" ? "icon-reset-date" : "icon-reset-date-hide"
                }
                type="close"
                style={{ color: "rgba(0,0,0,.45)" }}
                onClick={reset}
              />
            </div>
            <Button style={{ width: "25%", margin: "" }} onClick={onSearch}>
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
              <ExcelColumn label="Id" value="partnerChargeId" />
              <ExcelColumn label="Username" value={user => user.user.username} />
              <ExcelColumn
                label="gameUserName"
                value={user => user.user.username}
              />
              <ExcelColumn label="Item" value="item" />
              <ExcelColumn label="C.coin" value="coin" />
              <ExcelColumn label="Server" value="" />
              <ExcelColumn label="Game" value={
                index => index.partner.partnerName
              } />
              <ExcelColumn label="Khuyen mai" value="" />
              <ExcelColumn
                label="Time"
                value={time =>
                  moment.utc(Number(time.createAt)).format("HH:mm DD-MM-YYYY")
                }
              />
              <ExcelColumn label="Status" value="status" />
            </ExcelSheet>
          </ExcelFile>
        </div>
      </div>
      {dataCharges && (
        <>
          <Table
            columns={columns}
            dataSource={dataCharges.listPartnerChargesByType.rows}
            pagination={false}
            rowSelection={rowSelection}
          />
          <Pagination
            current={pageIndex.currentPage}
            total={dataCharges.listPartnerChargesByType.count}
            pageSize={10}
            onChange={goPage}
            className="pagination-listUser"
          />
        </>
      )}
    </Row>
  );
}

export default ListChargesDetail;
