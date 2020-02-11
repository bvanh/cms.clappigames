import React from "react";
import { Upload, Checkbox, Row, Col, Card } from "antd";
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
      <Checkbox value={val.id}><img src={val.url} alt={val.name} width="100%" /></Checkbox>
    </Card.Grid>
  ));
  const onChange=val=>{
    console.log(val)
  }
  return (
    <Row>
      <Checkbox.Group style={{ width: '100%' }} onChange={onChange}>
      <Col md={16}>{printListImages}</Col>
      </Checkbox.Group>
      <Col md={8}>
        <UploadImages refetch={refetch} />
      </Col>
    </Row>
  );
}
export default Media;
