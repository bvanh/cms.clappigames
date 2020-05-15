import React, { useState, useEffect, useMemo } from "react";
import { Table, Button, Pagination, Input, Tabs, Modal } from "antd";
import {
  getListEventByType,
  getListPromotionByType,
} from "../../../../utils/query/promotion";
import { useLazyQuery, useQuery, useMutation } from "@apollo/react-hooks";
import { Link } from "react-router-dom";
import { alertErrorServer } from "../../../../utils/alertErrorAll";
import { deletePromotion } from "../../../../utils/mutation/promotion";

const { TabPane } = Tabs;
function ListPromo() {
  const [pageIndex, setPageIndex] = useState({
    currentPage: 1,
    pageSize: 10,
    status: "",
    type: "",
    game: "",
    server: 0,
    name: "",
  });
  const [dataListPromo, setData] = useState(null);
  const [listDelete, setListDelete] = useState([]);
  const { currentPage, pageSize, status, type, game, server, name } = pageIndex;
  const [getData, { loading, data }] = useLazyQuery(getListPromotionByType, {
    fetchPolicy: "cache-and-network",
    onCompleted: (data) => {
      setData(data.listPromotionsByType);
    },
    onError: (index) => alertErrorServer(index.message),
  });
  const [deletePromo] = useMutation(deletePromotion, {
    variables: {
      ids: listDelete,
    },
    onCompleted: (data) => console.log(data),
    onError: (index) => alertErrorServer(index.message),
  });
  useMemo(() => {
    getData({
      variables: {
        currentPage: currentPage,
        pageSize: pageSize,
        status: status,
        type: type,
        gameId: game,
        server: server,
        name: name,
      },
    });
  }, []);
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <span>
          <Link to={`/payment/promotion/detail/promotion?id=${record.id}`}>
            {text}
          </Link>
        </span>
      ),
    },
    {
      title: "Method",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (index) => (
        <span>{index === "INPUT" ? "Ngừng hoạt động" : "Hoạt động"}</span>
      ),
    },
    {
      title: "Total",
      dataIndex: "",
      key: "demo",
    },
    {
      title: "Start Time",
      dataIndex: "eventTime",
      key: "startTime",
      render: (index) => <span>{JSON.parse(index).startTime}</span>,
    },
    {
      title: "End Time",
      dataIndex: "eventTime",
      key: "endTime",
      render: (index) => <span>{JSON.parse(index).endTime}</span>,
    },
  ];
  const handleChangeTypePromo = (statusValue) => {
    setPageIndex({ ...pageIndex, status: statusValue });
    getData({
      variables: {
        currentPage: currentPage,
        pageSize: pageSize,
        status: statusValue,
        type: type,
        game: game,
        server: server,
        name: name,
      },
    });
  };
  const goPage = (pageNumber) => {
    setPageIndex({ ...pageIndex, currentPage: pageNumber });
    getData({
      variables: {
        currentPage: currentPage,
        pageSize: pageSize,
        status: status,
        type: type,
        game: game,
        server: server,
        name: name,
      },
    });
  };
  const getValueSearch = (e) => {
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
        name: name,
      },
    });
  };
  const submitDelete = async () => {
    await deletePromo();
    getData({
      variables: {
        currentPage: currentPage,
        pageSize: pageSize,
        status: status,
        type: type,
        game: game,
        server: server,
        name: name,
      },
    });
    setListDelete([]);
  };
  const onSelectListDelete = (selectedRowKeys, selectedRows) => {
    setListDelete(selectedRows.map((val, i) => val.id));
  };
  const rowSelection = {
    onChange: onSelectListDelete,
  };
  if (loading) return "Loading...";
  return (
    <div>
      <div className="btn-search-promo">
        <Input onChange={getValueSearch} style={{ marginRight: ".25rem" }} />
        <Button onClick={onSearchPromo} style={{ marginRight: ".25rem" }}>
          Search
        </Button>
        {/* <Button onClick={submitDelete} disabled={listDelete.length > 0 ? false : true}>Delete</Button> */}
      </div>
      <Tabs activeKey={status} onChange={handleChangeTypePromo}>
        <TabPane tab="Total Purchase" key=""></TabPane>
        <TabPane tab="Active" key="COMPLETE"></TabPane>
        <TabPane tab="Plan" key="INPUT"></TabPane>
      </Tabs>
      {dataListPromo && (
        <>
          <Table
            columns={columns}
            dataSource={dataListPromo.rows}
            pagination={false}
            // rowSelection={rowSelection}
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
