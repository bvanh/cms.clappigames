import React, { useState, useMemo, useEffect, useCallback } from "react";
import { Button, Input, Row, Col, Select, Modal, Radio } from "antd";
import {
  createItemEvent,
  updateEvent
} from "../../../../../utils/mutation/promotion";
import moment from "moment";
import { useLazyQuery, useMutation, useQuery } from "@apollo/react-hooks";
import { connect } from "react-redux";
import {
  checkPoint,
  checkMainInfoPromoAndEvent,
  checkRewardsIsEmtry,
  alertErrorNamePromo,
  alertErrorItemPromo,
  checkStartHour,
  checkEndHour
} from "../../promoService";
import { getListPartnerProducts } from "../../../../../utils/queryPartnerProducts";
import {
  dispatchTypeEventByMoney,
  dispatchSetDataTypePromo,
  dispatchAddItemPromo,
  dispatchAddInkindPromo,
  dispatchReduceItemPromo,
  dispatchSeclectItemPartnerPromo,
  dispatchSeclectNumbItem,
  dispatchSelectItemInkind,
  dispatchSelectCoinEvent
} from "../../../../../redux/actions";
const { Option } = Select;
function InputRewardForShowByMoney(props) {
  const { indexEventByMoney } = props;
  const { type } = JSON.parse(props.detailPromo.config);
  const [listItemForEvent, setListItemForEvent] = useState({
    isShow: false,
    itemsForEventTypeMoney: [{ productName: "", partnerProductId: "" }]
  });
  const [rowItems, setRowItems] = useState(0);
  const [itemNumb, setItemNumb] = useState(null);
  const { inkind, item, coin } = props.indexConfig;
  const { isShow, itemsForEventTypeMoney } = listItemForEvent;
  const {
    id,
    name,
    platformId,
    server,
    status,
    timeTotal,
    dates,
    daily,
    startTime,
    endTime
  } = props.indexPromoAndEvent;
  useEffect(() => {
    dispatchTypeEventByMoney(type);
    props.setIsCreatePromo(false);
  }, []);
  useQuery(getListPartnerProducts(platformId), {
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
        price: itemNumb * 1000,
        basecoin: itemNumb
      }
    },
    onCompleted: async data => {
      const newIndexEvent = { ...props.indexEventByMoney };
      newIndexEvent.itemsForEventByMoney = [
        ...props.indexEventByMoney.itemsForEventByMoney,
        data.createProduct
      ];
      props.setIndexEventByMoney(newIndexEvent);
      dispatchSelectCoinEvent({
        positionItem: rowItems,
        value: data.createProduct.productId
      });
    }
  });
  const mainInfo = {
    name: name,
    status: status,
    paymentType: props.nameEventByMoney,
    eventTime: JSON.stringify({
      startTime: timeTotal[0],
      endTime: timeTotal[1],
      dates: dates,
      daily: daily,
      hour: [checkStartHour(startTime),checkEndHour(endTime)]
    })
  };
  const [updateEventByInkind] = useMutation(updateEvent, {
    variables: {
      id: id,
      req: {
        ...mainInfo,
        config: JSON.stringify({
          type: props.typeEventByMoney,
          data: inkind
        })
      }
    },
    onCompleted: data => console.log(data)
  });
  const [updateEventByCoin] = useMutation(updateEvent, {
    variables: {
      id: id,
      req: {
        ...mainInfo,
        config: JSON.stringify({
          type: props.typeEventByMoney,
          data: coin
        })
      }
    },
    onCompleted: data => console.log(data)
  });
  const [updateEventByItem] = useMutation(updateEvent, {
    variables: {
      id: id,
      req: {
        ...mainInfo,
        config: JSON.stringify({
          game: platformId,
          server: server,
          type: props.typeEventByMoney,
          data: item
        })
      }
    },
    onCompleted: data => console.log(data)
  });
  const submitUpdateEvent = async () => {
    if (
      checkMainInfoPromoAndEvent(
        name,
        props.nameEventByMoney,
        timeTotal[0],
        startTime,
        endTime,
      )
    ) {
      if (props.nameEventByMoney === "MONEY") {
        if (
          props.typeEventByMoney === "INKIND" &&
          checkPoint(inkind) &&
          checkRewardsIsEmtry(inkind)
        ) {
          await updateEventByInkind();
          props.successAlert(false);
        } else if (checkPoint(coin) && checkRewardsIsEmtry(coin)) {
          await updateEventByCoin();
          props.successAlert(false);
        }
      } else if (
        props.nameEventByMoney === "COIN" &&
        checkPoint(item) &&
        checkRewardsIsEmtry(item) &&
        platformId !== "" &&
        server !== ""
      ) {
        await updateEventByItem();
        props.successAlert(false);
      } else {
        alertErrorItemPromo();
      }
    } else {
      alertErrorNamePromo();
    }
  };
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
      value: e.target.value !== "" ? Number(e.target.value) : ""
    });
  };
  const handleChooseInKind = (positionItem, e) => {
    dispatchSelectItemInkind({
      positionItem: positionItem,
      value: e.target.value
    });
  };
  const handleSelectCoinEvent = e => {
    dispatchSelectCoinEvent({
      positionItem: rowItems,
      value: e.target.value
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
  // console.log(props.typeEventByMoney, type,'ffg');
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
          value={val.productId}
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
            value={val.point}
            min={index1 > 0 ? inkind[index1 - 1].point : 0}
            type="number"
            name="pucharseTimes"
            onChange={e => handleChooseNumbItem("inkind", index1, e)}
            style={{ width: "10%" }}
            disabled={props.isTimeInPromo}
          ></Input>
          VNĐ
          <Input
            value={val.rewards[0]}
            placeholder="-Điền quà out game-"
            name="pucharseTimes"
            onChange={e => handleChooseInKind(index1, e)}
            style={{ width: "10%" }}
            disabled={props.isTimeInPromo}
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
        value={val.point}
        min={index1 > 0 ? coin[index1 - 1].point : 0}
        type="number"
        name="pucharseTimes"
        onChange={e => handleChooseNumbItem("coin", index1, e)}
        style={{ width: "10%" }}
        disabled={props.isTimeInPromo}
      ></Input>
      ...
      <Select
        value={val.rewards}
        style={{ width: "15%" }}
        dropdownClassName='dropdown-coin-event'
        showArrow={false}
        className='select-coin-event'
        disabled={props.isTimeInPromo}
      >
        {printItemsEvent}
      </Select>{" "}
      <span onClick={() => showModal(index1)}>show item COIN</span>
      <span onClick={() => reduceItem("coin", index1)}disabled={props.isTimeInPromo}>xóa item</span>
    </Col>
  ));
  const defaultEventInput = () => {
    if (
      props.typeEventByMoney === "INKIND" &&
      props.nameEventByMoney === "MONEY"
    ) {
      return true;
    } else {
      return false;
    }
  };
  const printItemPartner = item.map((val, index1) => (
    <Col md={24} key={index1}>
      TỪ
      <Input
        value={val.point}
        min={index1 > 0 ? item[index1 - 1].point : 0}
        type="number"
        name="pucharseTimes"
        onChange={e => handleChooseNumbItem("item", index1, e)}
        style={{ width: "10%" }}
        disabled={props.isTimeInPromo}
      ></Input>
      ...
      <Select
        mode="multiple"
        value={val.rewards}
        style={{ width: "90%" }}
        onChange={value => handleChooseItemPartner(index1, value)}
        disabled={props.isTimeInPromo}
      >
        {printListItems}
      </Select>{" "}
      <Button onClick={() => reduceItem("item", index1)} disabled={props.isTimeInPromo}>xóa item</Button>
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
        <Button onClick={() => submitUpdateEvent()}>Xác nhận</Button>
      </div>
      <Row>
        {props.typeEventByMoney === "COIN" && (
          <>
            {printItemCoin}
            <Button onClick={() => addItem("coin")} disabled={props.isTimeInPromo}>Thêm điều kiện</Button>
          </>
        )}
        {defaultEventInput() && (
          <>
            {printItemInkind}
            <Button onClick={() => addItem("inkind")} disabled={props.isTimeInPromo}>Thêm điều kiện</Button>
          </>
        )}
        {props.typeEventByMoney === "ITEM" && (
          <>
            {printItemPartner}
            <Button onClick={() => addItem("item")} disabled={props.isTimeInPromo}>Thêm điều kiện</Button>
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
        <Radio.Group onChange={e => handleSelectCoinEvent(e)}>
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
    indexConfig: state.indexConfig
  };
}
export default connect(mapStateToProps, null)(InputRewardForShowByMoney);
