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
import ImagePicker from "react-image-picker";
import "react-image-picker/dist/index.css";
import UploadImagesInNews from "./upload";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { queryListImages } from "../../../utils/queryMedia";
import { connect } from "react-redux";
import AlbumImageInNews from "./albumImageNews";
import AlbumDetailImages from "./albumDetaiImages";
import {
  dispatchShowImagesNews,
  dispatchSetUrlImage,
  dispatchSetUrlImageThumbnail
} from "../../../redux/actions";
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
  const { isShow, albumId } = isDetailAlbum;
  const { loading, error, data, refetch } = useQuery(queryListImages, {
    onCompleted: data => {
      const newDataImage = data.listUploadedImages.filter((val, i) => val.status !== 'INVISIBLE')
      setDataImage(newDataImage)
    }
  });
  if (loading) return "Loading...";
  if (error) return `Error! ${error.message}`;
  const onPickImages = (value) => {
    if (props.isThumbnail) {
      dispatchSetUrlImageThumbnail(value.value)
    } else {
      dispatchSetUrlImage(value.value);
    }
  }
  const setIsAlbum = () => {
    setDetailAlbum({ isShow: true, albumId: null });
  };
  const operations = <UploadImagesInNews />;
  console.log(albumId, isShow);
  return (
    <>
      <Modal
        visible={props.visible}
        className="listImages_news"
        onOk={() => dispatchShowImagesNews(false)}
        onCancel={() => dispatchShowImagesNews(false)}
        footer={[
          <span>
            {" "}
            URL:{" "}
            <input
              value={props.urlImgNews}
              style={{ marginLeft: "5px", width: "100%" }}
              disabled
            />
          </span>
        ]}
      >
        <Tabs type="card" tabBarExtraContent={operations}>
          <TabPane tab="Tất cả ảnh" key="1">
            <Row className="listImages_news">
              <Col>
                <ImagePicker
                  images={dataImage.map((image, i) => ({
                    src: image.url,
                    value: image.url
                  }))}
                  onPick={onPickImages}
                />
              </Col>
            </Row>
          </TabPane>
          <TabPane
            tab={
              <span onClick={setIsAlbum}>
                <Icon type="android" />
                Album
              </span>
            }
            key="2"
          >
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
    visible: state.visibleModalNews,
    urlImgNews: state.urlImgNews,
  };
}
export default connect(mapStateToProps, null)(ListImagesForNews);
