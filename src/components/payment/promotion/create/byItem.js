import React, { Component } from "react";
import {
  Button,
  Input,
  Row,
  Col,
  Select,
} from "antd";
const { Option } = Select;
function EventByItems(props) {
  const printItem = props.indexShop.map(function(val, index1) {
    const printReward = val.reward.map((valReward, index2) => (
      <div key={index2}>
        <Input
          //   value={coin}
          type="number"
          max="10"
          name="pucharseTimes"
          onChange={e => props.handleChooseNumbReward(index1, index2, e)}
          style={{ width: "10%" }}
        ></Input>
        <Select
          defaultValue="jack"
          style={{ width: "60%" }}
          onChange={value => props.handleChooseReward(index1, index2, value)}
        >
          <Option value="jack">Item1</Option>
          <Option value="lucy">COIN</Option>
        </Select>{" "}
        <span onClick={() => props.reduceReward(valReward.rewardIndex, index1)}>
          Delete
        </span>
      </div>
    ));
    return (
      <>
        <Col md={12}>
          <Input
            //   value={coin}
            type="number"
            max="10"
            name="pucharseTimes"
            onChange={e => props.handleChooseNumbItem(index1, e)}
            style={{ width: "10%" }}
          ></Input>
          <Select
            defaultValue="jack"
            style={{ width: "90%" }}
            onChange={value => props.handleChooseItem(index1, value)}
          >
            <Option value="jack">Item1</Option>
            <Option value="lucy">COIN</Option>
          </Select>{" "}
          <span onClick={() => props.reduceItem(val.purchaseIndex)}>
            xóa item
          </span>
        </Col>
        <Col md={12}>
          {printReward}
          <Button
            onClick={() =>
              props.addReward(props.indexShop[index1].reward.length, index1)
            }
          >
            Thêm quà
          </Button>
        </Col>
      </>
    );
  });
  return (
    <Row>
      {printItem}
      <Button onClick={() => props.addItem(props.indexShop.length)}>
        Thêm điều kiện
      </Button>
    </Row>
  );
}

export default EventByItems;
