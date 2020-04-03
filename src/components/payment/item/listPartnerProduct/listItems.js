import React, { useState, useEffect } from "react";
import { Table, Button, Pagination, Input, Row, Col, Icon, Radio } from "antd";
import CreatePartnerItems from "./createItems";
import { deletePartnerProducts } from "../../../../utils/mutation/partnerProductItems";
import { queryGetListPartnerProducts } from "../../../../utils/queryPartnerProducts";
import { queryGetPlatform } from "../../../../utils/queryPlatform";
import { useLazyQuery, useMutation, useQuery } from "@apollo/react-hooks";
import { Link } from "react-router-dom";
import ListPartnerChages from "../partnerCharges/listPartnerCharges";
import ChartPartnerChages from "../partnerCharges/chartPartnerChargesByDate";
const radioStyle = {
  display: "block",
  height: "30px",
  lineHeight: "30px"
};
function ListItems(props) {
  const [pageIndex, setPageIndex] = useState({
    currentPage: 1,
    pageSize: 10,
    partnerId: "",
    partnerProductName: ""
  });
  const [listGame, setListGame] = useState([
    { partnerId: "", partnerName: "" }
  ]);
  const [dataProducts, setData] = useState(null);
  const [itemsForDelete, setItemsForDelete] = useState([]);
  const { currentPage, pageSize, partnerId, partnerProductName } = pageIndex;
  const [getData, { loading }] = useLazyQuery(queryGetListPartnerProducts, {
    fetchPolicy: "cache-and-network",
    onCompleted: data => {
      setData(data);
    }
  });
  const [getListGame] = useLazyQuery(queryGetPlatform, {
    fetchPolicy: "cache-and-network",
    onCompleted: data => setListGame(data.listPartners)
  });
  const [deletePartnerProduct] = useMutation(deletePartnerProducts, {
    variables: {
      ids: itemsForDelete
    }
  });
  useEffect(() => {
    getListGame();
    getData({
      variables: {
        currentPage: currentPage,
        pageSize: pageSize,
        partnerId: partnerId,
        partnerProductName: partnerProductName
      }
    });
  }, []);
  const handleFilter = () => {
    getData({
      variables: {
        currentPage: 1,
        pageSize: 10,
        partnerId: partnerId,
        partnerProductName: partnerProductName
      }
    });
  };
  const handleResetFilter = () => {
    getData({
      variables: {
        currentPage: 1,
        pageSize: 10,
        partnerId: "",
        partnerProductName: ""
      }
    });
  };
  const columns = [
    {
      title: "Item Id",
      dataIndex: "partnerProductId",
      key: "productId",
      width: "23%",
      render: index => <span className="convert-col">{index}</span>
    },
    {
      title: "Name",
      dataIndex: "productName",
      key: "productName",
      width:"20%"
    },
    {
      title: "Price (C.coin)",
      dataIndex: "coin",
      key: "coin",
      width:"20%",
      render: index => <span className="convert-col">{index}</span>
    },
    {
      title: "Game",
      dataIndex: "partner",
      key: "partner",
      width:"20%",
      render: index => <span>{index.partnerName}</span>,
      filterDropdown: () => (
        <div style={{ padding: 8 }}>
          <Radio.Group
            onChange={e =>
              setPageIndex({ ...pageIndex, partnerId: e.target.value })
            }
            value={pageIndex.partnerId}
          >
            {printOptionsGame}
          </Radio.Group>
          <Button
            type="primary"
            onClick={handleFilter}
            size="small"
            style={{ width: 90, marginRight: 8 }}
          >
            Filter
          </Button>
          <Button
            onClick={handleResetFilter}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </div>
      ),
      filterIcon: filtered => (
        <Icon
          type="filter"
          theme="filled"
          style={{ color: filtered ? "#1890ff" : "#fafafa" }}
        />
      )
    },
    {
      title: "Action",
      key: "action",
      width:"17%",
      render: (text, record) => (
        <span>
          <Link
            to={`/payment/items/edit?partnerProductId=${record.partnerProductId}`}
          >
            Edit
          </Link>
        </span>
      )
    }
  ];
  const rowSelection = {
    onChange: (selectRowsKeys, selectedRows) => {
      const itemsIdForDelete = selectedRows.map(
        (val, index) => val.partnerProductId
      );
      setItemsForDelete(itemsIdForDelete);
    }
  };
  const submitDeletePartnerProduct = async () => {
    await deletePartnerProduct();
    getData({
      variables: {
        currentPage: currentPage,
        pageSize: pageSize,
        partnerId: partnerId,
        partnerProductName: partnerProductName
      }
    });
  };
  const hasSelected = itemsForDelete.length > 0;
  const getValueSearch = e => {
    setPageIndex({ ...pageIndex, partnerProductName: e.target.value });
  };
  const onSearch = () => {
    getData({
      variables: {
        currentPage: currentPage,
        pageSize: pageSize,
        partnerId: partnerId,
        partnerProductName: partnerProductName
      }
    });
  };
  const goPage = val => {
    setPageIndex({ ...pageIndex, currentPage: val });
    getData({
      variables: {
        currentPage: val,
        pageSize: pageSize,
        partnerId: partnerId,
        partnerProductName: partnerProductName
      }
    });
  };
  const printOptionsGame = listGame.map((val, index) => (
    <Radio style={radioStyle} value={val.partnerId} key={index}>
      {val.partnerName}
    </Radio>
  ));
  if (loading)
    return (
      <Col md={12}>
        <p>loading...</p>
      </Col>
    );
  return (
    <>
      <div className="products-title">
        <div>
          <h2>Item managerment</h2>
          <div className="view-more">
            <Link
              to="/payment/items"
              onClick={() => props.setIsCreateItem(true)}
            >
              <Button icon="plus">Add new Item</Button>
              <Button
                disabled={!hasSelected}
                onClick={submitDeletePartnerProduct}
              >
                Delete
              </Button>
            </Link>
          </div>
        </div>
        {/* <div className="btn-search-users">
          <Button disabled={!hasSelected} onClick={submitDeletePartnerProduct}>
            Delete
          </Button>
          <Input
            onChange={e => getValueSearch(e)}
            onPressEnter={onSearch}
            prefix={<Icon type="search" style={{ color: "rgba(0,0,0,.25)" }} />}
            placeholder="Search by name Item"/>
        </div>*/}
      </div>
      {dataProducts && (
        <>
          <Table
            rowSelection={rowSelection}
            columns={columns}
            dataSource={dataProducts.listPartnerProductsByPartner.rows}
            pagination={false}
            // scroll={{ x: 1000 }}
          />
          <Pagination
            current={pageIndex.currentPage}
            total={dataProducts.listPartnerProductsByPartner.count}
            pageSize={10}
            onChange={goPage}
            className="pagination-listUser"
          />
        </>
      )}
    </>
  );
}

export default ListItems;
