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
    currentPage: 2,
    pageSize: 10,
    userAdmin: localStorage.getItem("userNameCMS"),
    albumName: ""
  });
  const [selectedAlbumId, setSelectedAlbumId] = useState([]);
  const [isCreateAlbum, setIsCreateAlbum] = useState(false);
  const [imagesForAlbum, setImagesForAlbum] = useState([]);
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
        data: `{"listImages":${JSON.stringify(imagesForAlbum)}}`
      }
    },
    onCompleted: data => console.log("tạo thành công")
  });
  const { loading, error, data, refetch } = useQuery(
    queryGetListAlbumByAdmin(currentPage, pageSize, userAdmin)
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
    if (albumName === ""){
      alert("thieu name");
    } else {
      createAlbum();
    }
  };
  const printListAlbum = data.listAdminAlbumsByUser.rows.map(function(
    val,
    index
  ) {
    if (val.status !== "INVISIBLE" && val.id >= 15) {
      return (
        <Card
          hoverable
          style={{ width: 240 }}
          cover={
            <img alt={val.name} src={JSON.parse(val.data).listImages[0]} />
          }
          actions={[
            <Checkbox value={val.id} className="checkbox-album"></Checkbox>,
            <Link to={`/media/album/edit?id=${val.id}`}><Icon type="edit" key="edit" /></Link>,
            <Icon type="ellipsis" key="ellipsis" />
          ]}
          key={index}
        >
          <Meta
            title={val.name}
            description={`${JSON.parse(val.data).listImages.length} ảnh`}
          />
        </Card>
      );
    }
  });
  return (
    <Row>
      <h2>
        Media <Link to="/media/album">Album</Link>
      </h2>
      <Col md={16}>
        {selectedAlbumId.length > 0 && (
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
        )}
        <Checkbox.Group
          style={{ width: "100%" }}
          onChange={onChange}
          className="container-album"
        >
          <Col>{printListAlbum}</Col>
        </Checkbox.Group>
      </Col>
      <Col md={8}>
        {isCreateAlbum ? (
          <div className="create-album" onClick={() => setIsCreateAlbum(false)}>
            <Icon type="folder-add" style={{ fontSize: "60px" }} />
            <p>Tạo album mới</p>
          </div>
        ) : (
          <div className="create-album">
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
            <p>Thêm ảnh</p>
            {fromComp === "pickFromComp" && (
              <CreateAlbumFromComp
                setImagesForAlbum={setImagesForAlbum}
                submitCreateAlbum={submitCreateAlbum}
                albumName={albumName}
                refetch={refetch}
                imagesForAlbum={imagesForAlbum}
                setPickDataImages={() =>
                  setPickDataImages({ ...pickDataImages, fromComp: "" })
                }
                removeAlbumName={() =>
                  setPageIndex({ ...pageIndex, albumName: "" })
                }
              />
            )}
            {fromLibary === "pickFromLibary" && (
              <CreateAlbumFromLibary
                setImagesForAlbum={setImagesForAlbum}
                submitCreateAlbum={submitCreateAlbum}
                refetch={refetch}
                imagesForAlbum={imagesForAlbum}
                setPickDataImages={() =>
                  setPickDataImages({ ...pickDataImages, fromComp: "" })
                }
                removeAlbumName={() =>
                  setPageIndex({ ...pageIndex, albumName: "" })
                }
              />
            )}
            {fromComp === "" || fromLibary === "" ? (
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
