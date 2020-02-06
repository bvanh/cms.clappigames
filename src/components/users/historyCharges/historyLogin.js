import React, { useState, useEffect } from "react";
import { Row, Col, Table, Menu, Icon } from "antd";
import { queryHistotyLogin } from "../../../utils/queryUsers";
import { useQuery } from "@apollo/react-hooks";
import moment from "moment";
const HistoryLogin = props => {
  const [pageIndex, setPageIndex] = useState({ currentPage: 1, pageSize: 5 });
  const [currentMenu, setCurrentMenu] = useState("historyCoin");
  const { loading, error, data } = useQuery(
    queryHistotyLogin(pageIndex.currentPage, pageIndex.pageSize, props.userId)
  );
  if (loading) return `loading...`;
  if (error) return `Error! ${error.message}`;
  const columns = [
    {
      title: "Device",
      dataIndex: "os",
      key: "device"
    },
    {
      title: "game",
      dataIndex: "partner",
      key: "game",
      render: index => <span>{index.partnerName}</span>
    },
    {
      title: "lastLogin",
      dataIndex: "lastLogin",
      key: "lastlogin",
      render: time => (
        <span>{moment.utc(Number(time)).format("HH:mm DD-MM-YYYY")}</span>
      )
    },
    {
      title: "gameId",
      dataIndex: "gameId",
      key: "gameId"
    }
  ];
  return (
    <>
      <Table
        dataSource={data.listLoginUsersByUser.rows}
        key={record => record.partner.partnerId}
        columns={columns}
      />
    </>
  );
};

export default HistoryLogin;
