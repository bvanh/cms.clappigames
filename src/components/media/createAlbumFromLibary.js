import React, { useState } from "react";
import { Upload, Checkbox, Row, Col, Card, Icon, Button, Modal } from "antd";
import UploadImages from "./upload";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { queryListImages } from "../../utils/queryMedia";
import { DELETE_IMAGE, CREATE_ALBUM } from "../../utils/mutation/media";
import "../../static/style/media.css";
import { Link } from "react-router-dom";

const gridStyle = {
  width: "24%",
  textAlign: "center",
  padding: "2px",
  margin: ".5%",
  position: "relative"
};
function CreateAlbumFromLibary() {
  const [selectedImage, setSelectedImage] = useState([]);
  const [dataImage, setDataImage] = useState([]);
  const [visible, setVisible] = useState(true);
  const { loading, error, data, refetch } = useQuery(queryListImages, {
    onCompleted: data => setDataImage(data)
  });
  if (loading) return "Loading...";
  if (error) return `Error! ${error.message}`;
  const onChange = val => {
    setSelectedImage(val);
    console.log(JSON.stringify({ images: val }));
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
  const printListImages = data.listUploadedImages.map(function(val, index) {
    if (val.status !== "INVISIBLE") {
      return (
        <Card.Grid style={gridStyle} key={index}>
          <Checkbox value={val.url} className="checkbox-image">
            <img src={val.url} alt={val.name} width="100%" />
          </Checkbox>
        </Card.Grid>
      );
    }
  });
  const printImageSelected = selectedImage.map((val, index) => (
    <img src={val} width="15%" />
  ));
  return (
    <>
      <div>
        <Button onClick={showImages}>chọn ảnh</Button>
        <span>{selectedImage.length}</span> items đã được chọn
        <p> {printImageSelected}</p>
      </div>
      <Modal
        title="Basic Modal"
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Row>
          <Col>
            {selectedImage.length > 0 && (
              <div className="btn-media-options">
                <span>
                  <Icon type="close" style={{ marginRight: "5px" }} />
                  <span>{selectedImage.length}</span> items đã được chọn
                </span>
              </div>
            )}
            <Checkbox.Group style={{ width: "100%" }} onChange={onChange}>
              <Col>{printListImages}</Col>
            </Checkbox.Group>
          </Col>
        </Row>
      </Modal>
    </>
  );
}
export default CreateAlbumFromLibary;
