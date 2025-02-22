import React, { useState, useRef, useEffect } from "react";
import {
  queryNewsDetail,
  UpdateNews,
  queryGetPlatform,
  queryDeleteNews,
} from "../../utils/queryNews";
import { Row, Col } from "antd";
import JoditEditor from "jodit-react";
import "jodit/build/jodit.min.css";
import { connect } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { useMutation, useQuery, useLazyQuery } from "@apollo/react-hooks";
import ListImagesForNews from "./modalImageUrl/imgsUrl";
import { Input, Select, Button, Radio, DatePicker, Modal } from "antd";
import moment from "moment";
import { alertErrorServer } from "../../utils/alertErrorAll";
import {
  dispatchShowImagesNews,
  dispatchSetUrlImageThumbnail,
} from "../../redux/actions";
const { Option } = Select;
const listType = {
  type: ["NEWS", "EVENT", "SLIDER", "NOTICE", "GUIDE"],
  status: [
    { value: "COMPLETE", status: "Public" },
    { value: "INPUT", status: "Draff" },
  ],
};
const radioStyle = {
  display: "block",
  height: "30px",
  lineHeight: "30px",
};
const NewsEditor = (props) => {
  const history = useHistory();
  const editor = useRef(null);
  const query = new URLSearchParams(window.location.search);
  const [isThumbnail, setIsThumbnail] = useState(false);
  const [listPlatform, setListPlatform] = useState([]);
  const [newContent, setNewContent] = useState("");
  const [isPostNow, setIsPostNow] = useState(true);
  const [isSetSchedule, setIsSchedule] = useState(false);
  const [newsIndex, setNewsIndex] = useState({
    newsId: null,
    title: "",
    shortContent: "",
    status: "",
    content: "",
    createAt: "",
    type: "",
    platform: "",
    startPost: null,
  });
  const [getNewsById] = useLazyQuery(queryNewsDetail(query.get("newsId")), {
    fetchPolicy: "cache-and-network",
    onCompleted: (data) => {
      console.log(data);
      setNewsIndex(data.listNews[0]);
      setNewContent(data.listNews[0].content);
      dispatchSetUrlImageThumbnail(data.listNews[0].image);
    },
    onError: (index) =>
      alertErrorServer(index.networkError.result.errors[0].message),
  });
  useQuery(queryGetPlatform(), {
    onCompleted: (dataPartner) => {
      setListPlatform(dataPartner.listPartners);
    },
    onError: (index) =>
      alertErrorServer(index.networkError.result.errors[0].message),
  });
  useEffect(() => {
    getNewsById();
  }, []);
  const {
    title,
    status,
    type,
    platform,
    shortContent,
    newsId,
    startPost,
  } = newsIndex;
  const [deleteNews] = useMutation(queryDeleteNews,{
    variables:{
      ids:[Number(query.get("newsId"))]
    }
  });
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
        startPost: startPost,
      },
    },
    onCompleted: (data) => successUpdate(),
    onError: (index) =>
      alertErrorServer(index.networkError.result.errors[0].message),
  });
  const handleChangeType = (e, val) => {
    setNewsIndex({ ...newsIndex, [val.props.name]: e });
  };
  const showUrlImagesNews = (val) => {
    setIsThumbnail(val);
    dispatchShowImagesNews(true);
  };
  const successUpdate = () => {
    Modal.success({
      title: 'Update news successful !'
    });
  }
  const showConfirm = (isDelete, contentAlert, okTextBtn, cancelTextBtn) => {
    Modal.confirm({
      title: `Do you want to ${contentAlert} this post ?`,
      okText: okTextBtn,
      cancelText: cancelTextBtn,
      onOk() {
        if (isDelete) {
          deleteNews();
        }
        history.push("/news");
      },
      onCancel() {},
    });
  };
  const handleChangeSchedule = (e) => {
    setNewsIndex({ ...newsIndex, status: e.target.value });
  };
  const handleChangeDateSchedule = (val) => {
    console.log(val);
    setIsPostNow(false);
    setNewsIndex({
      ...newsIndex,
      startPost: val,
    });
  };
  const setStartPostNow = () => {
    // moment.unix(value).format("MM/DD/YYYY")
    const now = moment().format("YYYY-MM-DD HH:mm:ss");
    setIsSchedule(false);
    setIsPostNow(true);
    setNewsIndex({ ...newsIndex, startPost: now });
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
  // console.log(moment(Number(startPost)).format("YYYY-MM-DD HH:mm:ss"))
  console.log(startPost);
  return (
    <Row>
      <Col sm={18} className="section1-news">
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h3>Update</h3>
          <a onClick={() => showConfirm(false, "continue update", "No", "Yes")}>
            Back
          </a>
        </div>
        <Input
          placeholder=""
          value={title}
          name="title"
          onChange={(e) =>
            setNewsIndex({ ...newsIndex, title: e.target.value })
          }
        />
        <Input
          placeholder="Subtitle..."
          value={shortContent}
          name="title"
          onChange={(e) =>
            setNewsIndex({ ...newsIndex, shortContent: e.target.value })
          }
        />

        <JoditEditor
          ref={editor}
          value={newContent}
          onBlur={(newContent) => setNewContent(newContent)} // preferred to use only this option to update the content for performance reasons
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
          <Radio.Group onChange={handleChangeSchedule} value={status}>
            {printStatus}
          </Radio.Group>
          <div
            className={
              status === "COMPLETE"
                ? "option-settimeline"
                : "hide-options-settimeline"
            }
          >
            <p style={{ margin: ".5rem 0" }}>* Set timeline</p>
            <div style={{ display: "flex" }}>
              <div style={{ width: "100%" }}>
                <DatePicker
                  showTime
                  placeholder="Set timeline"
                  onChange={(time, timeString) => {
                    handleChangeDateSchedule(timeString);
                  }}
                  style={{ width: "99%", marginRight: "1%" }}
                  // disabledDate={disabledDate}
                  format="YYYY-MM-DD HH:mm:ss"
                  allowClear={true}
                  value={
                    Number.isInteger(Number(startPost))
                      ? moment(
                          moment(Number(startPost)).format(
                            "YYYY-MM-DD HH:mm:ss"
                          ),
                          "YYYY-MM-DD HH:mm:ss"
                        )
                      : moment(startPost, "YYYY-MM-DD HH:mm:ss")
                  }
                  disabled={status === "COMPLETE" ? false : true}
                  open={isSetSchedule}
                  dropdownClassName="setTimeline-news"
                  renderExtraFooter={() => (
                    <Button size="small" onClick={setStartPostNow}>
                      Post Now
                    </Button>
                  )}
                  onOk={() => setIsSchedule(false)}
                  onFocus={() => setIsSchedule(true)}
                />
              </div>
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
          <p
            onClick={() => showConfirm(true, "delete", "Yes", "No")}
            style={{ color: "red", cursor: "pointer" }}
          >
            Delete news
          </p>
          <a onClick={()=>updateNews()}>Update</a>
        </div>
      </Col>
      <ListImagesForNews isThumbnail={isThumbnail} />
      {/* <Modal
        title="Confirm!"
        visible={alertIndex.isShow}
        okText={<Link to="/news">{alertIndex.confirmBtn}</Link>}
        onOk={submitUpdateAndDelete}
        cancelText="Yes"
        onCancel={handleCancel}
      >
        <p>{alertIndex.content}</p>
      </Modal> */}
    </Row>
  );
};
function mapStateToProps(state) {
  return {
    visible: state.visibleModalNews,
    urlImgThumbnail: state.urlImgThumbnail,
  };
}
export default connect(mapStateToProps, null)(NewsEditor);
