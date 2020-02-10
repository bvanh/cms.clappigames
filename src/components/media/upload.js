import React, { useState } from "react";
import { Upload, Icon, message, Button } from "antd";
import { queryUploadImages, queryUploadImage } from "../../utils/queryMedia";
import { useMutation } from "@apollo/react-hooks";

const { Dragger } = Upload;

function UploadImages() {
  const [fileImage, setFileListImage] = useState();
  const props = {
    name: "file",
    multiple: true,
    action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
    onChange(info) {
      //   console.log(info);
      const { status } = info.file;
      if (status !== "uploading") {
        // console.log(info.file, info.fileList);
      }
      if (status === "done") {
        message.success(`${info.file.name} file uploaded successfully.`);
        console.log(info.file);
        setFileListImage(info.file.originFileObj);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    }
  };
  const [uploadImage] = useMutation(queryUploadImage, {
    variables: {
      partnerName: "clappigames",
      file: [fileImage]
    }
  });
  const submitUploadImages = () => {
    const demo = uploadImage();
    console.log(demo, fileImage);
  };
  // const onChange = e => {
  //   setFileListImage(e.target.files[0]);
  // };
  const onChange = ({
    target: {
      validity,
      files: [file]
    }
  }) => validity.valid && uploadImage({ variables: { partnerName: "clappigames",file } });
  return (
    <>
      <Dragger {...props}>
        <p className="ant-upload-drag-icon">
          <Icon type="inbox" />
        </p>
        <p className="ant-upload-text">
          Click or drag file to this area to upload
        </p>
      </Dragger>
      <input type="file" onChange={onChange} />
      <Button onClick={submitUploadImages}>upload</Button>
    </>
  );
}
export default UploadImages;
