import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Radio,
  Input,
  Row,
  Col,
  Icon,
  Modal,
  Select
} from "antd";
import {
  dispatchShowImagesNews,
  dispatchSetUrlImageThumbnail
} from "../../../../redux/actions/index";
import ListImagesForNews from "../../../news/modalImageUrl/imgsUrl";
import { connect } from "react-redux";
import { queryGetPaymentType } from "../../../../utils/queryPaymentAndPromoType";
import { createProduct } from "../../../../utils/mutation/productCoin";
import { useLazyQuery, useMutation, useQuery } from "@apollo/react-hooks";
import { Link } from "react-router-dom";
import "../../../../static/style/listProducts.css";

const { Option } = Select;
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
    oldData: {
      productName: "",
      type: "",
      sort: null,
      price: null,
      status: "INPUT"
    }
  });
  const [dataProduct, setDataProduct] = useState({
    productName: "",
    type: "",
    sort: null,
    price: null,
    status: "INPUT"
  });
  useEffect(() => {
    dispatchSetUrlImageThumbnail(null);
  }, []);
  const { productName, status, price, sort, type } = dataProduct;
  const [createCoin] = useMutation(createProduct, {
    variables: {
      req: {
        productName: productName,
        sort: Number(sort),
        price: Number(price),
        baseCoin: Number(price),
        type: type,
        status: status,
        image: props.urlImgThumbnail
      }
    }
  });
  const checkStatusData = () => {
    if (
      productName !== "" &&
      type !== "" &&
      sort !== null &&
      price !== null &&
      status !== ""
    ) {
      return false;
    } else {
      return true;
    }
  };
  const getNameAndPriceAndSort = e => {
    setDataProduct({ ...dataProduct, [e.target.name]: e.target.value });
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
  const getType = val => {
    setDataProduct({ ...dataProduct, type: val });
  };
  const { enumValues } = props.data.__type;
  const printPaymentTypes = enumValues.map((val, index) => (
    <Option value={val.name} key={index}>
      {val.name}
    </Option>
  ));

  const showConfirm = () => {
    Modal.confirm({
      title: "Do you want to countinue creating a new C.coin package?",
      okText:"Back",
      cancelText:"Next",
      onOk() {
        props.setIsCreateCoin(false);
      },
      onCancel() {
        console.log("Cancel");
      }
    });
  };
  return (
    <Row>
      <Link to="/payment/coin" onClick={showConfirm}>
        <span>
          <Icon type="arrow-left" style={{ paddingRight: ".2rem" }} />
          Back
        </span>
      </Link>
      <div className="products-title">
        <div>
          <h2>Create new C.coin</h2>
          <div>
            <p>
              <Button
                onClick={showConfirm}
                disabled={oldDataProduct.statusBtnCancel}
                style={{marginRight:".5rem"}}
              >
                Cancel
              </Button>
              <Button onClick={submitUpdateCoin} disabled={checkStatusData()}>
                Create C.coin
              </Button>
            </p>
          </div>
        </div>
      </div>
      <Row className="products-content">
        <Col md={12} className="section1-listcoin">
          <div>
            <div>
              <p className="edit-product-content-title">C.coin Id</p>
              <span>Id: AUTO </span>
            </div>
          </div>
          <div className="product-input-update">
            <span className="edit-product-content-title">C.coin name</span>
            <Input
              name="productName"
              onChange={getNameAndPriceAndSort}
              value={productName}
            ></Input>
            <span className="edit-product-content-title">Price (VNĐ)</span>
            <Input
              type="number"
              max="9990000000"
              name="price"
              onChange={getNameAndPriceAndSort}
              value={price}
            ></Input>
            <div>
              <Col>
                <span className="edit-product-content-title">
                  Sort
                </span>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Input
                    style={{ width: "4rem" }}
                    type="number"
                    max="10"
                    min="1"
                    name="sort"
                    onChange={getNameAndPriceAndSort}
                    value={sort}
                  ></Input>
                  <span style={{ paddingLeft: ".2rem" }}>/10</span>
                </div>
              </Col>
            </div>
            <div>
              <span className="edit-product-content-title">Image</span>
            </div>
            <div style={{ width: "100px" }}>
              <img src={props.urlImgThumbnail} width="100%" />
            </div>
            <div>
              <a onClick={() => dispatchShowImagesNews(true)}>Image</a>
            </div>
          </div>
        </Col>
        <Col md={6} className="section2">
          <div>
            <p className="edit-product-content-title">Status</p>
            <Radio.Group
              onChange={getStatusAndType}
              name="status"
              value={status}
            >
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
            <p className="edit-product-content-title">Create</p>
            <span>
              Admin: <span>{userName}</span>
            </span>
          </div>
        </Col>
        <Col md={6} className="section2">
          <div>
            <p className="edit-product-content-title">Payment Type</p>
            <Select value={type} style={{ width: "100%" }} onChange={getType}>
              {printPaymentTypes}
            </Select>
          </div>
        </Col>
        <ListImagesForNews isThumbnail={true} />
      </Row>
    </Row>
  );
}
function mapStateToProps(state) {
  return {
    visible: state.visibleModalNews,
    urlImgThumbnail: state.urlImgThumbnail
  };
}
export default connect(mapStateToProps, null)(CreateProductCoin);
