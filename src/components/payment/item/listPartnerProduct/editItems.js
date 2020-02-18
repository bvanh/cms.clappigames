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
import {
  queryGetPartnerProductById,
  queryGetRefPartnerProducts
} from "../../../../utils/queryPartnerProducts";
import { updatePartnerProductItem } from "../../../../utils/mutation/partnerProductItems";
import { useLazyQuery, useMutation, useQuery } from "@apollo/react-hooks";
import { Link } from "react-router-dom";
import "../../../../static/style/listProducts.css";
const { Option } = Select;
const radioStyle = {
  display: "block",
  height: "24px",
  lineHeight: "30px"
};
function EditPartnerProductItem() {
  const userName = localStorage.getItem("userNameCMS");
  const query = new URLSearchParams(window.location.search);
  const partnerProductId = query.get("partnerProductId");
  const [oldDataPartnerProduct, setOldDataPartnerProduct] = useState({
    statusBtnCancel: false,
    oldData: null
  });
  const [dataListPlatform, setListPlatform] = useState([]);
  const [dataListRefProduct, setListRefProduct] = useState([]);
  const [dataPartnerProduct, setDataPartnerProduct] = useState({
    productName: "",
    partnerId: "",
    productId: "",
    coin: 0,
    partnerProductName: "",
    promotionId: 0,
    status: ""
  });
  useQuery(queryGetPlatform(), {
    onCompleted: dataPartner => {
      setListPlatform(dataPartner.listPartners);
    }
  });
  const { data, loading, error, refetch } = useQuery(
    queryGetPartnerProductById,
    {
      variables: {
        partnerProductId: partnerProductId
      },
      onCompleted: data => {
        setDataPartnerProduct(data.listPartnerProducts[0]);
        setOldDataPartnerProduct({
          ...oldDataPartnerProduct,
          oldData: data.listPartnerProducts[0]
        });
      }
    }
  );
  const {
    productName,
    status,
    productId,
    coin,
    partnerProductName,
    partnerId,
    promotionId
  } = dataPartnerProduct;
  const [getRefPartnerProduct] = useLazyQuery(
    queryGetRefPartnerProducts(partnerId),
    {
      onCompleted: data => {
        setListRefProduct(data.listRefPartnerProducts);
      }
    }
  );
  useEffect(() => {
    getRefPartnerProduct();
  }, []);
  const [updateCoin] = useMutation(updatePartnerProductItem, {
    variables: {
      partnerProductId: partnerProductId,
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
  const submitUpdateCoin = () => {
    let result = updateCoin();
    result.then(val => {
      if (val) {
        alert("update thành công!");
        refetch();
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
  const changePartnerProductName = async val => {
    await setDataPartnerProduct({
      ...dataPartnerProduct,
      partnerProductName: JSON.parse(val).productName,
      productId: JSON.parse(val).productId
    });
  };
  const printPlatform = dataListPlatform.map((val, index) => (
    <Option value={val.partnerId} key={index}>
      {val.partnerName}
    </Option>
  ));
  const printRefProduct = dataListRefProduct.map(function(val, index) {
    if (index = 0) {
      return (
        <Option
          value={`{"productId":"${productId}","productName":"${partnerProductName}"}`}
          key={index}
        >
          {partnerProductName}
        </Option>
      );
    } else {
      return (
        <Option
          value={`{"productId":"${val.productId}","productName":"${val.productName}"}`}
          key={index}
        >
          {val.productName}
        </Option>
      );
    }
  });
  if (dataPartnerProduct !== null) {
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
            <h2>Update Item</h2>
            <div>
              <p>
                <Button
                  onClick={cancelUpdate}
                  disabled={oldDataPartnerProduct.statusBtnCancel}
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
                <span className="edit-product-content-title">
                  ProductIdAndName
                </span>
                <Select
                  value={
                    dataListRefProduct.length === 0
                      ? ""
                      : `{"productId":"${productId}","productName":"${partnerProductName}"}`
                  }
                  style={{ width: "100%", marginTop: "0" }}
                  onChange={changePartnerProductName}
                  disabled={dataListRefProduct.length === 0 ? true : false}
                >
                  {printRefProduct}
                </Select>
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

export default EditPartnerProductItem;
