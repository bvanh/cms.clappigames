import React, { useState } from "react";
import { Upload, Checkbox, Row, Col, Card, Icon, Button, Modal } from "antd";
import UploadImages from "../upload";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { queryListImages } from "../../../utils/queryMedia";
import {errorAlert} from '../mediaService'

const gridStyle = {
  width: "24%",
  textAlign: "center",
  padding: "2px",
  margin: ".5%",
  position: "relative"
};

function CreateAlbumFromLibary(props) {
  const { imagesForAlbum } = props;
  const [dataImage, setDataImage] = useState([]);
  const [visible, setVisible] = useState(false);
  const { loading, error, data, refetch } = useQuery(queryListImages, {
    fetchPolicy: "cache-and-network",
    onCompleted: data => {
      let newListImage = data.listUploadedImages.filter(
        (val, i) => val.status !== "INVISIBLE"
      );
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
  const printImageSelected = imagesForAlbum.map((val, index) => (
    <Col xs={4} style={{ height: "55px" }} key={index}>
      <img
        src={JSON.parse(val).url}
        style={{ height: "100%", width: "100%" }}
        key={index}
        alt="img"
      />
    </Col>
  ));

  const getImagesForAlbum = valImg => {
    props.setImagesForAlbum(valImg);
    console.log(valImg);
  };

  const updateAlbum = () => {
    setVisible(false);
    if (props.albumName === "") {
      errorAlert();
    } else {
      props.submitCreateAndUpdateAlbum();
      props.setPickDataImages();
      props.removeAlbumName();
    }
  };
  const printListImages = data.listUploadedImages.map(function(val, index) {
    if (val.status !== "INVISIBLE") {
      return (
        <Card.Grid style={gridStyle} key={index}>
          <Checkbox
            value={`{"id":${val.id},"status":"${val.status}","url":"${val.url}"}`}
            className="checkbox-image"
          >
            <img src={val.url} alt={val.name} width="100%" />
          </Checkbox>
        </Card.Grid>
      );
    }
  });
  return (
    <>
      <div>
        <a onClick={showImages} style={{ paddingRight: ".5rem" }}>
          <Icon type="double-right" />
          Chọn ảnh
        </a>
        <span>{imagesForAlbum.length}</span> items đã được chọn
        <Row style={{ margin: "1rem 0" }}>{printImageSelected}</Row>
        <Button
          onClick={updateAlbum}
          style={{ width: "100%", marginBottom: ".5rem" }}
          disabled={props.imagesForAlbum.length > 0 ? false : true}
        >
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
            {imagesForAlbum.length > 0 && (
              <div className="btn-media-options">
                <span>
                  <Icon type="close" style={{ marginRight: "5px" }} />
                  <span>{imagesForAlbum.length}</span> items đã được chọn
                </span>
              </div>
            )}
            <Checkbox.Group
              style={{ width: "100%" }}
              value={imagesForAlbum}
              onChange={getImagesForAlbum}
            >
              <Col>{printListImages}</Col>
            </Checkbox.Group>
          </Col>
        </Row>
      </Modal>
    </>
  );
}
export default CreateAlbumFromLibary;
