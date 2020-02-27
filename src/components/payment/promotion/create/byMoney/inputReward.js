import React, { useState, useMemo } from "react";
import { Button, Input, Row, Col, Select, Modal, Radio } from "antd";
import {
  createPromotion,
  createItemEvent
} from "../../../../../utils/mutation/promotion";
import { getListItemsForEvent } from "../../../../../utils/query/promotion";
import { useLazyQuery, useMutation, useQuery } from "@apollo/react-hooks";
import { connect } from "react-redux";
import { getListPartnerProducts } from "../../../../../utils/queryPartnerProducts";
const { Option } = Select;
function InputRewardByMoney(props) {
  const { indexEventByMoney } = props;
  const [listItemForEvent, setListItemForEvent] = useState({
    isShow: false,
    itemsForEventTypeMoney: [{ productName: "", partnerProductId: "" }]
  });
  const { isShow, itemsForEventTypeMoney } = listItemForEvent;
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
  const [rowItems, setRowItems] = useState(0);
  const [itemNumb, setItemNumb] = useState(null);
  const [indexShop, setIndexShop] = useState([
    {
      purchaseTimes: 1,
      purchaseItemId: "",
      itemsInkind: "",
      itemId: "",
      itemsEvent: [null]
    }
  ]);
  const resetInput = useMemo(
    () =>
      setIndexShop([
        {
          purchaseTimes: 1,
          purchaseItemId: "",
          itemsInkind: ""
        }
      ]),
    [indexEventByMoney.paymentTypeByMoney]
  );
  const { data } = useQuery(getListPartnerProducts(platformPromoId), {
    onCompleted: data => {
      setListItemForEvent({
        ...listItemForEvent,
        itemsForEventTypeMoney: data.listPartnerProducts
      });
      setIndexShop([
        {
          purchaseTimes: 1,
          purchaseItemId: "",
          itemsInkind: ""
        }
      ]);
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
  const [createNewItemEvent] = useMutation(createItemEvent, {
    variables: {
      req: {
        productName: `${itemNumb} coin`,
        type: "EVENT",
        status: "COMPLETE",
        sort: 0,
        price: itemNumb * 1000
      }
    },
    onCompleted: data => {
      const newItem = [...indexShop];
      newItem[rowItems].itemsEvent = [data.createProduct.productName];
      newItem[rowItems].itemId = data.createProduct.productId;
      setIndexShop(newItem);
      props.getItemsForEventTypeMoney();  
    }
  });
  const addItem = () => {
    const newItem = {
      purchaseTimes: 1,
      purchaseItemId: null,
      rewardItemId: [null]
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
  const handleChooseIsKind = (positionItem, e) => {
    const newItem = [...indexShop];
    newItem[positionItem].itemsInkind = e.target.value;
    setIndexShop(newItem);
  };
  const setCoinForEventTypeMoney = e => {
    const newItem = [...indexShop];
    newItem[rowItems].itemsEvent = [JSON.parse(e.target.value).productName];
    newItem[rowItems].itemId = JSON.parse(e.target.value).productId;
    setIndexShop(newItem);
    setItemNumb(null);
  };
  const submitCreateItem = () => {
    createNewItemEvent();
    setListItemForEvent({ ...listItemForEvent, isShow: false });
  };
  const showModal = async val => {
    setListItemForEvent({ ...listItemForEvent, isShow: true });
    setRowItems(val);
    setItemNumb(null);
  };
  const printListItems = itemsForEventTypeMoney.map((val, index) => (
    <Option value={val.partnerProductId} key={index}>
      {val.productName}
    </Option>
  ));
  const printItemsForEventTypeMoney = indexEventByMoney.itemsForEventByMoney.map(
    (val, i) => (
      <Col span={24} key={i}>
        <Radio
          style={{ display: "block", height: "30px", lineHeight: "30px" }}
          value={`{"productId":"${val.productId}","productName":"${val.productName}"}`}
        >
          {val.productName}
        </Radio>
      </Col>
    )
  );
  console.log(props.typeEventByMoney);
  const printItem = indexShop.map(function(val, index1) {
    return (
      <div key={index1}>
        <Col md={24}>
          TỪ
          <Input
            value={indexShop[index1].purchaseTimes}
            type="number"
            name="pucharseTimes"
            onChange={e => handleChooseNumbItem(index1, e)}
            style={{ width: "10%" }}
          ></Input>
          ...
          {props.typeEventByMoney === "INKIND" && (
            <Input
              value={indexShop[index1].itemsInkind}
              placeholder="-Điền quà out game-"
              name="pucharseTimes"
              onChange={e => handleChooseIsKind(index1, e)}
              style={{ width: "10%" }}
            ></Input>
          )}
          {props.typeEventByMoney === "COIN" && (
            <>
              <Select
                mode="multiple"
                value={indexShop[index1].itemsEvent}
                style={{ width: "90%" }}
                // onChange={value => handleChooseItem(index1, value)}
              >
                {printListItems}
              </Select>{" "}
              <span onClick={() => showModal(index1)}>show item COIN</span>
              <span onClick={() => reduceItem(index1)}>xóa item</span>
            </>
          )}
          {props.typeEventByMoney === "ITEM" && (
            <>
              <Select
                mode="multiple"
                value={indexShop[index1].purchaseItemId}
                style={{ width: "90%" }}
                onChange={value => handleChooseItem(index1, value)}
              >
                {printListItems}
              </Select>{" "}
              <span
                onClick={() =>
                  setListItemForEvent({ ...listItemForEvent, isShow: true })
                }
              >
                show item
              </span>
              <span onClick={() => reduceItem(index1)}>xóa item</span>
            </>
          )}
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
      <Modal
        title="Chọn gói C.coin"
        centered
        visible={isShow}
        onOk={() => setListItemForEvent({ ...listItemForEvent, isShow: false })}
        onCancel={() =>
          setListItemForEvent({ ...listItemForEvent, isShow: false })
        }
      >
        <div className="input-coin-event-money">
          <Input
            type="number"
            min="0"
            placeholder="Nhập số lượng coin"
            value={itemNumb}
            onChange={e => setItemNumb(e.target.value)}
          ></Input>
          <Button onClick={submitCreateItem}>Submit</Button>
        </div>
        <Radio.Group onChange={e => setCoinForEventTypeMoney(e)}>
          {printItemsForEventTypeMoney}
        </Radio.Group>
      </Modal>
    </>
  );
}

function mapStateToProps(state) {
  return {
    typeEventByMoney: state.typeEventByMoney
  };
}
export default connect(mapStateToProps, null)(InputRewardByMoney);
