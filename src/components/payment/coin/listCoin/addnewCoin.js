import React, { useState, useEffect } from "react";
import { Table, Button, Radio, Input, Row, Col, Icon, Rate } from "antd";

import { queryGetPaymentType } from "../../../../utils/queryPaymentType";
import { createProduct } from "../../../../utils/mutation/productCoin";
import { useLazyQuery, useMutation, useQuery } from "@apollo/react-hooks";
import { Link } from "react-router-dom";
import "../../../../static/style/listProducts.css";
const radioStyle = {
  display: "block",
  height: "24px",
  lineHeight: "30px"
};
function CreateProductCoin(props) {
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
  const { productName, status, price, sort, type } = dataProduct;
  const { data } = useQuery(queryGetPaymentType);
  const [createCoin] = useMutation(createProduct, {
    variables: {
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
  const getStatusAndType = e => {
    setDataProduct({ ...dataProduct, [e.target.name]: e.target.value });
  };
  const submitUpdateCoin = () => {
    let result = createCoin();
    result.then(val => {
      if (val) {
        alert("tạo mới c.coin thành công!");
        setOldDataProduct({ ...oldDataProduct, statusBtnCancel: true });
      }
    });
  };
  const cancelUpdate = () => {
    setDataProduct(oldDataProduct.oldData);
  };
  if (data && data.__type) {
    const printPaymentTypes = data.__type.enumValues.map((val, index) => (
      <Radio value={val.name}>{val.name}</Radio>
    ));
    return (
      <Row>
        <Link to="/payment/coin" onClick={()=>props.setIsCreateCoin(false)}>
          <span>
            <Icon type="arrow-left" style={{ paddingRight: ".2rem" }} />
            Danh sách Coin
          </span>
        </Link>
        <div className="products-title">
          <div>
            <h2>Tạo mới C.coin</h2>
            <div>
              <p>
                <Button
                  onClick={cancelUpdate}
                  disabled={oldDataProduct.statusBtnCancel}
                >
                  Hủy
                </Button>
                <Button onClick={submitUpdateCoin}>Tạo mới C.coin</Button>
              </p>
            </div>
          </div>
        </div>
        <Row className="products-content">
          <Col md={12} className="section1">
            <div>
              <div>
                <p className="edit-product-content-title">Mã C.coin</p>
                <span>Mã tự tạo: AUTO </span>
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
              <Input name="productName" onChange={getNameAndPrice}></Input>
              <span className="edit-product-content-title">Giá (VNĐ)</span>
              <Input
                type="number"
                max="9990000000"
                name="price"
                onChange={getNameAndPrice}
              ></Input>
              <div>
                <Col>
                  <span className="edit-product-content-title">
                    Thứ tự ưu tiên
                  </span>
                  <Rate count={10} onChange={getSort} value={sort} />
                </Col>
                <Col>
                  <span className="edit-product-content-title"style={{marginTop:'5px'}}>
                    Kiểu thanh toán
                  </span>
                  <Radio.Group name="type" onChange={getStatusAndType}>
                    {printPaymentTypes}
                  </Radio.Group>
                </Col>
              </div>
            </div>
          </Col>
          <Col md={8} className="section2">
            <div>
              <p className="edit-product-content-title">Trạng thái</p>
              <Radio.Group onChange={getStatusAndType} name="status">
                <Radio style={radioStyle} value="INPUT">
                  INPUT
                </Radio>
                <Radio style={radioStyle} value="COMPLETE">
                  COMPLETE
                </Radio>
                <Radio style={radioStyle} value="DELETE">
                  DELETE
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
  return <p>Loading...</p>
}

export default CreateProductCoin;
