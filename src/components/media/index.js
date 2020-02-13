import React, { useState } from "react";
import { Upload, Checkbox, Row, Col, Card, Icon } from "antd";
import UploadImages from "./upload";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { queryListImages, DELETE_IMAGE } from "../../utils/queryMedia";
import "../../static/style/media.css";

const gridStyle = {
  width: "24%",
  textAlign: "center",
  padding: "2px",
  margin: ".5%",
  position: "relative"
};
function Media() {
  const [selectedImage, setSelectedImage] = useState([]);
  const [dataImage, setDataImage] = useState([])
  const [deleteImages] = useMutation(DELETE_IMAGE, {
    variables: {
      ids: selectedImage
    }
  });
  const { loading, error, data, refetch } = useQuery(queryListImages, {
    onCompleted: data => setDataImage(data)
  });
  if (loading) return "Loading...";
  if (error) return `Error! ${error.message}`;
  const printListImages = data.listUploadedImages.map(function (val, index) {
    if (val.status !== "INVISIBLE") {
      return <Card.Grid style={gridStyle} key={index}>
        <Checkbox value={val.id} className="checkbox-image">
          <img src={val.url} alt={val.name} width="100%" />
        </Checkbox>
      </Card.Grid>;
    }
  });
  const onChange = val => {
    setSelectedImage(val);
    console.log(val);
  };
  const submitDelete = async () => {
    await deleteImages();
    await refetch();
    setSelectedImage([]);
  };
  return (
    <Row>
      <h2>Media</h2>
      <Col md={16}>
        {selectedImage.length > 0 && (
          <div className="btn-media-options">
            <span>
              <Icon type="close" style={{ marginRight: "5px" }} />
              <span>{selectedImage.length}</span> items đã được chọn
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
          <Col>{printListImages}</Col>
        </Checkbox.Group>
      </Col>
      <Col md={8}>
        <UploadImages refetch={refetch} />
      </Col>
    </Row>
  );
}
export default Media;
