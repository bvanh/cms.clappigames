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
import { Link } from "react-router-dom";
import "suneditor/dist/css/suneditor.min.css"; // Import Sun Editor's CSS File
import JoditEditor from "jodit-react";
import "jodit/build/jodit.min.css";
import moment from "moment";
import { alertError } from './newsAlert'
// import ListNews from ".";
const { Option } = Select;
const listType = {
  type: ["NEWS", "EVENT", "SLIDER", "NOTICE", "GUIDE"],
  status: [
    { value: "COMPLETE", status: "Public" },
    { value: "INPUT", status: "Draff" },
    // { value: "SCHEDULE", status: "Set timeline to public" }
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
  const [listPlatform, setListPlatform] = useState([]);
  const [newContent, setNewContent] = useState("");
  const [isSetSchedule, setIsSchedule] = useState(false);
  const [isPostNow, setIsPostNow] = useState(true)
  const [newsIndex, setNewsIndex] = useState({
    title: "",
    subTitle: "",
    type: "NEWS",
    status: "INPUT",
    platform: "5A6DC0B0-B02B-40FB-BA2C-3C42EC442B89",
    startPost: moment().format('YYYY-MM-DD HH:mm:ss')
  });
  const [alertIndex, setAlertIndex] = useState({
    isShow: false,
    content: "Updating successful post !",
    isDelete: false,
    confirmBtn: "Back"
  });
  useQuery(queryGetPlatform(), {
    onCompleted: dataPartner => {
      setListPlatform(dataPartner.listPartners);
    }
  });
  const { title, status, type, platform, subTitle, startPost } = newsIndex;
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
        unity: 0,
        startPost: startPost
      }
    },
    onCompleted: data => console.log(data)
  });
  const disabledDate = current => {
    return current && current < moment().endOf("day");
  };
  const handleChangeType = (e, val) => {
    setNewsIndex({ ...newsIndex, [val.props.name]: e });
    console.log(newsIndex);
  };
  const submitUpdateNews = () => {
    if (title !== "" && newContent !== "" && subTitle !== "" && status !== "") {
      let data = updateNews();
      data.then(val => {
        setAlertIndex({ ...alertIndex, isShow: true, content: "Create new post successful!" })
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
      alertError();
    }
  };
  const showUrlImagesNews = val => {
    setIsThumbnail(val);
    dispatchShowImagesNews(true);
  };
  const handleCancel = () => {
    setAlertIndex({ ...alertIndex, isShow: false })
  };
  const handleChangeSchedule = (e) => {
    setNewsIndex({ ...newsIndex, status: e.target.value, startPost: moment().format('YYYY-MM-DD hh:mm:ss') })
  }
  const handleChangeDateSchedule = val => {
    setIsPostNow(false);
    setNewsIndex({
      ...newsIndex,
      startPost: val
    });
  };
  const setStartPostNow = () => {
    // moment.unix(value).format("MM/DD/YYYY")
    const now = moment().format("YYYY-MM-DD hh:mm:ss")
    setIsSchedule(false);
    setIsPostNow(true);
    setNewsIndex({ ...newsIndex, startPost: now })
  }
  const backToNews = () => {
    setAlertIndex({ ...alertIndex, isShow: true, content: "Do you want to countinue creating a new post?" })
  }
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
        <h3>
            <Icon
              type="close"
              style={{ color: "rgba(0,0,0,.45)", paddingRight: ".5rem" }}
              onClick={backToNews}
            />
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
          </Radio.Group>
          <div className={status === 'COMPLETE' ? 'option-settimeline' : "hide-options-settimeline"}>
            <p style={{ margin: ".5rem 0" }}>
              * Set timeline
           </p>
            <div style={{ display: "flex" }}>
              <div style={{ width: "100%" }}>
                {/* <p>Date</p> */}
                <DatePicker
                  showTime={{ format: 'HH:mm:ss' }}
                  placeholder="Set timeline"
                  onChange={(time, timeString) => {
                    handleChangeDateSchedule(timeString);
                  }}
                  style={{ width: "99%", marginRight: "1%" }}
                  disabledDate={disabledDate}
                  format="YYYY-MM-DD HH:mm:ss"
                  allowClear={false}
                  defaultValue={moment(startPost, "YYYY-MM-DD HH:mm:ss")}
                  disabled={status === 'COMPLETE' ? false : true}
                  open={isSetSchedule}
                  dropdownClassName='setTimeline-news'
                  renderExtraFooter={() => <Button size='small' onClick={setStartPostNow}>Post Now</Button>}
                  onOk={() =>setIsSchedule(false)}
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
          <a onClick={() => showUrlImagesNews(true)}>Select</a>
        </div>
        <Button onClick={submitUpdateNews}>Submit</Button>
      </Col>
      <ListImagesForNews isThumbnail={isThumbnail} />
      <Modal
        title="Confirm !"
        visible={alertIndex.isShow}
        okText={<Link to="/news">Back</Link>}
        cancelText="Next"
        onCancel={handleCancel}
      >
        <p>{alertIndex.content}</p>
      </Modal>
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
