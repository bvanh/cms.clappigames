import React, { useState } from "react";
import { Button, Input, Row, Col, Select, Icon } from "antd";
import { createPromotion } from "../../../../../utils/mutation/promotion";
import { dispatchSaveIdCreateInUpdate } from "../../../../../redux/actions/index";
import { alertErrorServer } from "../../../../../utils/alertErrorAll";
import { connect } from "react-redux";
import { useLazyQuery, useMutation, useQuery } from "@apollo/react-hooks";
import { getListPartnerProducts } from "../../../../../utils/queryPartnerProducts";
import { initialIndexShop2 } from "../../promoService";
import {
  checkItemsPromoIsEmtry,
  checkStepEmtry,
  checkRewardsEmtry,
  checkDescriptionEmtry,
  checkMainInfoPromoAndEvent,
  checkItemIsEmtry,
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
  const { indexShop, isUpdate, indexShop2 } = props;
  const [itemSelected, setItemSelected] = useState([]);
  const [rewardsSelected, setRewardsSelected] = useState([[]])
  // const [itemDeselected, setItemDeselected] = useState({
  //   productName: "",
  //   productId: ""
  // })
  const itemsID = new Set(indexShop2.map(({ productId }) => productId));
  const filteredOptions = [
    ...itemsForEventTypeItem.filter(({ partnerProductId }) => !itemsID.has(partnerProductId))
  ];
  const filterRewards = (i) => {
    const rewardsID = new Set(rewardsSelected[i].map(({ productId }) => productId));
    const filterRewardsOptions = [
      ...itemsForEventTypeItem.filter(({ partnerProductId }) => !rewardsID.has(partnerProductId))
    ];
    return filterRewardsOptions;
  }
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
        gameId: platformId,
        server: server,
        shop: JSON.stringify(indexShop2),
        eventTime: JSON.stringify({
          dates: dates,
          days: daily,
          hours: [checkStartHour(startTime), checkEndHour(endTime)],
        }),
        startedAt:timeTotal[0],
        endedAt:timeTotal[1],
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
    // if (
    //   checkMainInfoPromoAndEvent(name, type, timeTotal[0], startTime, endTime)
    // ) {
      if (
        // checkItemsPromoIsEmtry(indexShop2) &&
        checkStepEmtry(indexShop2) &&
        checkDescriptionEmtry(indexShop2) &&
        checkRewardsEmtry(indexShop2)
        // checkNumb(indexShop2) &&
        // checkItemIsEmtry(indexShop2) &&
        // server !== "" &&
        // platformId !== ""
      ) {
        // createPromo();
      } else {
        alertErrorItemPromo();
      }
    // } else {
    //   alertErrorNamePromo();
    // }
  };
  const addItems = (i) => {
    const newItem = {
      productId: "",
      productName: "",
      detail: [
        {
          requiredQuantity: 1,
          description: "",
          thresholds: [
            {
              quantity: 1,
              rewards: [
              ],
            },
          ],
        },
      ],
    };
    props.setIndexShop2([...indexShop2, newItem]);
    setRewardsSelected([...rewardsSelected, []])
  };
  // console.log(indexShop2);
  const addRewards = (indexDetail, indexThresholds) => {
    const newReward = {
      quantity: 1,
      rewards: [],
    };
    const newShop = [...indexShop2];
    newShop[indexDetail].detail[indexThresholds].thresholds = [
      ...newShop[indexDetail].detail[indexThresholds].thresholds,
      newReward,
    ];
    props.setIndexShop2(newShop);
  };
  const addStep = (i) => {
    const newStep = {
      requiredQuantity: 1,
      description: "",
      thresholds: [
        {
          quantity: 1,
          rewards: [
          ],
        },
      ],
    };
    const newShop = [...indexShop2];
    newShop[i].detail = [...newShop[i].detail, newStep];
    props.setIndexShop2(newShop);
  };
  const handleChooseItems = (positionItem, value) => {
    const { productId, productName } = JSON.parse(value);
    const newItem = [...indexShop2];
    let newItemSelected = [...itemSelected];
    newItem[positionItem].productId = productId;
    newItem[positionItem].productName = productName;
    newItemSelected = [...newItemSelected, JSON.parse(value)]
    setItemSelected(newItemSelected);
    props.setIndexShop2(newItem);
    console.log(newItemSelected)
  }
  const handleChooseNumbItems = (positionItem, positionDetail, value) => {
    const newItem = [...indexShop2];
    newItem[positionItem].detail[positionDetail].requiredQuantity = Number(value);
    props.setIndexShop2(newItem);
  }
  const handleSetDescription = (positionItem, positionDetail, value) => {
    const newItem = [...indexShop2];
    newItem[positionItem].detail[positionDetail].description = value;
    props.setIndexShop2(newItem);
  }
  const handleChooseNumbRewards = (positionItem, positionDetail, positionReward, value) => {
    const newItem = [...indexShop2];
    newItem[positionItem].detail[positionDetail].thresholds[positionReward].quantity = Number(value);
    props.setIndexShop2(newItem)
  }
  const handleSelectedRewards = async (positionItem, positionDetail, positionReward, value) => {
    const convertValue = JSON.parse(value);
    const newItem = [...indexShop2];
    const newRewardsSelected = [...rewardsSelected];
    newRewardsSelected[positionItem] = [...newRewardsSelected[positionItem], convertValue];
    newItem[positionItem].detail[positionDetail].thresholds[positionReward].rewards = [...newItem[positionItem].detail[positionDetail].thresholds[positionReward].rewards, convertValue];
    await props.setIndexShop2(newItem);
    setRewardsSelected(newRewardsSelected);
    console.log(indexShop2)
  }
  const handleDeselectedRewards = (positionItem, positionDetail, positionReward, value) => {
    const convertValue = JSON.parse(value);
    const newRewardsSelected = [...rewardsSelected];
    const newItem = [...indexShop2];
    const newItem2 = newItem[positionItem].detail[positionDetail].thresholds[positionReward].rewards.filter((val, i) => val.productId !== convertValue.productId)
    const res = newRewardsSelected[positionItem].filter((val, i) => val.productId !== convertValue.productId);
    newRewardsSelected[positionItem] = res;
    newItem[positionItem].detail[positionDetail].thresholds[positionReward].rewards = newItem2;
    setRewardsSelected(newRewardsSelected);
    props.setIndexShop2(newItem);
    console.log(indexShop2)
  }
  const lengthThreholds = (positionItem, positionDetail) => indexShop2[positionItem].detail[positionDetail].thresholds.length;
  const lengthDetail = (positionItem) => indexShop2[positionItem].detail.length;
  const reduceReward = async (positionItem, positionDetail, positionThresholds) => {
    const newShop = [...indexShop2];
    const newRewardsSelected = [...rewardsSelected];
    if (lengthThreholds(positionItem, positionDetail) > 1) {
      const newReward = await newShop[positionItem].detail[positionDetail].thresholds.filter(
        (value, i) => positionThresholds !== i
      );
      const rewardRemoved = indexShop2[positionItem].detail[positionDetail].thresholds.filter(
        (value, i) => positionThresholds === i
      );
      const rewardRemovedID = new Set(rewardRemoved[0].rewards.map(({ productId }) => productId));
      const filterRewardsRemoved = [
        ...newRewardsSelected[positionItem].filter(({ productId }) => !rewardRemovedID.has(productId))
      ];
      newRewardsSelected[positionItem] = filterRewardsRemoved;
      newShop[positionItem].detail[positionDetail].thresholds = newReward;
    }
    props.setIndexShop2(newShop);
    setRewardsSelected(newRewardsSelected);
  };
  const reduceStep = (positionItem, positionDetail) => {
    const newShop = [...indexShop2];
    const newRewardsSelected = [...rewardsSelected];
    const arrRemovedID = [];
    if (lengthDetail(positionItem) > 1) {
      const newReward = newShop[positionItem].detail.filter(
        (value, i) => positionDetail !== i
      );
      const rewardRemoved = indexShop2[positionItem].detail.filter(
        (value, i) => positionDetail === i
      );
      const rewardRemovedID = rewardRemoved[0].thresholds.map((val) => val.rewards.map(({ productId }) => {
        arrRemovedID.push(productId);
        return productId;
      }));
      const filterRewardsRemoved = [
        ...newRewardsSelected[positionItem].filter(({ productId }) => !new Set(arrRemovedID).has(productId))
      ];
      newRewardsSelected[positionItem] = filterRewardsRemoved;
      newShop[positionItem].detail = newReward;
      // console.log(new Set(arrRemovedID));
    }
    props.setIndexShop2(newShop);
    setRewardsSelected(newRewardsSelected);
  }
  const reduceItems = positionItem => {
    let newShop = [...indexShop2];
    const newRewardsSelected = [...rewardsSelected];
    let newItemSelected = [...itemSelected];
    if (newShop.length > 1) {
      const newShopAfterRemoved = newShop.filter(
        (value, i) => positionItem !== i
      );
      newShop = newShopAfterRemoved;
      newRewardsSelected[positionItem] = [];
    }
    // setItemSelected(newItemSelected)
    props.setIndexShop2(newShop);
    setRewardsSelected(newRewardsSelected);
  }
  const tranformValue = arr => arr.map(val => JSON.stringify(val))

  console.log(JSON.stringify(indexShop2))
  // const reduceItem = async (val) => {
  //   if (val !== 0) {
  //     const newItem = await indexShop.filter((value, index) => index !== val);
  //     props.setIndexShop(newItem);
  //   }
  // };
  // const addReward = async (i) => {
  //   const newReward = {
  //     numb: 1,
  //     itemId: [],
  //   };
  //   const newShop = [...indexShop];
  //   newShop[i].rewards = [...newShop[i].rewards, newReward];
  //   props.setIndexShop(newShop);
  // };
  // const reduceReward = async (numberItem, indexReward) => {
  //   const newShop = [...indexShop];
  //   if (indexShop[numberItem].rewards.length > 1) {
  //     const newReward = await indexShop[numberItem].rewards.filter(
  //       (value, i) => indexReward !== i
  //     );
  //     newShop[numberItem].rewards = newReward;
  //     props.setIndexShop(newShop);
  //   }
  // };
  // const handleChooseReward = (positionItem, positionReward, val) => {
  //   const newItem = [...indexShop];
  //   newItem[positionItem].rewards[positionReward].itemId = val;
  //   props.setIndexShop(newItem);
  // };
  // const handleChooseNumbReward = (positionItem, positionReward, e) => {
  //   const newItem = [...indexShop];
  //   newItem[positionItem].rewards[positionReward].numb =
  //     e.target.value !== "" ? Number(e.target.value) : "";
  //   props.setIndexShop(newItem);
  // };
  // const handleChooseItem = (positionItem, value) => {
  //   const newItem = [...indexShop];
  //   newItem[positionItem].purchaseItemId = value;
  //   props.setIndexShop(newItem);
  // };
  // const handleChooseNumbItem = (positionItem, e) => {
  //   const newItem = [...indexShop];
  //   newItem[positionItem].purchaseTimes =
  //     e.target.value !== "" ? Number(e.target.value) : "";
  //   props.setIndexShop(newItem);
  // };
  const printListItems = filteredOptions.map((val, index) => (
    <Option value={`{"productName":"${val.productName}","productId":"${val.partnerProductId}"}`} key={index} >
      {val.productName}
    </Option>
  ));
  const printListItemsRewards = (i) =>
    filterRewards(i).map((val, index) => (
      <Option value={`{"productName":"${val.productName}","productId":"${val.partnerProductId}"}`} key={index} >
        {val.productName}
      </Option>
    ));
  const printStep = indexShop2.map(function (firtRow, index1) {
    const printDetailStep = firtRow.detail.map(function (secondRow, index2) {
      const printReward = secondRow.thresholds.map((thirdRow, index3) => (
        <div key={index3 + "a"} style={{ display: "flex" }}>
          <Icon type="minus" onClick={() => reduceReward(index1, index2, index3)} style={{ fontSize: "16px", margin: '0 .25rem' }} className={lengthThreholds(index1, index2) - 1 === index3 ? 'showDeletePresent' : "hideDeletePresent"} />
          <Input
            // value={indexShop2[index1].rewards[index2].numb}
            placeholder="số"
            type="number"
            name="pucharseTimes"
            onChange={e => handleChooseNumbRewards(index1, index2, index3, e.target.value)}
            style={{ width: "20%" }}
          ></Input>
          <Select
            mode="multiple"
            placeholder="quà"
            // default
            value={tranformValue(indexShop2[index1].detail[index2].thresholds[index3].rewards)}
            style={{ width: "80%" }}
            // onChange={value => demo(value)}
            onSelect={value => handleSelectedRewards(index1, index2, index3, value)}
            onDeselect={value => handleDeselectedRewards(index1, index2, index3, value)}
          >
            {printListItemsRewards(index1)}
          </Select>{" "}
        </div>
      ));
      return (
        <Row md={20} key={index2 + "b"} >
          <Col md={8} style={{ display: "flex" }}>
            <Icon type="minus" onClick={() => reduceStep(index1, index2)} style={{ fontSize: "16px", margin: '0 .25rem' }} />
            <Input
              value={indexShop2[index1].detail[index2].requiredQuantity}
              placeholder="số lượng item"
              type="number"
              min={index2 > 0 ? indexShop2[index1].detail[index2 - 1].requiredQuantity : 0}
              name="pucharseTimes"
              onChange={e => handleChooseNumbItems(index1, index2, e.target.value)}
              style={{ width: "100%" }}
            ></Input>
            <Input
              value={indexShop2[index1].detail[index2].description}
              placeholder="description"
              name="description"
              onChange={e => handleSetDescription(index1, index2, e.target.value)}
              style={{ width: "100%" }}
            ></Input>
          </Col>
          <Col md={16}>
            {printReward}
            <Button
              onClick={() => addRewards(index1, index2)}
              style={{ marginLeft: "1.5rem" }}
              disabled={filterRewards(index1).length === 0 ? true : false}
            >
              Add more present
            </Button>
          </Col>
        </Row>
      );
    });
    return (
      <div>
        <Col md={6} key={index1 + "c"} style={{ display: "flex" }}>
          <Icon type="minus" onClick={() => reduceItems(index1)} style={{ fontSize: "16px", margin: '0 .25rem' }} className={indexShop2.length - 1 === index1 ? 'showDeletePresent' : "hideDeletePresent"} />
          <Select
            placeholder="tên item"
            // value={indexShop[index1].rewards[index2].itemId}
            style={{ width: "100%" }}
            onChange={value => handleChooseItems(index1, value)}
          >
            {printListItems}
          </Select>{" "}
        </Col>
        <Col md={18}>
          {printDetailStep}
          <Button
            onClick={() => addStep(index1)}
            style={{ marginLeft: "1.5rem" }}
            disabled={indexShop2[index1].productId === "" ? true : false}
          >
            Add more step
          </Button>
        </Col>
      </div>
    );
  });
  // const printItem = indexShop.map(function (val, index1) {
  //   const printReward = val.rewards.map((valReward, index2) => (
  //     <div key={index2} className="more-reward">
  //       <Icon
  //         type="minus"
  //         onClick={() => reduceReward(index1, index2)}
  //         style={{ fontSize: "16px", margin: "0 .25rem" }}
  //       />
  //       <Input
  //         value={indexShop[index1].rewards[index2].numb}
  //         type="number"
  //         name="pucharseTimes"
  //         onChange={(e) => handleChooseNumbReward(index1, index2, e)}
  //         style={{ width: "20%" }}
  //       ></Input>
  //       <Select
  //         mode="multiple"
  //         value={indexShop[index1].rewards[index2].itemId}
  //         style={{ width: "80%" }}
  //         onChange={(value) => handleChooseReward(index1, index2, value)}
  //       >
  //         {printListItems}
  //       </Select>{" "}
  //     </div>
  //   ));
  //   return (
  //     <div key={index1}>
  //       <Col md={12} className="more-items">
  //         <Icon
  //           type="close"
  //           onClick={() => reduceItem(index1)}
  //           style={{ fontSize: "16px", margin: "0 .25rem" }}
  //         />
  //         <Input
  //           value={indexShop[index1].purchaseTimes}
  //           type="number"
  //           min={index1 > 0 ? indexShop[index1 - 1].purchaseTimes : 0}
  //           name="pucharseTimes"
  //           onChange={(e) => handleChooseNumbItem(index1, e)}
  //           style={{ width: "20%" }}
  //         ></Input>
  //         <Select
  //           value={indexShop[index1].purchaseItemId}
  //           style={{ width: "80%" }}
  //           onChange={(value) => handleChooseItem(index1, value)}
  //         >
  //           {printListItems}
  //         </Select>{" "}
  //       </Col>
  //       <Col md={12} style={{ padding: "1rem 1rem 1rem .25rem" }}>
  //         {printReward}
  //         <Button
  //           onClick={() => addReward(index1)}
  //           style={{ marginLeft: "1.5rem" }}
  //         >
  //           Add more present
  //         </Button>
  //       </Col>
  //     </div>
  //   );
  // });
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
        {/* {printItem} */}
        {printStep}
        <Button onClick={() => addItems()} style={{ marginLeft: "1.5rem" }} disabled={filteredOptions.length === 0 ? true : false}>
          Add more items
        </Button>
        {/* <Button onClick={() => addItem()} style={{ margin: "1rem 1.5rem" }}>
          Add more conditions
        </Button> */}
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
