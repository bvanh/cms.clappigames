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
import { queryGetPaymentType } from "../../../../utils/queryPaymentAndPromoType";
import { queryGetListCoin } from "../../../../utils/queryCoin";
import { useLazyQuery, useMutation, useQuery } from "@apollo/react-hooks";
import { Link } from "react-router-dom";
import "../../../../static/style/listProducts.css";
import { convertPaymentType } from '../service'
import { alertErrorServer } from '../../../../utils/alertErrorAll'
import { dispatchSetListPaymentType, dispatchTypeEventByMoney } from '../../../../redux/actions/index'
import { deleteCoinProduct } from "../../../../utils/mutation/productCoin";
const radioStyle = {
  display: "block",
  height: "30px",
  lineHeight: "30px"
};
function ListCoin(props) {
  const [pageIndex, setPageIndex] = useState({
    currentPage: 1,
    type: "",
    pageSize: 10,
    productName: "",
    listTypePayment: [{ name: "", description: "" }]
  });
  const [dataCoin, setDataCoin] = useState(null);
  const [itemsForDelete, setItemsForDelete] = useState([]);
  const {
    currentPage,
    type,
    pageSize,
    listTypePayment,
    productName
  } = pageIndex;
  const [getDataCoin, { loading, refetch }] = useLazyQuery(queryGetListCoin, {
    fetchPolicy: "cache-and-network",
    onCompleted: data => {
      console.log(data)
      setDataCoin(data);
    },
    onError: index => alertErrorServer(index.message)
  });
  const { data } = useQuery(queryGetPaymentType, {
    onCompleted: data => {
      console.log(data)
      setPageIndex({ ...pageIndex, listTypePayment: data.__type.enumValues });
      dispatchSetListPaymentType(data.__type.enumValues);
    },
    onError: index => alertErrorServer(index.message)
  });
  useEffect(() => {
    getDataCoin({
      variables: {
        currentPage: currentPage,
        type: type,
        pageSize: pageSize,
        productName: productName
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
        pageSize: pageSize,
        productName: productName
      }
    });
  };

  const handleResetFilter = () => {
    getDataCoin({
      variables: {
        currentPage: currentPage,
        type: "",
        pageSize: pageSize,
        productName: productName
      }
    });
  };
  // console.log(convertPaymentType(listTypePayment,"GA"))
  // eslint-disable-next-line no-sparse-arrays
  const columns = [
    {
      title: "C.coin Name",
      dataIndex: "productName",
      key: "productName",
      width: "25%",
      render: (text, record) => (
        <span>
          <Link to={`/payment/coin/edit?productId=${record.productId}`}>
            {text}
          </Link>
        </span>
      )
    },
    ,
    {
      title: "Price (VND)",
      dataIndex: "price",
      key: "price",
      render: price => <span>{price.toLocaleString()} đ</span>,
      width: "25%"
    },
    {
      title: "Promotion",
      dataIndex: "discount",
      key: "discount",
      width: "15%"
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      width: "20%",
      render: index => <span>{convertPaymentType(listTypePayment, index)}</span>,
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
      title: "Image",
      dataIndex: "image",
      key: "img",
      width: "15%",
      render: index => <img src={index} width='100%' />
    }
  ];
  const printOptionsType = listTypePayment.map((val, index) => (
    <Radio style={radioStyle} value={val.name} key={index}>
      {val.name}
    </Radio>
  ));
  return (
    <>
      <div className="products-title">
        <div>
          <h2>C.coin managerment</h2>
          <div className="view-more">
          <Link className="btn-view-more" to="/payment/coin/detail">
              Detail <Icon type="double-right" />
            </Link>
            <Link
              to="/payment/coin"
              onClick={() => props.setIsCreateCoin(true)}
            >
              <Button icon="plus">Add new C.coin package</Button>
            </Link>
            {/* <Button
              disabled={!hasSelected}
              onClick={submitDeleteProduct}
              style={{ marginLeft: ".25rem" }}
            >
              Delete
            </Button> */}
          </div>
        </div>
      </div>
      {dataCoin && (
        <>
          <Table
            // rowSelection={rowSelection}
            columns={columns}
            dataSource={dataCoin.listProductsByPaymentType.rows}
            pagination={false}
          />
        </>
      )}
    </>
  );
}

export default ListCoin;
