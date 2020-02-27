import React, { useState, useEffect } from "react";
import {
    Table,
    Button,
    Pagination,
    Input,
    Row,
    Col,
    Radio,
    DatePicker,
    Select,
    TimePicker
} from "antd";
import { useLazyQuery, useMutation, useQuery } from "@apollo/react-hooks";
import "../../../../../static/style/promotion.css";
import {
    getPromotionType,
    getEventPaymentType
} from "../../../../../utils/queryPaymentAndPromoType";
import { queryGetPlatform } from "../../../../../utils/queryPlatform";
import { getListPartnerProducts } from "../../../../../utils/queryPartnerProducts";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
const { Option } = Select;
const { RangePicker } = DatePicker;

const eventMoneyType = [
    {
        value: "COIN",
        description: "Tặng C.Coin"
    },
    {
        value: "INKIND",
        description: "Tặng quà out game"
    }
];
const eventCointype = [{
    value: 'ITEM',
    description: 'Tặng bằng vật phẩm trong game',
},
]
const MenuRewardEventByMoney = props => {
    const { server } = props;
    const { type, listGame, listServer } = props.typePromo;
    const [eventByMoneyIndex, setEventByMoneyIndex] = useState({
        eventType: [],
        eventPaymentType: []
    })
    const { eventType, eventPaymentType } = eventByMoneyIndex
    useQuery(getEventPaymentType, {
        onCompleted: data => setEventByMoneyIndex({ ...eventByMoneyIndex, eventType: data.__type.enumValues })
    })
    const handleChangePaymentType = async val => {
        const deo='ITEM'
        if (val === 'MONEY') {
            setEventByMoneyIndex({ ...eventByMoneyIndex, eventPaymentType: eventMoneyType })
            props.setIndexEventByMoney({ ...props.indexEventByMoney, paymentTypeByCoin: false })
        } else if (val === 'COIN') {
            await props.setIndexEventByMoney({ ...props.indexEventByMoney, paymentTypeByMoney: deo })
            await setEventByMoneyIndex({ ...eventByMoneyIndex, eventPaymentType: eventCointype })
            props.setIndexEventByMoney({ ...props.indexEventByMoney, paymentTypeByCoin: true })
        }
    }
    const handleChanePaymentTypeByMoney = val => {
        props.setIndexEventByMoney({ ...props.indexEventByMoney, paymentTypeByMoney: val })
        if (val === 'COIN') {
            props.getItemsForEventTypeMoney();
        }
    }
    const printEventMoneyType = eventPaymentType.map((val, i) => (
        <Option key={i} value={val.value}>{val.description}</Option>
    ))
    const printEventType = eventType.map((val, index) => (
        <Option key={index} value={val.name}>{val.name}</Option>
    ))
    const printPlatform = listGame.map((val, i) => (
        <Option value={val.partnerId} key={i}>
            {val.partnerName}
        </Option>
    ));
    const printListServer = listServer.map((val, index) => (
        <Option value={val.server} key={index}>
            {val.serverName}
        </Option>
    ));
    return (
        <div>
            <p className="promotion-title-field">Chọn loại hóa đơn</p>
            <Select
                style={{ width: 120 }}
                onChange={handleChangePaymentType}
                placeholder="-Chọn game-"
            >
                {printEventType}
            </Select>{" "}
            <span>Hình thức</span>
            <Select
                style={{ width: 120 }}
                onChange={handleChanePaymentTypeByMoney}
            >
                {printEventMoneyType}
            </Select>{" "}
            {props.indexEventByMoney.paymentTypeByCoin &&
                <div>
                    <p className="promotion-title-field">Chọn game</p>
                    <Select
                        style={{ width: 120 }}
                        onChange={props.handleChangePlatform}
                        placeholder="-Chọn game-"
                    >
                        {printPlatform}
                    </Select>{" "}
                    <span>Server</span>
                    <Select
                        placeholder="-Chọn server-"
                        style={{ width: 120 }}
                        onChange={props.handleChangeServer}
                        name="server"
                        value={server}
                    >
                        {printListServer}
                    </Select>{" "}
                </div>
            }
        </div>
    );
};
export default MenuRewardEventByMoney;
