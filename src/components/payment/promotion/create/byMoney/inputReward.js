import React, { useState } from "react";
import { Button, Input, Row, Col, Select } from "antd";
import { createPromotion } from "../../../../../utils/mutation/promotion";
import { useLazyQuery, useMutation, useQuery } from "@apollo/react-hooks";
const { Option } = Select;
function InputRewardByMoney(props) {
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
      purchaseTimes: 1,
      purchaseItemId: "",
      reward: [
        {
          numb: 1,
          itemId: ""
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
          hour: [startTime, endTime]
        })
      }
    },
    onCompleted: data => console.log(data)
  });
  const addItem = () => {
    const newItem = {
      purchaseTimes: 1,
      purchaseItemId: null,
      reward: [
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
  const printListItems = listItems.map((val, index) => (
    <Option value={val.productId} key={index}>
      {val.productName}
    </Option>
  ));
  const printItem = indexShop.map(function(val, index1) {
    return (
      <div key={index1}>
        <Col md={24}>
          <Input
            value={indexShop[index1].purchaseTimes}
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
          <span onClick={() => reduceItem(index1)}>xóa item</span>
        </Col>
      </div>
    );
  });
  return (
    <>
    <Row>
        <Col md={12}>
          <span>Tổng hóa đơn</span>
          <span>Khuyến mãi</span>
        </Col>
      </Row>
      <div className="btn-create-promo">
        <Button>Hủy</Button>
        <Button onClick={() => createPromo()}>Tạo khuyến mãi</Button>
      </div>
      <Row>
        {printItem}
        <Button onClick={() => addItem()}>Thêm điều kiện</Button>
      </Row>
    </>
  );
}

export default InputRewardByMoney;
