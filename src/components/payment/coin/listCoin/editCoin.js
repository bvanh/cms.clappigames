import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Radio,
  Input,
  Row,
  Col,
  Select,
  Icon,
  Rate
} from "antd";

import { queryGetProductById } from "../../../../utils/queryCoin";
import { updateProduct } from "../../../../utils/mutation/productCoin";
import { useLazyQuery, useMutation } from "@apollo/react-hooks";
import { Link } from "react-router-dom";
import "../../../../static/style/listProducts.css";
const radioStyle = {
  display: "block",
  height: "24px",
  lineHeight: "30px"
};
function EditProductCoin() {
  const userName = localStorage.getItem("userNameCMS");
  const query = new URLSearchParams(window.location.search);
  const productId = query.get("productId");
  const [oldDataProduct, setOldDataProduct] = useState({
    statusBtnCancel: false,
    oldData: null
  });
  const [dataProduct, setDataProduct] = useState({
    productName: "",
    type: "",
    sort: null,
    price: null,
    status: ""
  });
  const [getData] = useLazyQuery(queryGetProductById, {
    fetchPolicy:"cache-and-network",
    onCompleted: data => {
      setDataProduct(data.listProducts[0]);
      setOldDataProduct({ ...oldDataProduct, oldData: data.listProducts[0] });
    }
  });
  useEffect(() => {
    getData({
      variables: {
        productId: productId
      }
    });
  }, []);
  const { productName, status, price, sort, type } = dataProduct;
  const [updateCoin] = useMutation(updateProduct, {
    variables: {
      productId: productId,
      req: {
        productName: productName,
        sort: sort,
        price: Number(price),
        type: type,
        status: status
      }
    }
  });
  const getNameAndPrice = e => {
    setDataProduct({ ...dataProduct, [e.target.name]: e.target.value });
    setOldDataProduct({ ...oldDataProduct, statusBtnCancel: false });
  };
  const getSort = value => {
    setDataProduct({ ...dataProduct, sort: value });
    setOldDataProduct({ ...oldDataProduct, statusBtnCancel: false });
  };
  const getStatus = e => {
    setDataProduct({ ...dataProduct, status: e.target.value });
  };
  const submitUpdateCoin = () => {
    let result = updateCoin();
    result.then(val => {
      if (val) {
        alert("update thành công!");
        setOldDataProduct({ ...oldDataProduct, statusBtnCancel: true });
      }
    });
  };
  const cancelUpdate = () => {
    setDataProduct(oldDataProduct.oldData);
  };
  if (dataProduct !== null) {
    return (
      <Row>
        <Link to="/payment/coin">
          <span>
            <Icon type="arrow-left" style={{ paddingRight: ".2rem" }} />
            Danh sách Coin
          </span>
        </Link>
        <div className="products-title">
          <div>
            <h2>Update C.coin</h2>
            <div>
              <p>
                <Button
                  onClick={cancelUpdate}
                  disabled={oldDataProduct.statusBtnCancel}
                >
                  Hủy
                </Button>
                <Button onClick={submitUpdateCoin}>Lưu mới C.coin</Button>
              </p>
            </div>
          </div>
        </div>
        <Row className="products-content">
          <Col md={12} className="section1">
            <div>
              <div>
                <p className="edit-product-content-title">Mã C.coin</p>
                <span>Mã tự tạo: {productId} </span>
              </div>
              <div>
                <p className="edit-product-content-title">
                  Đang trong khuyến mãi?
                </p>
                <span>Mã KM: Demo </span>
              </div>
            </div>
            <div className="product-input-update">
              <span className="edit-product-content-title">Tên C.coin</span>
              <Input
                value={productName}
                name="productName"
                onChange={getNameAndPrice}
              ></Input>
              <span className="edit-product-content-title">Giá (VNĐ)</span>
              <Input
                value={price}
                type="number"
                max="9990000000"
                name="price"
                onChange={getNameAndPrice}
              ></Input>
              <span className="edit-product-content-title">Thứ tự ưu tiên</span>
              <Rate value={sort} count={10} onChange={getSort} />
            </div>
          </Col>
          <Col md={8} className="section2">
            <div>
              <p className="edit-product-content-title">Trạng thái</p>
              <Radio.Group value={status} onChange={getStatus}>
                <Radio style={radioStyle} value="INPUT">
                  INPUT
                </Radio>
                <Radio style={radioStyle} value="COMPLETE">
                  COMPLETE
                </Radio>
                <Radio style={radioStyle} value="DELETED">
                  DELETED
                </Radio>
              </Radio.Group>
            </div>
            <div style={{ marginTop: "1rem" }}>
              <p className="edit-product-content-title">Khởi tạo</p>
              <span>
                Người tạo: <span>{userName}</span>
              </span>
            </div>
          </Col>
        </Row>
      </Row>
    );
  }
  return <p>Loading...</p>;
}

export default EditProductCoin;
