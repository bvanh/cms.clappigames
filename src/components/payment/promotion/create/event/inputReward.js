import React, { useState, useMemo, isValidElement } from "react";
import { Button, Input, Row, Col, Select, Modal, Radio } from "antd";
import moment from "moment";
import {
  createPromotion,
  createItemEvent,
  createEvent
} from "../../../../../utils/mutation/promotion";
import {
  checkMainInfoPromoAndEvent,
  checkRewardsIsEmtry
} from "../../promoService";
import { dispatchSaveIdCreateInUpdate } from "../../../../../redux/actions/index";
import { useLazyQuery, useMutation, useQuery } from "@apollo/react-hooks";
import { connect } from "react-redux";
import { getListItemsForEvent } from "../../../../../utils/query/promotion";
import { getListPartnerProducts } from "../../../../../utils/queryPartnerProducts";
const { Option } = Select;
function InputrewardForShowByMoney(props) {
  const { isUpdate } = props;
  const [listItemForEvent, setListItemForEvent] = useState({
    isShow: false,
    itemsForEventTypeMoney: [{ productName: "", partnerProductId: "" }],
  });
  const [coinEvent, setCoinEvent] = useState([{ productId: "", productName: "" }])
  const {
    name,
    platformId,
    server,
    status,
    promoType,
    timeTotal,
    dates,
    daily,
    startTime,
    endTime
  } = props.indexPromoAndEvent;
  const [rowItems, setRowItems] = useState(0);
  const [itemNumb, setItemNumb] = useState(null);
  const [indexShop, setIndexShop] = useState([
    {
      point: 1,
      rewards: []
    }
  ]);
  useQuery(getListItemsForEvent, {
    onCompleted: data => {
      setCoinEvent(data.listProducts);
    }
  });
  const { isShow, itemsForEventTypeMoney } = listItemForEvent;
  const resetInput = useMemo(() => {
    setIndexShop([
      {
        point: 1,
        rewards: []
      }
    ]);
  }, [props.typeEventByMoney]);
  useQuery(getListPartnerProducts(platformId), {
    onCompleted: data => {
      setListItemForEvent({
        ...listItemForEvent,
        itemsForEventTypeMoney: data.listPartnerProducts
      });
      setIndexShop([
        {
          point: 1,
          rewards: []
        }
      ]);
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
        baseCoin: Number(itemNumb)
      }
    },
    onCompleted: async data => {
      const demo = {
        productName: data.createProduct.productName,
        productId: data.createProduct.productId
      };
      const newCoinEvent = [...listItemForEvent.coinEvent, demo];
      setListItemForEvent({ ...listItemForEvent, coinEvent: newCoinEvent });
      const newItem = [...indexShop];
      newItem[rowItems].rewards[0] = data.createProduct.productId;
      setIndexShop(newItem);
    }
  });
  const [createEventByMoney] = useMutation(createEvent, {
    variables: {
      req: {
        name: name,
        status: status,
        paymentType: props.nameEventByMoney,
        eventTime: JSON.stringify({
          startTime: moment(timeTotal[0]).format("YYYY-MM-DD hh:mm"),
          endTime: moment(timeTotal[1]).format("YYYY-MM-DD hh:mm"),
          dates: dates,
          daily: daily,
          hour: [startTime, endTime]
        }),
        config: JSON.stringify({
          type: props.typeEventByMoney,
          data: indexShop
        })
      }
    },
    onCompleted: data => {
      isUpdate ? dispatchSaveIdCreateInUpdate(data.createEvents.id) : console.log(data);
    }
  });
  const [createEventByMoneyForItem] = useMutation(createEvent, {
    variables: {
      req: {
        name: name,
        status: status,
        paymentType: props.nameEventByMoney,
        eventTime: JSON.stringify({
          startTime: timeTotal[0],
          endTime: timeTotal[1],
          dates: dates,
          daily: daily,
          hour: [startTime, endTime]
        }),
        config: JSON.stringify({
          game: platformId,
          server: server,
          type: props.typeEventByMoney,
          data: indexShop
        })
      }
    },
    onCompleted: data => {
      isUpdate ? dispatchSaveIdCreateInUpdate(data.createEvents.id) : console.log(data);
    }
  });
  const submitCreateEvent = async () => {
    if (
      checkMainInfoPromoAndEvent(
        name,
        props.nameEventByMoney,
        timeTotal[0],
        startTime,
        endTime,
        dates,
        daily
      )
    ) {
      if (props.nameEventByMoney === "MONEY") {
        if (checkRewardsIsEmtry(indexShop)) {
          await createEventByMoney();
          props.successAlert();
        } else {
          console.log("money");
          alert("kiểm tra và điền đầy đủ thông tin");
        }
      } else if (props.nameEventByMoney === "COIN") {
        if (
          checkRewardsIsEmtry(indexShop) &&
          platformId !== "" &&
          server !== ""
        ) {
          await createEventByMoneyForItem();
          props.successAlert();
        } else {
          console.log("coin");
          alert("kiểm tra và điền đầy đủ thông tin");
        }
      }
    } else {
      alert("kiểm tra và điền đầy đủ thông tin");
    }
  };
  const addItem = () => {
    const newItem = {
      point: indexShop[indexShop.length - 1].point,
      rewards: []
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
    newItem[positionItem].rewards = value;
    setIndexShop(newItem);
  };
  const handleChooseNumbItem = (positionItem, e) => {
    const newItem = [...indexShop];
    newItem[positionItem].point =
      e.target.value !== "" ? Number(e.target.value) : "";
    setIndexShop(newItem);
  };
  const handleChooseIsKind = (positionItem, e) => {
    const newItem = [...indexShop];
    newItem[positionItem].rewards[0] = e.target.value;
    setIndexShop(newItem);
  };
  const setCoinForEventTypeMoney = e => {
    const newItem = [...indexShop];
    newItem[rowItems].rewards = [e.target.value];
    setIndexShop(newItem);
    setItemNumb(null);
  };
  const submitCreateItem = async () => {
    if (itemNumb !== null) {
      createNewItemEvent();
      setListItemForEvent({ ...listItemForEvent, isShow: false });
    }
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
  const printListItemsEvent = coinEvent.map((val, index) => (
    <Option value={val.productId} key={index}>
      {val.productName}
    </Option>
  ));
  const printItemsForEventTypeMoney = coinEvent.map((val, i) => (
    <Col span={24} key={i}>
      <Radio
        style={{ display: "block", height: "30px", lineHeight: "30px" }}
        value={val.productId}
      >
        {val.productName}
      </Radio>
    </Col>
  ));
  const printItem = indexShop.map(function (val, index1) {
    return (
      <div key={index1}>
        <Col md={24}>
          TỪ
          <Input
            value={indexShop[index1].point}
            min={index1 > 0 ? indexShop[index1 - 1].point : 0}
            type="number"
            name="pucharseTimes"
            onChange={e => handleChooseNumbItem(index1, e)}
            style={{ width: "10%" }}
          ></Input>
          {props.nameEventByMoney === "MONEY" ? "VNĐ" : "C.COIN"}
          {props.typeEventByMoney === "INKIND" && (
            <Input
              value={indexShop[index1].rewards[0]}
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
                value={indexShop[index1].rewards[0]}
                style={{ width: "90%" }}
              >
                {printListItemsEvent}
              </Select>{" "}
              <span onClick={() => showModal(index1)}>show item COIN</span>
              <span onClick={() => reduceItem(index1)}>xóa item</span>
            </>
          )}
          {props.typeEventByMoney === "ITEM" && (
            <>
              <Select
                mode="multiple"
                value={indexShop[index1].rewards}
                style={{ width: "90%" }}
                onChange={value => handleChooseItem(index1, value)}
              >
                {printListItems}
              </Select>{" "}
              {/* <span
                onClick={() =>
                  setListItemForEvent({ ...listItemForEvent, isShow: true })
                }
              >
                show item
              </span> */}
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
        <Button onClick={submitCreateEvent}>Tạo khuyến mãi</Button>
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
    typeEventByMoney: state.typeEventByMoney,
    nameEventByMoney: state.nameEventByMoney
  };
}
export default connect(mapStateToProps, null)(InputrewardForShowByMoney);
