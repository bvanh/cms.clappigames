import React, { useState, useEffect } from "react";
import { Table, Button, Pagination, Input, Row, Col, Icon } from "antd";
import CreatePartnerItems from "./createItems";
import { deletePartnerProducts } from "../../../../utils/mutation/partnerProductItems";
import { queryGetListPartnerProducts } from "../../../../utils/queryPartnerProducts";
import { useLazyQuery, useMutation, useQuery } from "@apollo/react-hooks";
import { Link } from "react-router-dom";
import ListPartnerChages from "../partnerCharges/listPartnerCharges";
import ChartPartnerChages from "../partnerCharges/chartPartnerChargesByDate";
// import "../../static/style/listUsers.css";

function ListPartnerItems() {
  const [pageIndex, setPageIndex] = useState({
    currentPage: 1,
    pageSize: 10,
    partnerId: "",
    partnerProductName: ""
  });
  const [isCreateItem, setIsCreateItem] = useState(false);
  const [dataProducts, setData] = useState(null);
  const [itemsForDelete, setItemsForDelete] = useState([]);
  const { currentPage, pageSize, partnerId, partnerProductName } = pageIndex;
  const [getData] = useLazyQuery(queryGetListPartnerProducts, {
    fetchPolicy: "cache-and-network",
    onCompleted: data => {
      setData(data);
    }
  });
  const [deletePartnerProduct] = useMutation(deletePartnerProducts, {
    variables: {
      ids: itemsForDelete
    }
  });
  useEffect(() => {
    getData({
      variables: {
        currentPage: currentPage,
        pageSize: pageSize,
        partnerId: partnerId,
        partnerProductName: partnerProductName
      }
    });
  }, []);
  const columns = [
    {
      title: "Id",
      dataIndex: "partnerProductId",
      key: "productId"
    },
    {
      title: "Name",
      dataIndex: "productName",
      key: "productName"
    },
    {
      title: "Giá (C.coin)",
      dataIndex: "coin",
      key: "coin"
    },
    {
      title: "Game",
      dataIndex: "partnerId",
      key: "partnerId"
    },
    {
      title: "Action",
      key: "action",
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
  if (isCreateItem)
    return <CreatePartnerItems setIsCreateItem={setIsCreateItem} />;
  if (isCreateItem === false)
    return (
      <Row>
        <Col md={12}>
          <div className="products-title">
            <div>
              <h2>Quản lý Item</h2>
              <div className="view-more">
                 {/*<a className="btn-view-more">
                  Chi tiết <Icon type="double-right" />
    </a>*/}
                <Link to="/payment/items" onClick={() => setIsCreateItem(true)}>
                  <Button icon="plus">Thêm gói C.coin</Button>
                </Link>
              </div>
            </div>
            <div className="btn-search-users">
              <Button
                disabled={!hasSelected}
                onClick={submitDeletePartnerProduct}
              >
                Delete
              </Button>
              <Input
                onChange={e => getValueSearch(e)}
                onPressEnter={onSearch}
                prefix={
                  <Icon type="search" style={{ color: "rgba(0,0,0,.25)" }} />
                }
                placeholder="Tìm kiếm theo tên Item"
              />
            </div>
          </div>
          {dataProducts && (
            <>
              <Table
                rowSelection={rowSelection}
                columns={columns}
                dataSource={dataProducts.listPartnerProductsByPartner.rows}
                // scroll={{ x: 1000 }}
              />
              {/* <Pagination
            current={pageIndex.currentPage}
            total={dataProducts.listProductsByPaymentType.count}
            pageSize={10}
            onChange={goPage}
            className="pagination-listUser"
          /> */}
            </>
          )}
        </Col>
        <Col md={12} style={{ padding: "0 1rem" }}>
          <ChartPartnerChages />
          <ListPartnerChages />
        </Col>
      </Row>
    );
}

export default ListPartnerItems;
