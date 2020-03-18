import React from "react";
import moment from 'moment'

const dates = {
    TODAY: moment().subtract(1, "days").format("YYYY-MM-DD"),
    THREE_DAY_AGO: moment()
        .subtract(3, "days")
        .format("YYYY-MM-DD"),
    SEVENT_DAY_AGO: moment()
        .subtract(7, "days")
        .format("YYYY-MM-DD"),
    FOURTEEN_DAY_AGO: moment()
        .subtract(14, "days")
        .format("YYYY-MM-DD"),
    THIRTY_DAY_AGO: moment()
        .subtract(30, "days")
        .format("YYYY-MM-DD")
};
const months = {
    THISMONTH: moment().subtract(1, "months").format("YYYY-MM"),
    THREE_MONTHS_AGO: moment().subtract(3, 'months').format('YYYY-MM'),
    SIX_MONTHS_AGO: moment().subtract(6, 'months').format('YYYY-MM'),
    ONE_YEAR_AGO: moment().subtract(1, 'years').format('YYYY-MM')
}
export { dates, months };
