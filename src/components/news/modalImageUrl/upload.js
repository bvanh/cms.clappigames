import React, { useState } from "react";
import { InMemoryCache } from "apollo-cache-inmemory";
import { createUploadLink } from "apollo-upload-client";
import { ApolloClient } from "apollo-client";
import { ApolloProvider, Mutation } from "react-apollo";
import { UPLOAD_IMAGE } from "../../../utils/mutation/media";
import { connect } from "react-redux";
import { Upload, Icon, message, Button } from "antd";
import {
  dispatchSetUrlImage
} from "../../../redux/actions";
const { Dragger } = Upload;

const apolloCache = new InMemoryCache();
function UploadImagesInNews(props) {
  const [fileImage, setFileImage] = useState(null);
  const [statusUploadBtn, setStatusUploadBtn] = useState(true);

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
  return (
    <ApolloProvider client={client}>
      <Mutation mutation={UPLOAD_IMAGE}>
        {(singleUploadStream, { data, loading, error }) => {
          const demo=()=>{
            console.log('fsfsf')
          }
          if(data){dispatchSetUrlImage(data.singleUploadImage.url)}
          return (
            <>
              <form
                onSubmit={() => {
                  console.log("Submitted");
                }}
                encType={"multipart/form-data"}
                name='Tải ảnh lên'
              >
                <input
                style={{display:'none'}}
                  name={"fileNews"}
                  id='fileNews'
                  type={"file"}
                  onChange={ async ({ target: { files } }) => {
                    for (var value of files) {
                        await singleUploadStream({
                            variables: {
                                partnerName: "lqmt",
                                file: value
                            }
                        });
                    }
                    alert('tải thành công')
                  }}
                  multiple
                />
                <label for="fileNews">Tải ảnh lên</label>
                {loading && <p>Loading.....</p>}
              </form>
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
export default connect(mapStateToProps, null)(UploadImagesInNews);
