import React, { useState, useRef, useEffect } from "react";
import {
  queryNewsDetail,
  UpdateNews,
  queryGetPlatform
} from "../../utils/queryNews";
import { Row, Col } from "antd";
import JoditEditor from "jodit-react";
import "jodit/build/jodit.min.css";
import { connect } from 'react-redux'
import { useMutation, useQuery, useLazyQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import buttonListToolbar from "../../utils/itemToolbar";
import ListImagesForNews from "./modalImageUrl/imgsUrl";
import { Input, Select, Button, Radio, DatePicker, TimePicker } from "antd";
import moment from "moment";
import SunEditor, { buttonList } from "suneditor-react";
import { dispatchShowImagesNews, dispatchSetUrlImageThumbnail } from "../../redux/actions";
const { Option } = Select;
const listType = {
  type: ["NEWS", "EVENT", "SLIDER", "NOTICE", "GUIDE"],
  status: [
    { value: "COMPLETE", status: "Đăng ngay" },
    { value: "INPUT", status: "Lưu nháp" }
  ]
};
const radioStyle = {
  display: "block",
  height: "30px",
  lineHeight: "30px"
};
const NewsEditor = (props) => {
  const editor = useRef(null);
  const query = new URLSearchParams(window.location.search);
  const [isThumbnail, setIsThumbnail] = useState(false)
  const [listPlatform, setListPlatform] = useState([]);
  const [newsIndex, setNewsIndex] = useState({
    newsId: 100,
    title: "",
    shortContent: "",
    status: "",
    content: "",
    createAt: "",
    type: "",
    platform: ""
  });
  const [getData] = useLazyQuery(queryNewsDetail(query.get("newsId")), {
    onCompleted: data => {
      console.log(data);
      setNewsIndex(data.listNews[0]);
      dispatchSetUrlImageThumbnail(data.listNews[0].image)
    }
  });
  useEffect(() => {
    getData();
  }, []);
  useQuery(queryGetPlatform(), {
    onCompleted: dataPartner => {
      setListPlatform(dataPartner.listPartners);
    }
  });
  const { content, title, status, type, platform, shortContent } = newsIndex;
  const [updateNews] = useMutation(UpdateNews, {
    variables: {
      newsId: Number(query.get("newsId")),
      req: {
        title: title,
        content: content,
        shortContent: shortContent,
        image: props.urlImgThumbnail,
        platform: platform,
        type: type,
        status: status,
        unity: 0
      }
    },onCompleted:data=>console.log(data)
  });
  const config = {
    readonly: false, // all options from https://xdsoft.net/jodit/doc/,
    height: 500
  };
  const handleChangeType = (e, val) => {
    setNewsIndex({ ...newsIndex, [val.props.name]: e });
  };
  const submitUpdateNews = () => {
    let data = updateNews();
    console.log(data);
  };
  const showUrlImagesNews = val => {
    setIsThumbnail(val);
    dispatchShowImagesNews(true);
  };
  const handleChangeSchedule = (e) => {
    setNewsIndex({...newsIndex,status:e.target.value})
   };
  const handleChangeDateSchedule = () => { };
  const printType = listType.type.map((val, index) => (
    <Option value={val} name="type" key={index}>
      {val}
    </Option>
  ));
  const printStatus = listType.status.map((val, index) => (
    <Radio style={radioStyle} value={val.value} key={index}>
      {val.status}
    </Radio>
  ));
  const printPlatform = listPlatform.map((val, index) => (
    <Option value={val.partnerId} name="platform" key={index}>
      {val.partnerName}
    </Option>
  ));
console.log(shortContent)
  return (
    <Row>
      <Col sm={18}>
        <h3>Chỉnh sửa bài viết</h3>
        <Input
          placeholder=""
          value={title}
          name="title"
          onChange={e => setNewsIndex({ ...newsIndex, title: e.target.value })}
        />
        <Input
          placeholder="Thêm subtitle..."
          value={shortContent}
          name="title"
          onChange={e =>
            setNewsIndex({ ...newsIndex, shortContent: e.target.value })
          }
        />
        <Button onClick={() => showUrlImagesNews(false)}>
          Lấy đường dẫn Image
        </Button>
        <JoditEditor
          ref={editor}
          value={content}
          // config={config}
          // tabIndex={1} // tabIndex of textarea
          onBlur={newContent => setNewsIndex({ ...newsIndex, content: newContent })} // preferred to use only this option to update the content for performance reasons
        //         onChange={newContent => {}}
        />
      </Col>
      <Col sm={6} style={{ padding: "0 1rem" }}>
        <div className="set-schedule-news">
          <h3>Chế độ đăng</h3>
          <Radio.Group onChange={handleChangeSchedule} value={status}>
            {printStatus}
            <Radio style={radioStyle} disabled>
              Lên lịch đăng bài
            </Radio>
          </Radio.Group>

          <p>
            Chọn thời gian<span>(chọn thời gian trước 15' so với mốc)</span>
          </p>
          <div style={{ display: "flex" }}>
            <div style={{ width: "50%" }}>
              <p>Ngày</p>
              <DatePicker onChange={handleChangeDateSchedule} style={{ width: "100%" }} />
            </div>
            <div style={{ width: "50%" }}>
              <p>Thời điểm</p>
              <TimePicker style={{ width: "100%" }} />
            </div>
          </div>
        </div>
        <div className="set-platform-news">
          <h3>Platform</h3>
          <Select
            value={platform}
            style={{ width: '100%' }}
            onChange={(e, value) => handleChangeType(e, value)}
          >
            {printPlatform}
          </Select>
        </div>
        <div className="set-type-news">
          <h3>Loại bài viết</h3>
          <Select
            value={type}
            style={{ width: '100%' }}
            onChange={(e, value) => handleChangeType(e, value)}
          >
            {printType}
          </Select>
        </div>
        <div className="set-thumbnail-news">
          <h3>Chọn ảnh thumbnail</h3>
          <img src={props.urlImgThumbnail} />
          <a onClick={() => showUrlImagesNews(true)}>Thay đổi</a>
        </div>
        <Button onClick={submitUpdateNews}>Submit</Button>
      </Col>
      <ListImagesForNews isThumbnail={isThumbnail} />
    </Row>
  );
};
function mapStateToProps(state) {
  return {
    visible: state.visibleModalNews,
    urlImgThumbnail: state.urlImgThumbnail
  };
}
export default connect(mapStateToProps, null)(NewsEditor);

