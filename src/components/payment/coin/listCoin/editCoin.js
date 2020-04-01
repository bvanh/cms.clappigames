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
import {
  dispatchShowImagesNews,
  dispatchSetUrlImageThumbnail
} from "../../../../redux/actions/index";
import ListImagesForNews from "../../../news/modalImageUrl/imgsUrl";  
import { queryGetPaymentType } from "../../../../utils/queryPaymentAndPromoType";
import { queryGetProductById } from "../../../../utils/queryCoin";
import { updateProduct } from "../../../../utils/mutation/productCoin";
import { useLazyQuery, useMutation, useQuery } from "@apollo/react-hooks";
import {connect} from 'react-redux'
import { Link } from "react-router-dom";
import "../../../../static/style/listProducts.css";
const { Option } = Select;
const radioStyle = {
  display: "block",
  height: "24px",
  lineHeight: "30px"
};
function EditProductCoin(props) {
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
    status: "",
    image: ""
  });
  const [paymentType, setPaymentType] = useState([{ name: "" }])
  const [getData] = useLazyQuery(queryGetProductById, {
    fetchPolicy: "cache-and-network",
    onCompleted: data => {
      setDataProduct(data.listProducts[0]);
      setOldDataProduct({ ...oldDataProduct, oldData: data.listProducts[0] });
    }
  });
  const { data } = useQuery(queryGetPaymentType, {
    onCompleted: data => {
      setPaymentType(data.__type.enumValues);
    }
  });
  useEffect(() => {
    getData({
      variables: {
        productId: productId
      }
    });
  }, []);
  const { productName, status, price, sort, type, image } = dataProduct;
  const [updateCoin] = useMutation(updateProduct, {
    variables: {
      productId: productId,
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
  const getType = val => {
    setDataProduct({ ...dataProduct, type: val });
  };
  const getNameAndPriceAndSort = e => {
    setDataProduct({ ...dataProduct, [e.target.name]: e.target.value });
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
  const printPaymentTypes = paymentType.map((val, index) => (
    <Option value={val.name} key={index}>
      {val.name}
    </Option>
  ));
  if (dataProduct !== null) {
    return (
      <Row>
        <Link to="/payment/coin">
          <span>
            <Icon type="arrow-left" style={{ paddingRight: ".2rem" }} />
            Back
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
                  style={{marginRight:".5rem"}}
                >
                  Cancel
                </Button>
                <Button onClick={submitUpdateCoin}>Update C.coin</Button>
              </p>
            </div>
          </div>
        </div>
        <Row className="products-content">
          <Col md={12} className="section1">
            <div>
              <div>
                <p className="edit-product-content-title">C.coin Id</p>
                <span>Id: {productId} </span>
              </div>
            </div>
            <div className="product-input-update">
              <span className="edit-product-content-title">C.coin name</span>
              <Input
                value={productName}
                name="productName"
                onChange={getNameAndPriceAndSort}
              ></Input>
              <span className="edit-product-content-title">Price (VNĐ)</span>
              <Input
                value={price}
                type="number"
                max="9990000000"
                name="price"
                onChange={getNameAndPriceAndSort}
              ></Input>
              <div>
                <Col>
                  <span className="edit-product-content-title">Sort</span>
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
                <a onClick={() => dispatchShowImagesNews(true)}>Select</a>
              </div>
            </div>
          </Col>
          <Col md={6} className="section2">
            <div>
              <p className="edit-product-content-title">Status</p>
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
  return <p>Loading...</p>;
}
function mapStateToProps(state) {
  return {
    visible: state.visibleModalNews,
    urlImgThumbnail: state.urlImgThumbnail
  };
}
export default connect(mapStateToProps, null)(EditProductCoin);
