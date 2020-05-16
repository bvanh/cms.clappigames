import React, { useState, useMemo, useEffect } from "react";
import { Button, Input, Row, Col, Select, Modal, Radio, Icon } from "antd";
import moment from "moment";
import {
  createPromotion,
  createItemEvent,
  createEvent,
} from "../../../../../utils/mutation/promotion";
import {
  checkMainInfoPromoAndEvent,
  checkRewardsIsEmtry,
  checkPoint,
  alertErrorNamePromo,
  alertErrorItemPromo,
  checkEndHour,
  checkStartHour,
} from "../../promoService";
import { alertErrorServer } from "../../../../../utils/alertErrorAll";
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
  const [coinEvent, setCoinEvent] = useState([
    { productId: "", productName: "" },
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
    linkUrl,
    linkSupport,
    prefixPromo,
  } = props.indexPromoAndEvent;
  const [rowItems, setRowItems] = useState(0);
  const [itemNumb, setItemNumb] = useState(null);
  const [indexShop, setIndexShop] = useState([
    {
      point: 1,
      rewards: [],
    },
  ]);
  const [indexShop2, setIndexShop2] = useState([
    {
      point: 1,
      rewards: {
        type: "",
        id: "",
        name: ""
      }
    }
  ])
  const { isShow, itemsForEventTypeMoney } = listItemForEvent;
  const resetInput = useMemo(() => {
    setIndexShop([
      {
        point: 1,
        rewards: [],
      },
    ]);
  }, [props.typeEventByMoney]);
  useQuery(getListItemsForEvent, {
    fetchPolicy: "cache-and-network",
    onCompleted: (data) => {
      setCoinEvent(data.listProducts);
    },
    onError: (index) => alertErrorServer(index.message),
  });
  useQuery(getListPartnerProducts(platformId), {
    fetchPolicy: "cache-and-network",
    onCompleted: (data) => {
      setListItemForEvent({
        ...listItemForEvent,
        itemsForEventTypeMoney: data.listPartnerProducts,
      });
      setIndexShop([
        {
          point: 1,
          rewards: [],
        },
      ]);
    },
    onError: (index) => alertErrorServer(index.message),
  });
  // useMemo(()=>{

  // })
  // useEffect(() => {
  //   getItemsForEvent();
  //   getPartnerProducts();
  // }, [])
  const [createNewItemEvent] = useMutation(createItemEvent, {
    variables: {
      req: {
        productName: `${itemNumb} coin`,
        type: "EVENT",
        status: "COMPLETE",
        sort: 0,
        price: itemNumb * 1000,
        baseCoin: Number(itemNumb),
      },
    },
    onCompleted: async (data) => {
      const newItem1 = {
        productName: data.createProduct.productName,
        productId: data.createProduct.productId,
      };
      setCoinEvent([...coinEvent, newItem1]);
      const newItem2 = [...indexShop2];
      newItem2[rowItems].rewards.id = data.createProduct.productId;
      newItem2[rowItems].rewards.name = data.createProduct.productName;
      setIndexShop2(newItem2);
    },
    onError: (index) => alertErrorServer(index.message),
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
          days: daily,
          hours: [startTime, endTime],
        }),
        config: JSON.stringify({
          type: props.typeEventByMoney,
          data: indexShop,
        }),
        linkUrl: linkUrl,
        imageUrl: props.imageUrl,
        prefix: prefixPromo,
        supportUrl: linkSupport
      },
    },
    onCompleted: (data) => {
      props.successAlert(true);
      isUpdate
        ? dispatchSaveIdCreateInUpdate(data.createEvent.id)
        : console.log(data);
    },
    onError: (index) => alertErrorServer(index.message),
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
          days: daily,
          hours: [checkStartHour(startTime), checkEndHour(endTime)],
        }),
        config: JSON.stringify({
          game: platformId,
          server: server,
          type: props.typeEventByMoney,
          data: indexShop,
        }),
        linkUrl: linkUrl,
        imageUrl: props.imageUrl,
        prefix: prefixPromo,
        supportUrl: linkSupport
      },
    },
    onCompleted: (data) => {
      props.successAlert(true);
      isUpdate
        ? dispatchSaveIdCreateInUpdate(data.createEvent.id)
        : console.log(data);
    },
    onError: (index) => alertErrorServer(index.message),
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
          createEventByMoney();
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
          createEventByMoneyForItem();
        } else {
          alertErrorItemPromo();
        }
      }
    } else {
      alertErrorNamePromo();
    }
  };
  const changeTypeRewards = (positionItem, val) => {
    const newShop = [...indexShop2];
    newShop[positionItem].rewards.type = val;
    setIndexShop2(newShop)
  }
  const addItem2 = () => {
    const newItem = {
      point: indexShop2[indexShop2.length - 1].point,
      rewards: {
        type: "",
        id: '',
        name: ""
      },
    }
    setIndexShop2([...indexShop2, newItem])
  }
  const handleStep = (positionItem, value) => {
    const newItem = [...indexShop2];
    newItem[positionItem].point = value;
    setIndexShop2(newItem)
  }
  const handleChooseInKind = (positionItem, value) => {
    const newItem = [...indexShop2];
    newItem[positionItem].rewards.name = value;
    setIndexShop2(newItem)
  }
  const addItem = () => {
    const newItem = {
      point: indexShop[indexShop.length - 1].point,
      rewards: [],
    };
    setIndexShop([...indexShop, newItem]);
  };
  const reduceItem = async (val) => {
    if (val !== 0) {
      const newItem = await indexShop2.filter((value, index) => index !== val);
      setIndexShop2(newItem);
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
  const setCoinForEventTypeMoney = (e) => {
    const convertValue = JSON.parse(e)
    const newItem = [...indexShop2];
    newItem[rowItems].rewards.id = convertValue.id;
    newItem[rowItems].rewards.name = convertValue.name;
    setIndexShop(newItem);
    setItemNumb(null);
    console.log(e)
  };
  const submitCreateItem = async () => {
    if (itemNumb !== null) {
      createNewItemEvent();
      setListItemForEvent({ ...listItemForEvent, isShow: false });
    }
  };
  const showModal = async (val) => {
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
    <Option value={`{"id":"${val.productId}","name":"${val.productName}"}`} key={index}>
      {val.productName}
    </Option>
  ));
  const printItemsForEventTypeMoney = coinEvent.map((val, i) => (
    <Col span={24} key={i}>
      <Radio
        style={{ display: "block", height: "30px", lineHeight: "30px" }}
        value={`{"id":"${val.productId}","name":"${val.productName}"}`}
      >
        {val.productName}
      </Radio>
    </Col>
  ));
  console.log(indexShop2)
  const printItemOutGame = indexShop2.map(function (val, index1) {
    return (
      <div
        key={index1}
        style={{ display: "flex", alignItems: "center", marginBottom: "1rem" }}
      >
        <div style={{ width: "15%", display: "flex", alignItems: "center" }}>
          <span style={{ marginRight: ".2rem" }}>From</span>
          <Input
            value={indexShop2[index1].point}
            min={index1 > 0 ? indexShop2[index1 - 1].point : 0}
            type="number"
            name="pucharseTimes"
            onChange={(e) => handleStep(index1, e.target.value)}
          ></Input>
          <span style={{ marginLeft: ".2rem" }}>
            VNĐ
          </span>
        </div>
        <div className="promo-input-item-input">
          {val.rewards.type === "" && (
            <>
              <Button type="primary" onClick={() => changeTypeRewards(index1, 'INKIND')} ghost>
                Gift's out game
             </Button>
              <Button type="primary" onClick={() => changeTypeRewards(index1, 'COIN')} ghost>
                C.coin
             </Button>
            </>
          )}
          {val.rewards.type === "INKIND" && (
            <div className="promo-input-coin-event">
              <Input
                value={indexShop2[index1].rewards.name}
                placeholder="-Input name of gift out game-"
                name="pucharseTimes"
                onChange={(e) => handleChooseInKind(index1, e.target.value)}
                style={{ width: "45%" }}
              ></Input>
              <Icon
                type="close"
                onClick={() => reduceItem(index1)}
                style={{ fontSize: "16px", margin: "0 .25rem" }}
              />
            </div>
          )}
          {val.rewards.type === "COIN" && (
            <div className="promo-input-coin-event">
              <div
                style={{ width: "35%", display: "flex", alignItems: "center" }}
              >
                <Select
                  value={indexShop2[index1].rewards.id !== "" ? `{"id":"${indexShop2[index1].rewards.id}","name":"${indexShop2[index1].rewards.name}"}` : ""}
                  dropdownClassName="dropdown-coin-event"
                  showArrow={false}
                  style={{ width: "90%" }}
                  className="select-coin-event"
                >
                  {printListItemsEvent}
                </Select>{" "}
                <Icon
                  type="menu"
                  onClick={() => showModal(index1)}
                  style={{ fontSize: "24px", margin: "0 .25rem" }}
                />
              </div>
              <Icon
                type="close"
                onClick={() => reduceItem(index1)}
                style={{ fontSize: "16px", margin: "0 .25rem" }}
              />
            </div>
          )}
        </div>
      </div>
    )
  })
  const printItem = indexShop.map(function (val, index1) {
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
            onChange={(e) => handleChooseNumbItem(index1, e)}
          ></Input>
          <span style={{ marginLeft: ".2rem" }}>
            {props.nameEventByMoney === "MONEY" ? "VNĐ" : "C.COIN"}
          </span>
        </div>
        <div className="promo-input-item-input">
          <Select
            mode="multiple"
            value={indexShop[index1].rewards}
            style={{ width: "80%" }}
            onChange={(value) => handleChooseItem(index1, value)}
          >
            {printListItems}
          </Select>{" "}
          <Icon
            type="close"
            onClick={() => reduceItem(index1)}
            style={{ fontSize: "16px", margin: "0 .25rem" }}
          />
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
      <Button onClick={submitCreateEvent} className="btn-create-promo">
        {isUpdate ? "Update" : "Submit"}
      </Button>
      <Row className="promo-input-item">
        {props.typeEventByMoney === "ITEM" ? (
          <>
            {printItem}
            < Button onClick={() => addItem()}>Add more conditions </ Button>
          </>
        ) : (
            <>
              {printItemOutGame}
              <Button onClick={() => addItem2()}>Add more conditions</Button>
            </>
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
          <Button onClick={submitCreateItem}>
            Submit
          </Button>
        </div>
        <Radio.Group onChange={(e) => setCoinForEventTypeMoney(e.target.value)}>
          {printItemsForEventTypeMoney}
        </Radio.Group>
      </Modal>
    </div >
  );
}

function mapStateToProps(state) {
  return {
    typeEventByMoney: state.typeEventByMoney,
    nameEventByMoney: state.nameEventByMoney,
    imageUrl: state.urlImgThumbnail,
  };
}
export default connect(mapStateToProps, null)(InputrewardForShowByMoney);
