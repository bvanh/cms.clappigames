import React, { useState } from "react";
import { Upload, Checkbox, Row, Col, Card, Icon, Button } from "antd";
import { UPDATE_ALBUM } from "../../../utils/mutation/media";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";
import CreateAlbumFromComp from "./createAlbumFromComp";
import CreateAlbumFromLibary from "./createAlbumFromLibary";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { queryGetImagesFromAlbumByType } from "../../../utils/queryMedia";
// import { DELETE_IMAGE, CREATE_ALBUM } from "../../utils/mutation/media";
import "../../../static/style/media.css";
import { Link } from "react-router-dom";

const gridStyle = {
  width: "24%",
  textAlign: "center",
  padding: "2px",
  margin: ".5%",
  position: "relative"
};
function UpdateAlbum() {
  const query = new URLSearchParams(window.location.search);
  const albumId = query.get("id");
  const userAdmin = localStorage.getItem("userNameCMS");
  const [pageIndex, setPageIndex] = useState({
    currentPage: 2,
    pageSize: 10,
    userAdmin: localStorage.getItem("userNameCMS"),
    albumName: ""
  });
  const [selectedImage, setSelectedImage] = useState([]);
  const [isCreateAlbum, setIsCreateAlbum] = useState(false);
  const [imagesForAlbum, setImagesForAlbum] = useState([]);
  const [isOpenImage, setIsOpenImage] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [pickDataImages, setPickDataImages] = useState({
    fromComp: "",
    fromLibary: ""
  });
  const { albumName } = pageIndex;
  const { fromComp, fromLibary } = pickDataImages;
  //   const [deleteImages] = useMutation(DELETE_IMAGE, {
  //     variables: {
  //       ids: selectedImage
  //     }
  //   });
  const { loading, error, data, refetch } = useQuery(
    queryGetImagesFromAlbumByType(albumId, userAdmin),
    {
      onCompleted: data => {
        setImagesForAlbum(JSON.parse(data.listAdminAlbums[0].data).listImages);
        setPageIndex({ ...pageIndex, albumName: data.listAdminAlbums[0].name });
      }
    }
  );
  const [updateAlbum] = useMutation(UPDATE_ALBUM, {
    variables: {
      id: Number(albumId),
      req: {
        user: userAdmin,
        name: albumName,
        data: `{"listImages":${JSON.stringify(imagesForAlbum)}}`
      }
    },
    onCompleted: data => console.log(data)
  });
  if (loading) return "Loading...";
  if (error) return `Error! ${error.message}`;
  const { listImages } = JSON.parse(data.listAdminAlbums[0].data);
  const onChange = val => {
    setSelectedImage(val);
    console.log(val);
  };
  const getAlbumName = e => {
    setPageIndex({ ...pageIndex, albumName: e.target.value });
  };
  //   const submitDelete = async () => {
  //     await deleteAlbum();
  //     await refetch();
  //     setSelectedAlbumId([]);
  //   };
  const submitUpdateAlbum = async () => {
    if (albumName === "" || imagesForAlbum.length === 0) {
      alert("thieu noi dung");
    } else {
      await updateAlbum();
      refetch();
      setSelectedImage([]);
    }
  };
  const submitDelete = async () => {
    const newImages = imagesForAlbum.filter(
      (val, i) => selectedImage.indexOf(val) == -1
    );
    await setImagesForAlbum(newImages);
    submitUpdateAlbum();
  };
  const backScreenUpdate = () => {
    setPickDataImages({ fromComp: "", fromLibary: "" });
  };
  const resetAlbumName = () => { };
  const printListImages = imagesForAlbum.map((val, index) => (
    <Card.Grid style={gridStyle} key={index}>
      <Checkbox value={val} className="checkbox-image">
        <img src={JSON.parse(val).url} width="100%" />
      </Checkbox>
    </Card.Grid>
  ));
  return (
    <Row>
      <Link to="/media">
        <h2>Media</h2>
      </Link>
      <Col md={16} className="container-images">
        {selectedImage.length > 0 ? (
          <div className="btn-media-options">
            <span>
              <Icon type="close" style={{ marginRight: "5px" }} onClick={() => setSelectedImage([])} />
              <span>{selectedImage.length}</span> items đã được chọn
            </span>
            <div>
              <Icon type="eye" style={{ fontSize: "18px", margin: "0 5px" }} onClick={() => setIsOpenImage(true)} />
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
        <Checkbox.Group style={{ width: "100%" }} onChange={onChange} value={selectedImage}>
          <div>{printListImages}</div>
        </Checkbox.Group>
        {isOpenImage && (
          <Lightbox
            mainSrc={JSON.parse(selectedImage[photoIndex]).url}
            nextSrc={JSON.parse(selectedImage[(photoIndex + 1) % selectedImage.length]).url}
            prevSrc={
              JSON.parse(
                selectedImage[
                (photoIndex + selectedImage.length - 1) % selectedImage.length
                ]).url
            }
            onCloseRequest={() => setIsOpenImage(false)}
            onMovePrevRequest={() =>
              setPhotoIndex(
                (photoIndex + selectedImage.length - 1) % selectedImage.length
              )
            }
            onMoveNextRequest={() =>
              setPhotoIndex((photoIndex + 1) % selectedImage.length)
            }
          />
        )}
      </Col>
      <Col md={8} className="create-album">
        <div>
          <h3>
            <Icon
              onClick={() => setIsCreateAlbum(false)}
              type="close"
              style={{ marginRight: "5px", fontSize: "15px" }}
            />
            Update Album
          </h3>
          <input
            className="input-album-name"
            placeholder="Nhập tên album"
            value={pageIndex.albumName}
            name="name"
            onChange={e => getAlbumName(e)}
          />
          <p className="add-images">Thêm ảnh</p>
          {fromComp === "pickFromComp" && (
            <CreateAlbumFromComp
              setImagesForAlbum={setImagesForAlbum}
              submitCreateAndUpdateAlbum={submitUpdateAlbum}
              refetch={refetch}
              imagesForAlbum={imagesForAlbum}
              setPickDataImages={backScreenUpdate}
              removeAlbumName={resetAlbumName}
            />
          )}
          {fromLibary === "pickFromLibary" && (
            <CreateAlbumFromLibary
              setImagesForAlbum={setImagesForAlbum}
              submitCreateAndUpdateAlbum={submitUpdateAlbum}
              refetch={refetch}
              imagesForAlbum={imagesForAlbum}
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
          {fromComp === "" && fromLibary === "" ? (
            <div style={{margin:"0 2rem"}}>
              <Button onClick={submitUpdateAlbum} style={{width:"100%"}}>
                Submit
            </Button>
            </div>
          ) : null}
        </div>
      </Col>
    </Row>
  );
}
export default UpdateAlbum;
