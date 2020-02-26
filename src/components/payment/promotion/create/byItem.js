import React, { useState } from "react";
import { Button, Input, Row, Col, Select } from "antd";
import { createPromotion } from "../../../../utils/mutation/promotion";
import { useLazyQuery, useMutation, useQuery } from "@apollo/react-hooks";
const { Option } = Select;
function EventByItems(props) {
  const { listItems } = props;
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
      purchaseNumber: 1,
      purchaseItemId: null,
      purchaseIndex: 0,
      reward: [
        {
          rewardNumb: 1,
          rewardItemId: null,
          rewardIndex: 0
        }
      ]
    }
  ]);
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
          hour: `${startTime},${endTime}`
        })
      }
    },
    onCompleted: data => console.log(data)
  });
  const addItem = val => {
    const newItem = {
      purchaseNumber: 1,
      purchaseItemId: null,
      purchaseIndex: val,
      reward: [
        {
          rewardNumb: 1,
          rewardItemId: null,
          rewardIndex: 0
        }
      ]
    };
    setIndexShop([...indexShop, newItem]);
  };
  const reduceItem = async val => {
    if (val !== 0) {
      const newItem = await indexShop.filter(
        (value, index) => value.purchaseIndex !== val
      );
      setIndexShop(newItem);
    }
  };
  const addReward = async (val, i) => {
    const newReward = {
      rewardNumb: 1,
      rewardItemId: null,
      rewardIndex: val
    };
    const newShop = [...indexShop];
    newShop[i].reward = [...newShop[i].reward, newReward];
    setIndexShop(newShop);
  };
  const reduceReward = async (val, numberItem) => {
    const newShop = [...indexShop];
    const newReward = await indexShop[numberItem].reward.filter(
      (value, i) => value.rewardIndex !== val
    );
    newShop[numberItem].reward = newReward;
    setIndexShop(newShop);
  };
  const handleChooseReward = (positionItem, positionReward, val) => {
    const newItem = [...indexShop];
    newItem[positionItem].reward[positionReward].rewardItemId = val;
    setIndexShop(newItem);
  };
  const handleChooseNumbReward = (positionItem, positionReward, e) => {
    const newItem = [...indexShop];
    newItem[positionItem].reward[positionReward].rewardNumb = e.target.value;
    setIndexShop(newItem);
  };
  const handleChooseItem = (positionItem, value) => {
    const newItem = [...indexShop];
    newItem[positionItem].purchaseItemId = value;
    setIndexShop(newItem);
  };
  const handleChooseNumbItem = (positionItem, e) => {
    const newItem = [...indexShop];
    newItem[positionItem].purchaseNumber = e.target.value;
    setIndexShop(newItem);
  };
  const printListItems = listItems.map((val, index) => (
    <Option value={val.productId} key={index}>
      {val.productName}
    </Option>
  ));
  const printItem = indexShop.map(function(val, index1) {
    const printReward = val.reward.map((valReward, index2) => (
      <div key={index2}>
        <Input
            value={indexShop[index1].reward[index2].rewardNumb}
          type="number"
          max="10"
          name="pucharseTimes"
          onChange={e => handleChooseNumbReward(index1, index2, e)}
          style={{ width: "10%" }}
        ></Input>
        <Select
          mode="multiple"
          value={indexShop[index1].reward[index2].rewardItemId}
          style={{ width: "60%" }}
          onChange={value => handleChooseReward(index1, index2, value)}
        >
          {printListItems}
        </Select>{" "}
        <span onClick={() => reduceReward(valReward.rewardIndex, index1)}>
          Delete
        </span>
      </div>
    ));
    return (
      <div key={index1}>
        <Col md={12}>
          <Input
            value={indexShop[index1].purchaseNumber}
            type="number"
            max="10"
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
          <span onClick={() => reduceItem(val.purchaseIndex)}>xóa item</span>
        </Col>
        <Col md={12}>
          {printReward}
          <Button
            onClick={() => addReward(indexShop[index1].reward.length, index1)}
          >
            Thêm quà
          </Button>
        </Col>
      </div>
    );
  });
  return (
    <Row>
      <div className="btn-create-promo">
        <Button>Hủy</Button>
        <Button onClick={()=>createPromo()}>Tạo khuyến mãi</Button>
      </div>
      {printItem}
      <Button onClick={() => addItem(indexShop.length)}>Thêm điều kiện</Button>
    </Row>
  );
}

export default EventByItems;
