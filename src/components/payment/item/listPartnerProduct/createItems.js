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
  Modal,
} from "antd";
import {
  dispatchShowImagesNews,
  dispatchSetUrlImageThumbnail,
} from "../../../../redux/actions/index";
import { connect } from "react-redux";
import { alertErrorServer } from "../../../../utils/alertErrorAll";
import ListImagesForNews from "../../../news/modalImageUrl/imgsUrl";
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
  lineHeight: "30px",
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
      status: "",
      prefix: "",
      appleId: "",
      googleId: ""
    },
  });
  const [dataListPlatform, setListPlatform] = useState([]);
  const [dataListRefProduct, setListRefProduct] = useState([]);
  const [dataPartnerProduct, setDataPartnerProduct] = useState({
    productName: "",
    partnerId: "",
    productId: "",
    coin: "",
    partnerProductName: "",
    // promotionId: "",
    status: "",
    prefix: "",
    appleId: "",
    googleId: ""
  });

  useEffect(() => {
    dispatchSetUrlImageThumbnail(null);
  }, []);
  const { loading, error, data } = useQuery(queryGetPlatform(), {
    onCompleted: (dataPartner) => {
      setListPlatform(dataPartner.listPartners);
    },
    onError: (index) =>
      alertErrorServer(index.networkError.result.errors[0].message),
  });
  const {
    productName,
    status,
    productId,
    coin,
    partnerProductName,
    partnerId,
    prefix,
    appleId,
    googleId
    // promotionId
  } = dataPartnerProduct;
  const [getRefPartnerProduct] = useLazyQuery(queryGetRefPartnerProducts, {
    fetchPolicy: 'cache-and-network',
    variables: {
      partnerId: partnerId,
    },
    onCompleted: (data) => {
      console.log(data)
      setListRefProduct(data.listRefPartnerProducts);
    },
    onError: (index) => {
       alertErrorServer(index.networkError.result.errors[0].message)
    }
    ,
  });
  const [createItem] = useMutation(createPartnerProduct, {
    variables: {
      req: {
        productName: productName,
        status: status,
        partnerId: partnerId,
        productId: productId,
        coin: Number(coin),
        partnerProductName: partnerProductName,
        // promotionId: Number(promotionId),
        image: props.urlImgThumbnail,
        prefix: prefix,
        appleId: appleId,
        googleId: googleId
      },
    },
    onError: (index) =>
      console.log(index)
    // alertErrorServer(index.networkError.result.errors[0].message),
  });
  const getNewInfoItem = (e) => {
    setDataPartnerProduct({
      ...dataPartnerProduct,
      [e.target.name]: e.target.value,
    });
    setOldDataPartnerProduct({
      ...oldDataPartnerProduct,
      statusBtnCancel: false,
    });
  };
  const getStatus = (e) => {
    setDataPartnerProduct({ ...dataPartnerProduct, status: e.target.value });
  };
  const getTypeItem = e => {
    switch (e) {
      case "appleId":
        setDataPartnerProduct({ ...dataPartnerProduct, [e]: e, googleId: "" });
        break;
      case "googleId":
        setDataPartnerProduct({ ...dataPartnerProduct, [e]: e, appleId: "" })
        break;
      default:
        setDataPartnerProduct({ ...dataPartnerProduct, googleId: '', appleId: "" })
        break;
    }
  }
  const submitCreateItem = () => {
    let result = createItem();
    result.then((val) => {
      if (val) {
        showConfirm("Create new Item successful !");
        setOldDataPartnerProduct({
          ...oldDataPartnerProduct,
          statusBtnCancel: true,
        });
        setDataPartnerProduct(oldDataPartnerProduct.oldData);
      }
    });
  };
  const cancelUpdate = () => {
    setDataPartnerProduct(oldDataPartnerProduct.oldData);
  };
  const changePartnerProductName = async (val) => {
    await setDataPartnerProduct({
      ...dataPartnerProduct,
      partnerProductName: JSON.parse(val).productName,
      productId: JSON.parse(val).productId,
    });
  };
  async function changePartnerName(val) {
    await setDataPartnerProduct({ ...dataPartnerProduct, partnerId: val });
    getRefPartnerProduct();
    console.log(val)
  }

  const printPlatform = dataListPlatform.map((val, index) => (
    <Option value={val.partnerId} key={index}>
      {val.partnerName}
    </Option>
  ));
  const printRefProduct = dataListRefProduct.map(function (val, index) {
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
  const showConfirm = (val) => {
    Modal.confirm({
      title: val,
      okText: "Back",
      cancelText: "Next",
      onOk() {
        props.setIsCreateItem(false);
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };
  return (
    <Row>
      <Link
        to="/payment/items"
        onClick={() => showConfirm("Do you want continute create new Item?")}
      >
        <span>
          <Icon type="arrow-left" style={{ paddingRight: ".2rem" }} />
          Back
        </span>
      </Link>
      <div className="products-title">
        <div>
          <h2>Create Item</h2>
          <div>
            <p>
              <Button
                onClick={() =>
                  showConfirm("Do you want continute create new Item?")
                }
                disabled={oldDataPartnerProduct.statusBtnCancel}
                style={{ marginRight: ".5rem" }}
              >
                Cancel
              </Button>
              <Button
                onClick={submitCreateItem}
                disabled={
                  productName === "" ||
                    partnerId === "" ||
                    productId === "" ||
                    coin === "" ||
                    partnerProductName === "" ||
                    prefix === "" ||
                    status === ""
                    ? true
                    : false
                }
              >
                Add new Item
              </Button>
            </p>
          </div>
        </div>
      </div>
      <Row className="products-content">
        <Col md={10} className="section1-listcoin">
          <div>
            <div>
              <p className="edit-product-content-title">Item Id</p>
              <span>Id: AUTO {partnerProductId} </span>
            </div>
          </div>
          <div className="product-input-update">
            <span className="edit-product-content-title">Platform</span>
            <Select
              value={partnerId}
              style={{ width: "100% !important" }}
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
            <span className="edit-product-content-title">Item name</span>
            <Input
              value={productName}
              name="productName"
              onChange={getNewInfoItem}
            ></Input>
            <span className="edit-product-content-title">Price (C.coin)</span>
            <Input
              value={coin}
              type="number"
              max="9990000000"
              name="coin"
              onChange={getNewInfoItem}
            ></Input>
            <Radio.Group onChange={e => getTypeItem(e.target.value)} defaultValue={""} style={{ flexDirection: "column" }}>
              <span className="edit-product-content-title">Loại Item</span>
              <Radio style={radioStyle} value="" name=''>
                Nap.clappigames
              </Radio>
              <Radio style={radioStyle} value="appleId">
                Appstore
              </Radio>
              <Radio style={radioStyle} value="googleId">
                Google Play
              </Radio>
            </Radio.Group>
            <span className="edit-product-content-title" style={{ marginTop: ".5rem" }}>Id</span>
            <Input
              value={prefix}
              // type="number"
              // max="9990000000"
              name="prefix"
              onChange={getNewInfoItem}
            ></Input>
          </div>
        </Col>
        <Col md={7} className="section2">
          <div>
            <p className="edit-product-content-title">Status</p>
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
            <p className="edit-product-content-title">Admin</p>
            <span>
              Admin: <span>{userName}</span>
            </span>
          </div>
        </Col>
        <Col md={7} className="section2">
          <div>
            <div>
              <span className="edit-product-content-title">Image</span>
            </div>
            <div style={{ width: "100px" }}>
              {props.urlImgThumbnail === null ? (
                <i>Thumbnail image is emtry</i>
              ) : (
                  <img src={props.urlImgThumbnail} width="100%" />
                )}
            </div>
            <div>
              <a onClick={() => dispatchShowImagesNews(true)}>Select</a>
            </div>
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
    urlImgThumbnail: state.urlImgThumbnail,
  };
}
export default connect(mapStateToProps, null)(CreatePartnerItems);
