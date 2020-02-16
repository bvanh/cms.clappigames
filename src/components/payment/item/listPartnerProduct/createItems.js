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
import { queryGetPlatform } from "../../../../utils/queryNews";
import { queryGetPartnerProductById } from "../../../../utils/queryPartnerProducts";
import { createPartnerProduct } from "../../../../utils/mutation/partnerProductItems";
import { useLazyQuery, useMutation, useQuery } from "@apollo/react-hooks";
import { Link } from "react-router-dom";
import "../../../../static/style/listProducts.css";
const { Option } = Select;
const radioStyle = {
  display: "block",
  height: "24px",
  lineHeight: "30px"
};
function CreatePartnerItems() {
  const userName = localStorage.getItem("userNameCMS");
  const query = new URLSearchParams(window.location.search);
  const partnerProductId = query.get("partnerProductId");
  const [oldDataPartnerProduct, setOldDataPartnerProduct] = useState({
    statusBtnCancel: false,
    oldData: null
  });
  const [dataListPlatform, setListPlatform] = useState([]);
  const [dataPartnerProduct, setDataPartnerProduct] = useState({
    productName: "",
    partnerId: "",
    productId: "",
    coin: 0,
    partnerProductName: "",
    promotionId: 0,
    status: ""
  });

  const { loading, error, data } = useQuery(queryGetPlatform(), {
    onCompleted: dataPartner => {
      setListPlatform(dataPartner.listPartners);
    }
  });
  const {
    productName,
    status,
    productId,
    coin,
    partnerProductName,
    partnerId,
    promotionId
  } = dataPartnerProduct;
  const [createItem] = useMutation(createPartnerProduct, {
    variables: {
      req: {
        productName: productName,
        status: status,
        partnerId: partnerId,
        productId: productId,
        coin: Number(coin),
        partnerProductName: partnerProductName,
        promotionId: Number(promotionId)
      }
    }
  });
  const getNewInfoItem = e => {
    setDataPartnerProduct({
      ...dataPartnerProduct,
      [e.target.name]: e.target.value
    });
    setOldDataPartnerProduct({
      ...oldDataPartnerProduct,
      statusBtnCancel: false
    });
  };
  const getStatus = e => {
    setDataPartnerProduct({ ...dataPartnerProduct, status: e.target.value });
  };
  const submitCreateItem = () => {
    let result = createItem();
    result.then(val => {
      if (val) {
        alert("Tạo item thành công!");
        setOldDataPartnerProduct({
          ...oldDataPartnerProduct,
          statusBtnCancel: true
        });
      }
    });
  };
  const cancelUpdate = () => {
    setDataPartnerProduct(oldDataPartnerProduct.oldData);
  };
  function changePartnerName(value) {
    setDataPartnerProduct({ ...dataPartnerProduct, partnerId: value });
  }
  const printPlatform = dataListPlatform.map((val, index) => (
    <Option value={val.partnerId} key={index}>
      {val.partnerName}
    </Option>
  ));
  return (
    <Row>
      <Link to="/payment/items">
        <span>
          <Icon type="arrow-left" style={{ paddingRight: ".2rem" }} />
          Danh sách Items
        </span>
      </Link>
      <div className="products-title">
        <div>
          <h2>Create Item</h2>
          <div>
            <p>
              <Button
                onClick={cancelUpdate}
                disabled={oldDataPartnerProduct.statusBtnCancel}
              >
                Hủy
              </Button>
              <Button onClick={submitCreateItem}>Lưu mới C.coin</Button>
            </p>
          </div>
        </div>
      </div>
      <Row className="products-content">
        <Col md={12} className="section1">
          <div>
            <div>
              <p className="edit-product-content-title">Mã C.coin</p>
              <span>Mã tự tạo: {partnerProductId} </span>
            </div>
            <div>
              <p className="edit-product-content-title">
                Đang trong khuyến mãi?
              </p>
              <span>Mã KM: Demo </span>
            </div>
          </div>
          <div className="product-input-update">
            <div>
              <span className="edit-product-content-title">Tên Game</span>
              <Select
                value={partnerId}
                style={{ width: 120 }}
                onChange={changePartnerName}
              >
                {printPlatform}
              </Select>
              <span className="edit-product-content-title">ProductId</span>
              <Input
                value={productId}
                name="productId"
                onChange={getNewInfoItem}
              ></Input>
            </div>
            <span className="edit-product-content-title">Tên Item</span>
            <Input
              value={productName}
              name="productName"
              onChange={getNewInfoItem}
            ></Input>
            <span className="edit-product-content-title">Giá (C.coin)</span>
            <Input
              value={coin}
              type="number"
              max="9990000000"
              name="coin"
              onChange={getNewInfoItem}
            ></Input>
            <span className="edit-product-content-title">
              PartnerProductName
            </span>
            <Input
              value={partnerProductName}
              name="partnerProductName"
              onChange={getNewInfoItem}
            ></Input>
            <span className="edit-product-content-title">Mã khuyến mãi</span>
            <Input
              value={promotionId}
              type="number"
              name="promotionId"
              onChange={getNewInfoItem}
            ></Input>
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

export default CreatePartnerItems;
