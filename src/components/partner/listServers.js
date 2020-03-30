import React, { useState, useEffect, useMemo } from "react";

import { Line } from "react-chartjs-2";
import { Link } from "react-router-dom";
import { getListServerByPartner } from '../../utils/query/promotion'
import { useQuery, useLazyQuery } from "@apollo/react-hooks";
import { getDataDAU, getDataMAU } from "../../utils/query/stats";
import { optionLineForStats } from "../../utils/configCharts";
import { connect } from "react-redux";
import { Icon, DatePicker, Input, Select, Table } from "antd";
import { dates } from "../../utils/dateInfo";
import moment from "moment";

const ListServers = props => {
    const [listServers, setListServers] = useState([])
    const [getData] = useLazyQuery(getListServerByPartner, {
        onCompleted: data => {
            setListServers(data.listPartnerServersByPartner)
        }
    })
    const { nameStats, partnerId } = props
    useMemo(
        () => {
            switch (nameStats) {
                case 'Servers':
                    getData({
                        variables: {
                            partnerId: partnerId
                        }
                    })
                    break;
                default:
                    break;
            }
        },
        [partnerId]
    );
    const columns = [
        {
            title: "Server name",
            dataIndex: "serverName"
        },
        {
            title: "Id",
            dataIndex: "server"
        },
        {
            title: "Thời gian tạo",
            dataIndex: "createdDate",
            render: index => <span>{moment.utc(Number(index)).format("HH:mm DD-MM-YYYY")}</span>
        },
        {
            title: "Status",
            dataIndex: "status"
        },
        {
            title: "Delete         ",
            key: "action",
            render: (text, record) => (
                <span>
                    <Icon type="delete" />
                    {/* <Link to={`users/detail?userId=${record.userId}`}>Chi tiết</Link> */}
                </span>
            )
        }
    ];
    return (
        <div style={{ width: "85%" }} className="chart-stats">
            <div className="title-stats" style={{ marginBottom: "1rem" }}>
                <h2 style={{ margin: '0' }}>Clappigames</h2>
                <span>{nameStats}</span>
            </div>
            <Table columns={columns} dataSource={listServers} pagination={false} />
        </div>
    );
};

export default ListServers;
