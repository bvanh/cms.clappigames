import React, { useState, useMemo, useEffect } from "react";
import { Row, Col, Card, Icon, Button, Pagination } from "antd";
import CreateAlbumFromComp from "./createAlbumFromComp";
import CreateAlbumFromLibary from "./createAlbumFromLibary";
import { useQuery, useMutation, useLazyQuery } from "@apollo/react-hooks";
import { queryGetListAlbumByAdmin } from "../../../utils/queryMedia";
import { DELETE_ALBUM, CREATE_ALBUM } from "../../../utils/mutation/media";
import "../../../static/style/media.css";
import { Link } from "react-router-dom";
import { successAlert } from "../mediaService";
const { Meta } = Card;
const Album = () => {
  const [pageIndex, setPageIndex] = useState({
    currentPage: 1,
    pageSize: 10,
    count: "",
    userAdmin: localStorage.getItem("userNameCMS"),
    albumName: ""
  });
  const [selectedAlbumId, setSelectedAlbumId] = useState([]);
  const [isCreateAlbum, setIsCreateAlbum] = useState(false);
  const [imagesForAlbumByComp, setImagesForAlbumByComp] = useState([]);
  const [imagesForAlbumByLi, setImagesForAlbumByLi] = useState([]);
  const [imagesAlbum, setImagesAlbum] = useState([
    { id: "", user: "", name: "", status: "", data: "" }
  ]);
  const [pickDataImages, setPickDataImages] = useState({
    fromComp: "",
    fromLibary: ""
  });
  const { currentPage, pageSize, userAdmin, albumName, count } = pageIndex;
  const { fromComp, fromLibary } = pickDataImages;
  const [deleteAlbum] = useMutation(DELETE_ALBUM, {
    variables: {
      ids: selectedAlbumId
    }
  });
  useMemo(() => {
    setImagesForAlbumByComp([]);
    setImagesForAlbumByLi([]);
  }, [fromComp, fromLibary]);
  const [createAlbumByComp] = useMutation(CREATE_ALBUM, {
    variables: {
      req: {
        user: userAdmin,
        name: albumName,
        data: `{"listImages":${JSON.stringify(imagesForAlbumByComp)}}`
      }
    },
    onCompleted: data => {
      console.log(JSON.parse(data.createAdminAlbum.data));
    }
  });
  const [createAlbumByLi] = useMutation(CREATE_ALBUM, {
    variables: {
      req: {
        user: userAdmin,
        name: albumName,
        data: `{"listImages":${JSON.stringify(imagesForAlbumByLi)}}`
      }
    },
    onCompleted: data => {
      console.log(JSON.parse(data.createAdminAlbum.data));
    }
  });
  const [getListAlbum] = useLazyQuery(
    queryGetListAlbumByAdmin(currentPage, pageSize, userAdmin),
    {
      fetchPolicy: "cache-and-network",
      onCompleted: data => {
        setPageIndex({ ...pageIndex, count: data.listAdminAlbumsByUser.count });
        setImagesAlbum(data.listAdminAlbumsByUser.rows);
      }
    }
  );
  useEffect(() => {
    getListAlbum();
  }, []);
  const getAlbumName = e => {
    console.log(e.target.value);
    setPageIndex({ ...pageIndex, albumName: e.target.value });
  };
  const submitDelete = async () => {
    await deleteAlbum();
    await getListAlbum();
    setSelectedAlbumId([]);
  };
  const submitCreateAlbumByComp = async () => {
    await createAlbumByComp();
    await successAlert("created");
    getListAlbum();
  };
  const submitCreateAlbumByLi = async () => {
    await createAlbumByLi();
    await successAlert("created");
    getListAlbum();
  };
  const backScreenUpdate = () => {
    setPickDataImages({ fromComp: "", fromLibary: "" });
  };
  const goPage = val => {
    setPageIndex({ ...pageIndex, currentPage: val });
  };
  const resetAlbumName = () => {
    setPageIndex({ ...pageIndex, albumName: "" });
  };
  const printListAlbum = imagesAlbum.map(function(val, index) {
    if (val.id >= 1) {
      return (
        <Col sm={6} key={index} style={{ padding: "0 .5rem .5rem .5rem" }}>
          <Link to={`/media/album/edit?id=${val.id}`}>
            <Card
              hoverable
              style={{ width: "100%" }}
              cover={
                <div>
                  <img
                    alt={
                      JSON.parse(val.data).listImages.length === 0
                        ? "Album is empty"
                        : val.name
                    }
                    src={
                      JSON.parse(val.data).listImages.length > 0
                        ? JSON.parse(JSON.parse(val.data).listImages[0]).url
                        : ""
                    }
                    style={{ maxHeight: "100%", maxWidth: "100%" }}
                  />
                </div>
              }
            >
              <Meta
                title={val.name}
                description={`${JSON.parse(val.data).listImages.length} ảnh`}
              />
            </Card>
          </Link>
        </Col>
      );
    }
  });
  return (
    <Row>
      <Link to="/media">
        <h2>Media</h2>
      </Link>
      <Col md={16} className="container-images">
        {selectedAlbumId.length > 0 ? (
          <div className="btn-media-options">
            <span>
              <Icon type="close" style={{ marginRight: "5px" }} />
              <span>{selectedAlbumId.length}</span> albums đã được chọn
            </span>
            <div>
              <Icon
                type="delete"
                style={{ fontSize: "18px", margin: "0 5px" }}
                onClick={submitDelete}
              />
              {/* <Icon type="download" style={{ fontSize: "18px" }} /> */}
            </div>
          </div>
        ) : (
          <div className="menu-images">
            <Link to="/media" style={{ marginRight: "3rem" }}>
              <h3>Images</h3>
            </Link>
            <Link to="/media/album">
              <h3>Album</h3>
            </Link>
          </div>
        )}
        <Row style={{ padding: "1rem .5rem" }}>{printListAlbum}</Row>
        <Pagination
          current={currentPage}
          total={count}
          pageSize={10}
          onChange={goPage}
          className="pagination-listUser"
        />
      </Col>
      <Col md={8} className="create-album">
        {isCreateAlbum ? (
          <div onClick={() => setIsCreateAlbum(false)}>
            <Icon type="folder-add" style={{ fontSize: "60px" }} />
            <p>Tạo album mới</p>
          </div>
        ) : (
          <div>
            <h3>
              <Icon
                onClick={() => setIsCreateAlbum(false)}
                type="close"
                style={{ marginRight: "5px", fontSize: "15px" }}
              />
              Creat new album
            </h3>
            <input
              className="input-album-name"
              placeholder="Name album"
              value={albumName}
              name="name"
              onChange={e => getAlbumName(e)}
            />
            <p className="add-images">Add image</p>
            {fromComp === "pickFromComp" && (
              <CreateAlbumFromComp
                setImagesForAlbum={setImagesForAlbumByComp}
                submitCreateAndUpdateAlbum={submitCreateAlbumByComp}
                albumName={albumName}
                refetch={getListAlbum}
                imagesForAlbum={imagesForAlbumByComp}
                setPickDataImages={backScreenUpdate}
                removeAlbumName={resetAlbumName}
              />
            )}
            {fromLibary === "pickFromLibary" && (
              <CreateAlbumFromLibary
                setImagesForAlbum={setImagesForAlbumByLi}
                submitCreateAndUpdateAlbum={submitCreateAlbumByLi}
                refetch={getListAlbum}
                albumName={albumName}
                imagesForAlbum={imagesForAlbumByLi}
                setPickDataImages={backScreenUpdate}
                removeAlbumName={resetAlbumName}
              />
            )}
            {fromLibary === "" ? (
              <>
                <div
                  className="create-album-pick"
                  onClick={() =>
                    setPickDataImages({
                      fromComp: "f",
                      fromComp: "pickFromComp"
                    })
                  }
                >
                  <Icon type="plus" style={{ marginRight: ".5rem" }} />
                  Choose from your computer
                </div>
                <div
                  className="create-album-pick"
                  onClick={() =>
                    setPickDataImages({
                      ...pickDataImages,
                      fromLibary: "pickFromLibary"
                    })
                  }
                >
                  <Icon type="search" style={{ marginRight: ".5rem" }} />
                  Choose from library
                </div>
              </>
            ) : null}
          </div>
        )}
      </Col>
    </Row>
  );
};

export default Album;
