import React, { useState, useEffect } from "react";
import { Upload, Checkbox, Row, Col, Card, Icon, Button, Radio } from "antd";
import { useQuery, useMutation, useLazyQuery } from "@apollo/react-hooks";
import { queryGetImagesFromAlbumByType } from "../../../utils/queryMedia";
import {
  dispatchShowImagesNews,
  dispatchSetUrlImage
} from "../../../redux/actions";
import "../../../static/style/media.css";
import { Link } from "react-router-dom";

function AlbumDetailImages(props) {
  const userAdmin = localStorage.getItem("userNameCMS");
  const [pageIndex, setPageIndex] = useState({
    currentPage: 2,
    pageSize: 10,
    userAdmin: localStorage.getItem("userNameCMS"),
    albumName: ""
  });
  const [selectedImage, setSelectedImage] = useState([]);
  const [isCreateAlbum, setIsCreateAlbum] = useState(false);
  const [imagesDetailAlbum, setImagesDetailAlbum] = useState([]);
  const { albumName } = pageIndex;
  const [dataImage, setDataImage] = useState([]);
  //   const [deleteImages] = useMutation(DELETE_IMAGE, {
  //     variables: {
  //       ids: selectedImage
  //     }
  //   });
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
  // useEffect(() => {
  //   getListImage();
  // }, []);
  const getUrl = e => {
    dispatchSetUrlImage(e.target.value);
  };
  const printListImages = imagesDetailAlbum.map((val, index) => (
    <Radio value={val} key={index} className="list-images-news">
      <img src={val} width="30%" className="image-news" alt={val.name} />
    </Radio>
  ));
  //   const submitDelete = async () => {
  //     await deleteImages();
  //     await refetch();
  //     setSelectedImage([]);
  //   };
  // console.log(JSON.parse(data.listAdminAlbums[0].data))
  return (
    <Row>
      <Col md={16}>
        {/* } */}
        <Checkbox.Group style={{ width: "100%" }}>
          <Radio.Group buttonStyle="solid" onChange={getUrl}>
            {printListImages}
          </Radio.Group>
        </Checkbox.Group>
      </Col>
    </Row>
  );
}
export default AlbumDetailImages;
