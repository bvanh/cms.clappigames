import React, { useState, useEffect, useMemo } from "react";
import { Table, Button, Pagination, Input, Tabs } from "antd";
import {
  getListEventsByType,
} from "../../../../utils/query/promotion";
import { useLazyQuery, useQuery, useMutation } from "@apollo/react-hooks";
import { Link } from "react-router-dom";
import { connect } from 'react-redux'
import { deleteEvents } from "../../../../utils/mutation/promotion";

const { TabPane } = Tabs;
function ListEvents(props) {
  const [pageIndex, setPageIndex] = useState({
    currentPage: 1,
    pageSize: 10,
    status: "",
    paymentType: "",
    name: ""
  });
  const [dataListEvents, setData] = useState(null);
  const [listDelete, setListDelete] = useState([])
  const { currentPage, pageSize, status, paymentType, name } = pageIndex;
  const [getData, { loading, data }] = useLazyQuery(getListEventsByType, {
    fetchPolicy: "cache-and-network",
    onCompleted: data => {
      setData(data.listEventsByType);
    }
  });
  const [deleteEvent] = useMutation(deleteEvents, {
    variables: {
      ids: listDelete
    },
    onCompleted: data => console.log(data)
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
      key: "name",
      render: (text, record) => (
        <span>
          <Link to={`/payment/promotion/detail/event?id=${record.id}`}>
            {text}
          </Link>
        </span>
      )
    },
    {
      title: "Hình thức",
      dataIndex: "config",
      key: "type",
      render: index => {
        if (JSON.parse(index).type === 'INKIND') {
          return <span>Tặng quà out Game</span>
        } else if (JSON.parse(index).type === 'COIN') {
          return <span>Tặng C.COIN</span>
        } else {
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
    }
  ];
  const onSelectListDelete = (selectedRowKeys, selectedRows) => {
    setListDelete(selectedRows.map((val, i) => val.id));
  };
  const rowSelection = {
    onChange: onSelectListDelete,
  };
  const handleChangeTypePromo = statusValue => {
    setPageIndex({ ...pageIndex, status: statusValue });
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
  const submitDelete = async () => {
    await deleteEvent();
    getData({
      variables: {
        currentPage: currentPage,
        pageSize: pageSize,
        status: status,
        paymentType: paymentType,
        name: name
      }
    });
    setListDelete([])
  }
  if (loading) return "Loading...";
  return (
    <div>
      <div className="btn-search-promo">
        <Input onChange={getValueSearch} style={{marginRight:'.25rem'}}/>
        <Button onClick={onSearchPromo} style={{marginRight:'.25rem'}}>Search</Button>
      
        <Button onClick={submitDelete} disabled={listDelete.length > 0 ? false : true}>Delete</Button>
        </div>
      <Tabs activeKey={status} onChange={handleChangeTypePromo}>
        <TabPane tab="Total Purchase" key=""></TabPane>
        <TabPane tab="Active" key="COMPLETE"></TabPane>
        <TabPane tab="Plan" key="INPUT"></TabPane>
      </Tabs>
      {dataListEvents && (
        <>
          <Table
            columns={columns}
            dataSource={dataListEvents.rows}
            pagination={false}
            rowSelection={rowSelection}
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
function mapStateToProps(state) {
  return {
    isCreatePromo: state.isCreatePromo
  };
}
export default connect(mapStateToProps, null)(ListEvents);

