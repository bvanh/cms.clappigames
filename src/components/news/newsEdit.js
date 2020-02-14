import React, { useState } from "react";
import {
  queryNewsDetail,
  UpdateNews,
  queryGetPlatform
} from "../../utils/queryNews";
import { useMutation, useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import buttonListToolbar from "../../utils/itemToolbar";
import { Input, Select, Button } from "antd";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css"; // Import Sun Editor's CSS File

// import ListNews from ".";
const { Option } = Select;
const listType = {
  type: ["NEWS", "EVENT", "SLIDER", "NOTICE", "GUIDE"],
  status: ["COMPLETE", "DELETED", "INPUT"]
};

const NewsEditor = () => {
  const query = new URLSearchParams(window.location.search);
  const [newContent, setNewContent] = useState("");
  const [listPlatform, setListPlatform] = useState([]);
  const [newsIndex, setNewsIndex] = useState({
    title: "",
    type: "",
    status: "",
    content: "",
    platform: []
  });
  const { loading, error, data } = useQuery(
    queryNewsDetail(query.get("newsId")),
    {
      onCompleted: data => {
        setNewsIndex(data.listNews[0]); 
      }
    }
  );
  useQuery(queryGetPlatform(), {
    onCompleted: dataPartner => {
      setListPlatform(dataPartner.listPartners);
    }
  });
  const { content, title, status, type, platform } = newsIndex;
  const [updateNews] = useMutation(UpdateNews, {
    variables: {
      newsId: Number(query.get("newsId")),
      req: {
        title: title,
        content: newContent,
        platform: platform,
        type: type,
        status: status,
        unity: 0
      }
    }
  });
  if (loading) return <p>Loading ...</p>;
  const handleChangeType = (e, val) => {
    setNewsIndex({ ...newsIndex, [val.props.name]: e });
  };
  const printType = listType.type.map((val, index) => (
    <Option value={val} name="type" key={index}>
      {val}
    </Option>
  ));
  const printStatus = listType.status.map((val, index) => (
    <Option value={val} name="status" key={index}>
      {val}
    </Option>
  ));
  const printPlatform = listPlatform.map((val, index) => (
    <Option value={val.partnerId} name="platform" key={index}>
      {val.partnerName}
    </Option>
  ));
  const submitUpdateNews = () => {
    let data = updateNews();
    console.log(data);
  };
  return (
    <div>
      <p>
        title{" "}
        <Input
          placeholder=""
          value={title}
          name="title"
          onChange={e => setNewsIndex({ ...newsIndex, title: e.target.value })}
        />
      </p>{" "}
      type:
      <Select
        value={type}
        style={{ width: 120 }}
        onChange={(e, value) => handleChangeType(e, value)}
      >
        {printType}
      </Select>
      status:
      <Select
        value={status}
        style={{ width: 120 }}
        onChange={(e, value) => handleChangeType(e, value)}
      >
        {printStatus}
      </Select>
      platform:
      <Select
        value={platform}
        style={{ width: 120 }}
        onChange={(e, value) => handleChangeType(e, value)}
      >
        {printPlatform}
      </Select>
      <Button onClick={submitUpdateNews}>Update</Button>
      <SunEditor
        setContents={content}
        setOptions={{
          buttonList: [buttonListToolbar] // Or Array of button list, eg. [['font', 'align'], ['image']]
          // Other option
        }}
        onChange={
          newContent => setNewContent(newContent)
          // console.log(newContent)
        }
      />
    </div>
  );
};

export default NewsEditor;
