import React from "react";
import moment from "moment";
import { Modal, Icon } from "antd";
import { Link } from "react-router-dom";
const printAlertDailyPromo = arr => {
  return arr.map(function (val, index) {
    switch (val) {
      case 0:
        return <span key={index}> Monday,</span>;
      case 1:
        return <span key={index}> Tuesday,</span>;
      case 2:
        return <span key={index}> Wednesday,</span>;
      case 3:
        return <span key={index}> Thursday,</span>;
      case 4:
        return <span key={index}> Friday,</span>;
      case 5:
        return <span key={index}> Saturday,</span>;
      case 6:
        return <span key={index}> Sunday,</span>;
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
  endTime
) => {
  if (
    namePromo != "" &&
    promoType != "" &&
    startTime !== "" &&
    endTime !== "" &&
    timeTotalPromo !== ""
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
const checkStartHour = (startTime) => {
  switch (startTime) {
    case '00:00:00':
      return '00:00:00'
    default:
      return startTime;
  }
}
const checkEndHour = (endTime) => {
  switch (endTime) {
    case '00:00:00':
      return '23:59:59'
    default:
      return endTime;
  }
}
const alertErrorItemPromo = () => {
  Modal.error({
    title: "Error !!!",
    content: (
      <div>
        <p>+ Kiểm tra thông tin game, server, item, hình thức.</p>
        <p>+ Giá trị các mốc khuyến mãi tăng dần.</p>
      </div>
    )
  });
};
const alertErrorNamePromo = () => {
  Modal.error({
    title: "Error!!!",
    content: (
      <div>
        <p>+ Kiểm tra thông tin tên, trạng thái, thời gian.</p>
      </div>
    )
  });
};
const indexAllServer = {
  server: 0,
  serverName: "All server"
}
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
  alertErrorNamePromo,
  alertErrorItemPromo,
  checkTime,
  checkEndHour, checkStartHour,
  indexAllServer
};
