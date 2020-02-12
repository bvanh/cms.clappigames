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
