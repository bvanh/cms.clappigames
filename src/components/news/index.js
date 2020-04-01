import React, { useState, useEffect } from "react";
import { Table, Button, Pagination, Input, Tooltip, Icon } from "antd";
import moment from "moment";
import { useLazyQuery, useMutation } from "@apollo/react-hooks";
import { queryGetNews, queryDeleteNews } from "../../utils/queryNews";
import { Link } from "react-router-dom";
import "../../static/style/news.css";
import {
  dispatchShowImagesNews,
  dispatchSetUrlImageThumbnail
} from "../../redux/actions";
function ListNews() {
  const [pageIndex, setPageIndex] = useState({
    currentPage: 1,
    pageSize: 10,
    search: ""
  });
  const [data, setData] = useState([]);
  const [listNewsDelete, setItemsForDelete] = useState([]);
  const [totalIndex, setTotalIndex] = useState({
    totalActive: [],
    totalInactive: []
  });
  const [getData] = useLazyQuery(queryGetNews, {
    fetchPolicy: "cache-and-network",
    onCompleted: data => {
      const totalActive = data.listNewsByType.rows.map(
        (val, i) => val.status === "COMPLETE"
      );
      const totalInactive = data.listNewsByType.rows.map(
        (val, i) => val.status !== "COMPLETE"
      );
      setData(data.listNewsByType);
      setTotalIndex({ totalActive: totalActive, totalInactive: totalInactive });
    }
  });
  const { currentPage, pageSize, search } = pageIndex;
  const { totalActive, totalInactive } = totalIndex;
  useEffect(() => {
    getData({
      variables: {
        currentPage: currentPage,
        pageSize: pageSize,
        search: search
      }
    });
    dispatchShowImagesNews(null);
    dispatchSetUrlImageThumbnail(null);
  }, []);
  const [deleteNews] = useMutation(queryDeleteNews);
  const submitDeleteNews = async () => {
    await deleteNews({ variables: { ids: listNewsDelete } });
    getData({
      variables: {
        currentPage: currentPage,
        pageSize: pageSize,
        search: search
      }
    });
  };
  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      width: "25%",
      render: (text, record) => (
        <span>
          <Link to={`news/edit?newsId=${record.newsId}`}>{text}</Link>
        </span>
      )
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
      title: "Time",
      dataIndex: "createAt",
      key: "time",
      render: time => (
        <span>{moment.utc(Number(time)).format("HH:mm DD-MM-YYYY")}</span>
      )
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status"
    }
  ];
  const rowSelection = {
    onChange: (selectRowsKeys, selectedRows) => {
      const itemsIdForDelete = selectedRows.map((val, index) => val.newsId);
      setItemsForDelete(itemsIdForDelete);
    }
  };
  const handleSetSearchValue = e => {
    setPageIndex({ ...pageIndex, search: e.target.value });
  };
  const submitSearch = () => {
    getData({
      variables: {
        currentPage: currentPage,
        pageSize: pageSize,
        search: search
      }
    });
  };
  const goPage = pageNumber => {
    setPageIndex({ ...pageIndex, currentPage: pageNumber });
    getData({
      variables: {
        currentPage: pageNumber,
        pageSize: pageSize,
        search: search
      }
    });
  };
  const resetImage = () => {
    dispatchSetUrlImageThumbnail(null);
    dispatchShowImagesNews(null);
  };
  const resetSearch = () => {
    setPageIndex({ currentPage: 1, pageSize: 10, search: "" });
    getData({
      variables: {
        currentPage: 1,
        pageSize: 10,
        search: ""
      }
    });
  };
  const totalActiveNews = [];
  if (data.length > 0) {
    totalActiveNews = data.rows.map((val, i) => val.status === "COMPLETE");
  }

  return (
    <div>
      <div style={{ marginBottom: 16 }} className="news-header">
        <div>
          <span>
            All {`(${data.count})`}
            {/* || Active {`(${totalActive.length})`}|| Inactive {`(${totalInactive.length})`}*/}
          </span>
        </div>
        <div>
          <Input
            onChange={handleSetSearchValue}
            style={{ width: "30%" }}
            value={search}
            suffix={
              <Tooltip
                title="reset"
                className={search !== "" ? "reset-btn-show" : "reset-btn-hide"}
              >
                <Icon
                  type="close"
                  style={{ color: "rgba(0,0,0,.45)" }}
                  onClick={resetSearch}
                />
              </Tooltip>
            }
          />
          <Button
            onClick={submitSearch}
            onPressEnter={submitSearch}
            style={{ margin: "0 .35rem" }}
          >
            Search
          </Button>
          <Button
            disabled={listNewsDelete.length > 0 ? false : true}
            onClick={submitDeleteNews}
            style={{ marginRight: ".5rem" }}
          >
            Delete
          </Button>
          <Button type="primary">
            <Link to="/news/addnews" onClick={resetImage}>
              Addnew
            </Link>
          </Button>
          {/* <span style={{ marginLeft: 8 }}>
          {hasSelected ? `Selected ${selectedRows.length} items` : ""}
        </span> */}
        </div>
      </div>
      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={data.rows}
        pagination={false}
      />
      <Pagination
        current={pageIndex.currentPage}
        total={data.count}
        pageSize={10}
        onChange={goPage}
        className="pagination-listUser"
      />
    </div>
  );
}

export default ListNews;
