import React from "react";
import moment from "moment";
import { Modal, Icon } from "antd";
import { Link } from "react-router-dom";
const printAlertDailyPromo = (arr) => {
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
  "Sunday",
];
const isTypeEvent = (val) => {
  switch (val) {
    case "INKIND":
      return "Gift's out game";
      break;
    case "COIN":
      return "C.COIN";
      break;
    default:
      return "Gift's in Game";
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
        itemId: [],
      },
    ],
  },
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
    moment().format("YYYY-MM-DD HH:mm"),
  ],
  datesPromo: [],
  dailyPromo: [],
  startTime: "00:00:00",
  endTime: "23:59:59",
};
const initialTypePromo = {
  eventPaymentType: [],
  listGame: [{}],
  listServer: [
    {
      server: null,
      serverName: "",
    },
  ],
  listItems: [
    {
      productId: "",
      partnerProductId: "",
    },
  ],
};
const initialIndexEventByMoney = {
  paymentTypeByMoney: "",
  isPaymentTypeByCoin: false,
  itemsForEventByMoney: [{ productName: "", productId: "" }],
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
    alertErrorNamePromo();
    return false;
  }
};
const checkLinkAndThumbnail = (link, thumbnail) => {
  console.log(link,thumbnail)
  if (link === "" || thumbnail === null) {
    alertErrorItemPromo("Link post and thumbnail is emtry !")
    console.log("Link post and thumbnail is emtry !")
    return false;
  } else {
    return true;
  }
}
const checkGameInfo = (game, server) => {
  if (game === "" || server === "") {
    alertErrorItemPromo("Game info is emtry!")
    return false;
  } else {
    return true;
  }
}
const checkItemsPromoIsEmtry = (indexShop) => {
  let res = true;
  indexShop.map((val, i) => {
    if (val.productId === "") {
      res = false;

      return;
    }
  });
  if (res === false) alertErrorItemPromo("Item is Emtry!");
  return res;
};
const checkStepEmtry = (indexShop) => {
  let res = true;
  indexShop.map((val, i1) => {
    val.detail.map((val2, i2) => {
      if (res === false) {

        return;
      }
      if (i2 > 0)
        res = val2.requiredQuantity > val.detail[i2 - 1].requiredQuantity;
    });
  });
  if (res === false) alertErrorItemPromo("Milestones are sorted by increasing !");
  return res;
};
const checkDescriptionEmtry = (indexShop) => {
  let res = true;
  indexShop.map((val, i1) => {
    val.detail.map((val2, i2) => {
      if (val2.description === "") {
        res = false;
        return;
      }
    });
  });
  if (res === false) alertErrorItemPromo("Desctiption is emtry !");
  return res;
};
const checkRewardsEmtry = (indexShop) => {
  let res = true;
  indexShop.map((val, i1) => {
    val.detail.map((val2, i2) => {
      val2.thresholds.map((val3, i3) => {
        if (val3.rewards.length === 0) {
          res = false;
          return;
        }
      });
    });
  });
  if (res === false) alertErrorItemPromo("Present is emtry !");
  return res;
};
const checkRewardsIsEmtry = (indexShop) => {
  const result = indexShop.map((val, i) => {
    if (val.rewards.length > 0 && val.rewards[0] !== "") {
      return true;
    } else {
      return false;
    }
  });
  return result.every((val, i) => val != false);
};
const checkItemIsEmtry = (indexShop) => {
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
const checkPoint = (indexShop) => {
  const demo = indexShop.map((val, i) => {
    if (i > 0) {
      return val.point > indexShop[i - 1].point;
    }
  });
  return demo.every((val, i) => val === true || val === undefined);
};
const checkNumb = (indexShop) => {
  const demo = indexShop.map((val, i) => {
    if (i > 0) {
      return val.purchaseTimes > indexShop[i - 1].purchaseTimes;
    }
  });
  return demo.every((val, i) => val === true || val === undefined);
};
const checkTime = (startTime) => {
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
    case "00:00:00":
      return "00:00:00";
    default:
      return startTime;
  }
};
const checkEndHour = (endTime) => {
  switch (endTime) {
    case "00:00:00":
      return "23:59:59";
    default:
      return endTime;
  }
};
const alertErrorItemPromo = (content) => {
  Modal.error({
    title: "Error !!!",
    content: (
      <div>
        {content}
      </div>
    ),
  });
};
const alertErrorNamePromo = () => {
  Modal.error({
    title: "Error!!!",
    content: (
      <div>
        <p>+ Check again promotion name, status, time.</p>
      </div>
    ),
  });
};
const indexAllServer = {
  server: null,
  serverName: "",
};
export {
  printAlertDailyPromo,
  daily0,
  isTypeEvent,
  initialIndexShop,
  initialIndexEventByMoney,
  initialIndexPromo,
  initialTypePromo,
  checkGameInfo,
  checkLinkAndThumbnail,
  checkItemsPromoIsEmtry,
  checkStepEmtry,
  checkRewardsEmtry,
  checkDescriptionEmtry,
  checkMainInfoPromoAndEvent,
  checkRewardsIsEmtry,
  checkItemIsEmtry,
  checkPoint,
  checkNumb,
  alertErrorNamePromo,
  alertErrorItemPromo,
  checkTime,
  checkEndHour,
  checkStartHour,
  indexAllServer,
};
