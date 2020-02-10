import React, { useState } from "react";
import { Upload, Icon, message, Button } from "antd";
import { queryUploadImages } from "../../utils/queryMedia";
import { useMutation } from "@apollo/react-hooks";

const { Dragger } = Upload;

function UploadImages() {
  const [fileListImage, setFileListImage] = useState([]);
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
        console.log(info);
        setFileListImage(info.fileList);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    }
  };
  const [uploadImages] = useMutation(queryUploadImages, {
    variables: {
      partnerName: "clappigames",
      files: fileListImage
    }
  });
  const submitUploadImages = () => {
    const demo = uploadImages();
    console.log(demo, fileListImage);
  };
  const onChange = ({ target: { validity, files } }) =>{
    // validity.valid &&
    // multipleUploadMutation({ variables: { files } }).then(() => {
    //   apolloClient.resetStore()
    console.log(validity,files)
    }
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
      <input type="file" multiple required onChange={onChange} />
      <Button onClick={submitUploadImages}>upload</Button>
    </>
  );
}
export default UploadImages;
