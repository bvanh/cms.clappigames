import { gql } from "apollo-boost";
const queryListImages = gql`
  query {
    listUploadedImages {
      url
      id
      name
      partnerName
    }
  }
`;
const queryUploadImages = gql`
  mutation($partnerName: String!, $files: [Upload]) {
    multipleUploadImages(partnerName: $partnerName, files: $files) {
      id
      name
      path
      url
    }
  }
`;
const UPLOAD_IMAGE = gql`
  mutation($partnerName: String!, $file: Upload) {
    singleUploadImage(partnerName: $partnerName, file: $file) {
      id
      name
      path
      url
    }
  }
`;
const UPLOAD_MULTI_IMAGE = gql`
  mutation($partnerName: String!, $files: Upload) {
    multipleUploadImages(partnerName: $partnerName, files: files) {
      name
    }
  }
`;
export { queryListImages, queryUploadImages, UPLOAD_IMAGE, UPLOAD_MULTI_IMAGE };
