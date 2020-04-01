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
  Row,
  Modal,
  Icon
} from "antd";
import {
  dispatchShowImagesNews,
  dispatchSetUrlImageThumbnail
} from "../../redux/actions";
import { gql } from "apollo-boost";
import { Link } from "react-router-dom";
import "suneditor/dist/css/suneditor.min.css"; // Import Sun Editor's CSS File
import JoditEditor from "jodit-react";
import "jodit/build/jodit.min.css";
import { set } from "immutable";
// import ListNews from ".";
const { Option } = Select;
const listType = {
  type: ["NEWS", "EVENT", "SLIDER", "NOTICE", "GUIDE"],
  status: [
    { value: "COMPLETE", status: "Public" },
    { value: "INPUT", status: "Draff" }
  ]
};
const radioStyle = {
  display: "block",
  height: "30px",
  lineHeight: "30px"
};
const AddNews = props => {
  // const editor = useRef(null);
  const [isThumbnail, setIsThumbnail] = useState(false);
  const [visible, setVisible] = useState(false);
  const [listPlatform, setListPlatform] = useState([]);
  const [newContent, setNewContent] = useState("");
  const [newsIndex, setNewsIndex] = useState({
    title: "",
    subTitle: "",
    type: "NEWS",
    status: "INPUT",
    platform: "5A6DC0B0-B02B-40FB-BA2C-3C42EC442B89"
  });
  useQuery(queryGetPlatform(), {
    onCompleted: dataPartner => {
      setListPlatform(dataPartner.listPartners);
    }
  });
  const { title, status, type, platform, subTitle } = newsIndex;
  const [updateNews] = useMutation(createNews, {
    variables: {
      req: {
        title: title,
        shortContent: subTitle,
        content: newContent,
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
    console.log(newsIndex);
  };
  const submitUpdateNews = () => {
    if (title !== "" && newContent !== "" && subTitle !== "" && status !== "") {
      let data = updateNews();
      data.then(val => {
        setVisible(true);
        setNewsIndex({
          ...newsIndex,
          title: "",
          subTitle: "",
          type: "NEWS",
          status: "INPUT",
          platform: "5A6DC0B0-B02B-40FB-BA2C-3C42EC442B89"
        });
        setNewContent("");
        dispatchSetUrlImageThumbnail(null);
      });
    } else {
      alert("thieu thong tin!");
    }
  };
  const showUrlImagesNews = val => {
    setIsThumbnail(val);
    dispatchShowImagesNews(true);
  };
  const handleCancel = () => {
    setVisible(false);
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
  return (
    <Row>
      <Col sm={18} className="section1-news">
        <h3>
          <Link to="/news">
            <Icon
              type="close"
              style={{ color: "rgba(0,0,0,.45)", paddingRight: ".5rem" }}
            />
          </Link>
          Add News
        </h3>
        <Input
          placeholder="Title..."
          value={title}
          name="title"
          onChange={e => setNewsIndex({ ...newsIndex, title: e.target.value })}
        />
        <Input
          placeholder="Subtitle..."
          value={subTitle}
          name="subTitle"
          onChange={e =>
            setNewsIndex({ ...newsIndex, subTitle: e.target.value })
          }
        />
        <JoditEditor
          // ref={editor}
          value={newContent}
          // config={config}
          // tabIndex={1} // tabIndex of textarea
          // onBlur={newContent => setNewsIndex({ ...newsIndex, content: newContent })} // preferred to use only this option to update the content for performance reasons
          onBlur={newContent => setNewContent(newContent)}
        />
        <Button
          onClick={() => showUrlImagesNews(false)}
          style={{ marginTop: ".5rem" }}
        >
          Get image link
        </Button>
      </Col>
      <Col sm={6} style={{ padding: "0 1rem" }}>
        <div className="set-schedule-news">
          <h3>Public status</h3>
          <Radio.Group onChange={handleChangeSchedule}>
            {printStatus}
            <Radio style={radioStyle} value={3} disabled>
              Set timeline to public
            </Radio>
          </Radio.Group>

          <p>
            When you set the timeline, Timeline must have soon 15 minutes from
            public time.
          </p>
          <div style={{ display: "flex" }}>
            <div style={{ width: "50%" }}>
              <p>Date</p>
              <DatePicker
                onChange={handleChangeDateSchedule}
                style={{ width: "99%", marginRight: "1%" }}
              />
            </div>
            <div style={{ width: "50%" }} className="timePick-schedule-news">
              <p>Time</p>
              <TimePicker style={{ width: "99%", marginLeft: "1%" }} />
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
          <h3>Type</h3>
          <Select
            value={type}
            style={{ width: "100%" }}
            onChange={(e, value) => handleChangeType(e, value)}
          >
            {printType}
          </Select>
        </div>
        <div className="set-thumbnail-news">
          <h3>Thumbnail image</h3>
          <div style={{ width: "70%", margin: "0 auto" }}>
            <img src={props.urlImgThumbnail} style={{ width: "100%" }} />
          </div>
          <a onClick={() => showUrlImagesNews(true)}>Select</a>
        </div>
        <Button onClick={submitUpdateNews}>Submit</Button>
      </Col>
      <ListImagesForNews isThumbnail={isThumbnail} />
      <Modal
        title="Task is completed !"
        visible={visible}
        okText={<Link to="/news">Back</Link>}
        cancelText="Next"
        onCancel={handleCancel}
      ></Modal>
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
