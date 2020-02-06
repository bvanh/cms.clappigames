import React, { useState, useRef } from "react";
import JoditEditor from "jodit-react";
import { queryNewsDetail } from "../../utils/queryNews";
import { useQuery } from "@apollo/react-hooks";
import { Input, Select } from "antd";
import ListNews from ".";
const { Option } = Select;
const NewsEditor = props => {
  const query = new URLSearchParams(props.location.search);
  const editor = useRef(null);
  const [content, setContent] = useState();
  const [newsIndex, setNewsIndex] = useState({ title: "", type: "NEWS" });
  const { loading, error, data, refetch } = useQuery(
    queryNewsDetail(query.get("newsId"))
  );
  if (loading) return "Loading...";
  if (error) return `Error! ${error.message}`;
  console.log(data)
  const config = {
    readonly: false, // all options from https://xdsoft.net/jodit/doc/
    uploader: {
      insertImageAsBase64URI: true
    }
  };
  return (
    <>
      <p>
        title{" "}
        <Input
          placeholder=""
          // value={userInfor.sdt}
          name="title"
          // onChange={getInforUser}
        />
      </p>
      <Select
        defaultValue={newsIndex.type}
        style={{ width: 120 }}
        // onChange={handleChange}
      >
        <Option value="NEWS">NEWS</Option>
        <Option value="lucy">Lucy</Option>
        <Option value="Yiminghe">yiminghe</Option>
      </Select>
      <JoditEditor
        ref={editor}
        value={data.listNews[0].content}
        config={config}
        tabIndex={1} // tabIndex of textarea
        onBlur={newContent => setContent(newContent)} // preferred to use only this option to update the content for performance reasons
        onChange={newContent => {
          console.log(newContent);
        }}
      />
    </>
  );
};

export default NewsEditor;
