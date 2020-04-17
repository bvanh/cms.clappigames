import React, { useState } from "react";
import { Button, Input, Row, Col, Select, Icon } from "antd";
import { createPromotion } from "../../../../../utils/mutation/promotion";
import { dispatchSaveIdCreateInUpdate } from "../../../../../redux/actions/index";
import { alertErrorServer } from "../../../../../utils/alertErrorAll";
import { connect } from "react-redux";
import { useLazyQuery, useMutation, useQuery } from "@apollo/react-hooks";
import { getListPartnerProducts } from "../../../../../utils/queryPartnerProducts";
import {
  checkMainInfoPromoAndEvent,
  checkItemIsEmtry,
  checkPurchaseItemIsEmtry,
  checkNumb,
  alertErrorNamePromo,
  alertErrorItemPromo,
  checkEndHour,
  checkStartHour,
} from "../../promoService";
const { Option } = Select;
function EventByItems(props) {
  const [itemsForEventTypeItem, setItemForEventTypeItem] = useState([
    { productName: "", partnerProductId: "" },
  ]);
  const {
    name,
    status,
    type,
    timeTotal,
    dates,
    daily,
    startTime,
    endTime,
    linkUrl,
    prefixPromo,
  } = props.indexPromoAndEvent;
  const { platformId, server } = props.indexGameForPromo;
  const { indexShop, isUpdate } = props;
  useQuery(getListPartnerProducts(platformId), {
    onCompleted: (data) => {
      setItemForEventTypeItem(data.listPartnerProducts);
    },
    onError: (index) => alertErrorServer(index.message),
  });
  const [createPromo] = useMutation(createPromotion, {
    variables: {
      req: {
        name: name,
        type: type,
        status: status,
        game: platformId,
        server: server,
        shop: JSON.stringify(indexShop),
        eventTime: JSON.stringify({
          startTime: timeTotal[0],
          endTime: timeTotal[1],
          dates: dates,
          daily: daily,
          hour: [checkStartHour(startTime), checkEndHour(endTime)],
        }),
        linkUrl: linkUrl,
        prefix: prefixPromo,
        imageUrl: props.imageUrl,
      },
    },
    onCompleted: (data) => {
      props.successAlert(true);
      isUpdate
        ? dispatchSaveIdCreateInUpdate(data.createPromotion.id)
        : console.log(data);
    },
    onError: (index) => alertErrorServer(index.message),
  });
  const submitCreatePromo = async () => {
    if (
      checkMainInfoPromoAndEvent(name, type, timeTotal[0], startTime, endTime)
    ) {
      if (
        checkPurchaseItemIsEmtry(indexShop) &&
        checkNumb(indexShop) &&
        checkItemIsEmtry(indexShop) &&
        server !== "" &&
        platformId !== ""
      ) {
        createPromo();
      } else {
        alertErrorItemPromo();
      }
    } else {
      alertErrorNamePromo();
    }
  };

  const addItem = () => {
    const newItem = {
      purchaseTimes: indexShop[indexShop.length - 1].purchaseTimes,
      purchaseItemId: [],
      rewards: [
        {
          numb: 1,
          itemId: [],
        },
      ],
    };
    props.setIndexShop([...indexShop, newItem]);
  };
  const reduceItem = async (val) => {
    if (val !== 0) {
      const newItem = await indexShop.filter((value, index) => index !== val);
      props.setIndexShop(newItem);
    }
  };
  const addReward = async (i) => {
    const newReward = {
      numb: 1,
      itemId: [],
    };
    const newShop = [...indexShop];
    newShop[i].rewards = [...newShop[i].rewards, newReward];
    props.setIndexShop(newShop);
  };
  const reduceReward = async (numberItem, indexReward) => {
    const newShop = [...indexShop];
    if (indexShop[numberItem].rewards.length > 1) {
      const newReward = await indexShop[numberItem].rewards.filter(
        (value, i) => indexReward !== i
      );
      newShop[numberItem].rewards = newReward;
      props.setIndexShop(newShop);
    }
  };
  const handleChooseReward = (positionItem, positionReward, val) => {
    const newItem = [...indexShop];
    newItem[positionItem].rewards[positionReward].itemId = val;
    props.setIndexShop(newItem);
  };
  const handleChooseNumbReward = (positionItem, positionReward, e) => {
    const newItem = [...indexShop];
    newItem[positionItem].rewards[positionReward].numb =
      e.target.value !== "" ? Number(e.target.value) : "";
    props.setIndexShop(newItem);
  };
  const handleChooseItem = (positionItem, value) => {
    const newItem = [...indexShop];
    newItem[positionItem].purchaseItemId = value;
    props.setIndexShop(newItem);
  };
  const handleChooseNumbItem = (positionItem, e) => {
    const newItem = [...indexShop];
    newItem[positionItem].purchaseTimes =
      e.target.value !== "" ? Number(e.target.value) : "";
    props.setIndexShop(newItem);
  };
  const printListItems = itemsForEventTypeItem.map((val, index) => (
    <Option value={val.partnerProductId} key={index}>
      {val.productName}
    </Option>
  ));
  const printItem = indexShop.map(function (val, index1) {
    const printReward = val.rewards.map((valReward, index2) => (
      <div key={index2} className="more-reward">
        <Icon
          type="minus"
          onClick={() => reduceReward(index1, index2)}
          style={{ fontSize: "16px", margin: "0 .25rem" }}
        />
        <Input
          value={indexShop[index1].rewards[index2].numb}
          type="number"
          name="pucharseTimes"
          onChange={(e) => handleChooseNumbReward(index1, index2, e)}
          style={{ width: "20%" }}
        ></Input>
        <Select
          mode="multiple"
          value={indexShop[index1].rewards[index2].itemId}
          style={{ width: "80%" }}
          onChange={(value) => handleChooseReward(index1, index2, value)}
        >
          {printListItems}
        </Select>{" "}
      </div>
    ));
    return (
      <div key={index1}>
        <Col md={12} className="more-items">
          <Icon
            type="close"
            onClick={() => reduceItem(index1)}
            style={{ fontSize: "16px", margin: "0 .25rem" }}
          />
          <Input
            value={indexShop[index1].purchaseTimes}
            type="number"
            min={index1 > 0 ? indexShop[index1 - 1].purchaseTimes : 0}
            name="pucharseTimes"
            onChange={(e) => handleChooseNumbItem(index1, e)}
            style={{ width: "20%" }}
          ></Input>
          <Select
            value={indexShop[index1].purchaseItemId}
            style={{ width: "80%" }}
            onChange={(value) => handleChooseItem(index1, value)}
          >
            {printListItems}
          </Select>{" "}
        </Col>
        <Col md={12} style={{ padding: "1rem 1rem 1rem .25rem" }}>
          {printReward}
          <Button
            onClick={() => addReward(index1)}
            style={{ marginLeft: "1.5rem" }}
          >
            Add more present
          </Button>
        </Col>
      </div>
    );
  });
  return (
    <div className="section4-promotion">
      <div style={{ width: "100%" }} className="section4-promotion-title">
        <div style={{ width: "50%", display: "flex" }}>
          <div style={{ width: "20%" }}>The mount of item</div>
          <div style={{ width: "80%" }}>Item</div>
        </div>
        <div style={{ width: "50%", display: "flex", paddingLeft: "1.5rem" }}>
          <div style={{ width: "20%" }}>Amount</div>
          <div style={{ width: "80%" }}>Present</div>
        </div>
      </div>

      <Button onClick={submitCreatePromo} className="btn-create-promo">
        {isUpdate ? "Update" : "Submit"}
      </Button>

      <Row>
        {printItem}
        <Button onClick={() => addItem()} style={{ margin: "1rem 1.5rem" }}>
          Add more conditions
        </Button>
      </Row>
    </div>
  );
}
function mapStateToProps(state) {
  return {
    imageUrl: state.urlImgThumbnail,
  };
}
export default connect(mapStateToProps, null)(EventByItems);
