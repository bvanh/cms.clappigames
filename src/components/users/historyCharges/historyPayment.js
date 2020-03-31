import React, { useState } from "react";
import { Table, Pagination } from "antd";
import { queryHistotyPayment } from "../../../utils/queryUsers";
import { useQuery } from "@apollo/react-hooks";
import moment from "moment";
const HistoryPayment = props => {
  const [pageIndex, setPageIndex] = useState({ currentPage: 1, pageSize: 5 });
  const [currentMenu, setCurrentMenu] = useState("historyCoin");
  const { loading, error, data } = useQuery(
    queryHistotyPayment(pageIndex.currentPage, pageIndex.pageSize, props.userId),{
      onCompleted:data=>console.log(data)
    }
  );
  if (loading) return `loading...`;
  if (error) return `Error! ${error.message}`;
  const columns = [
    {
      title: "Id",
      dataIndex: "partnerChargeCode",
      key: "partnerChargeCode",
    },
    {
      title: "Character",
      dataIndex: "payload",
      key: "character",
      render: index => <span>{JSON.parse(index).gameUserName}</span>
    },
    {
      title: "Item",
      dataIndex: "partnerProduct",
      key: "item",
      render: index => <span>{index.partnerProductName}</span>
    },
    {
      title: "C.coin",
      dataIndex: "payload",
      key: "coin",
      render: index => <span>{JSON.parse(index).coin}</span>
    },
    {
      title: "Server",
      dataIndex: "payload",
      key: "server",
      render: index => <span>{JSON.parse(index).discount}</span>
    },
    {
      title: "Game",
      dataIndex: "partner",
      key: "game",
      render: index => <span>{index.partnerName}</span>
    },
    {
      title: "Promotion",
      dataIndex: "payload",
      key: "promotion",
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
