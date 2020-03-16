import React, { useState } from "react";
import { Button, Input, Row, Col, Select } from "antd";
import { createPromotion } from "../../../../../utils/mutation/promotion";
import { dispatchSaveIdCreateInUpdate } from "../../../../../redux/actions/index";
import moment from "moment";
import { useLazyQuery, useMutation, useQuery } from "@apollo/react-hooks";
import { getListPartnerProducts } from "../../../../../utils/queryPartnerProducts";
import {
  checkMainInfoPromoAndEvent,
  checkItemIsEmtry,
  checkPurchaseItemIsEmtry,
  checkNumb,
  alertError
} from "../../promoService";
const { Option } = Select;
function EventByItems(props) {
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
  const { platformId, server } = props.indexGameForPromo;
  const { indexShop, isUpdate } = props;
  useQuery(getListPartnerProducts(platformId), {
    onCompleted: data => {
      setItemForEventTypeItem(data.listPartnerProducts);
    }
  });
  const [createPromo] = useMutation(createPromotion, {
    variables: {
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
    onCompleted: data => {
      isUpdate
        ? dispatchSaveIdCreateInUpdate(data.createPromotion.id)
        : console.log(data);
    }
  });
  const submitCreatePromo = async () => {
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
      checkPurchaseItemIsEmtry(indexShop) &&
      checkNumb(indexShop) &&
      checkItemIsEmtry(indexShop) &&
      server !== "" &&
      platformId !== ""
    ) {
      await createPromo();
     
      props.successAlert(true);
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
    if (indexShop[numberItem].rewards.length > 1) {
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
          max="10"
          name="pucharseTimes"
          onChange={e => handleChooseNumbReward(index1, index2, e)}
          style={{ width: "10%" }}
        ></Input>
        <Select
          mode="multiple"
          value={indexShop[index1].rewards[index2].itemId}
          style={{ width: "60%" }}
          onChange={value => handleChooseReward(index1, index2, value)}
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
            min={index1 > 0 ? indexShop[index1 - 1].purchaseTimes : 0}
            name="pucharseTimes"
            onChange={e => handleChooseNumbItem(index1, e)}
            style={{ width: "10%" }}
          ></Input>
          <Select
            value={indexShop[index1].purchaseItemId}
            style={{ width: "90%" }}
            onChange={value => handleChooseItem(index1, value)}
          >
            {printListItems}
          </Select>{" "}
          <span onClick={() => reduceItem(index1)}>xóa item</span>
        </Col>
        <Col md={12}>
          {printReward}
          <Button onClick={() => addReward(index1)}>Thêm quà</Button>
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
        <Button onClick={submitCreatePromo}>Xác nhận</Button>
      </div>
      <Row>
        {printItem}
        <Button onClick={() => addItem()}>Thêm điều kiện</Button>
      </Row>
    </div>
  );
}

export default EventByItems;
