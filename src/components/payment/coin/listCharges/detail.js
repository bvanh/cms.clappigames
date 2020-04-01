import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Pagination,
  Input,
  Row,
  Col,
  Select,
  Icon,
  DatePicker,
  Tooltip
} from "antd";
import moment from "moment";
import {
  queryGetListCoin,
  queryGetListCharges
} from "../../../../utils/queryCoin";
import { useLazyQuery } from "@apollo/react-hooks";
import { dates } from "../../../../utils/dateInfo";
import ReactExport from "react-export-excel";
import { Link } from "react-router-dom";
import "../../../../static/style/listProducts.css";
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;
const { Option } = Select;
const { RangePicker } = DatePicker;
const listSelectDates = [
  { days: "Last 3 days", variables: "THREE_DAY_AGO" },
  { days: "Last 7 days", variables: "SEVENT_DAY_AGO" },
  { days: "Last 14 days", variables: "FOURTEEN_DAY_AGO" },
  { days: "Last 30 days", variables: "THIRTY_DAY_AGO" }
];
const listType = [
  { nameType: "By C.coin", id: 4 },
  { nameType: "By Purchase ID", id: 1 },
  { nameType: "By User ID", id: 2 },
  // { nameType: "Theo kiểu thanh toán", id: 3 }
];
function ListChargesDetail() {
  const [pageIndex, setPageIndex] = useState({
    currentPage: 1,
    type: 4,
    pageSize: 10,
    search: "",
    fromDate: "",
    toDate: ""
  });
  const [dataCharges, setDataCharges] = useState(null);
  const [dataExport, setDataExport] = useState([]);
  const { currentPage, pageSize, type, search, fromDate, toDate } = pageIndex;
  const { TODAY } = dates;
  const [getDataCharges] = useLazyQuery(queryGetListCharges, {
    fetchPolicy: "cache-and-network",
    onCompleted: data => {
      setDataCharges(data);
    }
  });
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
  const handleChangeType = (val) => {
    setPageIndex({ ...pageIndex, type: val })
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
    getDataCharges({
      variables: {
        currentPage: value,
        type: type,
        pageSize: pageSize,
        search: search,
        fromDate: fromDate,
        toDate: toDate
      }
    });
  };
  const onSearch = () => {
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
  };
  const reset = () => {
    setPageIndex({
      currentPage: 1,
      type: 4,
      pageSize: 10,
      search: "",
      fromDate: "",
      toDate: ""
    });
    getDataCharges({
      variables: {
        currentPage: 1,
        type: 4,
        pageSize: 10,
        search: "",
        fromDate: "",
        toDate: ""
      }
    });
  };
  const columns = [
    {
      title: "Purchase Id",
      dataIndex: "chargeId",
      key: "chargeId"
    },
    {
      title: "C.coin",
      dataIndex: "baseCoin",
      key: "baseCoin"
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: index => <span>{index.toLocaleString()} đ</span>
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
      key: "createAt",
      render: time => (
        <span>{moment.utc(Number(time)).format("HH:mm DD-MM-YYYY")}</span>
      )
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: index => <span>{index === "INPUT" ? "PENDING" : "DONE"}</span>
    }
  ];
  const printOptionDates = listSelectDates.map((val, i) => (
    <Option value={val.variables} key={i}>
      {val.days}
    </Option>
  ));
  const printTypePayment = listType.map((val, i) => (
    <Option value={val.id} key={i}>
      {val.nameType}
    </Option>
  ))
  return (
    <Row>
      <div>
        <Link to="/payment/coin">
          <Icon type="double-left" />
          Back
        </Link>
        <h2>History purchase</h2>
        <div className="btn-search-charges">
          <div>
            <Input
              value={search}
              placeholder="Search by C.coin package name"
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
              <ExcelColumn label="Id" value="chargeId" />
              <ExcelColumn label="C.coin" value="baseCoin" />
              <ExcelColumn
                label="UserName"
                value={user => user.user.username}
              />
              <ExcelColumn label="PaymentType" value="paymentType" />
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
            dataSource={dataCharges.listChargesByType.rows}
            pagination={false}
            rowSelection={rowSelection}
          />
          <Pagination
            current={pageIndex.currentPage}
            total={dataCharges.listChargesByType.count}
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
