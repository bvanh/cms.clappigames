import React, { useState } from "react";
import { Upload, Checkbox, Row, Col, Card, Icon, Button, Modal } from "antd";
import UploadImages from "../upload";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { queryListImages } from "../../../utils/queryMedia";
import ImagePicker from "react-image-picker";
import { DELETE_IMAGE, CREATE_ALBUM } from "../../../utils/mutation/media";
import "../../../static/style/media.css";
import { Link } from "react-router-dom";
import createAlbumFromComp from "./createAlbumFromComp";

function CreateAlbumFromLibary(props) {
  const { imagesForCreateAlbum } = props;
  const [dataImage, setDataImage] = useState([]);
  const [visible, setVisible] = useState(false);
  const { loading, error, data, refetch } = useQuery(queryListImages, {
    fetchPolicy: "cache-and-network",
    onCompleted: data => {
      let newListImage = data.listUploadedImages.filter(
        (val, i) => val.status !== "INVISIBLE"
      );
      const idOldImage = imagesForCreateAlbum.map((val, i) =>
        Number(JSON.parse(val).id)
      );
      newListImage = newListImage.filter(e => idOldImage.indexOf(e.id) < 0);
      setDataImage(newListImage);
    }
  });
  if (loading) return "Loading...";
  if (error) return `Error! ${error.message}`;
  const handleOk = e => {
    setVisible(false);
  };

  const handleCancel = e => {
    setVisible(false);
  };
  const showImages = () => {
    setVisible(true);
  };
  const printImageSelected = imagesForCreateAlbum.map((val, index) => (
    <Col xs={4} style={{ height: "55px" }} key={index}>
      <img
        src={JSON.parse(val).url}
        style={{ height: "100%", width: "100%" }}
        key={index}
      />
    </Col>
  ));
  const onPickImages = value => {
    const listImageForShow = value.map((val, i) => val.value);
    const newListImage = [...imagesForCreateAlbum, ...listImageForShow];
    const filterImages = newListImage.filter(
      (value, i, newListImage) => newListImage.indexOf(value) === i
    );
    props.setImagesForCreateAlbum(filterImages);
  };
  const updateAlbum = () => {
    setVisible(false);
    props.submitCreateAndUpdateAlbum();
    props.setPickDataImages();
  };
  return (
    <>
      <div>
        <a onClick={showImages} style={{paddingRight:".5rem"}}><Icon type="double-right" />Chọn ảnh</a>
        <span>{imagesForCreateAlbum.length}</span> items đã được chọn
        <Row style={{margin:"1rem 0"}}>{printImageSelected}</Row>
        
        <Button onClick={updateAlbum} style={{width:"100%",marginBottom:".5rem"}} >
          Submit
        </Button>
        
        <a onClick={props.setPickDataImages}>
          <Icon type="double-left" />
          Quay lại
        </a>
      </div>
      <Modal
        title="Media"
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Row>
          <Col>
            {imagesForCreateAlbum.length > 0 && (
              <div className="btn-media-options">
                <span>
                  <Icon type="close" style={{ marginRight: "5px" }} />
                  <span>{imagesForCreateAlbum.length}</span> items đã được chọn
                </span>
              </div>
            )}
            <ImagePicker
              multiple
              images={dataImage.map((image, i) => ({
                src: image.url,
                value: `{"id":"${image.id}","status":"${image.status}","name":"${image.name}","url":"${image.url}"}`
              }))}
              onPick={onPickImages}
            />
          </Col>
        </Row>
      </Modal>
    </>
  );
}
export default CreateAlbumFromLibary;
