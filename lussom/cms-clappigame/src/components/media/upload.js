import React, { useState } from "react";
import { InMemoryCache } from "apollo-cache-inmemory";
import { createUploadLink } from "apollo-upload-client";
import { ApolloClient } from "apollo-client";
import { ApolloProvider, Mutation } from "react-apollo";
import { UPLOAD_IMAGE } from "../../utils/mutation/media";
import { connect } from "react-redux";
import { Upload, Icon, message, Button, Col, Modal } from "antd";

const { Dragger } = Upload;

const apolloCache = new InMemoryCache();
function UploadImages(props) {
  const [fileList, setFileImage] = useState([]);
  const [statusUploadBtn, setStatusUploadBtn] = useState(true);
  const [statusUploadList, setStatusUploadList] = useState(false);
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
    onRemove(file) {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileImage(newFileList);
    },
    beforeUpload: (file, fileList) => {
      setFileImage(fileList);
    },
    fileList
  };
  const cancelUpload = () => {
    setFileImage([]);
  };
  const success = () => {
    Modal.success({
      content: "Upload successful...!"
    });
    setFileImage([]);
  };
  return (
    <ApolloProvider client={client}>
      <Mutation mutation={UPLOAD_IMAGE}>
        {(singleUploadStream, { data, loading, error }) => {
          console.log(data, loading, error);
          return (
            <Col md={8} className="section-upload">
              <Dragger {...configDrag}>
                <p className="ant-upload-drag-icon">
                  <Icon type="file-add" />
                </p>
                <p className="ant-upload-text">
                  Click or drag file to this area to upload
                </p>
              </Dragger>
              <div className="btn-load-images">
                <Button style={{ marginRight: "10px" }} onClick={cancelUpload}>
                  Cancel
                </Button>
                <Button
                  onClick={async () => {
                    for (var key of fileList) {
                      await singleUploadStream({
                        variables: {
                          partnerName: "lqmt",
                          file: key
                        }
                      });
                    }
                    props.refetch();
                    success();
                  }}
                  disabled={fileList.length === 0 ? true : false}
                >
                  Load media
                </Button>
              </div>
              {loading && <p>Loading.....</p>}
            </Col>
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
export default connect(mapStateToProps, null)(UploadImages);
