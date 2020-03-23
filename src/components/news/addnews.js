import React, { useState, useRef } from "react";
import {
  createNews,
  UpdateNews,
  queryGetPlatform
} from "../../utils/queryNews";
import ListImagesForNews from "./modalImageUrl/imgsUrl";
import { connect } from "react-redux";
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
import { dispatchShowImagesNews, dispatchSetUrlImageThumbnail } from "../../redux/actions";
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
const AddNews = props => {
  const editor = useRef(null);
  const [isThumbnail, setIsThumbnail] = useState(false)
  const [listPlatform, setListPlatform] = useState([]);
  const [newsIndex, setNewsIndex] = useState({
    title: "",
    subTitle: "",
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
  const { content, title, status, type, platform, subTitle } = newsIndex;
  const [updateNews] = useMutation(createNews, {
    variables: {
      req: {
        title: title,
        shortContent: subTitle,
        content: content,
        platform: platform,
        type: type,
        status: status,
        image: props.urlImgThumbnail,
        unity: 0
      }
    },
    onCompleted: data => console.log(data)
  });
  const handleChangeType = (e, val) => {

    setNewsIndex({ ...newsIndex, [val.props.name]: e });
    console.log(newsIndex)
  };
  const printType = listType.type.map((val, index) => (
    <Option value={val} name="type" key={index}>
      {val}
    </Option>
  ));
  const handleChangeSchedule = () => { };
  const handleChangeDateSchedule = () => { };
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
        setNewsIndex({ ...newsIndex, title: "", subTitle: "", content: "" });
        dispatchSetUrlImageThumbnail(null)
      });
    } else {
      alert("thieu thong tin!");
    }
  };
  const showUrlImagesNews = val => {
    setIsThumbnail(val);
    dispatchShowImagesNews(true);
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
          placeholder="Thêm subtitle..."
          value={subTitle}
          name="title"
          onChange={e =>
            setNewsIndex({ ...newsIndex, subTitle: e.target.value })
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
        // onChange={newContent => {console.log(newContent)}}
        />
      </Col>
      <Col sm={6} style={{ padding: "0 1rem" }}>
        <div className="set-schedule-news">
          <h3>Chế độ đăng</h3>
          <Radio.Group onChange={handleChangeSchedule}>
            {printStatus}
            <Radio style={radioStyle} value={3} disabled>
              Lên lịch đăng bài
            </Radio>
          </Radio.Group>

          <p>
            Chọn thời gian<span>(chọn thời gian trước 15' so với mốc)</span>
          </p>
          <div style={{ display: "flex" }}>
            <div style={{ width: "50%" }}>
              <p>Ngày</p>
              <DatePicker
                onChange={handleChangeDateSchedule}
                style={{ width: "100%" }}
              />
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
            style={{ width: "100%" }}
            onChange={(e, value) => handleChangeType(e, value)}
          >
            {printPlatform}
          </Select>
        </div>
        <div className="set-type-news">
          <h3>Loại bài viết</h3>
          <Select
            value={type}
            style={{ width: "100%" }}
            onChange={(e, value) => handleChangeType(e, value)}
          >
            {printType}
          </Select>
        </div>
        <div className="set-thumbnail-news">
          <h3>Chọn ảnh thumbnail</h3>
          <div style={{ padding: ".5rem" }}>
            <img src={props.urlImgThumbnail} style={{ width: "100%" }} />
          </div>
          <a onClick={() => showUrlImagesNews(true)}>Chọn ảnh</a>
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
export default connect(mapStateToProps, null)(AddNews);
