import React, { useState, useEffect } from "react";
import { Table, Button, Pagination, Input, Row, Col } from "antd";
import CreatePartnerItems from "./createItems";
import { deletePartnerProducts } from "../../../../utils/mutation/partnerProductItems";
import { queryGetListPartnerProducts } from "../../../../utils/queryPartnerProducts";
import { useLazyQuery,useMutation } from "@apollo/react-hooks";
import { Link } from "react-router-dom";
import ListPartnerChages from "../partnerCharges/listPartnerCharges";
// import "../../static/style/listUsers.css";

function ListPartnerItems() {
  const [pageIndex, setPageIndex] = useState({
    currentPage: 1,
    type: "",
    pageSize: 10
  });
  const [isCreateItem, setIsCreateItem] = useState(false);
  const [dataProducts, setData] = useState(null);
  const [itemsForDelete, setItemsForDelete] = useState([]);
  const { currentPage, type, pageSize } = pageIndex;
  const [getData, { loading, data }] = useLazyQuery(
    queryGetListPartnerProducts,
    {
      onCompleted: data => {
        setData(data);
      }
    }
  );
  useEffect(() => {
    getData({
      variables: {
        currentPage: currentPage,
        type: type,
        pageSize: pageSize
        // search: search
      }
    });
  }, []);
  const [deleteProduct] = useMutation(deletePartnerProducts, {
    variables: {
      ids: itemsForDelete
    }
  });
  const columns = [
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
    },
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
      title: "Promotion",
      dataIndex: "promotion",
      key: "discount"
    },
    {
      title: "Time",
      dataIndex: "createAt",
      key: "time"
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status"
    },
    {
      title: "partnerId",
      dataIndex: "partnerId",
      key: "partnerId"
    }
    // {
    //   title: "Action",
    //   key: "action",

    //   render: (text, record) => (
    //     <span>
    //       <Link to={`users/detail?userId=${record.userId}`}>Chi tiết</Link>
    //     </span>
    //   )
    // }
  ];
  const rowSelection = {
    onChange: (selectRowsKeys, selectedRows) => {
      const itemsIdForDelete = selectedRows.map((val, index) => val.partnerProductId);
      setItemsForDelete(itemsIdForDelete);
    }
  };
  const submitDeletePartnerProduct = async () => {
    const demo = await deleteProduct();
    // refetch();
    console.log(demo);
  };
  const hasSelected = itemsForDelete.length > 0;
  const getValueSearch = e => {
    setPageIndex({ ...pageIndex, search: e.target.value });
  };
  const onSearch = () => {
    getData({
      variables: {
        currentPage: currentPage,
        type: type,
        pageSize: pageSize
        // search: search
      }
    });
  };
  if (loading) return "Loading...";
  if (isCreateItem)
    return <CreatePartnerItems setIsCreateItem={setIsCreateItem} />;
  if (isCreateItem === false)
    return (
      <Row>
        <Col md={12}>
          <div className="title">
            <h2>Quản lý Item</h2>

            <Link to="/payment/items" onClick={() => setIsCreateItem(true)}>
              <Button icon="plus">Thêm gói C.coin</Button>
            </Link>

            <div className="btn-search-users">
              <Button
                disabled={!hasSelected}
                onClick={submitDeletePartnerProduct}
              >
                Delete
              </Button>
              <Input onChange={e => getValueSearch(e)} />
              <Button onClick={onSearch}>Search</Button>
            </div>
          </div>
          {dataProducts && (
            <>
              <Table
                rowSelection={rowSelection}
                columns={columns}
                dataSource={dataProducts.listPartnerProducts}
                scroll={{ x: 1000 }}
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
        <Col md={12}>
          <Col>Xu hướng mua Item</Col>
          <ListPartnerChages />
        </Col>
      </Row>
    );
}

export default ListPartnerItems;
