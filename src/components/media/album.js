import React, { useState } from "react";
import { Upload, Checkbox, Row, Col, Card, Icon } from "antd";
import UploadImages from "./upload";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { queryGetListAlbumByAdmin } from "../../utils/queryMedia";
import { DELETE_ALBUM } from "../../utils/mutation/media";
import "../../static/style/media.css";
import { Link } from "react-router-dom";

const gridStyle = {
  width: "24%",
  textAlign: "center",
  padding: "2px",
  margin: ".5%",
  position: "relative"
};
const Album = () => {
  const [pageIndex, setPageIndex] = useState({
    currentPage: 1,
    pageSize: 10,
    userAdmin: localStorage.getItem("userNameCMS")
  });
  const [selectedAlbum, setSelectedAlbum] = useState([]);
  const [dataAlbum, setDataAlbum] = useState([]);
  const [deleteAlbum] = useMutation(DELETE_ALBUM, {
    variables: {
      ids: selectedAlbum
    }
  });
  const { currentPage, pageSize, userAdmin } = pageIndex;
  const { loading, error, data, refetch } = useQuery(
    queryGetListAlbumByAdmin(currentPage, pageSize, userAdmin),
    {
      onCompleted: data => setDataAlbum(data)
    }
  );
  if (loading) return "Loading...";
  if (error) return `Error! ${error.message}`;
  const onChange = val => {
    setSelectedAlbum(val);
    console.log(val);
  };
  const submitDelete = async () => {
    await deleteAlbum();
    await refetch();
    setSelectedAlbum([]);
  };
  const printListAlbum = data.listAdminAlbumsByUser.rows.map(function(
    val,
    index
  ) {
    if (val.status !== "INVISIBLE") {
      return (
        <Card.Grid style={gridStyle} key={index}>
          <Checkbox value={val.id} className="checkbox-image">
            <img src={val.url} alt={val.name} width="100%" />
          </Checkbox>
        </Card.Grid>
      );
    }
  });
  return (
    <Row>
      <h2>Media</h2>
      <Link to="/media/album">
        <h2>Album</h2>
      </Link>
      <Col md={16}>
      {selectedAlbum.length > 0 && (
        <div className="btn-media-options">
          <span>
            <Icon type="close" style={{ marginRight: "5px" }} />
            <span>{selectedAlbum.length}</span> albums đã được chọn
          </span>
          <div>
            <Icon
              type="delete"
              style={{ fontSize: "18px", margin: "0 5px" }}
              onClick={submitDelete}
            />
            <Icon type="download" style={{ fontSize: "18px" }} />
          </div>
        </div>
      )}
        <Checkbox.Group style={{ width: "100%" }} onChange={onChange}>
          <Col>{printListAlbum}</Col>
        </Checkbox.Group>
      </Col>
      <Col md={8}></Col>
    </Row>
  );
};

export default Album;
