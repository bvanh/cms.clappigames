import React, { useState } from "react";
import { Table, Pagination } from "antd";
import { queryHistotyPayment } from "../../../utils/queryUsers";
import { useQuery } from "@apollo/react-hooks";
import moment from "moment";
const HistoryPayment = props => {
  const [pageIndex, setPageIndex] = useState({ currentPage: 1, pageSize: 5 });
  const [currentMenu, setCurrentMenu] = useState("historyCoin");
  const { loading, error, data } = useQuery(
    queryHistotyPayment(pageIndex.currentPage, pageIndex.pageSize, props.userId)
  );
  if (loading) return `loading...`;
  if (error) return `Error! ${error.message}`;
  const columns = [
    {
      title: "Id",
      dataIndex: "payload",
      key: "gameUserId",
      render: index => <span>{JSON.parse(index).gameUserId}</span>
    },
    {
      title: "Character",
      dataIndex: "payload",
      key: "chargeId",
      render: index => <span>{JSON.parse(index).discount}</span>
    },
    {
      title: "Item",
      dataIndex: "payload",
      key: "item",
      render: index => <span>{JSON.parse(index).discount}</span>
    },
    {
      title: "C.coin",
      dataIndex: "payload",
      key: "coin",
      render: index => <span>{JSON.parse(index).discount}</span>
    },
    {
      title: "Server",
      dataIndex: "payload",
      key: "server",
      render: index => <span>{JSON.parse(index).discount}</span>
    },
    {
      title: "Game",
      dataIndex: "payload",
      key: "game",
      render: index => <span>{JSON.parse(index).discount}</span>
    },
    {
      title: "Promotion",
      dataIndex: "payload",
      key: "game",
      render: index => <span>{JSON.parse(index).discount}</span>
    },
    {
      title: "Time",
      dataIndex: "payload",
      key: "createtime",
      render: index => <span>{JSON.parse(index).createAt}</span>
    }
  ];
  const { currentPage, pageSize } = pageIndex;
  const goPage = val => {
    setPageIndex({ ...pageIndex, currentPage: val });
  };
  return (
    <>
      <Table
        dataSource={data.listPartnerChargesByUser.rows}
        columns={columns}
        pagination={false}
      />
      <Pagination
        current={currentPage}
        total={data.listPartnerChargesByUser.count}
        pageSize={pageSize}
        onChange={goPage}
        className="pagination-listUser"
      />
    </>
  );
};

export default HistoryPayment;
