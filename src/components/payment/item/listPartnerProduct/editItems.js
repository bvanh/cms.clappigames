import React, { useState, useEffect, useMemo } from "react";
import {
  Table,
  Button,
  Radio,
  Input,
  Row,
  Col,
  Select,
  Icon,
  Rate,
  Modal,
} from "antd";
import { queryGetPlatform } from "../../../../utils/queryNews";
import { alertErrorServer } from "../../../../utils/alertErrorAll";
import { deletePartnerProducts } from "../../../../utils/mutation/partnerProductItems";
import {
  dispatchShowImagesNews,
  dispatchSetUrlImageThumbnail,
} from "../../../../redux/actions/index";
import { connect } from "react-redux";
import ListImagesForNews from "../../../news/modalImageUrl/imgsUrl";
import {
  queryGetPartnerProductById,
  queryGetRefPartnerProducts,
} from "../../../../utils/queryPartnerProducts";
import { updatePartnerProductItem } from "../../../../utils/mutation/partnerProductItems";
import { useLazyQuery, useMutation, useQuery } from "@apollo/react-hooks";
import { Link, useHistory } from "react-router-dom";
import "../../../../static/style/listProducts.css";
const { Option } = Select;
const radioStyle = {
  display: "block",
  height: "24px",
  lineHeight: "30px",
};
function EditPartnerProductItem(props) {
  const history = useHistory();
  const userName = localStorage.getItem("userNameCMS");
  const query = new URLSearchParams(window.location.search);
  const partnerProductId = query.get("partnerProductId");
  const [oldDataPartnerProduct, setOldDataPartnerProduct] = useState({
    statusBtnCancel: false,
    oldData: null,
  });
  const [dataListPlatform, setListPlatform] = useState([]);
  const [dataListRefProduct, setListRefProduct] = useState([]);
  const [dataPartnerProduct, setDataPartnerProduct] = useState({
    productName: "",
    partnerId: "",
    productId: "",
    coin: 0,
    partnerProductName: "",
    // promotionId: 0,
    status: "",
    image: "",
  });
  useQuery(queryGetPlatform(), {
    onCompleted: (dataPartner) => {
      setListPlatform(dataPartner.listPartners);
    },
    onError: (index) =>
      alertErrorServer(index.networkError.result.errors[0].message),
  });
  const { data, loading, error, refetch } = useQuery(
    queryGetPartnerProductById,
    {
      variables: {
        partnerProductId: partnerProductId,
      },
      onCompleted: (data) => {
        dispatchSetUrlImageThumbnail(data.listPartnerProducts[0].image);
        setDataPartnerProduct(data.listPartnerProducts[0]);
        setOldDataPartnerProduct({
          ...oldDataPartnerProduct,
          oldData: data.listPartnerProducts[0],
        });
      },
      onError: (index) =>
        alertErrorServer(index.networkError.result.errors[0].message),
    }
  );
  const {
    productName,
    status,
    productId,
    coin,
    partnerProductName,
    partnerId,
  } = dataPartnerProduct;
  const [getRefPartnerProduct] = useLazyQuery(
    queryGetRefPartnerProducts(partnerId),
    {
      onCompleted: (data) => {
        setListRefProduct(data.listRefPartnerProducts);
      },
      onError: (index) =>
        alertErrorServer(index.networkError.result.errors[0].message),
    }
  );
  useEffect(() => {
    getRefPartnerProduct();
  }, []);
  const [updateItem] = useMutation(updatePartnerProductItem, {
    variables: {
      partnerProductId: partnerProductId,
      req: {
        productName: productName,
        status: status,
        partnerId: partnerId,
        productId: productId,
        coin: Number(coin),
        partnerProductName: partnerProductName,
        // promotionId: Number(promotionId),
        image: props.urlImgThumbnail,
      },
    },
    onCompleted: (data) => successUpdate(),
    onError: (index) =>
      alertErrorServer(index.networkError.result.errors[0].message),
  });
  const [deletePartnerProduct] = useMutation(deletePartnerProducts, {
    variables: {
      ids: [partnerProductId],
    },
    onCompleted: (data) => console.log(data),
    onError: (index) =>
      alertErrorServer(index.networkError.result.errors[0].message),
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
  // const submitupdateItem = () => {
  //   let result = updateItem();
  //   result.then((val) => {
  //     if (val) {
  //       alert("update thành công!");
  //       refetch();
  //       setOldDataPartnerProduct({
  //         ...oldDataPartnerProduct,
  //         statusBtnCancel: true,
  //       });
  //     }
  //   });
  // };

  const changePartnerName = (value) => {
    setDataPartnerProduct({ ...dataPartnerProduct, partnerId: value });
  };
  const changePartnerProductName = async (val) => {
    await setDataPartnerProduct({
      ...dataPartnerProduct,
      partnerProductName: JSON.parse(val).productName,
      productId: JSON.parse(val).productId,
    });
  };

  const successUpdate = () => {
    Modal.success({
      title: "Update Item successful !",
    });
  };
  const showConfirm = (isDelete, contentAlert, okTextBtn, cancelTextBtn) => {
    Modal.confirm({
      title: `Do you want to ${contentAlert} these items ?`,
      okText: okTextBtn,
      cancelText: cancelTextBtn,
      onOk() {
        if (isDelete) {
          deletePartnerProduct();
        }
        history.push("/payment/items");
      },
      onCancel() {},
    });
  };
  const printPlatform = dataListPlatform.map((val, index) => (
    <Option value={val.partnerId} key={index}>
      {val.partnerName}
    </Option>
  ));
  const printRefProduct = dataListRefProduct.map(function (val, index) {
    if ((index = 0)) {
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
        <a
          onClick={() =>
            showConfirm(false, "continue update", "Back", "Continue")
          }
        >
          <Icon type="arrow-left" style={{ paddingRight: ".2rem" }} />
          Back
        </a>
        <div className="products-title">
          <div>
            <h2>Update Item</h2>
            <div>
              <p>
                <Button
                  onClick={() => showConfirm(true, "delete", "Yes", "No")}
                  style={{ marginRight: ".5rem" }}
                >
                  Delete Item
                </Button>
                <Button onClick={()=>updateItem()}>Update Item</Button>
              </p>
            </div>
          </div>
        </div>
        <Row className="products-content">
          <Col md={12} className="section1">
            <div>
              <div>
                <p className="edit-product-content-title">Item Id</p>
                <span style={{ paddingLeft: "1rem" }}>
                  Id: {partnerProductId}{" "}
                </span>
              </div>
            </div>
            <div className="product-input-update">
              <div>
                <span className="edit-product-content-title">Platform</span>
                <Select
                  value={partnerId}
                  style={{ width: "100%" }}
                  onChange={changePartnerName}
                >
                  {printPlatform}
                </Select>
                <span className="edit-product-content-title">
                  ProductId And Name
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
              <span className="edit-product-content-title">Name</span>
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
          <Col md={8} className="section2">
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
    urlImgThumbnail: state.urlImgThumbnail,
  };
}
export default connect(mapStateToProps, null)(EditPartnerProductItem);
