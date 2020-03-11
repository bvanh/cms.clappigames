import React from "react";
import moment from "moment";
const printAlertDailyPromo = arr => {
  return arr.map(function(val, index) {
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
  datesPromo,
  dailyPromo
) => {
  if (
    namePromo != "" &&
    promoType != "" &&
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
    if (val.rewards.length > 0) {
      return true;
    } else {
      return false;
    }
  });
  return result.every((val, i) => val != false);
};
const checkItemIsEmtry = indexShop => {
  const result1 = indexShop.map((value, i) => {
    const result = value.rewards.map((value2, i) => {
      if (value2.itemId.length > 0) {
        return true;
      } else {
        return false;
      }
    });
    return result[0];
  });
  return result1.every((val, i) => val != false);
};
export {
  printAlertDailyPromo,
  daily0,
  isTypeEvent,
  initialIndexEventByMoney,
  initialIndexPromo,
  initialTypePromo,
  checkMainInfoPromoAndEvent,
  checkRewardsIsEmtry,
  checkItemIsEmtry,
  checkPurchaseItemIsEmtry
};
