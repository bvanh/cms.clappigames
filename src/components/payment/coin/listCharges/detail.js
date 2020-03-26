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
  const handleChangeType = () => {};
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
        type: 4,
        pageSize: pageSize,
        search: search,
        fromDate: fromDate,
        toDate: toDate
      }
    });
  };
  const reset = () => {
    setPageIndex({ ...pageIndex, search: "" });
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
      render: index => <span>{index === "INPUT" ? "NOT DONE" : "DONE"}</span>
    }
  ];
  const printOptionDates = listSelectDates.map((val, i) => (
    <Option value={val.variables} key={i}>
      {val.days}
    </Option>
  ));
  return (
    <Row>
      <div>
        <Link to="/payment/coin">
          <Icon type="double-left" />
          Quay lại
        </Link>
        <h2>Lịch sử giao dịch</h2>
        <div className="btn-search-charges">
          <Input
            value={search}
            placeholder="Tìm kiếm theo tên c.coin"
            onChange={getProductName}
            style={{ width: "50%", marginRight: "2%" }}
            suffix={
              <Tooltip
                title="reset"
                className={search !== "" ? "reset-btn-show" : "reset-btn-hide"}
              >
                <Icon
                  type="close"
                  style={{ color: "rgba(0,0,0,.45)" }}
                  onClick={reset}
                />
              </Tooltip>
            }
          />
          <DatePicker
            onChange={handleChangeFromDates}
            disabledDate={disabledDate}
            style={{ width: "12%", marginRight: ".5%" }}
          />
          <DatePicker
            onChange={handleChangeToDates}
            disabledDate={disabledEndDate}
            style={{ width: "12%", marginRight: ".5%" }}
            suffixIcon={
              <Tooltip
                title="reset"
                className={search !== "" ? "reset-btn-show" : "reset-btn-hide"}
              >
                <Icon
                  type="close"
                  style={{ color: "rgba(0,0,0,.45)" }}
                  onClick={reset}
                />
              </Tooltip>
            }
          />
          <Button style={{ width: "10%", margin: "0 1.5%" }} onClick={onSearch}>
            Search
          </Button>
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
