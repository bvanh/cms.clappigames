import React, { useState, useRef } from "react";
import {
  createNews,
  UpdateNews,
  queryGetPlatform
} from "../../utils/queryNews";
import ListImagesForNews from "./modalImageUrl/imgsUrl";
import { useMutation, useQuery } from "@apollo/react-hooks";
import {
  Input,
  Select,
  Button,
  Radio,
  DatePicker,
  TimePicker,
  Col,
  Row
} from "antd";
import { dispatchShowImagesNews } from "../../redux/actions";
import { gql } from "apollo-boost";
import buttonListToolbar from "../../utils/itemToolbar";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css"; // Import Sun Editor's CSS File
import JoditEditor from "jodit-react";
import "jodit/build/jodit.min.css";
// import ListNews from ".";
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
const AddNews = () => {
  const editor = useRef(null);
  const [newContent, setNewContent] = useState("");
  const [listPlatform, setListPlatform] = useState([]);
  const [newsIndex, setNewsIndex] = useState({
    title: "",
    type: "NEWS",
    status: "COMPLETE",
    content: "",
    platform: "5A6DC0B0-B02B-40FB-BA2C-3C42EC442B89"
  });
  useQuery(queryGetPlatform(), {
    onCompleted: dataPartner => {
      setListPlatform(dataPartner.listPartners);
    }
  });
  const { content, title, status, type, platform } = newsIndex;
  const [updateNews] = useMutation(createNews, {
    variables: {
      req: {
        title: title,
        content: content,
        platform: platform,
        type: type,
        status: status,
        unity: 0
      }
    }
  });
  //   if (loading) return <p>Loading ...</p>;
  const handleChangeType = (e, val) => {
    setNewsIndex({ ...newsIndex, [val.props.name]: e });
  };
  const printType = listType.type.map((val, index) => (
    <Option value={val} name="type" key={index}>
      {val}
    </Option>
  ));
  const handleChangeSchedule = () => {};
  const handleChangeDateSchedule = () => {};
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
  const submitUpdateNews = () => {
    if (title !== "" && content !== "") {
      let data = updateNews();
      data.then(val => {
        alert("tao bai viet thanh cong");
        setNewsIndex({ ...newsIndex, title: "", content: "" });
      });
    } else {
      alert("thieu thong tin roi!");
    }
  };
  return (
    <Row>
      <Col sm={18}>
        <h3>Thêm bài viết mới</h3>
        <Input
          placeholder="Thêm tiêu đề bài viết"
          value={title}
          name="title"
          onChange={e => setNewsIndex({ ...newsIndex, title: e.target.value })}
        />
        <Input
          placeholder="Giới thiệu ngắn bài viết"
          value={title}
          name="title"
          onChange={e => setNewsIndex({ ...newsIndex, title: e.target.value })}
        />
        <Button onClick={() => dispatchShowImagesNews(true)}>
          Lấy đường dẫn Image
        </Button>
        <JoditEditor
          ref={editor}
          value={content}
          // config={config}
          // tabIndex={1} // tabIndex of textarea
          // onBlur={newContent => setContent(newContent)} // preferred to use only this option to update the content for performance reasons
          //         onChange={newContent => {}}
        />
      </Col>
      <Col sm={6}>
        <div className="set-schedule-news">
          <h3>Chế độ đăng</h3>
          <Radio.Group onChange={handleChangeSchedule}>
            {printStatus}
            <Radio style={radioStyle} value={3}>
              Lên lịch đăng bài
            </Radio>
          </Radio.Group>

          <p>
            Chọn thời gian<span>(chọn thời gian trước 15' so với mốc)</span>
          </p>
          <div style={{ display: "flex" }}>
            <div style={{ width: "50%" }}>
              <p>Ngày</p>
              <DatePicker onChange={handleChangeDateSchedule} />
            </div>
            <div style={{ width: "50%" }}>
              <p>Thời điểm</p>
              <TimePicker />
            </div>
          </div>
        </div>
        <div className="set-platform-news">
          Platform
          <Select
            value={platform}
            style={{ width: 120 }}
            onChange={(e, value) => handleChangeType(e, value)}
          >
            {printPlatform}
          </Select>
        </div>
        <div className="set-type-news">
          Loại bài viết
          <Select
            value={type}
            style={{ width: 120 }}
            onChange={(e, value) => handleChangeType(e, value)}
          >
            {printType}
          </Select>
        </div>
        <div className="set-thumbnail-news">
          Chọn ảnh thumbnail
          <img />
          <a>Thay đổi</a>
        </div>
        <Button onClick={submitUpdateNews}>Update</Button>
      </Col>
      <ListImagesForNews />
    </Row>
  );
};

export default AddNews;
