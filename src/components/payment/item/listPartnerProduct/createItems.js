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
import { queryGetRefPartnerProducts } from "../../../../utils/queryPartnerProducts";
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
function CreatePartnerItems(props) {
  const userName = localStorage.getItem("userNameCMS");
  const query = new URLSearchParams(window.location.search);
  const partnerProductId = query.get("partnerProductId");
  const [oldDataPartnerProduct, setOldDataPartnerProduct] = useState({
    statusBtnCancel: false,
    oldData: {
      productName: "",
      partnerId: "",
      productId: "",
      coin: "",
      partnerProductName: "",
      promotionId: "",
      status: ""
    }
  });
  const [dataListPlatform, setListPlatform] = useState([]);
  const [dataListRefProduct, setListRefProduct] = useState([]);
  const [dataPartnerProduct, setDataPartnerProduct] = useState({
    productName: "",
    partnerId: "",
    productId: "",
    coin: "",
    partnerProductName: "",
    promotionId: "",
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
  const [getRefPartnerProduct] = useLazyQuery(
    queryGetRefPartnerProducts(partnerId),
    {
      onCompleted: data => {
        setListRefProduct(data.listRefPartnerProducts);
      }
    }
  );
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
        setDataPartnerProduct(oldDataPartnerProduct.oldData);
      }
    });
  };
  const cancelUpdate = () => {
    setDataPartnerProduct(oldDataPartnerProduct.oldData);
  };
  const changePartnerProductName = async val => {
    await setDataPartnerProduct({
      ...dataPartnerProduct,
      partnerProductName: JSON.parse(val).productName,
      productId: JSON.parse(val).productId
    });
  };
  async function changePartnerName(val) {
    await setDataPartnerProduct({ ...dataPartnerProduct, partnerId: val });
    getRefPartnerProduct();
  }
  const printPlatform = dataListPlatform.map((val, index) => (
    <Option value={val.partnerId} key={index}>
      {val.partnerName}
    </Option>
  ));
  const printRefProduct = dataListRefProduct.map(function(val, index) {
    if (index <= 0) {
      return null;
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
  return (
    <Row>
      <Link to="/payment/items" onClick={() => props.setIsCreateItem(false)}>
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
                style={{marginRight:".5rem"}}
              >
                Hủy
              </Button>
              <Button
                onClick={submitCreateItem}
                disabled={
                  productName === "" ||
                  partnerId === "" ||
                  productId === "" ||
                  coin === "" ||
                  partnerProductName === "" ||
                  promotionId === 0 ||
                  status === ""
                    ? true
                    : false
                }
              >
                Thêm mới C.coin
              </Button>
            </p>
          </div>
        </div>
      </div>
      <Row className="products-content">
        <Col md={12} className="section1-listcoin">
          <div>
            <div>
              <p className="edit-product-content-title">Mã C.coin</p>
              <span>Mã tự tạo: {partnerProductId} </span>
            </div>
          </div>
          <div className="product-input-update">
              <span className="edit-product-content-title">Tên Game</span>
              <Select
                value={partnerId}
                style={{ width: '100%' }}
                onChange={changePartnerName}
              >
                {printPlatform}
              </Select>       
            <span className="edit-product-content-title">ProductIdAndName</span>
            <Select
              value={
                productId === ""
                  ? null
                  : `{"productId":"${productId}","productName":"${partnerProductName}"}`
              }
              style={{ width: "100%", marginTop: "0" }}
              onChange={changePartnerProductName}
              disabled={dataListRefProduct.length === 0 ? true : false}
            >
              {printRefProduct}
            </Select>
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
            {/*<span className="edit-product-content-title">Mã khuyến mãi</span>
            <Input
              value={promotionId}
              type="number"
              name="promotionId"
              onChange={getNewInfoItem}
            ></Input>*/}
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
