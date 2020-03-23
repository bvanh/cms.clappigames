import React, { useState } from "react";
import { InMemoryCache } from "apollo-cache-inmemory";
import { createUploadLink } from "apollo-upload-client";
import { ApolloClient } from "apollo-client";
import { ApolloProvider, Mutation } from "react-apollo";
import { UPLOAD_IMAGE } from "../../../utils/mutation/media";
import { connect } from "react-redux";
import { Upload, Icon, message, Button } from "antd";
import { undefinedVarMessage } from "graphql/validation/rules/NoUndefinedVariables";

const { Dragger } = Upload;

const apolloCache = new InMemoryCache();
function CreateAlbumFromComp(props) {
  const [fileImage, setFileImage] = useState([]);
  const [statusUploadBtn, setStatusUploadBtn] = useState(true);
  const [imagesForAlbum, setImagesForAlbum] = useState([]);
  const uploadLink = createUploadLink({
    uri: "https://api.cms.cubegame.vn/graphql",
    headers: {
      Authorization: `Bearer ${props.token.accessToken}`
    }
  });
  const client = new ApolloClient({
    cache: apolloCache,
    link: uploadLink
  });
  const configDrag = {
    name: "file",
    accept: ".png, .jpg, .gif",
    multiple: true,
    showUploadList: { showDownloadIcon: false },
    action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
    onChange(info) {
      const { status } = info.file;
      if (status !== "uploading") {
        console.log("loading...");
      }
      if (status === "done") {
        message.success(`${info.file.name} file uploaded successfully.`);
        setFileImage(info.fileList);
        setStatusUploadBtn(false);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    async onRemove(file) {
      const imagesAfterRemove = await fileImage.filter((val, index) => {
        return val !== file;
      });
      setFileImage(imagesAfterRemove);
    }
  };
  const getImagesForAlbum = async data => {
     delete data.singleUploadImage['path'];
     delete data.singleUploadImage['__typename'];
     delete data.singleUploadImage['name'];
    props.setImagesForAlbum([
      ...props.imagesForAlbum,
      JSON.stringify(data.singleUploadImage)
    ]);
    console.log(JSON.stringify(data.singleUploadImage))
  };
  return (
    <ApolloProvider client={client}>
      <Mutation
        mutation={UPLOAD_IMAGE}
        update={(cache, { data }) => {
          getImagesForAlbum(data);
        }}
      >
        {(singleUploadStream, { data, loading, error, called }) => {
          return (
            <>
              <Dragger {...configDrag}>
                <p className="ant-upload-drag-icon">
                  <Icon type="file-add" />
                </p>
                <p className="ant-upload-text">
                  Click or drag file to this area to upload
                </p>
              </Dragger>

              <Button
                onClick={async () => {
                  if (props.albumName === "") {
                    console.log("thieu tên album");
                  } else {
                    for (var key of fileImage) {
                      await singleUploadStream({
                        variables: {
                          partnerName: "lqmt",
                          file: key.originFileObj
                        }
                      });
                    }
                    await props.submitCreateAndUpdateAlbum();
                    props.setPickDataImages();
                    props.removeAlbumName();
                  }
                }}
                disabled={fileImage.length === 0 ? true : false}
                style={{ margin: "1rem 0" }}
              >
                Submit
              </Button>
              <a onClick={props.setPickDataImages}>
                <Icon type="double-left" />
                Quay lại
              </a>
              {loading && <p>Loading.....</p>}
            </>
          );
        }}
      </Mutation>
    </ApolloProvider>
  );
}
function mapStateToProps(state) {
  return {
    isLogin: state.isLogin,
    token: state.accessToken
  };
}
export default connect(mapStateToProps, null)(CreateAlbumFromComp);
