import React, { useState, useEffect } from "react";
import { Table, Button, Pagination, Input, Row, Col } from "antd";
import { queryGetListProducts } from "../../../utils/queryProducts";
import { useLazyQuery } from "@apollo/react-hooks";
import { Link } from "react-router-dom";
// import "../../static/style/listUsers.css";

function ListItems() {
  const [pageIndex, setPageIndex] = useState({
    currentPage: 1,
    type: "",
    pageSize: 10
  });
  const [dataProducts, setData] = useState(null);
  const { currentPage, type, pageSize } = pageIndex;
  const [getData, { loading, data }] = useLazyQuery(queryGetListProducts, {
    onCompleted: data => {
      setData(data);
      console.log("fsffsff");
    }
  });
  useEffect(() => {
    getData({
      variables: {
        currentPage: currentPage,
        type: type,
        pageSize: pageSize
        // search: search
      }
    });
  }, []);
  const columns = [
    {
      title: "Id",
      dataIndex: "productId",
      key: "productId"
    },
    {
      title: "Name",
      dataIndex: "productName",
      key: "productName"
    },
    {
      title: "Giá (C.coin)",
      dataIndex: "baseCoin",
      key: "baseCoin"
    },
    {
      title: "promo",
      dataIndex: "discount",
      key: "discount"
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type"
    }
    // {
    //   title: "Action",
    //   key: "action",

    //   render: (text, record) => (
    //     <span>
    //       <Link to={`users/detail?userId=${record.userId}`}>Chi tiết</Link>
    //     </span>
    //   )
    // }
  ];
  //   const goPage = pageNumber => {
  //     setPageIndex({ ...pageIndex, currentPage: pageNumber });
  //     getData({
  //       variables: {
  //         currentPage: pageNumber,
  //         type: type,
  //         pageSize: pageSize
  //         // search: search
  //       }
  //     });
  //   };
  const getValueSearch = e => {
    setPageIndex({ ...pageIndex, search: e.target.value });
  };
  const onSearch = () => {
    getData({
      variables: {
        currentPage: currentPage,
        type: type,
        pageSize: pageSize
        // search: search
      }
    });
  };
  if (loading) return "Loading...";
  return (
    <Row>
      <Col md={12}>
        <div className="title">
          <h2>Quản lý Item</h2>
          <div className="btn-search-users">
            <Input onChange={e => getValueSearch(e)} />
            <Button onClick={onSearch}>Search</Button>
          </div>
        </div>
        {dataProducts && (
          <>
            <Table
              columns={columns}
              dataSource={dataProducts.listProductsByPaymentType.rows}
              pagination={false}
            />
            {/* <Pagination
            current={pageIndex.currentPage}
            total={dataProducts.listProductsByPaymentType.count}
            pageSize={10}
            onChange={goPage}
            className="pagination-listUser"
          /> */}
          </>
        )}
      </Col>
      <Col md={12}>
        <Col>Xu hướng mua Item</Col>
        <Col></Col>
      </Col>
    </Row>
  );
}

export default ListItems;
