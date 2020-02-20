import React, { useState } from "react";
import {
  Upload,
  Checkbox,
  Row,
  Col,
  Card,
  Icon,
  Button,
  Modal,
  Input,
  Radio,
  Tabs
} from "antd";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { queryListImages } from "../../../utils/queryMedia";
import { connect } from "react-redux";
import AlbumImageInNews from "./albumImageNews";
import AlbumDetailImages from "./albumDetaiImages";
import { dispatchShowImagesNews } from "../../../redux/actions";
import { DELETE_IMAGE, CREATE_ALBUM } from "../../../utils/mutation/media";
import "../../../static/style/media.css";
import { Link } from "react-router-dom";
const { TabPane } = Tabs;

function ListImagesForNews(props) {
  const [dataImage, setDataImage] = useState([]);
  const [isDetailAlbum, setDetailAlbum] = useState({
    isShow: true,
    albumId: null
  });
  const [imgUrl, setImgUrl] = useState("");
  const { isShow, albumId } = isDetailAlbum;
  const { loading, error, data, refetch } = useQuery(queryListImages, {
    onCompleted: data => setDataImage(data)
  });
  if (loading) return "Loading...";
  if (error) return `Error! ${error.message}`;
  const printListImages = data.listUploadedImages.map(function(val, index) {
    if (val.status !== "INVISIBLE") {
      return (
        <Radio value={val.url} key={index} className="list-images-news">
          <img src={val.url} width="30%" className="image-news" />
        </Radio>
      );
    }
  });
  const getUrl = e => {
    setImgUrl(e.target.value);
  };
  return (
    <>
      <Modal
        visible={props.visible}
        className="listImages_news"
        footer={[
          <span>
            {" "}
            URL:{" "}
            <input
              value={imgUrl}
              style={{ marginLeft: "5px", width: "100%" }}
              disabled
            />
          </span>
        ]}
      >
        <Tabs type="card">
          <TabPane tab="Tất cả ảnh" key="1">
            <Row className="listImages_news">
              <Col>
                <Radio.Group buttonStyle="solid" onChange={getUrl}>
                  {printListImages}
                </Radio.Group>
              </Col>
            </Row>
          </TabPane>
          <TabPane tab="Album" key="2">
            {isShow ? (
              <AlbumImageInNews setDetailAlbum={setDetailAlbum} />
            ) : (
              <AlbumDetailImages albumId={albumId} />
            )}
          </TabPane>
        </Tabs>
      </Modal>
    </>
  );
}
function mapStateToProps(state) {
  return {
    visible: state.visibleModalNews
  };
}
export default connect(mapStateToProps, null)(ListImagesForNews);
