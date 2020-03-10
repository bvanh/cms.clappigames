import React, { useState } from "react";
import { Button, Input, Row, Col, Select } from "antd";
import { createPromotion } from "../../../../../utils/mutation/promotion";
import { useLazyQuery, useMutation, useQuery } from "@apollo/react-hooks";
import { getListPartnerProducts } from "../../../../../utils/queryPartnerProducts";
const { Option } = Select;
function EventByItems(props) {
  const [itemsForEventTypeItem, setItemForEventTypeItem] = useState([
    { productName: "", partnerProductId: "" }
  ]);
  const {
    namePromo,
    platformPromoId,
    server,
    statusPromo,
    promoType,
    timeTotalPromo,
    datesPromo,
    dailyPromo,
    startTime,
    endTime
  } = props.indexPromo;
  const [indexShop, setIndexShop] = useState([
    {
      purchaseTimes: 1,
      purchaseItemId: "",
      rewards: [
        {
          numb: 1,
          itemId: ""
        }
      ]
    }
  ]);
  const { data } = useQuery(getListPartnerProducts(platformPromoId), {
    onCompleted: data => {
      setItemForEventTypeItem(data.listPartnerProducts);
    }
  });
  const [createPromo] = useMutation(createPromotion, {
    variables: {
      req: {
        name: namePromo,
        type: promoType,
        status: statusPromo,
        game: platformPromoId,
        server: server,
        shop: JSON.stringify(indexShop),
        eventTime: JSON.stringify({
          startTime: timeTotalPromo[0],
          endTime: timeTotalPromo[1],
          dates: datesPromo,
          daily: dailyPromo,
          hour: [startTime, endTime]
        })
      }
    },
    onCompleted: data => console.log(data)
  });
  const submitCreatePromo = async () => {
    await createPromo();
    alert("tao thanh cong");
  };
  const addItem = () => {
    const newItem = {
      purchaseTimes: indexShop[indexShop.length - 1].purchaseTimes,
      purchaseItemId: null,
      rewards: [
        {
          numb: 1,
          itemId: null
        }
      ]
    };
    setIndexShop([...indexShop, newItem]);
  };
  const reduceItem = async val => {
    if (val !== 0) {
      const newItem = await indexShop.filter((value, index) => index !== val);
      setIndexShop(newItem);
    }
  };
  const addReward = async i => {
    const newReward = {
      numb: 1,
      itemId: null
    };
    const newShop = [...indexShop];
    newShop[i].rewards = [...newShop[i].rewards, newReward];
    setIndexShop(newShop);
  };
  const reduceReward = async (numberItem, indexReward) => {
    const newShop = [...indexShop];
    const newReward = await indexShop[numberItem].rewards.filter(
      (value, i) => indexReward !== i
    );
    newShop[numberItem].rewards = newReward;
    setIndexShop(newShop);
  };
  const handleChooseReward = (positionItem, positionReward, val) => {
    const newItem = [...indexShop];
    newItem[positionItem].rewards[positionReward].itemId = val;
    setIndexShop(newItem);
  };
  const handleChooseNumbReward = (positionItem, positionReward, e) => {
    const newItem = [...indexShop];
    newItem[positionItem].rewards[positionReward].numb = e.target.value;
    setIndexShop(newItem);
  };
  const handleChooseItem = (positionItem, value) => {
    const newItem = [...indexShop];
    newItem[positionItem].purchaseItemId = value;
    setIndexShop(newItem);
  };
  const handleChooseNumbItem = (positionItem, e) => {
    const newItem = [...indexShop];
    newItem[positionItem].purchaseTimes = e.target.value;
    setIndexShop(newItem);
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
          // value={indexShop[index1].reward[index2].itemId}
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
            min={indexShop[index1 > 0 ? index1 - 1 : index1].purchaseTimes}
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
        <Button>Hủy</Button>
        <Button onClick={submitCreatePromo}>Tạo khuyến mãi</Button>
      </div>
      <Row>
        {printItem}
        <Button onClick={() => addItem()}>Thêm điều kiện</Button>
      </Row>
    </div>
  );
}

export default EventByItems;
