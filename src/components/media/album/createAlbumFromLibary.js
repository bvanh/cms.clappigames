import React, { useState } from "react";
import { Upload, Checkbox, Row, Col, Card, Icon, Button, Modal } from "antd";
import UploadImages from "../upload";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { queryListImages } from "../../../utils/queryMedia";
import ImagePicker from 'react-image-picker'
import { DELETE_IMAGE, CREATE_ALBUM } from "../../../utils/mutation/media";
import "../../../static/style/media.css";
import { Link } from "react-router-dom";
import createAlbumFromComp from "./createAlbumFromComp";

function CreateAlbumFromLibary(props) {
  const { imagesForAlbum } = props;
  const [selectedImage, setSelectedImage] = useState([])
  const [dataImage, setDataImage] = useState([]);
  const [visible, setVisible] = useState(true);
  const { loading, error, data, refetch } = useQuery(queryListImages, {
    fetchPolicy: "cache-and-network",
    onCompleted: data => {
      const newListImage = data.listUploadedImages.filter(
        (val, i) => val.status !== "INVISIBLE"
      );
      setDataImage(newListImage);
    }
  });
  if (loading) return "Loading...";
  if (error) return `Error! ${error.message}`;
  const getImagesForAlbum = valImg => {
    props.setImagesForAlbum(valImg);
  };
  const handleOk = e => {
    setVisible(false);
  };

  const handleCancel = e => {
    setVisible(false);
  };
  const showImages = () => {
    setVisible(true);
  };
  const printImageSelected = imagesForAlbum.map((val, index) => (
    <img src={val} width="15%" key={index} />
  ));
  const onPickImages = value => {
    const listDelete = value.map((val, i) => val.value);
    setSelectedImage(listDelete);
  };
  return (
    <>
      <div>
        <Button onClick={showImages}>chọn ảnh</Button>
        <span>{imagesForAlbum.length}</span> items đã được chọn
        <p> {printImageSelected}</p>
        <Button onClick={() => props.submitCreateAlbum()}>Tao album</Button>
      </div>
      <Modal
        title="Basic Modal"
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Row>
          <Col>
            {imagesForAlbum.length > 0 && (
              <div className="btn-media-options">
                <span>
                  <Icon type="close" style={{ marginRight: "5px" }} />
                  <span>{imagesForAlbum.length}</span> items đã được chọn
                </span>
              </div>
            )}
            <ImagePicker
              multiple
              images={dataImage.map((image, i) => ({
                src: image.url,
                value: image.id
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
