import React, { useState, useCallback } from "react";
import { Button, Input, Row, Col, Select } from "antd";
import { updatePromotion } from "../../../../../utils/mutation/promotion";
import moment from "moment";
import {
  checkNumb,
  checkMainInfoPromoAndEvent,
  checkPurchaseItemIsEmtry,
  alertError,
  checkItemIsEmtry
} from "../../promoService";
import { useLazyQuery, useMutation, useQuery } from "@apollo/react-hooks";
import { getListPartnerProducts } from "../../../../../utils/queryPartnerProducts";
import { connect } from "react-redux";
const { Option } = Select;
function EventByItems(props) {
  const { shop, id } = props.detailPromo;
  const [itemsForEventTypeItem, setItemForEventTypeItem] = useState([
    { productName: "", partnerProductId: "" }
  ]);
  const {
    name,
    status,
    type,
    timeTotal,
    dates,
    daily,
    startTime,
    endTime
  } = props.indexPromoAndEvent;
  const { indexShop } = props;
  const { platformId, server } = props.indexGameForPromo;
  const { data } = useQuery(getListPartnerProducts(platformId), {
    onCompleted: data => {
      setItemForEventTypeItem(data.listPartnerProducts);
    }
  });
  const [updatePromo] = useMutation(updatePromotion, {
    variables: {
      id: id,
      req: {
        name: name,
        type: type,
        status: status,
        game: platformId,
        server: server,
        shop: JSON.stringify(indexShop),
        eventTime: JSON.stringify({
          startTime: timeTotal[0],
          endTime: timeTotal[1],
          dates: dates,
          daily: daily,
          hour: [startTime, endTime]
        })
      }
    },
    onCompleted: data => console.log(data)
  });
  const submitUpdatePromo = async () => {
    if (
      checkMainInfoPromoAndEvent(
        name,
        type,
        timeTotal[0],
        startTime,
        endTime,
        dates,
        daily
      ) &&
      checkNumb(indexShop) &&
      checkItemIsEmtry(indexShop) &&
      checkPurchaseItemIsEmtry(indexShop)
    ) {
      await updatePromo();
      props.successAlert(false);
    } else {
      alertError();
    }
  };
  const addItem = () => {
    const newItem = {
      purchaseTimes: indexShop[indexShop.length - 1].purchaseTimes,
      purchaseItemId: [],
      rewards: [
        {
          numb: 1,
          itemId: []
        }
      ]
    };
    props.setIndexShop([...indexShop, newItem]);
  };
  const reduceItem = async val => {
    if (val !== 0) {
      const newItem = await indexShop.filter((value, index) => index !== val);
      props.setIndexShop(newItem);
    }
  };
  const addReward = async i => {
    const newReward = {
      numb: 1,
      itemId: []
    };
    const newShop = [...indexShop];
    newShop[i].rewards = [...newShop[i].rewards, newReward];
    props.setIndexShop(newShop);
  };
  const reduceReward = async (numberItem, indexReward) => {
    const newShop = [...indexShop];
    if (newShop.length > 0) {
      const newReward = await indexShop[numberItem].rewards.filter(
        (value, i) => indexReward !== i
      );
      newShop[numberItem].rewards = newReward;
      props.setIndexShop(newShop);
    }
  };
  const handleChooseReward = (positionItem, positionReward, val) => {
    const newItem = [...indexShop];
    newItem[positionItem].rewards[positionReward].itemId = val;
    props.setIndexShop(newItem);
  };
  const handleChooseNumbReward = (positionItem, positionReward, e) => {
    const newItem = [...indexShop];
    newItem[positionItem].rewards[positionReward].numb =
      e.target.value !== "" ? Number(e.target.value) : "";
    props.setIndexShop(newItem);
  };
  const handleChooseItem = (positionItem, value) => {
    const newItem = [...indexShop];
    newItem[positionItem].purchaseItemId = value;
    props.setIndexShop(newItem);
  };
  const handleChooseNumbItem = (positionItem, e) => {
    const newItem = [...indexShop];
    newItem[positionItem].purchaseTimes =
      e.target.value !== "" ? Number(e.target.value) : "";
    console.log(newItem);
    props.setIndexShop(newItem);
  };
  const printListItems = itemsForEventTypeItem.map((val, index) => (
    <Option value={val.partnerProductId} key={index}>
      {val.productName}
    </Option>
  ));
  const printItem = indexShop.map(function (val, index1) {
    const printReward = val.rewards.map((valReward, index2) => (
      <div key={index2}>
        <Input
          value={indexShop[index1].rewards[index2].numb}
          type="number"
          name="pucharseTimes"
          onChange={e => handleChooseNumbReward(index1, index2, e)}
          style={{ width: "10%" }}
          disabled={props.isTimeInPromo}
        ></Input>
        <Select
          mode="multiple"
          value={indexShop[index1].rewards[index2].itemId}
          style={{ width: "60%" }}
          onChange={value => handleChooseReward(index1, index2, value)}
          disabled={props.isTimeInPromo}
        >
          {printListItems}
        </Select>{" "}
        <span onClick={() => reduceReward(index1, index2)}>Delete</span>
      </div>
    ));
    return (
      <div key={index1}>
        <Col md={12}>
          <Input
            value={indexShop[index1].purchaseTimes}
            type="number"
            step="100"
            min={index1 > 0 ? indexShop[index1 - 1].purchaseTimes : 0}
            name="pucharseTimes"
            onChange={e => handleChooseNumbItem(index1, e)}
            style={{ width: "10%" }}
            disabled={props.isTimeInPromo}
          ></Input>
          <Select
            value={indexShop[index1].purchaseItemId}
            style={{ width: "90%" }}
            onChange={value => handleChooseItem(index1, value)}
            disabled={props.isTimeInPromo}
          >
            {printListItems}
          </Select>{" "}
          <Button onClick={() => reduceItem(index1)} disabled={props.isTimeInPromo}>xóa item</Button>
        </Col>
        <Col md={12}>
          {printReward}
          <Button onClick={() => addReward(index1)} disabled={props.isTimeInPromo}>Thêm quà</Button>
        </Col>
      </div>
    );
  });
  return (
    <div className="section4-promotion">
      <div style={{ width: "100%" }} className="section4-promotion-title">
        <div style={{ width: "50%", display: "flex" }}>
          <div style={{ width: "20%" }}>Số lần</div>
          <div style={{ width: "80%" }}>Item mua</div>
        </div>
        <div style={{ width: "50%", display: "flex" }}>
          <div style={{ width: "20%" }}>Số lượng</div>
          <div style={{ width: "80%" }}>Tặng quà</div>
        </div>
      </div>
      <div className="btn-create-promo">
        <Button onClick={submitUpdatePromo}>Xác nhận</Button>
      </div>
      <Row>
        {printItem}
        <Button onClick={() => addItem()} disabled={props.isTimeInPromo}>Thêm điều kiện</Button>
      </Row>
    </div>
  );
}
function mapStateToProps(state) {
  return {
    detailPromo: state.detailPromo
  };
}
export default connect(mapStateToProps, null)(EventByItems);
