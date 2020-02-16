import React, { useState, useEffect } from "react";
import { Table, Button, Pagination, Input, Row, Col, Select } from "antd";
import { queryGetListCoin } from "../../../../utils/queryCoin";
import { useLazyQuery, useMutation } from "@apollo/react-hooks";
import { Link } from "react-router-dom";
import "../../../../static/style/listProducts.css";
import ListCharges from "../listCharges/listCharges";
import CreateProductCoin from "../listCoin/addnewCoin";
import { deleteCoinProduct } from "../../../../utils/mutation/productCoin";
import { fromPromise } from "apollo-boost";
function ListCoin(props) {
  const [pageIndex, setPageIndex] = useState({
    currentPage: 1,
    type: "",
    pageSize: 100
  });
  const [isCreateCoin, setIsCreateCoin] = useState(false);
  const [dataCoin, setDataCoin] = useState(null);
  const [itemsForDelete, setItemsForDelete] = useState([]);
  const { currentPage, type, pageSize } = pageIndex;
  const [getDataCoin, { loading, data ,refetch }] = useLazyQuery(queryGetListCoin, {
    onCompleted: data => {
      setDataCoin(data);
    }
  });
  const [deleteProduct] = useMutation(deleteCoinProduct, {
    variables: {
      ids: itemsForDelete
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
      title: "C.coin",
      dataIndex: "productName",
      key: "productName"
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
          <Link to={`/payment/coin/edit?productId=${record.productId}`}>
            Edit
          </Link>
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
  const rowSelection = {
    onChange: (selectRowsKeys, selectedRows) => {
      const itemsIdForDelete = selectedRows.map((val, index) => val.productId);
      setItemsForDelete(itemsIdForDelete);
    }
  };
  const submitDeleteProduct = async() => {
    const demo =  await deleteProduct();
    refetch();
    console.log(demo);
  };
  const hasSelected = itemsForDelete.length > 0;
  if (loading) return "Loading...";
  if (isCreateCoin) return <CreateProductCoin setIsCreateCoin={setIsCreateCoin} />;
  if (isCreateCoin === false)
    return (
      <Row>
        <Col md={12}>
          <div className="products-title">
            <div>
              <h2>Quản lý C.coin</h2>
              <Link
                to="/payment/coin/addnew"
                onClick={() => setIsCreateCoin(true)}
              >
                <Button icon="plus">Thêm gói C.coin</Button>
              </Link>
            </div>
            <div className="btn-search-users">
              <Button disabled={!hasSelected} onClick={submitDeleteProduct}>
                Delete
              </Button>
              <Input onChange={e => getValueSearch(e)} />
              <Button onClick={onSearch}>Search</Button>
            </div>
          </div>
          {dataCoin && (
            <>
              <Table
                rowSelection={rowSelection}
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
