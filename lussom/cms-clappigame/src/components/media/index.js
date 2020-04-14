import React, { useState, useEffect } from "react";
import { Upload, Checkbox, Row, Col, Card, Icon, Button } from "antd";
import UploadImages from "./upload";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";
import "react-image-picker/dist/index.css";
import { useQuery, useMutation, useLazyQuery } from "@apollo/react-hooks";
import { queryListImages } from "../../utils/queryMedia";
import { DELETE_IMAGE, CREATE_ALBUM } from "../../utils/mutation/media";
import "../../static/style/media.css";
import { Link } from "react-router-dom";

const gridStyle = {
  width: "24%",
  textAlign: "center",
  padding: "2px",
  margin: ".5%",
  position: "relative",
  height:"100px"
};
function Media() {
  const [selectedImage, setSelectedImage] = useState([]);
  const [dataImage, setDataImage] = useState([
    { url: "", status: "", id: "", name: "", partnerName: "" }
  ]);
  const [deleteImages] = useMutation(DELETE_IMAGE, {
    variables: {
      ids: selectedImage.map((val, i) => val.id)
    }
  });
  const [isOpenImage, setIsOpenImage] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [getListImages] = useLazyQuery(queryListImages, {
    fetchPolicy:"cache-and-network",
    onCompleted: data => {
      setDataImage(data.listUploadedImages);
    }
  });
  useEffect(() => { getListImages() }, [])
  const onChange = val => {
    console.log(val)
    const newVal = val.map((val, i) => JSON.parse(val))
    setSelectedImage(newVal);
  };
  const submitDelete = async () => {
    await deleteImages();
    await getListImages();
    setSelectedImage([]);
  };
  const showImage = val => {
    setPhotoIndex(val);
    setIsOpenImage(true)
  }
  const printListImages = dataImage.map(function (val, index) {
    return (
      <Card.Grid
        style={gridStyle}
        key={index}
        className="checkbox-image-container"
      >
        <Checkbox value={`{"id":${val.id},"url":"${val.url}"}`} className="checkbox-image">
        </Checkbox>
        <div style={{ height: "100%",cursor:"pointer" }} onClick={() => showImage(index)}>
          <img src={val.url} alt={val.name} style={{maxHeight:"100%",maxWidth:"100%"}} />
        </div>
      </Card.Grid>
    );
  });
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
              <span>{selectedImage.length}</span> items is chosen
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
        <Checkbox.Group
          style={{ width: "100%" }}
          className="list-media"
          onChange={onChange}
          value={selectedImage.map((val, i) => JSON.stringify(val))}
        >
          <Col>{printListImages}</Col>
        </Checkbox.Group>
        {isOpenImage && (
          <Lightbox
            mainSrc={dataImage[photoIndex].url}
            nextSrc={dataImage[(photoIndex + 1) % dataImage.length].url}
            prevSrc={
              dataImage[
                (photoIndex + dataImage.length - 1) % dataImage.length
              ].url
            }
            onCloseRequest={() => setIsOpenImage(false)}
            onMovePrevRequest={() =>
              setPhotoIndex(
                (photoIndex + dataImage.length - 1) % dataImage.length
              )
            }
            onMoveNextRequest={() =>
              setPhotoIndex((photoIndex + 1) % dataImage.length)
            }
          />
        )}
      </Col>
      <UploadImages refetch={getListImages} />
    </Row>
  );
}
export default Media;
