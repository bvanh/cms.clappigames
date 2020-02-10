import React, { useState, useRef, useEffect } from "react";
import JoditEditor from "jodit-react";
import { queryNewsDetail, queryUpdateNews } from "../../utils/queryNews";
import { useLazyQuery, useMutation } from "@apollo/react-hooks";
import { Input, Select } from "antd";
// import ListNews from ".";
const { Option } = Select;
const listType = {
  type: ["NEWS", "EVENT", "SLIDER", "NOTICE", "GUIDE"],
  status: ["COMPLETE", "DELETED", "INPUT"]
};

const NewsEditor = ({ demo }) => {
  const query = new URLSearchParams(window.location.search);
  const editor = useRef(null);
  const [newsContent, setNewsContent] = useState("");
  const [newsIndex, setNewsIndex] = useState({
    title: "",
    type: "",
    status: "",
    content: ""
  });
  const { loading, data,error }= useLazyQuery(
    queryNewsDetail(query.get("newsId"))
  );
  if (loading) return "Loading...";
  if (error) return `Error! ${error.message}`;
  // useEffect(  () => {
  //   async getData();
  //   // if (data) {
  //   //   setNewsIndex(data.listNews[0]);
  //   //   console.log(newsIndex)
  //   if (loading) return <p>Loading ...</p>;
  //   if(data){
  //     setNewsIndex(data.listNews[0]);
  //   }
  //   // }
  // },[]);
  const config = {
    readonly: false, // all options from https://xdsoft.net/jodit/doc/
    uploader: {
      insertImageAsBase64URI: true
    }
  };
  //
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
  const getTitle = e => {
    setNewsIndex({ ...newsIndex, title: e.target.value });
  };
  const { content, title, status, type } = newsIndex;
  return (
    <div>
      <p>
        title{" "}
        <Input placeholder="" value={title} name="title" onChange={getTitle} />
      </p>
      <Select
        defaultValue={type}
        style={{ width: 120 }}
        onChange={(e, value) => handleChangeType(e, value)}
      >
        {printType}
      </Select>
      <Select
        defaultValue={status}
        style={{ width: 120 }}
        onChange={(e, value) => handleChangeType(e, value)}
      >
        {printStatus}
      </Select>
      <JoditEditor
        ref={editor}
        value={content}
        config={config}
        tabIndex={1} // tabIndex of textarea
        onBlur={newContent =>
          setNewsIndex({ ...newsIndex, content: newContent })
        } // preferred to use only this option to update the content for performance reasons
        // onChange={newContent => {
        //   setNewsIndex({ ...newsIndex, content: newContent })
        // }}
      />
    </div>
  );
};

export default NewsEditor;
