import React, { useState, useEffect } from "react";
import { Table, Button, Pagination, Input, Row, Col, Select } from "antd";
import {
  queryGetListCoin,
  queryGetListCharges
} from "../../../utils/queryCoin";
import { useLazyQuery } from "@apollo/react-hooks";
import { Link } from "react-router-dom";
import "../../../static/style/listProducts.css";
import ListCharges from "./listCharges";
const { Option } = Select;
function ListCoin() {
  const [pageIndex, setPageIndex] = useState({
    currentPage: 1,
    type: "",
    pageSize: 100
  });
  const [dataCoin, setDataCoin] = useState(null);
  const { currentPage, type, pageSize } = pageIndex;
  const [getDataCoin, { loading, data }] = useLazyQuery(queryGetListCoin, {
    onCompleted: data => {
      setDataCoin(data);
    }
  });
  useEffect(() => {
    getDataCoin({
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
      title: "Giá (C.coin)",
      dataIndex: "baseCoin",
      key: "baseCoin"
    },
    ,
    {
      title: "Giá (VND)",
      dataIndex: "price",
      key: "price",
      render: price => <span>{price.toLocaleString()} đ</span>
    },
    {
      title: "promo",
      dataIndex: "discount",
      key: "discount"
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      filters: [
        {
          text: "NGANLUONG",
          value: "NGANLUONG"
        },
        {
          text: "GATE",
          value: "GATE"
        },
        {
          text: "FUNCARD",
          value: "FUNCARD"
        },
        {
          text: "VCOIN",
          value: "VCOIN"
        },
        {
          text: "MOMO",
          value: "MOMO"
        },
        {
          text: "APPOTA",
          value: "APPOTA"
        }
      ],
      filterMultiple: false,
      defaultFilteredValue: ["NGANLUONG"],
      onFilter: (value, record) => record.type.includes(value)
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <span>
          <Link to={`/payment/coin/edit`}>Edit</Link>
        </span>
      )
    }
  ];
  const getValueSearch = e => {
    setPageIndex({ ...pageIndex, search: e.target.value });
  };
  const onSearch = () => {
    getDataCoin({
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
        <div className="products-title">
          <div>
            <h2>Quản lý C.coin</h2>
            <Button icon="plus">Thêm gói C.coin</Button>
          </div>
          <div className="btn-search-users">
            <Input onChange={e => getValueSearch(e)} />
            <Button onClick={onSearch}>Search</Button>
          </div>
        </div>
        {dataCoin && (
          <>
            <Table
              columns={columns}
              dataSource={dataCoin.listProductsByPaymentType.rows}
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
        <Col>
          <ListCharges />
        </Col>
      </Col>
    </Row>
  );
}

export default ListCoin;
