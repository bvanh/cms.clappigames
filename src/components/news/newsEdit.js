import React, { useState, useRef, useEffect } from "react";
import {
  queryNewsDetail,
  UpdateNews,
  queryGetPlatform,
  queryDeleteNews
} from "../../utils/queryNews";
import { Row, Col } from "antd";
import JoditEditor from "jodit-react";
import "jodit/build/jodit.min.css";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useLazyQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import buttonListToolbar from "../../utils/itemToolbar";
import ListImagesForNews from "./modalImageUrl/imgsUrl";
import {
  Input,
  Select,
  Button,
  Radio,
  DatePicker,
  TimePicker,
  Modal
} from "antd";
import moment from "moment";
import SunEditor, { buttonList } from "suneditor-react";
import {
  dispatchShowImagesNews,
  dispatchSetUrlImageThumbnail
} from "../../redux/actions";
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
const NewsEditor = props => {
  const editor = useRef(null);
  const query = new URLSearchParams(window.location.search);
  const [isThumbnail, setIsThumbnail] = useState(false);
  const [listPlatform, setListPlatform] = useState([]);
  const [alertIndex, setAlertIndex] = useState({
    isShow: false,
    content: "Updating successful post !",
    isDelete: false,
    confirmBtn: "Back"
  });
  const [newContent, setNewContent] = useState("");
  const [newsIndex, setNewsIndex] = useState({
    newsId: null,
    title: "",
    shortContent: "",
    status: "",
    content: "",
    createAt: "",
    type: "",
    platform: "",
    startPost: {
      date: "",
      time: ""
    }
  });
  useQuery(queryNewsDetail(query.get("newsId")), {
    fetchPolicy: "cache-and-network",
    onCompleted: data => {
      // console.log(data);
      setNewsIndex(data.listNews[0]);
      setNewContent(data.listNews[0].content);
      dispatchSetUrlImageThumbnail(data.listNews[0].image);
    }
  });
  useQuery(queryGetPlatform(), {
    onCompleted: dataPartner => {
      setListPlatform(dataPartner.listPartners);
    }
  });
  const {
    content,
    title,
    status,
    type,
    platform,
    shortContent,
    newsId,
    startPost
  } = newsIndex;
  const [deleteNews] = useMutation(queryDeleteNews);
  const [updateNews] = useMutation(UpdateNews, {
    variables: {
      newsId: Number(query.get("newsId")),
      req: {
        title: title,
        content: newContent,
        shortContent: shortContent,
        image: props.urlImgThumbnail,
        platform: platform,
        type: type,
        status: status,
        unity: 0,
        startPost:JSON.stringify(startPost)
      }
    },
    onCompleted: data => console.log(data)
  });
  const config = {
    readonly: false, // all options from https://xdsoft.net/jodit/doc/,
    height: 500
  };
  const disabledDate = current => {
    return current && current < moment().endOf("day");
  };
  const handleChangeType = (e, val) => {
    setNewsIndex({ ...newsIndex, [val.props.name]: e });
  };
  const submitUpdateNews = () => {
    let data = updateNews();
    data.then(val => setAlertIndex({ ...alertIndex, isShow: true }));
  };
  const showUrlImagesNews = val => {
    setIsThumbnail(val);
    dispatchShowImagesNews(true);
  };
  const handleChangeSchedule = e => {
    setNewsIndex({ ...newsIndex, status: e.target.value });
  };
  const handleCancel = () => {
    setAlertIndex({
      ...alertIndex,
      isShow: false,
      isDelete: false,
      content: "Updating successful post!",
      confirmBtn: "Back"
    });
  };
  const submitUpdateAndDelete = () => {
    if (alertIndex.isDelete) {
      deleteNews({ variables: { ids: [newsId] } });
    }
  };
  const showConfirm = () => {
    setAlertIndex({
      ...alertIndex,
      isShow: true,
      content: "Do you want to countinue delete this post??",
      confirmBtn: "Ok !",
      isDelete: true
    });
  };
  const handleChangeTimeSchedule = val => {
    setNewsIndex({
      ...newsIndex,
      startPost: { date: startPost.date, time: val }
    });
  };
  const handleChangeDateSchedule = val => {
    setNewsIndex({
      ...newsIndex,
      startPost: { date: val, time: startPost.time }
    });
  };
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
  return (
    <Row>
      <Col sm={18} className="section1-news">
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h3>Update</h3>
          <Link to="/news">Back</Link>
        </div>
        <Input
          placeholder=""
          value={title}
          name="title"
          onChange={e => setNewsIndex({ ...newsIndex, title: e.target.value })}
        />
        <Input
          placeholder="Subtitle..."
          value={shortContent}
          name="title"
          onChange={e =>
            setNewsIndex({ ...newsIndex, shortContent: e.target.value })
          }
        />

        <JoditEditor
          ref={editor}
          value={newContent}
          onBlur={newContent => setNewContent(newContent)} // preferred to use only this option to update the content for performance reasons
        />
        <Button onClick={() => showUrlImagesNews(false)}>Get image link</Button>
      </Col>
      <Col sm={6} style={{ padding: "0 1rem" }}>
        <div className="set-schedule-news">
          <h3>Public status</h3>
          <Radio.Group onChange={handleChangeSchedule} value={status}>
            {printStatus}
            <Radio style={radioStyle} disabled>
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
                onChange={(time, timeString) => {
                  handleChangeDateSchedule(timeString);
                }}
                style={{ width: "99%", marginRight: "1%" }}
                disabledDate={disabledDate}
                format="YYYY-MM-DD"
                allowClear={false}
              />
            </div>
            <div style={{ width: "50%" }}>
              <p>Time</p>
              <TimePicker
                style={{ width: "99%", marginLeft: "1%" }}
                allowClear={false}
                format={"hh:mm:ss"}
                placeholder="Select time"
                onChange={(time, timeString) => {
                  handleChangeTimeSchedule(timeString);
                }}
              />
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
          <a onClick={() => showUrlImagesNews(true)}>Change</a>
        </div>
        <div className="btn-submit">
          <p onClick={showConfirm} style={{ color: "red", cursor: "pointer" }}>
            Delete news
          </p>
          <a onClick={submitUpdateNews}>Update</a>
        </div>
      </Col>
      <ListImagesForNews isThumbnail={isThumbnail} />
      <Modal
        title={alertIndex.content}
        visible={alertIndex.isShow}
        okText={<Link to="/news">{alertIndex.confirmBtn}</Link>}
        onOk={submitUpdateAndDelete}
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
export default connect(mapStateToProps, null)(NewsEditor);
