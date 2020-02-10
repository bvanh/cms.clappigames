import React from "react";
import { Upload, Icon, message, Row, Col, Card } from "antd";
import UploadImages  from "./upload";
import { useQuery } from "@apollo/react-hooks";
import { queryListImages } from "../../utils/queryMedia";

const { Dragger } = Upload;

function Media() {
  const gridStyle = {
    width: "25%",
    textAlign: "center"
  };
  const { loading, error, data, refetch } = useQuery(queryListImages);
  if (loading) return "Loading...";
  if (error) return `Error! ${error.message}`;

  const printListImages = data.listUploadedImages.map((val, index) => (
    <Card.Grid style={gridStyle}>
      <img src={val.url} alt={val.name} width="100%" />
    </Card.Grid>
  ));
 
  return (
    <Row>
      <Col md={16}>{printListImages}</Col>
      <Col md={8}>
        <UploadImages />
      </Col>
    </Row>
  );
}
export default Media;
