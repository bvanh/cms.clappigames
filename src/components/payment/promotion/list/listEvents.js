import React, { useState, useEffect } from "react";
import { Table, Button, Pagination, Input, Tabs } from "antd";
import {
  getListEventsByType,
} from "../../../../utils/query/promotion";
import { useLazyQuery, useQuery } from "@apollo/react-hooks";
import { Link } from "react-router-dom";

const { TabPane } = Tabs;
function ListEvents() {
  const [pageIndex, setPageIndex] = useState({
    currentPage: 1,
    pageSize: 10,
    status: "",
    paymentType: "",
    name: ""
  });
  const [dataListEvents, setData] = useState(null);
  const { currentPage, pageSize, status, paymentType, name } = pageIndex;
  const [getData, { loading, data }] = useLazyQuery(getListEventsByType, {
    onCompleted: data => {
      setData(data.listEventsByType);
    }
  });
  useEffect(() => {
    getData({
      variables: {
        currentPage: currentPage,
        pageSize: pageSize,
        status: status,
        paymentType: paymentType,
        name: name
      }
    });
  }, []);
  const columns = [
    {
      title: "Chi tiết",
      dataIndex: "name",
      key: "name"
    },
    {
      title: "Hình thức",
      dataIndex: "config",
      key: "type",
      render:index=>{
        if(JSON.parse(index).type==='INKIND'){
          return <span>Tặng quà out Game</span>
        }else if(JSON.parse(index).type==='COIN'){
          return <span>Tặng C.COIN</span>
        }else {
          return <span>Tặng Item in Game</span>
        }
      }
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: index => (
        <span>{index === "INPUT" ? "Ngừng hoạt động" : "Hoạt động"}</span>
      )
    },
    {
      title: "Total",
      dataIndex: "",
      key: "demo"
    },
    {
      title: "Bắt đầu",
      dataIndex: "eventTime",
      key: "startTime",
      render: index => <span>{JSON.parse(index).startTime}</span>
    },
    {
      title: "Kết thúc",
      dataIndex: "eventTime",
      key: "endTime",
      render: index => <span>{JSON.parse(index).endTime}</span>
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <span>
          <Link to={`/payment/promotion/detail?eventId=${record.id}`}>
            Detail
          </Link>
        </span>
      )
    }
  ];
  const handleChangeTypePromo = statusValue => {
    setPageIndex({ ...pageIndex, status: statusValue });
    getData({
      variables: {
        currentPage: currentPage,
        pageSize: pageSize,
        status: statusValue,
        paymentType: paymentType,
        name: ""
      }
    });
  };
  const goPage = pageNumber => {
    setPageIndex({ ...pageIndex, currentPage: pageNumber });
    getData({
      variables: {
        currentPage: currentPage,
        pageSize: pageSize,
        status: status,
        paymentType: paymentType,
        name: name
      }
    });
  };
  const getValueSearch = e => {
    setPageIndex({ ...pageIndex, name: e.target.value });
  };
  const onSearchPromo = () => {
    getData({
      variables: {
        currentPage: currentPage,
        pageSize: pageSize,
        status: status,
        paymentType: paymentType,
        name: name
      }
    });
  };
  if (loading) return "Loading...";
  return (
    <div>
      <div className="btn-search-promo">
        <Input onChange={getValueSearch} />
        <Button onClick={onSearchPromo}>Search</Button>
      </div>
      <Tabs activeKey={status} onChange={handleChangeTypePromo}>
        <TabPane tab="Tất cả khuyến mãi" key=""></TabPane>
        <TabPane tab="Đang áp dụng" key="COMPLETE"></TabPane>
        <TabPane tab="Chưa áp dụng" key="INPUT"></TabPane>
      </Tabs>
      {dataListEvents && (
        <>
          <Table
            columns={columns}
            dataSource={dataListEvents.rows}
            pagination={false}
          />
          <Pagination
            current={currentPage}
            total={dataListEvents.count}
            pageSize={10}
            onChange={goPage}
            className="pagination-listUser"
          />
        </>
      )}
    </div>
  );
}

export default ListEvents;
