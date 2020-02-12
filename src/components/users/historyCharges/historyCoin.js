import React, { useState, useEffect } from "react";
import { Row, Col, Table, Pagination} from "antd";
import { queryHistotyChargesByUsers } from "../../../utils/queryUsers";
import { useQuery } from "@apollo/react-hooks";
import moment from "moment";
import HistoryPayment from "./historyPayment";
import HistoryLogin from "./historyLogin";
import { Tabs } from "antd";

const { TabPane } = Tabs;
const HistoryCharges = props => {
  const [pageIndex, setPageIndex] = useState({ currentPage: 1, pageSize: 5 });
  const [currentMenu, setCurrentMenu] = useState("historyCoin");
  const { loading, error, data } = useQuery(
    queryHistotyChargesByUsers(pageIndex.currentPage, pageIndex.pageSize, props.userId)
  );
  if (loading) return `loading...`;
  if (error) return `Error! ${error.message}`;
  const columns = [
    {
      title: "id",
      dataIndex: "chargeId",
      key: "chargeId"
    },
    {
      title: "Phương thức nạp",
      dataIndex: "paymentType",
      key: "paymentType"
    },
    {
      title: "Coin",
      dataIndex: "baseCoin",
      key: "coin"
    },
    {
      title: "Vnđ",
      dataIndex: "price",
      key: "vnd",
      render: price => <span>{price.toLocaleString()}</span>
    },
    {
      title: "thời gian",
      dataIndex: "createAt",
      key: "time",
      render: time => (
        <span>{moment.utc(Number(time)).format("HH:mm DD-MM-YYYY")}</span>
      )
    },
    {
      title: "trạng thái",
      dataIndex: "status",
      key: "status"
    }
  ];
  const callback = key => {
    console.log(key);
  };
  const { currentPage, pageSize } = pageIndex;
  const goPage = val => {
    setPageIndex({ ...pageIndex, currentPage: val });
  };
  return (
    <>
      <Tabs onChange={callback} type="card">
        <TabPane tab="Lịch sử nạp Coin" key="1">
          <Table
            dataSource={data.listChargesByUser.rows}
            columns={columns}
            pagination={false}
          />
          <Pagination
            current={currentPage}
            total={data.listChargesByUser.count}
            pageSize={pageSize}
            onChange={goPage}
            className="pagination-listUser"
          />
        </TabPane>
        <TabPane tab="Lịch sử mua vật phẩm" key="2">
          <HistoryPayment userId={props.userId} />
        </TabPane>
        <TabPane tab="Lịch sử hoạt động" key="3">
          <HistoryLogin userId={props.userId} />
        </TabPane>
      </Tabs>
      ,
    </>
  );
};

export default HistoryCharges;
