import React, { useState } from "react";
import { Upload, Checkbox, Row, Col, Card, Icon, Button } from "antd";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { queryGetListAlbumByAdmin } from "../../../utils/queryMedia";
import { DELETE_ALBUM, CREATE_ALBUM } from "../../../utils/mutation/media";
import "../../../static/style/media.css";
import { Link } from "react-router-dom";
const { Meta } = Card;
const AlbumImageInNews = (props) => {
    const [pageIndex, setPageIndex] = useState({
        currentPage: 5,
        pageSize: 10,
        userAdmin: localStorage.getItem("userNameCMS"),
        albumName: ""
    });
    const [selectedAlbumId, setSelectedAlbumId] = useState([]);
    const [isCreateAlbum, setIsCreateAlbum] = useState(false);
    const [albumId, setAlbumId] = useState('');
    const { currentPage, pageSize, userAdmin, albumName } = pageIndex;
    const { loading, error, data, refetch } = useQuery(
        queryGetListAlbumByAdmin(currentPage, pageSize, userAdmin),{
            onCompleted:data=>console.log(JSON.parse(JSON.parse(data.listAdminAlbumsByUser.rows[0].data))[0])
        }
    );
    if (loading) return "Loading...";
    if (error) return `Error! ${error.message}`;
    const onChange = val => {
        setSelectedAlbumId(val);
    };
    const printListAlbum = data.listAdminAlbumsByUser.rows.map(function (
        val,
        index
    ) {
        if (val.status !== "INVISIBLE" && val.id >= 15) {
            return (
                <Card
                    hoverable
                    style={{ width: 240 }}
                    cover={
                        <img alt={val.name} src={JSON.parse(JSON.parse(val.data).listImages[0])} />
                    }
                    key={index}
                    onClick={() => props.setDetailAlbum({ isShow: false, albumId: val.id })}
                >
                    <Meta
                        title={val.name}
                        description={`${JSON.parse(val.data).listImages.length} ảnh`}
                    />
                </Card>
            );
        }
    });
    return (
        <Row>
            <Col md={16}>
                <Checkbox.Group
                    style={{ width: "100%" }}
                    onChange={onChange}
                    className="container-album"
                >
                    <Col>{printListAlbum}</Col>
                </Checkbox.Group>
            </Col>
        </Row>
    );
};

export default AlbumImageInNews;
