import React, { useState, useEffect } from "react";
import { Table, Button, Pagination, Input } from "antd";
import moment from "moment";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { queryGetNews, queryDeleteNews } from "../../utils/queryNews";
import { Link } from "react-router-dom";
import "../../static/style/news.css";

function ListNews() {
  const [selectedRows, setSelectRows] = useState([]);
  const [pageIndex, setPageIndex] = useState({
    currentPage: 1,
    pageSize: 10,
    search: "",
    fromDate: "06/28/2019",
    toDate: "11/06/2019"
  });
  
  const { currentPage, pageSize, search, fromDate, toDate } = pageIndex;
  const { loading, error, data, refetch } = useQuery(
    queryGetNews(
      currentPage,
      pageSize,
      search,
      fromDate,
      toDate
    )
  );
  useEffect(() => {
    refetch();
  }, []);
  const [deleteNews] = useMutation(queryDeleteNews);
  const submitDeleteNews = async value => {
    await deleteNews({ variables: { newsId: value } });
    refetch();
  };

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
      title: "Action",
      key: "action",
      render: (text, record) => (
        <span>
          <Link to={`news/edit?newsId=${record.newsId}`}>Edit</Link>|
          <a onClick={() => submitDeleteNews(record.newsId)}>Delete</a>
        </span>
      )
    }
  ];
  // const onSelectChange = (selectedRowKeys, selectedRows) => {
  //   console.log("selectedRowKeys changed: ", selectedRowKeys, selectedRows);
  //   setSelectRowKeys(selectedRowKeys);
  // };
  // const rowSelection = {
  //   onChange: (selectedRowKeys, selectedRows) => {
  //     setSelectRows(selectedRows);
  //     console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
  //   }
  // };
  // const hasSelected = selectedRows.length > 0;
  const goPage = pageNumber => {
    setPageIndex({ ...pageIndex, currentPage: pageNumber });
  };
  // const filterData=data.listNewsByType.rows.filter(val=>val.status!=='DELETED')
  return (
    <div>
      <div style={{ marginBottom: 16 }} className="news-header">
        {/* <Button
          type="primary"
          // onClick={this.start}
          disabled={!hasSelected}
          loading={loading2}
        >
          Reload
        </Button> */}
        <Input />
        <Button>Search</Button>
        <Button type="primary">
          <Link to="/news/addnews">Addnew</Link>
        </Button>
        {/* <span style={{ marginLeft: 8 }}>
          {hasSelected ? `Selected ${selectedRows.length} items` : ""}
        </span> */}
      </div>
      <Table
        // rowSelection={rowSelection}
        columns={columns}
        dataSource={data.listNewsByType.rows}
        pagination={false}
      />
      <Pagination
        current={pageIndex.currentPage}
        total={data.listNewsByType.count}
        pageSize={10}
        onChange={goPage}
        className="pagination-listUser"
      />
    </div>
  );
}

export default ListNews;
