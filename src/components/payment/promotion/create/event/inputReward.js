import React, { useState, useMemo, useEffect } from "react";
import { Button, Input, Row, Col, Select, Modal, Radio, Icon } from "antd";
import moment from "moment";
import {
  createPromotion,
  createItemEvent,
  createEvent
} from "../../../../../utils/mutation/promotion";
import {
  checkMainInfoPromoAndEvent,
  checkRewardsIsEmtry,
  checkPoint,
  alertErrorNamePromo,
  alertErrorItemPromo,
  checkEndHour,
  checkStartHour
} from "../../promoService";
import { alertErrorServer } from '../../../../../utils/alertErrorAll'
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
    itemsForEventTypeMoney: [{ productName: "", partnerProductId: "" }]
  });
  const [coinEvent, setCoinEvent] = useState([
    { productId: "", productName: "" }
  ]);
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
    endTime,
    linkUrl
  } = props.indexPromoAndEvent;
  const [rowItems, setRowItems] = useState(0);
  const [itemNumb, setItemNumb] = useState(null);
  const [indexShop, setIndexShop] = useState([
    {
      point: 1,
      rewards: []
    }
  ]);
  const { isShow, itemsForEventTypeMoney } = listItemForEvent;
  const resetInput = useMemo(() => {
    setIndexShop([
      {
        point: 1,
        rewards: []
      }
    ]);
  }, [props.typeEventByMoney]);
  const [getItemsForEvent] = useLazyQuery(getListItemsForEvent, {
    fetchPolicy: "cache-and-network",
    onCompleted: data => {
      setCoinEvent(data.listProducts);
    },
    onError: index => alertErrorServer(index.networkError.result.errors[0].message)
  });
  const [getPartnerProducts] = useLazyQuery(getListPartnerProducts(platformId), {
    fetchPolicy: "cache-and-network",
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
    },
    onError: index => alertErrorServer(index.networkError.result.errors[0].message)
  });
  useEffect(() => {
    getItemsForEvent();
    getPartnerProducts();
  }, [])
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
      const newItem1 = {
        productName: data.createProduct.productName,
        productId: data.createProduct.productId
      };
      setCoinEvent([...coinEvent, newItem1]);
      const newItem2 = [...indexShop];
      newItem2[rowItems].rewards[0] = data.createProduct.productId;
      setIndexShop(newItem2);
    }
  });
  const [createEventByMoney] = useMutation(createEvent, {
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
          type: props.typeEventByMoney,
          data: indexShop
        }),
        linkUrl: linkUrl,
        imageUrl: props.imageUrl
      }
    },
    onCompleted: data => {
      isUpdate
        ? dispatchSaveIdCreateInUpdate(data.createEvent.id)
        : console.log(data);
    }
  });
  const [createEventByMoneyForItem] = useMutation(createEvent, {
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
          hour: [checkStartHour(startTime), checkEndHour(endTime)]
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
      isUpdate
        ? dispatchSaveIdCreateInUpdate(data.createEvent.id)
        : console.log(data);
    }
  });
  const submitCreateEvent = async () => {
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
        if (checkRewardsIsEmtry(indexShop) && checkPoint(indexShop)) {
          await createEventByMoney();
          props.successAlert(true);
        } else {
          alertErrorItemPromo();
        }
      } else if (props.nameEventByMoney === "COIN") {
        if (
          checkRewardsIsEmtry(indexShop) &&
          checkPoint(indexShop) &&
          platformId !== "" &&
          server !== ""
        ) {
          await createEventByMoneyForItem();
          props.successAlert(true);
        } else {
          alertErrorItemPromo();
        }
      }
    } else {
      alertErrorNamePromo();
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
  const printItem = indexShop.map(function(val, index1) {
    return (
      <div
        key={index1}
        style={{ display: "flex", alignItems: "center", marginBottom: "1rem" }}
      >
        <div style={{ width: "15%", display: "flex", alignItems: "center" }}>
          <span style={{ marginRight: ".2rem" }}>From</span>
          <Input
            value={indexShop[index1].point}
            min={index1 > 0 ? indexShop[index1 - 1].point : 0}
            type="number"
            name="pucharseTimes"
            onChange={e => handleChooseNumbItem(index1, e)}
          ></Input>
          <span style={{ marginLeft: ".2rem" }}>
            {props.nameEventByMoney === "MONEY" ? "VNĐ" : "C.COIN"}
          </span>
        </div>
        <div className="promo-input-item-input">
          {props.typeEventByMoney === "INKIND" && (
            <div className='promo-input-coin-event'>
              <Input
                value={indexShop[index1].rewards[0]}
                placeholder="-Input name of gift out game-"
                name="pucharseTimes"
                onChange={e => handleChooseIsKind(index1, e)}
                style={{ width: "45%" }}
              ></Input>
              <Icon
                type="close"
                onClick={() => reduceItem(index1)}
                style={{ fontSize: "16px", margin: "0 .25rem" }}
              />
            </div>
          )}
          {props.typeEventByMoney === "COIN" && (
            <div className='promo-input-coin-event'>
              <div style={{ width: "35%",display: "flex", alignItems: "center" }}>
                <Select
                  value={indexShop[index1].rewards[0]}
                  dropdownClassName="dropdown-coin-event"
                  showArrow={false}
                  style={{ width: "90%" }}
                  className="select-coin-event"
                >
                  {printListItemsEvent}
                </Select>{" "}
                <Icon type="menu" onClick={() => showModal(index1)} style={{ fontSize: "24px", margin: "0 .25rem" }} />
              </div>
              <Icon
                type="close"
                onClick={() => reduceItem(index1)}
                style={{ fontSize: "16px", margin: "0 .25rem" }}
              />
            </div>
          )}
          {props.typeEventByMoney === "ITEM" && (
            <div className='promo-input-coin-event'>
              <Select
                mode="multiple"
                value={indexShop[index1].rewards}
                style={{ width: "80%" }}
                onChange={value => handleChooseItem(index1, value)}
              >
                {printListItems}
              </Select>{" "}
              <Icon
                type="close"
                onClick={() => reduceItem(index1)}
                style={{ fontSize: "16px", margin: "0 .25rem" }}
              />
            </div>
          )}
        </div>
      </div>
    );
  });
  return (
    <div className="section4-promotion">
     <div style={{ width: "100%" }} className="section4-promotion-title">
        <div className="promo-input-title-numb">
          <span>Total price of purchase from</span>
        </div>
        <div className="promo-input-title-item">
          <span>Gift's out game</span>
        </div>
      </div>
      <div className="btn-create-promo">
        <Button>Cancel</Button>
        <Button onClick={submitCreateEvent}>Submit</Button>
      </div>
      <Row className="promo-input-item">
        {printItem}
        <Button onClick={() => addItem()}>Add more conditions</Button>
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
            onChange={e => setItemNumb(e.target.value)}
          ></Input>
          <Button onClick={submitCreateItem}>Submit</Button>
        </div>
        <Radio.Group onChange={e => setCoinForEventTypeMoney(e)}>
          {printItemsForEventTypeMoney}
        </Radio.Group>
      </Modal>
    </div>
  );
}

function mapStateToProps(state) {
  return {
    typeEventByMoney: state.typeEventByMoney,
    nameEventByMoney: state.nameEventByMoney
  };
}
export default connect(mapStateToProps, null)(InputrewardForShowByMoney);
