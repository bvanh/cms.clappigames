import React, { useState, useEffect } from "react";
import { Upload, Checkbox, Row, Col, Card, Icon, Button, Radio } from "antd";
import { useQuery, useMutation, useLazyQuery } from "@apollo/react-hooks";
import { queryGetImagesFromAlbumByType } from "../../../utils/queryMedia";
import {
  dispatchShowImagesNews,
  dispatchSetUrlImage,
  dispatchSetUrlImageThumbnail
} from "../../../redux/actions";
import "../../../static/style/media.css";
import { Link } from "react-router-dom";

function AlbumDetailImages(props) {
  const userAdmin = localStorage.getItem("userNameCMS");
  const [pageIndex, setPageIndex] = useState({
    currentPage: 1,
    pageSize: 10,
    userAdmin: localStorage.getItem("userNameCMS"),
    albumName: ""
  });
  const [selectedImage, setSelectedImage] = useState([]);
  const [isCreateAlbum, setIsCreateAlbum] = useState(false);
  const [imagesDetailAlbum, setImagesDetailAlbum] = useState([]);
  const { albumName } = pageIndex;
  const [dataImage, setDataImage] = useState([]);
  const { data, loading, error } = useQuery(
    queryGetImagesFromAlbumByType(props.albumId, userAdmin),
    {
      onCompleted: data => {
        setImagesDetailAlbum(
          JSON.parse(data.listAdminAlbums[0].data).listImages
        );
        console.log(data);
      }
    }
  );
  const getUrl = e => {
    if (props.isThumbnail) {
      dispatchSetUrlImageThumbnail(e.target.value)
    } else {
      dispatchSetUrlImage(e.target.value);
    }
  };
  const printListImages = imagesDetailAlbum.map((val, index) => (
    <Radio value={JSON.parse(val).url} key={index} className="list-images-news">
      <img src={JSON.parse(val).url} width="100%" className="image-news" />
    </Radio>
  ));
  return (
    <Checkbox.Group className='list-album-news'>
      <Radio.Group buttonStyle="solid" onChange={getUrl}>
        {printListImages}
      </Radio.Group>
    </Checkbox.Group>
  );
}
export default AlbumDetailImages;
