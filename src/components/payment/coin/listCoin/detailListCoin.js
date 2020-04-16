import React, { useState, useEffect } from "react";
import {
    Table,
    Button,
    Pagination,
    Input,
    Row,
    Select,
    Icon,
    DatePicker,
} from "antd";
import moment from "moment";
import {
    queryGetListCoin
} from "../../../../utils/queryCoin";
import { queryGetPaymentType } from "../../../../utils/queryPaymentAndPromoType";
import { dispatchSetListPaymentType } from '../../../../redux/actions/index'
import { connect } from 'react-redux';
import { convertPaymentType } from '../service';
import { alertErrorServer } from '../../../../utils/alertErrorAll'
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
    { nameType: "By UserName", id: 4 },
    { nameType: "By Purchase Coin ID", id: 1 },
    // { nameType: "By Payment Type", id: 3 }
    // { nameType: "Theo kiểu thanh toán", id: 3 }
];
function DetailListCoin(props) {
    const [pageIndex, setPageIndex] = useState({
        currentPage: 1,
        type: "",
        pageSize: 10,
        productName: ""
    });
    const [dataListCoin, setDataListCoin] = useState(null);
    const [dataExport, setDataExport] = useState([]);
    const { currentPage, pageSize, type, productName } = pageIndex;
    const { TODAY } = dates;
    const [getListPaymentType] = useLazyQuery(queryGetPaymentType, {
        onCompleted: data => {
            dispatchSetListPaymentType(data.__type.enumValues);
        },
        onError: index => alertErrorServer(index.networkError.result.errors[0].message)
    });
    const [getDataListCoin] = useLazyQuery(queryGetListCoin, {
        fetchPolicy: "cache-and-network",
        onCompleted: data => {
            setDataListCoin(data);
            // console.log(data)
        },
        onError: index => alertErrorServer(index.networkError.result.errors[0].message)
    });
    useEffect(() => {
        getListPaymentType();
        getDataListCoin({
            variables: {
                currentPage: currentPage,
                type: type,
                pageSize: pageSize,
                productName: productName
            }
        });
    }, []);
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
        getDataListCoin({
            variables: {
                currentPage: value,
                type: type,
                pageSize: pageSize,
                productName: productName
            }
        });
    };
    const onSearch = () => {
        getDataListCoin({
            variables: {
                currentPage: currentPage,
                type: type,
                pageSize: pageSize,
                productName: productName
            }
        });
    };
    const reset = () => {
        setPageIndex({
            currentPage: 1,
            type: '',
            pageSize: 10,
            productName: ""
        });
        getDataListCoin({
            variables: {
                currentPage: 1,
                type: "",
                pageSize: 10,
                productName: ""
            }
        });
    };
    const columns = [
        {
            title: "C.coin Id",
            dataIndex: "productId",
            key: "productId"
        },
        {
            title: "C.coin Name",
            dataIndex: "productName",
            key: "coin name",
            // render: val => <span>{val !== null ? val.username : null}</span>
        },
        {
            title: "Price (VNĐ)",
            dataIndex: "price",
            key: "price"
        },
        {
            title: "Payment Type",
            dataIndex: "type",
            key: "paymenttype",
            render: index => <span>{convertPaymentType(props.listPaymentType, index)}</span>
        },
        {
            title: "Promotion",
            dataIndex: "discount",
            key: "promotion",
            render: index => <span>0</span>
        },
        {
            title: "Sort",
            dataIndex: "sort",
            key: "sort",
            render: index => <span>0</span>
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            render: index => <span>{index === "INPUT" ? "PENDING" : "DONE"}</span>
        },
        {
            title: "Image",
            dataIndex: "image",
            key: "createAt",
            width: "5%",
            render: time => <img src={time} width='100%' />
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
    ));
    return (
        <Row>
            <div>
                <Link to="/payment/coin">
                    <Icon type="double-left" />
          Back
        </Link>
                <h2>List C.coin</h2>
                <div className="btn-search-charges">
                    <div>
                        <Input
                            value={productName}
                            placeholder="Search by C.coin name"
                            onChange={getProductName}
                            style={{ width: "30%", marginRight: "2%" }}
                            suffix={
                                <Icon
                                    className={
                                        productName !== "" ? "reset-btn-show" : "reset-btn-hide"
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
                        filename="History Purchase C.coin"
                    >
                        <ExcelSheet data={dataExport} name="History Purchase C.coin">
                            <ExcelColumn label="Id" value="chargeId" />

                            <ExcelColumn
                                label="UserName"
                                value={user => user.user.username}
                            />
                            <ExcelColumn label="C.coin" value="baseCoin" />
                            <ExcelColumn label="PaymentType" value="paymentType" />
                            <ExcelColumn label="Promotion" value="promotion" />
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
            {dataListCoin && (
                <>
                    <h3>
                        Total C.coin:{" "}
                        <span style={{ color: "#1890ff" }}>
                            {dataListCoin.listProductsByPaymentType.count}
                        </span>
                    </h3>
                    <Table
                        columns={columns}
                        dataSource={dataListCoin.listProductsByPaymentType.rows}
                        pagination={false}
                        rowSelection={rowSelection}
                    />
                    <Pagination
                        current={pageIndex.currentPage}
                        total={dataListCoin.listProductsByPaymentType.count}
                        pageSize={10}
                        onChange={goPage}
                        className="pagination-listUser"
                    />
                </>
            )}
        </Row>
    );
}
function mapStateToProps(state) {
    return {
        listPaymentType: state.listPaymentType
    }

}
export default connect(mapStateToProps, null)(DetailListCoin);
