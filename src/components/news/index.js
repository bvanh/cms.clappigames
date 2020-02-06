import React, { useState, useEffect } from "react";
import { Table, Button, Pagination } from "antd";
import moment from "moment";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { queryGetNews } from "../../utils/queryNews";
import { Link } from "react-router-dom";

function ListNews() {
  const [selectedRowKeys, setSelectRowKeys] = useState([]);
  const [pageIndex, setPageIndex] = useState({
    currentPage: 1,
    pageSize: 10,
    search: "",
    fromDate: "06/28/2019",
    toDate: "11/06/2019"
  });

  const { loading, error, data } = useQuery(
    queryGetNews(
      pageIndex.currentPage,
      pageIndex.pageSize,
      pageIndex.search,
      pageIndex.fromDate,
      pageIndex.toDate
    )
  );
  const [loading2, setLoading] = useState(false);

  if (loading) return "Loading...";
  if (error) return `Error! ${error.message}`;
  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      width: "25%"
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type"
    },
    {
      title: "ID",
      dataIndex: "newsId",
      key: "newsId"
    },
    {
      title: "Platform",
      dataIndex: "partner",
      key: "platform",
      render: index => <span>{index.partnerName}</span>
    },

    {
      title: "Thời gian",
      dataIndex: "createAt",
      key: "time",
      render: time => (
        <span>{moment.utc(Number(time)).format("HH:mm DD-MM-YYYY")}</span>
      )
    },
    {
      title: "status",
      dataIndex: "status",
      key: "status"
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <span>
          <Link to={`news/edit?newsId=${record.newsId}`}>Edit</Link>
        </span>
      ),
    },
  ];
  const onSelectChange = selectedRowKeys => {
    console.log("selectedRowKeys changed: ", selectedRowKeys);
    setSelectRowKeys(selectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange
  };
  const hasSelected = selectedRowKeys.length > 0;
  const goPage = pageNumber => {
    setPageIndex({ currentPage: pageNumber });
  };
  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button
          type="primary"
          // onClick={this.start}
          disabled={!hasSelected}
          loading={loading2}
        >
          Reload
        </Button>
        <span style={{ marginLeft: 8 }}>
          {hasSelected ? `Selected ${selectedRowKeys.length} items` : ""}
        </span>
      </div>
      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={data.listNewsByType.rows}
        pagination={false}
      />
      {/* <Pagination
        current={pageIndex.currentPage}
        total={data.listUsersByType.count}
        pageSize={10}
        onChange={goPage}
      /> */}
    </div>
  );
}

export default ListNews;
