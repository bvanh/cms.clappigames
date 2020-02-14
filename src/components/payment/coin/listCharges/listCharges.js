import React, { useState, useEffect } from "react";
import { Table, Button, Pagination, Input, Row, Col, Select } from "antd";
import {
    queryGetListCoin,
    queryGetListCharges
} from "../../../../utils/queryCoin";
import { useLazyQuery } from "@apollo/react-hooks";
import { Link } from "react-router-dom";

import "../../../../static/style/listProducts.css";

const { Option } = Select;
function ListCharges() {
    const [pageIndex, setPageIndex] = useState({
        currentPage: 1,
        type: 1,
        pageSize: 10,
        search: "",
        fromDate: "",
        toDate: ""
    });
    const [dataCharges, setDataCharges] = useState(null);
    const {
        currentPage,
        pageSize,
        type,
        search,
        fromDate,
        toDate
    } = pageIndex;
    const [getDataCharges, { loading, data }] = useLazyQuery(
        queryGetListCharges,
        {
            onCompleted: data => {
                setDataCharges(data);
            }
        }
    );
    useEffect(() => {
        getDataCharges({
            variables: {
                currentPage: currentPage,
                type: type,
                pageSize: pageSize,
                search: search,
                fromDate: fromDate,
                toDate: toDate
            }
        });
    }, []);
    const columns = [
        {
            title: "Id",
            dataIndex: "chargeId",
            key: "chargeId"
        },
        {
            title: "C.coin",
            dataIndex: "baseCoin",
            key: "baseCoin"
        },
        {
            title: "UserName",
            dataIndex: "user",
            key: "userName",
            render: val => <span>{val !== null ? val.username : null}</span>
        },
        {
            title: "Type",
            dataIndex: "paymentType",
            key: "paymenttype"
        },
        {
            title: "Time",
            dataIndex: "createAt",
            key: "createAt"
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status"
        }
    ];
    const getValueSearch = e => {
        setPageIndex({ ...pageIndex, search: e.target.value });
    };
    const onSearch = () => {
        getDataCharges({
            variables: {
                currentPage: currentPage,
                type: type,
                pageSize: pageSize
                // search: search
            }
        });
    };
    if (loading) return "Loading...";
    return (
        <>
            {dataCharges && (
                <Table
                    columns={columns}
                    dataSource={dataCharges.listChargesByType.rows}
                    pagination={false }
                />)}
        </>
    );
}

export default ListCharges;
