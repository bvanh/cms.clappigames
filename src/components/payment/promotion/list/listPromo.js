import React, { useState, useEffect } from "react";
import { Table, Button, Pagination, Input, Tabs } from "antd";
import {
  getListEventByType,
  getListPromotionByType
} from "../../../../utils/query/promotion";
import { useLazyQuery, useQuery } from "@apollo/react-hooks";
import { Link } from "react-router-dom";

const { TabPane } = Tabs;
function ListPromo() {
  const [pageIndex, setPageIndex] = useState({
    currentPage: 1,
    pageSize: 10,
    status: "",
    type: "",
    game: "",
    server: 0,
    name: ""
  });
  const [dataListPromo, setData] = useState(null);
  const { currentPage, pageSize, status, type, game, server, name } = pageIndex;
  const [getData, { loading, data }] = useLazyQuery(getListPromotionByType, {
    onCompleted: data => {
      setData(data.listPromotionsByType);
    }
  });
  useEffect(() => {
    getData({
      variables: {
        currentPage: currentPage,
        pageSize: pageSize,
        status: status,
        type: type,
        game: game,
        server: server,
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
      dataIndex: "type",
      key: "type"
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
    }
    ,
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <span>
          <Link to={`/payment/promotion/detail/promotion?id=${record.id}`}>
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
        type: type,
        game: game,
        server: server,
        name: name
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
        type: type,
        game: game,
        server: server,
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
        type: type,
        game: game,
        server: server,
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
      {dataListPromo && (
        <>
          <Table
            columns={columns}
            dataSource={dataListPromo.rows}
            pagination={false}
          />
          <Pagination
            current={currentPage}
            total={dataListPromo.count}
            pageSize={10}
            onChange={goPage}
            className="pagination-listUser"
          />
        </>
      )}
    </div>
  );
}

export default ListPromo;
