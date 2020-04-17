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
  Radio,
} from "antd";
import moment from "moment";
import { queryGetListPartnerProducts } from "../../../../utils/queryPartnerProducts";
import { connect } from "react-redux";
import { queryGetPlatform } from "../../../../utils/queryPlatform";
import { alertErrorServer } from "../../../../utils/alertErrorAll";
import { useLazyQuery, useQuery } from "@apollo/react-hooks";
import { dates } from "../../../../utils/dateInfo";
import ReactExport from "react-export-excel";
import { Link } from "react-router-dom";
import "../../../../static/style/listProducts.css";
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;
const radioStyle = {
  display: "block",
  height: "30px",
  lineHeight: "30px",
};
function DetailListItems(props) {
  const [pageIndex, setPageIndex] = useState({
    currentPage: 1,
    pageSize: 10,
    partnerProductName: "",
    partnerId: "",
    productName:""
  });
  const [listGame, setListGame] = useState([
    { partnerId: "", partnerName: "" },
  ]);
  const [dataListItem, setDataListItems] = useState(null);
  const [dataExport, setDataExport] = useState([]);
  const { currentPage, pageSize,productName, partnerProductName, partnerId } = pageIndex;
  const { TODAY } = dates;
  const [getListGame] = useLazyQuery(queryGetPlatform, {
    fetchPolicy: "cache-and-network",
    onCompleted: (data) => setListGame(data.listPartners),
    onError: (index) =>
      alertErrorServer(index.networkError.result.errors[0].message),
  });
  const [getDataListItems, { loading }] = useLazyQuery(
    queryGetListPartnerProducts,
    {
      fetchPolicy: "cache-and-network",
      onCompleted: (data) => {
        setDataListItems(data);
      },
      onError: (index) =>
        alertErrorServer(index.networkError.result.errors[0].message),
    }
  );
  useEffect(() => {
    getListGame();
    getDataListItems({
      variables: {
        currentPage: currentPage,
        partnerId: partnerId,
        pageSize: pageSize,
        partnerProductName: partnerProductName,
        productName:productName
      },
    });
  }, []);
  const getProductName = (e) => {
    setPageIndex({ ...pageIndex, productName: e.target.value });
  };
  const rowSelection = {
    onChange: (selectRowsKeys, selectedRows) => {
      //   const itemsIdForDelete = selectedRows.map((val, index) => val.productId);
      //   setItemsForDelete(itemsIdForDelete);
      console.log(selectedRows);
      setDataExport(selectedRows);
    },
  };
  const goPage = (value) => {
    setPageIndex({ ...pageIndex, currentPage: value });
    getDataListItems({
      variables: {
        currentPage: currentPage,
        partnerId: partnerId,
        pageSize: pageSize,
        partnerProductName: partnerProductName,
        productName:productName
      },
    });
  };
  const onSearch = () => {
    getDataListItems({
      variables: {
        currentPage: currentPage,
        partnerId: partnerId,
        pageSize: pageSize,
        partnerProductName: partnerProductName,
        productName:productName
      },
    });
  };
  const reset = () => {
    setPageIndex({
      currentPage: 1,
      partnerId: "",
      pageSize: 10,
      partnerProductName: "",
    });
    getDataListItems({
      variables: {
        currentPage: 1,
        partnerId: "",
        pageSize: 10,
        partnerProductName: "",
        productName:""
      },
    });
  };
  const handleFilter = () => {
    getDataListItems({
      variables: {
        currentPage: currentPage,
        partnerId: partnerId,
        pageSize: pageSize,
        partnerProductName: partnerProductName,
        productName:productName
      },
    });
  };
  const handleResetFilter = () => {
    getDataListItems({
      variables: {
        currentPage: currentPage,
        partnerId: "",
        pageSize: pageSize,
        partnerProductName: "",
        productName:""
      },
    });
  };
  const columns = [
    {
      title: "Items Id",
      dataIndex: "partnerProductId",
      key: "partnerProductId",
    },
    {
      title: "Items Name",
      dataIndex: "productName",
      key: "itemName",
      // render: val => <span>{val !== null ? val.username : null}</span>
    },
    {
      title: "Price (C.coin)",
      dataIndex: "coin",
      key: "price",
    },
    {
      title: "Game",
      dataIndex: "partner",
      key: "partner",
      render: (index) => <span>{index.partnerName}</span>,
      filterDropdown: () => (
        <div style={{ padding: 8 }}>
          <Radio.Group
            onChange={(e) =>
              setPageIndex({ ...pageIndex, partnerId: e.target.value })
            }
            value={partnerId}
          >
            {printOptionsGame}
          </Radio.Group>
          <Button
            type="primary"
            onClick={handleFilter}
            size="small"
            style={{ width: 90, marginRight: 8 }}
          >
            Filter
          </Button>
          <Button
            onClick={handleResetFilter}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </div>
      ),
      filterIcon: (filtered) => (
        <Icon
          type="filter"
          theme="filled"
          style={{ color: filtered ? "#1890ff" : "#fafafa" }}
        />
      ),
    },
    {
      title: "Promotion",
      dataIndex: "discount",
      key: "promotion",
      render: (index) => <span>0</span>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (index) => <span>{index === "INPUT" ? "PENDING" : "DONE"}</span>,
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "createAt",
      width: "5%",
      render: (time) => <img src={time} width="100%" />,
    },
  ];
  const printOptionsGame = listGame.map((val, index) => (
    <Radio style={radioStyle} value={val.partnerId} key={index}>
      {val.partnerName}
    </Radio>
  ));
  if (loading) return <p>loading...</p>;
  return (
    <Row>
      <div>
        <Link to="/payment/coin">
          <Icon type="double-left" />
          Back
        </Link>
        <h2>List Items</h2>
        <div className="btn-search-listCoin">
          <div>
            <Input
              value={productName}
              placeholder="Search by Items name..."
              onChange={getProductName}
              style={{ width: "30%", marginRight: "1%" }}
              suffix={
                <Icon
                  className={
                    productName !== ""
                      ? "reset-btn-show"
                      : "reset-btn-hide"
                  }
                  type="close"
                  style={{ color: "rgba(0,0,0,.45)" }}
                  onClick={reset}
                />
              }
            />
            <Button
              style={{ width: "15%", marginRight: "2%" }}
              onClick={onSearch}
            >
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
              filename="List Items"
            >
              <ExcelSheet data={dataExport} name="History Purchase C.coin">
                <ExcelColumn label="Item Id" value="partnerProductId" />
                <ExcelColumn label="Item Name" value="productName" />
                <ExcelColumn label="Price (C.coin)" value="coin" />
                <ExcelColumn
                  label="Game"
                  value={(index) => index.partner.partnerName}
                />
                <ExcelColumn label="Promotion" value="discount" />
                <ExcelColumn label="Status" value="status" />
              </ExcelSheet>
            </ExcelFile>
          </div>
        </div>
      </div>

      {dataListItem && (
        <>
          <h3>
            Total C.coin:{" "}
            <span style={{ color: "#1890ff" }}>
              {dataListItem.listPartnerProductsByPartner.count}
            </span>
          </h3>
          <Table
            columns={columns}
            dataSource={dataListItem.listPartnerProductsByPartner.rows}
            pagination={false}
            rowSelection={rowSelection}
          />
          <Pagination
            current={pageIndex.currentPage}
            total={dataListItem.listPartnerProductsByPartner.count}
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
    listPaymentType: state.listPaymentType,
  };
}
export default connect(mapStateToProps, null)(DetailListItems);
