import React, { useState, useEffect } from "react";
import { Row, Col, Table, Menu, Icon } from "antd";
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
      title: "id",
      dataIndex: "payload",
      key: "gameUserId",
      render: index => <span>{JSON.parse(index).gameUserId}</span>
    },
    {
        title: "discount",
        dataIndex: "payload",
        key: "chargeId",
        render: index => <span>{JSON.parse(index).discount}</span>
      },
      ,
    {
        title: "createTime",
        dataIndex: "payload",
        key: "createtime",
        render: index => <span>{JSON.parse(index).createAt}</span>
      },
      ,
    {
        title: "endTime",
        dataIndex: "payload",
        key: "endtime",
        render: index => <span>{JSON.parse(index).endAt}</span>
      },
      ,
    {
        title: "coin",
        dataIndex: "payload",
        key: "coin",
        render: index => <span>{JSON.parse(index).coin}</span>
      },
    {
      title: "trạng thái",
      dataIndex: "status",
      key: "status"
    }
  ];
  return (
    <>
      <Table dataSource={data.listPartnerChargesByUser.rows} columns={columns} />
    </>
  );
};

export default HistoryPayment;