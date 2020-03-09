import React, { useState, useMemo, useEffect, useCallback } from "react";
import { Button, Input, Row, Col, Select, Modal, Radio } from "antd";
import {
  createPromotion,
  createItemEvent,
  createEvent
} from "../../../../../utils/mutation/promotion";
import { getListItemsForEvent } from "../../../../../utils/query/promotion";
import { useLazyQuery, useMutation, useQuery } from "@apollo/react-hooks";
import { connect } from "react-redux";
import { getListPartnerProducts } from "../../../../../utils/queryPartnerProducts";
import {
  dispatchNameEventByMoney,
  dispatchTypeEventByMoney,
  dispatchSetDataTypePromo,
  dispatchAddItemPromo,
  dispatchReduceItemPromo,
  dispatchSeclectItemPartnerPromo,
  dispatchSeclectNumbItem,
  dispatchSelectItemInkind,
  dispatchSelectCoinEent
} from "../../../../../redux/actions";
const { Option } = Select;
function InputRewardForShowByMoney(props) {
  const { config, paymentType } = props.detailPromo;
  const { type, data, game } = JSON.parse(config);
  const { indexEventByMoney } = props;
  const [listItemForEvent, setListItemForEvent] = useState({
    isShow: false,
    itemsForEventTypeMoney: [{ productName: "", partnerProductId: "" }]
  });
  const [rowItems, setRowItems] = useState(0);
  const [itemNumb, setItemNumb] = useState(null);
  // const resetRewards = useCallback(
  //   () => setIndexShop({ ...indexShop, item: rootConfig }),
  //   [props.indexPromo.platformPromoId]
  // );
  const { inkind, item, coin } = props.indexShop;
  useEffect(() => {
    dispatchTypeEventByMoney(type);
    dispatchSetDataTypePromo({ isType: type.toLowerCase(), data: data });
  }, []);
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
  // useMemo(() => props.refetch(), [indexShop.coin])
  // const { point, rewards, itemsInkind, rewardForShow } = indexShop;
  useQuery(getListPartnerProducts(game), {
    onCompleted: data => {
      setListItemForEvent({
        ...listItemForEvent,
        itemsForEventTypeMoney: data.listPartnerProducts
      });
    }
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
    onCompleted: async data => {
      const newIndexEvent = { ...props.indexEventByMoney };
      newIndexEvent.itemsForEventByMoney = [
        ...props.indexEventByMoney.itemsForEventByMoney,
        data.createProduct
      ];
      props.setIndexEventByMoney(newIndexEvent);
      dispatchSelectCoinEent({
        positionItem: rowItems,
        value: data.createProduct.productId
      });
    }
  });
  const [createEventByMoney] = useMutation(createEvent, {
    variables: {
      req: {
        name: namePromo,
        status: statusPromo,
        paymentType: props.nameEventByMoney,
        eventTime: JSON.stringify({
          startTime: timeTotalPromo[0],
          endTime: timeTotalPromo[1],
          dates: datesPromo,
          daily: dailyPromo,
          hour: [startTime, endTime]
        }),
        config: JSON.stringify({
          type: props.typeEventByMoney,
          data: props.indexShop
        })
      }
    },
    onCompleted: data => console.log(data)
  });
  const [createEventByMoneyForItem] = useMutation(createEvent, {
    variables: {
      req: {
        name: namePromo,
        status: statusPromo,
        paymentType: props.nameEventByMoney,
        eventTime: JSON.stringify({
          startTime: timeTotalPromo[0],
          endTime: timeTotalPromo[1],
          dates: datesPromo,
          daily: dailyPromo,
          hour: [startTime, endTime]
        }),
        config: JSON.stringify({
          game: platformPromoId,
          server: server,
          type: props.typeEventByMoney,
          data: props.indexShop
        })
      }
    },
    onCompleted: data => console.log(data)
  });
  const addItem = val => {
    dispatchAddItemPromo(val);
  };
  const reduceItem = async (isType, val) => {
    if (val !== 0) {
      dispatchReduceItemPromo({ isType: isType, val: val });
    }
  };
  const handleChooseItemPartner = (positionItem, value) => {
    dispatchSeclectItemPartnerPromo({
      positionItem: positionItem,
      value: value
    });
  };
  const handleChooseNumbItem = (isType, positionItem, e) => {
    dispatchSeclectNumbItem({
      isType: isType,
      positionItem: positionItem,
      value: e.target.value
    });
  };
  const handleChooseInKind = (positionItem, e) => {
    dispatchSelectItemInkind({
      positionItem: positionItem,
      value: e.target.value
    });
  };
  const setCoinForEventTypeMoney = e => {
    dispatchSelectCoinEent({
      positionItem: rowItems,
      value: JSON.parse(e.target.value).productId
    });
    setItemNumb(null);
  };
  const submitCreateItem = () => {
    if (itemNumb !== null) {
      createNewItemEvent();
      props.refetch();
      setListItemForEvent({ ...listItemForEvent, isShow: false });
    }
  };
  const showModal = async val => {
    setListItemForEvent({ ...listItemForEvent, isShow: true });
    setRowItems(val);
    setItemNumb(null);
  };
  // const submitCreateEvent = async () => {
  //   if (props.nameEventByMoney === "MONEY") {
  //     if (props.typeEventByMoney === "INKIND") {
  //       const newConigInkind = await indexShop.map(
  //         (val, i) => (delete val.rewards, delete val.rewardForShow)
  //       );
  //       createEventByMoney();
  //     } else {
  //       const newConigInkind = await indexShop.map(
  //         (val, i) => (delete val.rewardForShow, delete val.itemsInkind)
  //       );
  //       createEventByMoney();
  //     }
  //   } else if (props.nameEventByMoney === "COIN") {
  //     const newConigInkind = await indexShop.map(
  //       (val, i) => (delete val.rewardForShow, delete val.itemsInkind)
  //     );
  //     createEventByMoneyForItem();
  //   }
  // };
  const printListItems = props.listItems.map((val, index) => (
    <Option value={val.partnerProductId} key={index}>
      {val.productName}
    </Option>
  ));
  const printItemsEvent = indexEventByMoney.itemsForEventByMoney.map(
    (val, i) => (
      <Option value={val.productId} key={i}>
        {val.productName}
      </Option>
    )
  );
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
  const printItemInkind = inkind.map(function(val, index1) {
    return (
      <div key={index1}>
        <Col md={24}>
          TỪ
          <Input
            value={inkind[index1].point}
            type="number"
            name="pucharseTimes"
            onChange={e => handleChooseNumbItem("inkind", index1, e)}
            style={{ width: "10%" }}
          ></Input>
          ...
          <Input
            value={inkind[index1].itemsInkind}
            placeholder="-Điền quà out game-"
            name="pucharseTimes"
            onChange={e => handleChooseInKind(index1, e)}
            style={{ width: "10%" }}
          ></Input>
          <span onClick={() => reduceItem("inkind", index1)}>xóa item</span>
        </Col>
      </div>
    );
  });
  const printItemCoin = coin.map((val, index1) => (
    <Col md={24} key={index1}>
      TỪ
      <Input
        value={coin[index1].point}
        type="number"
        name="pucharseTimes"
        onChange={e => handleChooseNumbItem("coin", index1, e)}
        style={{ width: "10%" }}
      ></Input>
      ...
      <Select
        mode="multiple"
        value={coin[index1].rewards}
        style={{ width: "90%" }}
        // onChange={value => handleChooseItem(index1, value)}
      >
        {printItemsEvent}
      </Select>{" "}
      <span onClick={() => showModal(index1)}>show item COIN</span>
      <span onClick={() => reduceItem("coin", index1)}>xóa item</span>
    </Col>
  ));
  const printItemPartner = item.map((val, index1) => (
    <Col md={24} key={index1}>
      TỪ
      <Input
        value={item[index1].point}
        type="number"
        name="pucharseTimes"
        onChange={e => handleChooseNumbItem("item", index1, e)}
        style={{ width: "10%" }}
      ></Input>
      ...
      <Select
        mode="multiple"
        value={item[index1].rewards}
        style={{ width: "90%" }}
        onChange={value => handleChooseItemPartner(index1, value)}
      >
        {printListItems}
      </Select>{" "}
      <span onClick={() => reduceItem("item", index1)}>xóa item</span>
    </Col>
  ));
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
        <Button >Tạo khuyến mãi</Button>
      </div>
      <Row>
        {props.typeEventByMoney === "COIN" && (
          <>
            {printItemCoin}
            <Button onClick={() => addItem("coin")}>Thêm điều kiện</Button>
          </>
        )}
        {props.typeEventByMoney === "INKIND" && (
          <>
            {printItemInkind}
            <Button onClick={() => addItem("inkind")}>Thêm điều kiện</Button>
          </>
        )}
        {props.typeEventByMoney === "ITEM" && (
          <>
            {printItemPartner}
            <Button onClick={() => addItem("item")}>Thêm điều kiện</Button>
          </>
        )}
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
    typeEventByMoney: state.typeEventByMoney,
    nameEventByMoney: state.nameEventByMoney,
    detailPromo: state.detailPromo,
    indexShop: state.indexShop
  };
}
export default connect(mapStateToProps, null)(InputRewardForShowByMoney);
