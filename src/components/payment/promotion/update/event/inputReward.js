import React, { useState, useMemo, useEffect } from "react";
import { Button, Input, Row, Col, Select, Modal, Radio, Icon } from "antd";
import {
  createItemEvent,
  updateEvent,
} from "../../../../../utils/mutation/promotion";
import { alertErrorServer } from "../../../../../utils/alertErrorAll";
import { useMutation, useQuery } from "@apollo/react-hooks";
import { connect } from "react-redux";
import {
  checkPoint,
  checkMainInfoPromoAndEvent,
  checkRewardsIsEmtry,
  alertErrorNamePromo,
  alertErrorItemPromo,
  checkStartHour,
  checkEndHour,
} from "../../promoService";
import { getListPartnerProducts } from "../../../../../utils/queryPartnerProducts";
import {
  dispatchTypeEventByMoney,
  dispatchAddItemPromo,
  dispatchReduceItemPromo,
  dispatchSeclectItemPartnerPromo,
  dispatchSeclectNumbItem,
  dispatchSelectItemInkind,
  dispatchSelectCoinEvent,
} from "../../../../../redux/actions";
const { Option } = Select;
function InputRewardForShowByMoney(props) {
  const { indexEventByMoney } = props;
  const { type } = JSON.parse(props.detailPromo.config);
  const [listItemForEvent, setListItemForEvent] = useState({
    isShow: false,
    itemsForEventTypeMoney: [{ productName: "", partnerProductId: "" }],
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
    endTime,
    linkUrlUpdate,
    prefixPromo,
  } = props.indexPromoAndEvent;
  useEffect(() => {
    dispatchTypeEventByMoney(type);
    props.setIsCreatePromo(false);
  }, []);
  useQuery(getListPartnerProducts(platformId), {
    onCompleted: (data) => {
      setListItemForEvent({
        ...listItemForEvent,
        itemsForEventTypeMoney: data.listPartnerProducts,
      });
    },
    onError: (index) => alertErrorServer(index.message),
  });
  const [createNewItemEvent] = useMutation(createItemEvent, {
    variables: {
      req: {
        productName: `${itemNumb} coin`,
        type: "EVENT",
        status: "COMPLETE",
        sort: 0,
        price: itemNumb * 1000,
        basecoin: itemNumb,
      },
    },
    onCompleted: async (data) => {
      const newIndexEvent = { ...props.indexEventByMoney };
      newIndexEvent.itemsForEventByMoney = [
        ...props.indexEventByMoney.itemsForEventByMoney,
        data.createProduct,
      ];
      props.setIndexEventByMoney(newIndexEvent);
      dispatchSelectCoinEvent({
        positionItem: rowItems,
        value: data.createProduct.productId,
      });
    },
    onError: (index) => alertErrorServer(index.message),
  });
  const mainInfo = {
    name: name,
    status: status,
    paymentType: props.nameEventByMoney,
    eventTime: JSON.stringify({
      startTime: timeTotal[0],
      endTime: timeTotal[1],
      dates: dates,
      days: daily,
      hours: [checkStartHour(startTime), checkEndHour(endTime)],
    }),
    prefix: prefixPromo,
    linkUrl: linkUrlUpdate,
    imageUrl: props.imageUrl,
  };
  const [updateEventByInkind] = useMutation(updateEvent, {
    variables: {
      id: id,
      req: {
        ...mainInfo,
        config: JSON.stringify({
          type: props.typeEventByMoney,
          data: inkind,
        }),
      },
    },
    onCompleted: (data) => props.successAlert(false),
    onError: (index) => alertErrorServer(index.message),
  });
  const [updateEventByCoin] = useMutation(updateEvent, {
    variables: {
      id: id,
      req: {
        ...mainInfo,
        config: JSON.stringify({
          type: props.typeEventByMoney,
          data: coin,
        }),
      },
    },
    onCompleted: (data) => props.successAlert(false),
    onError: (index) => alertErrorServer(index.message),
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
          data: item,
        }),
      },
    },
    onCompleted: (data) => props.successAlert(false),
    onError: (index) => alertErrorServer(index.message),
  });
  const submitUpdateEvent = async () => {
    if (
      checkMainInfoPromoAndEvent(
        name,
        props.nameEventByMoney,
        timeTotal[0],
        startTime,
        endTime
      )
    ) {
      if (props.nameEventByMoney === "MONEY") {
        if (
          props.typeEventByMoney === "INKIND" &&
          checkPoint(inkind) &&
          checkRewardsIsEmtry(inkind)
        ) {
        updateEventByInkind();
          
        } else if (checkPoint(coin) && checkRewardsIsEmtry(coin)) {
         updateEventByCoin();
        
        }
      } else if (
        props.nameEventByMoney === "COIN" &&
        checkPoint(item) &&
        checkRewardsIsEmtry(item) &&
        platformId !== "" &&
        server !== ""
      ) {
         updateEventByItem();
      } else {
        alertErrorItemPromo();
      }
    } else {
      alertErrorNamePromo();
    }
  };
  const addItem = (val) => {
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
      value: value,
    });
  };
  const handleChooseNumbItem = (isType, positionItem, e) => {
    dispatchSeclectNumbItem({
      isType: isType,
      positionItem: positionItem,
      value: e.target.value !== "" ? Number(e.target.value) : "",
    });
  };
  const handleChooseInKind = (positionItem, e) => {
    dispatchSelectItemInkind({
      positionItem: positionItem,
      value: e.target.value,
    });
  };
  const handleSelectCoinEvent = (e) => {
    dispatchSelectCoinEvent({
      positionItem: rowItems,
      value: e.target.value,
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
  const showModal = async (val) => {
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
  const printItemInkind = inkind.map(function (val, index1) {
    return (
      <div
        style={{ display: "flex", alignItems: "center", marginBottom: "1rem" }}
        key={index1}
      >
        <div style={{ width: "15%", display: "flex", alignItems: "center" }}>
          <span style={{ marginRight: ".2rem" }}>From</span>
          <Input
            value={val.point}
            min={index1 > 0 ? inkind[index1 - 1].point : 0}
            type="number"
            name="pucharseTimes"
            style={{ width: "45%" }}
            onChange={(e) => handleChooseNumbItem("inkind", index1, e)}
            disabled={props.isTimeInPromo}
          ></Input>
          VNĐ
        </div>
        <div className="promo-input-coin-event">
          <Input
            value={val.rewards[0]}
            placeholder="-Input name of gift out game-"
            name="pucharseTimes"
            onChange={(e) => handleChooseInKind(index1, e)}
            style={{ width: "45%" }}
            disabled={props.isTimeInPromo}
          ></Input>
          <Icon
            type="close"
            onClick={() => reduceItem("inkind", index1)}
            style={{ fontSize: "16px", margin: "0 .25rem" }}
          />
        </div>
      </div>
    );
  });
  const printItemCoin = coin.map((val, index1) => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        marginBottom: "1rem",
        padding: "1rem",
      }}
      key={index1}
    >
      <div style={{ width: "20%", display: "flex", alignItems: "center" }}>
        <span style={{ marginRight: ".2rem" }}>From</span>
        <Input
          value={val.point}
          min={index1 > 0 ? coin[index1 - 1].point : 0}
          type="number"
          name="pucharseTimes"
          onChange={(e) => handleChooseNumbItem("coin", index1, e)}
          disabled={props.isTimeInPromo}
        ></Input>
        <span style={{ marginLeft: ".2rem" }}>
          {props.nameEventByMoney === "MONEY" ? "VNĐ" : "C.COIN"}
        </span>
      </div>
      <div
        className="promo-input-coin-event"
        style={{ width: "80%", paddingLeft: "1rem" }}
      >
        <div style={{ width: "35%", display: "flex", alignItems: "center" }}>
          <Select
            value={val.rewards}
            dropdownClassName="dropdown-coin-event"
            showArrow={false}
            style={{ width: "90%" }}
            className="select-coin-event"
            disabled={props.isTimeInPromo}
          >
            {printItemsEvent}
          </Select>{" "}
          <Icon
            type="menu"
            onClick={() => showModal(index1)}
            style={{ fontSize: "24px", margin: "0 .25rem" }}
          />
        </div>
        <Icon
          type="close"
          onClick={() => reduceItem("coin", index1)}
          disabled={props.isTimeInPromo}
          style={{ fontSize: "16px", margin: "0 .25rem" }}
        />
      </div>
    </div>
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
    <div
      style={{ display: "flex", alignItems: "center", marginBottom: "1rem" }}
      key={index1}
    >
      <div style={{ width: "15%", display: "flex", alignItems: "center" }}>
        <span style={{ marginRight: ".2rem" }}>From</span>
        <Input
          value={val.point}
          min={index1 > 0 ? item[index1 - 1].point : 0}
          type="number"
          name="pucharseTimes"
          onChange={(e) => handleChooseNumbItem("item", index1, e)}
          disabled={props.isTimeInPromo}
        ></Input>
        <span style={{ marginLeft: ".2rem" }}>
          {props.nameEventByMoney === "MONEY" ? "VNĐ" : "C.COIN"}
        </span>
      </div>
      <div className="promo-input-item-input">
        <Select
          mode="multiple"
          value={val.rewards}
          style={{ width: "90%" }}
          onChange={(value) => handleChooseItemPartner(index1, value)}
          disabled={props.isTimeInPromo}
        >
          {printListItems}
        </Select>{" "}
        <Icon
          type="close"
          onClick={() => reduceItem("item", index1)}
          disabled={props.isTimeInPromo}
          style={{ fontSize: "16px", margin: "0 .25rem" }}
        />
      </div>
    </div>
  ));
  return (
    <div className="section4-promotion">
      <div style={{ width: "100%" }} className="section4-promotion-title">
        <div className="promo-input-title-numb">
          <span>Total price of purchase from</span>
        </div>
        <div className="promo-input-title-item">
          <span>Present</span>
        </div>
      </div>
      <Button onClick={() => submitUpdateEvent()} className="btn-create-promo">
        Update
      </Button>
      <Row>
        {props.typeEventByMoney === "COIN" && (
          <>
            {printItemCoin}
            <Button
              onClick={() => addItem("coin")}
              disabled={props.isTimeInPromo}
              className="btn-more-item"
            >
              Add more conditions
            </Button>
          </>
        )}
        {defaultEventInput() && (
          <>
            {printItemInkind}
            <Button
              onClick={() => addItem("inkind")}
              disabled={props.isTimeInPromo}
              className="btn-more-item"
            >
              Add more conditions
            </Button>
          </>
        )}
        {props.typeEventByMoney === "ITEM" && (
          <div className="promo-input-item">
            {printItemPartner}
            <Button
              onClick={() => addItem("item")}
              disabled={props.isTimeInPromo}
              className="btn-more-item"
            >
              Add more conditions
            </Button>
          </div>
        )}
      </Row>
      <Modal
        title="Choose C.coin package"
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
            placeholder="Input volume c.coin package..."
            value={itemNumb}
            onChange={(e) => setItemNumb(e.target.value)}
          ></Input>
          <Button onClick={submitCreateItem} style={{ marginLeft: ".2rem" }}>
            Submit
          </Button>
        </div>
        <Radio.Group onChange={(e) => handleSelectCoinEvent(e)}>
          {printItemsForEventTypeMoney}
        </Radio.Group>
      </Modal>
    </div>
  );
}

function mapStateToProps(state) {
  return {
    typeEventByMoney: state.typeEventByMoney,
    nameEventByMoney: state.nameEventByMoney,
    detailPromo: state.detailPromo,
    indexConfig: state.indexConfig,
    imageUrl: state.urlImgThumbnail,
  };
}
export default connect(mapStateToProps, null)(InputRewardForShowByMoney);
