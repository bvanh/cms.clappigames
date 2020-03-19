import React, { useState } from "react";
import { Upload, Checkbox, Row, Col, Card, Icon, Button } from "antd";
import CreateAlbumFromComp from "./createAlbumFromComp";
import CreateAlbumFromLibary from "./createAlbumFromLibary";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { queryGetListAlbumByAdmin } from "../../../utils/queryMedia";
import { DELETE_ALBUM, CREATE_ALBUM } from "../../../utils/mutation/media";
import "../../../static/style/media.css";
import { Link } from "react-router-dom";
const { Meta } = Card;
const Album = () => {
  const [pageIndex, setPageIndex] = useState({
    currentPage: 5,
    pageSize: 10,
    userAdmin: localStorage.getItem("userNameCMS"),
    albumName: ""
  });
  const [selectedAlbumId, setSelectedAlbumId] = useState([]);
  const [isCreateAlbum, setIsCreateAlbum] = useState(false);
  const [imagesForCreateAlbum, setImagesForCreateAlbum] = useState([]);
  const [imagesAlbum, setImagesAlbum] = useState([
    { id: "", user: "", name: "", status: "", data: "" }
  ]);
  const [pickDataImages, setPickDataImages] = useState({
    fromComp: "",
    fromLibary: ""
  });
  const { currentPage, pageSize, userAdmin, albumName } = pageIndex;
  const { fromComp, fromLibary } = pickDataImages;
  const [deleteAlbum] = useMutation(DELETE_ALBUM, {
    variables: {
      ids: selectedAlbumId
    }
  });
  const [createAlbum] = useMutation(CREATE_ALBUM, {
    variables: {
      req: {
        user: userAdmin,
        name: albumName,
        data: `{"listImages":${JSON.stringify(imagesForCreateAlbum)}}`
      }
    },
    onCompleted: data => {
      console.log(JSON.parse(data.createAdminAlbum.data));
    }
  });
  const { loading, error, data, refetch } = useQuery(
    queryGetListAlbumByAdmin(currentPage, pageSize, userAdmin),
    {
      onCompleted: data => {
        console.log(data.listAdminAlbumsByUser);
        setImagesAlbum(data.listAdminAlbumsByUser.rows);
      }
    }
  );

  if (loading) return "Loading...";
  if (error) return `Error! ${error.message}`;
  const onChange = val => {
    setSelectedAlbumId(val);
  };
  const getAlbumName = e => {
    setPageIndex({ ...pageIndex, albumName: e.target.value });
  };
  const submitDelete = async () => {
    await deleteAlbum();
    await refetch();
    setSelectedAlbumId([]);
  };
  const submitCreateAlbum = () => {
    if (albumName === "" || imagesForCreateAlbum.length === 0) {
      alert("thieu name");
    } else {
      createAlbum();
    }
  };
  const backScreenUpdate = () => {
    setPickDataImages({ fromComp: "", fromLibary: "" });
  };
  const printListAlbum = imagesAlbum.map(function(val, index) {
    if (val.status !== "INVISIBLE" && val.id >= 15) {
      return (
        <Col sm={6} key={index} style={{ padding: "0 .5rem .5rem .5rem" }}>
          <Link to={`/media/album/edit?id=${val.id}`}>
            <Card
              hoverable
              style={{ width: "100%" }}
              cover={
                <div>
                  <img
                    alt={val.name}
                    src={JSON.parse(JSON.parse(val.data).listImages[0]).url}
                    width="100%"
                  />
                </div>
              }
              // actions={[
              //   <Checkbox value={val.id} className="checkbox-album"></Checkbox>,
              //   <Link to={`/media/album/edit?id=${val.id}`}>
              //     <Icon type="edit" key="edit" />
              //   </Link>,
              //   <Icon type="ellipsis" key="ellipsis" />
              // ]}
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
              <Icon type="download" style={{ fontSize: "18px" }} />
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
        <Row style={{padding:'1rem .5rem'}}>{printListAlbum}</Row>
      </Col>
      <Col md={8} className="create-album">
        {isCreateAlbum ? (
          <div onClick={() => setIsCreateAlbum(false)}>
            <Icon type="folder-add" style={{ fontSize: "60px" }} />
            <p>Tạo album mới</p>
          </div>
        ) : (
          <div >
            <h3>
              <Icon
                onClick={() => setIsCreateAlbum(false)}
                type="close"
                style={{ marginRight: "5px", fontSize: "15px" }}
              />
              Tạo album mới
            </h3>
            <input
              className="input-album-name"
              placeholder="Nhập tên album"
              value={albumName}
              name="name"
              onChange={e => getAlbumName(e)}
            />
            <p className="add-images">Thêm ảnh</p>
            {fromComp === "pickFromComp" && (
              <CreateAlbumFromComp
                setImagesForCreateAlbum={setImagesForCreateAlbum}
                submitCreateAndUpdateAlbum={submitCreateAlbum}
                albumName={albumName}
                refetch={refetch}
                imagesForCreateAlbum={imagesForCreateAlbum}
                setPickDataImages={backScreenUpdate}
                removeAlbumName={() =>
                  setPageIndex({ ...pageIndex, albumName: "" })
                }
              />
            )}
            {fromLibary === "pickFromLibary" && (
              <CreateAlbumFromLibary
                setImagesForCreateAlbum={setImagesForCreateAlbum}
                submitCreateAndUpdateAlbum={submitCreateAlbum}
                refetch={refetch}
                imagesForCreateAlbum={imagesForCreateAlbum}
                setPickDataImages={backScreenUpdate}
                removeAlbumName={() =>
                  setPageIndex({ ...pageIndex, albumName: "" })
                }
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
                  <Icon type="plus" />
                  Chọn ảnh từ máy tính
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
                  <Icon type="search" />
                  Chọn ảnh từ thư viện
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
