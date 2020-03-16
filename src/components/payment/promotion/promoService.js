import React from "react";
import moment from "moment";
import { Modal, Icon } from "antd";
import { Link } from "react-router-dom";
const printAlertDailyPromo = arr => {
  return arr.map(function (val, index) {
    switch (val) {
      case 0:
        return <span key={index}>Thứ 2,</span>;
      case 1:
        return <span key={index}> Thứ 3,</span>;
      case 2:
        return <span key={index}> Thứ 4,</span>;
      case 3:
        return <span key={index}> Thứ 5,</span>;
      case 4:
        return <span key={index}> Thứ 6,</span>;
      case 5:
        return <span key={index}> Thứ 7,</span>;
      case 6:
        return <span key={index}> Chủ nhật</span>;
      default:
        break;
    }
  });
};
const daily0 = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday"
];
const isTypeEvent = val => {
  switch (val) {
    case "INKIND":
      return "Tặng vật phẩm out game";
      break;
    case "COIN":
      return "Tặng C.COIN";
      break;
    default:
      return "Tặng Item in Game";
      break;
  }
};
const initialIndexShop = [
  {
    purchaseTimes: 1,
    purchaseItemId: [],
    rewards: [
      {
        numb: 1,
        itemId: []
      }
    ]
  }
];
const initialIndexPromo = {
  eventPaymentType: [],
  namePromo: "",
  platformPromoId: "",
  server: "",
  statusPromo: "COMPLETE",
  promoType: "",
  timeTotalPromo: [
    moment().format("YYYY-MM-DD HH:mm"),
    moment().format("YYYY-MM-DD HH:mm")
  ],
  datesPromo: [],
  dailyPromo: [],
  startTime: "00:00:00",
  endTime: "23:00:00"
};
const initialTypePromo = {
  eventPaymentType: [],
  listGame: [{}],
  listServer: [
    {
      server: 0,
      serverName: "All server"
    }
  ],
  listItems: [
    {
      productId: "",
      partnerProductId: ""
    }
  ]
};
const initialIndexEventByMoney = {
  paymentTypeByMoney: "",
  isPaymentTypeByCoin: false,
  itemsForEventByMoney: [{ productName: "", productId: "" }]
};
const checkMainInfoPromoAndEvent = (
  namePromo,
  promoType,
  timeTotalPromo,
  startTime,
  endTime,
  datesPromo,
  dailyPromo
) => {
  if (
    namePromo != "" &&
    promoType != "" &&
    startTime !== "" &&
    endTime !== "" &&
    timeTotalPromo !== "" &&
    (datesPromo.length > 0 || dailyPromo.length > 0)
  ) {
    return true;
  } else {
    return false;
  }
};
const checkPurchaseItemIsEmtry = indexShop => {
  const result = indexShop.map((val, i) => {
    if (val.purchaseItemId.length > 0) {
      return true;
    } else {
      return false;
    }
  });
  return result.every((val, i) => val != false);
};
const checkRewardsIsEmtry = indexShop => {
  const result = indexShop.map((val, i) => {
    if (val.rewards.length > 0 && val.rewards[0] !== "") {
      return true;
    } else {
      return false;
    }
  });
  return result.every((val, i) => val != false);
};
const checkItemIsEmtry = indexShop => {
  let demo = [];
  const result1 = indexShop.map((value, i) => {
    const result = value.rewards.map((value2, i) => {
      if (value2.itemId.length > 0) {
        demo.push(true);
      } else {
        demo.push(false);
      }
    });
  });
  return demo.every((val, i) => val != false);
};
const checkPoint = indexShop => {
  const demo = indexShop.map((val, i) => {
    if (i > 0) {
      return val.point > indexShop[i - 1].point;
    }
  });
  return demo.every((val, i) => val === true || val === undefined);
};
const checkNumb = indexShop => {
  const demo = indexShop.map((val, i) => {
    if (i > 0) {
      return val.purchaseTimes > indexShop[i - 1].purchaseTimes;
    }
  });
  return demo.every((val, i) => val === true || val === undefined);
};
const checkTime = startTime => {
  const startTimes = moment(startTime).format("x");
  const now1 = moment().format("x");
  if (Number(now1) - Number(startTimes) > 0) {
    return true;
  } else {
    return false;
  }
};
const alertError = () => {
  Modal.error({
    title: "Chú ý !!!",
    content: (
      <div>
        <p>+ Điền đẩy đủ thông tin.</p>
        <p>+ Giá trị các mốc khuyến mãi tăng dần.</p>
      </div>
    )
  });
};
export {
  printAlertDailyPromo,
  daily0,
  isTypeEvent,
  initialIndexShop,
  initialIndexEventByMoney,
  initialIndexPromo,
  initialTypePromo,
  checkMainInfoPromoAndEvent,
  checkRewardsIsEmtry,
  checkItemIsEmtry,
  checkPurchaseItemIsEmtry,
  checkPoint,
  checkNumb,
  alertError,
  checkTime
};
