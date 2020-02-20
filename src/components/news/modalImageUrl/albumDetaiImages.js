import React, { useState,useEffect } from "react";
import { Upload, Checkbox, Row, Col, Card, Icon, Button } from "antd";
import { useQuery, useMutation,useLazyQuery } from "@apollo/react-hooks";
import { queryGetImagesFromAlbumByType } from "../../../utils/queryMedia";
// import { DELETE_IMAGE, CREATE_ALBUM } from "../../utils/mutation/media";
import "../../../static/style/media.css";
import { Link } from "react-router-dom";

const gridStyle = {
  width: "24%",
  textAlign: "center",
  padding: "2px",
  margin: ".5%",
  position: "relative"
};
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
  const [pickDataImages, setPickDataImages] = useState({
    fromComp: "",
    fromLibary: ""
  });
  const { albumName } = pageIndex;
  const { fromComp, fromLibary } = pickDataImages;
  const [dataImage, setDataImage] = useState([]);
  //   const [deleteImages] = useMutation(DELETE_IMAGE, {
  //     variables: {
  //       ids: selectedImage
  //     }
  //   });
  const [getListImage] = useLazyQuery(
    queryGetImagesFromAlbumByType(props.albumId, userAdmin),
    {
      onCompleted: data => {
        setImagesDetailAlbum(JSON.parse(data.listAdminAlbums[0].data).listImages)
      }
    }
  );
  useEffect(()=>{
      getListImage();
  },[])
 
//   const { listImages } = JSON.parse(data.listAdminAlbums[0].data);
//   const onChange = val => {
//     setSelectedImage(val);
//     console.log(JSON.stringify({ images: val }));
//   };
  const printListImages = imagesDetailAlbum.map((val, index) => (
    <Card.Grid style={gridStyle} key={index}>
      <Checkbox value={val} className="checkbox-image">
        <img src={val} alt={val.name} width="100%" />
      </Checkbox>
    </Card.Grid>
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
        <Checkbox.Group style={{ width: "100%" }} >
          <div>{printListImages}</div>
        </Checkbox.Group>
      </Col>
    </Row>
  );
}
export default AlbumDetailImages;
