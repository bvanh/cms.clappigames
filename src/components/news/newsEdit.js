import React, { useState,useRef } from "react";
import {
  queryNewsDetail,
  UpdateNews,
  queryGetPlatform
} from "../../utils/queryNews";

import JoditEditor from "jodit-react";
import 'jodit/build/jodit.min.css';
import { useMutation, useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import buttonListToolbar from "../../utils/itemToolbar";
import ListImagesForNews from "./modalImageUrl/imgsUrl";
import { Input, Select, Button } from "antd";
import SunEditor, { buttonList } from "suneditor-react";
import { dispatchShowImagesNews } from "../../redux/actions";
// import { Editor } from "react-draft-wysiwyg";
// import draftToHtml from "draftjs-to-html";
// import htmlToDraft from "html-to-draftjs";
// import { stateToHTML } from "draft-js-export-html";
// import { EditorState, convertToRaw, ContentState } from "draft-js";
// ADD THIS LINE. ADJUST THE BEGINNING OF THE PATH AS NEEDED FOR YOUR PROJECT

import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "suneditor/dist/css/suneditor.min.css"; // Import Sun Editor's CSS File
import { convertToHTML, convertFromHTML } from "draft-convert";
// import ListNews from ".";
const { Option } = Select;
const listType = {
  type: ["NEWS", "EVENT", "SLIDER", "NOTICE", "GUIDE"],
  status: ["COMPLETE", "INPUT"]
};
const NewsEditor = () => {
  const html = '<p>Hey this <strong>editor</strong> rocks 😀</p>';
  // const contentBlock = htmlToDraft(html);
  // const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
  // const editorState = EditorState.createWithContent(contentState);
  const contentDemo = { "entityMap": {}, "blocks": [{ "key": "637gr", "text": "Initialized from content state.", "type": "unstyled", "depth": 0, "inlineStyleRanges": [], "entityRanges": [], "data": {} }] };
  const query = new URLSearchParams(window.location.search);
  const [newContent, setNewContent] = useState("");
  const [listPlatform, setListPlatform] = useState([]);
  const [editorState2, setEditorState] = useState("editorState")
  const [newsIndex, setNewsIndex] = useState({
    title: "",
    type: "",
    status: "",
    content: "",
    platform: []
  });
  const { loading, error, data } = useQuery(
    queryNewsDetail(100),
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
  const config = {
    readonly: false ,// all options from https://xdsoft.net/jodit/doc/,
    height:500
	}
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

  const getEditorState = editorState => {
    // setEditorState({ editorState });
    // setEditorState(val)
    // console.log(val)
    // console.log(convertToRaw(editorState.getCurrentContent()));
    // setEditorState({editorState,editorContentHtml:stateToHTML(editorState.getCurrentContent())})
  };
  // console.log(draftToHtml(convertToRaw(editorState.getCurrentContent())))
  // console.log(editorState)
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
      <Button onClick={() => dispatchShowImagesNews(true)}>
        Lấy đường dẫn Image
      </Button>
       <SunEditor
       appendContents={content}
        setOptions={{
          buttonList: buttonList.complex // Or Array of button list, eg. [['font', 'align'], ['image']]
          // Other option
        }}
        onChange={
          newContent => setNewContent(newContent)
          // console.log(newContent)
        }
      />  
      {/* <Trumbowyg id='react-trumbowyg'
                        buttons={
                            [
                                ['viewHTML'],
                                ['formatting'],
                                'btnGrp-semantic',
                                ['link'],
                                ['insertImage'],
                                'btnGrp-justify',
                                'btnGrp-lists',
                                ['table'], // I ADDED THIS FOR THE TABLE PLUGIN BUTTON
                                ['fullscreen']
                            ]
                        }
                        data={this.props.someData}
                        placeholder='Type your text!'
                        onChange={this.props.someCallback}
                        ref="trumbowyg"
                    /> */}

      <ListImagesForNews />
    </div>
  );
};

export default NewsEditor;
