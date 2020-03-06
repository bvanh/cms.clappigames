import React from "react";
const printAlertDailyPromo = arr => {
  return arr.map(function(val, index) {
    switch (val) {
      case 0:
        return <span key={index}>Monday</span>;
      case 1:
        return <span key={index}>Tuesday</span>;
      case 2:
        return <span key={index}>Wednesday</span>;
      case 3:
        return <span key={index}>Thursday</span>;
      case 4:
        return <span key={index}>Friday</span>;
      case 5:
        return <span key={index}>Saturday</span>;
      case 6:
        return <span key={index}>Sunday</span>;
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

export {printAlertDailyPromo,daily0}