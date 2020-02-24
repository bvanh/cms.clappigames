import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Pagination,
  Input,
  Row,
  Col,
  Icon,
  Select,
  Radio
} from "antd";
import { queryGetPaymentType } from "../../../../utils/queryPaymentType";
import { queryGetListCoin } from "../../../../utils/queryCoin";
import { useLazyQuery, useMutation, useQuery } from "@apollo/react-hooks";
import { Link } from "react-router-dom";
import "../../../../static/style/listProducts.css";
import ListCharges from "../listCharges/listCharges";
import CreateProductCoin from "../listCoin/addnewCoin";
import { deleteCoinProduct } from "../../../../utils/mutation/productCoin";
import { fromPromise } from "apollo-boost";
const radioStyle = {
  display: "block",
  height: "30px",
  lineHeight: "30px"
};
function ListCoin(props) {
  const [pageIndex, setPageIndex] = useState({
    currentPage: 1,
    type: "",
    pageSize: 100,
    listTypePayment: []
  });
  const [isCreateCoin, setIsCreateCoin] = useState(false);
  const [dataCoin, setDataCoin] = useState(null);
  const [itemsForDelete, setItemsForDelete] = useState([]);
  const { currentPage, type, pageSize,listTypePayment } = pageIndex;
  const [getDataCoin, { loading, refetch }] = useLazyQuery(queryGetListCoin, {
    fetchPolicy: "cache-and-network",
    onCompleted: data => {
      setDataCoin(data);
    }
  });
  const { data } = useQuery(queryGetPaymentType, {
    onCompleted: data => {
      setPageIndex({ ...pageIndex, listTypePayment: data.__type.enumValues });
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
  const setValueTypePayment = e => {
    setPageIndex({ ...pageIndex, type: e.target.value });
  };
  const handleFilter = () => {
    getDataCoin({
      variables: {
        currentPage: currentPage,
        type: type,
        pageSize: pageSize
        // search: search
      }
    });
  };

  const handleResetFilter = () => {
    getDataCoin({
      variables: {
        currentPage: currentPage,
        type: "",
        pageSize: pageSize
        // search: search
      }
    });
  };
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
      filterDropdown: () => (
        <div style={{ padding: 8 }}>
          <Radio.Group onChange={setValueTypePayment} value={type}>
            {printOptionsType}
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
      filterIcon: filtered => (
        <Icon
          type="filter"
          theme="filled"
          style={{ color: filtered ? "#1890ff" : "#fafafa" }}
        />
      )
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
  const submitDeleteProduct = async () => {
    const demo = await deleteProduct();
    refetch();
  };
  const printOptionsType = listTypePayment.map((val, index) => (
    <Radio style={radioStyle} value={val.name} key={index}>
      {val.name}
    </Radio>
  ));
  const hasSelected = itemsForDelete.length > 0;
  if (loading) return "Loading...";
  if (isCreateCoin)
    return <CreateProductCoin setIsCreateCoin={setIsCreateCoin} data={data} />;
  if (isCreateCoin === false)
    return (
      <Row>
        <Col md={12}>
          <div className="products-title">
            <div>
              <h2>Quản lý C.coin</h2>
              <Link to="/payment/coin" onClick={() => setIsCreateCoin(true)}>
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
          <Col>{/* <ListCharges /> */}</Col>
        </Col>
      </Row>
    );
}

export default ListCoin;
