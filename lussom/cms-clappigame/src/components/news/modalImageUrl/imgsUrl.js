import React, { useState, useEffect } from "react";
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
import UploadImagesInNews from "./upload";
import { useQuery, useMutation, useLazyQuery } from "@apollo/react-hooks";
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
  const [getListImages] = useLazyQuery(queryListImages, {
    fetchPolicy: "cache-and-network",
    onCompleted: data => {
      setDataImage(data.listUploadedImages);
    }
  });
  useEffect(() => {
    getListImages();
  }, []);
  const printListImages = dataImage.map(function(val, index) {
    if (val.status !== "INVISIBLE") {
      return (
        <Radio value={val.url} key={index} className="list-images-news">
          {/* <Icon type="check-circle" theme="filled"style={{color:"red"}} className='icon-checked-images'/> */}
          <img src={val.url} width="100%" className="image-news" />
        </Radio>
      );
    }
  });
  const getUrl = e => {
    if (props.isThumbnail) {
      dispatchSetUrlImageThumbnail(e.target.value);
    } else {
      dispatchSetUrlImage(e.target.value);
    }
  };
  const setIsAlbum = () => {
    setDetailAlbum({ isShow: true, albumId: null });
  };
  const operations = (
    <UploadImagesInNews
      isThumbnail={props.isThumbnail}
      refetch={getListImages}
    />
  );
  return (
    <>
      <Modal
        visible={props.visible}
        className="listImages-news-modal"
        onOk={() => dispatchShowImagesNews(false)}
        onCancel={() => dispatchShowImagesNews(false)}
        footer={[
          <span className={`isThumbnail-${props.isThumbnail}`}>
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
              <Radio.Group
                buttonStyle="solid"
                onChange={getUrl}
                value={
                  props.isThumbnail ? props.urlImgThumbnail : props.urlImgNews
                }
              >
                {printListImages}
              </Radio.Group>
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
              <AlbumDetailImages
                albumId={albumId}
                isThumbnail={props.isThumbnail}
              />
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
    urlImgThumbnail: state.urlImgThumbnail
  };
}
export default connect(mapStateToProps, null)(ListImagesForNews);
