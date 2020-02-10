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
  mutation MultipleUploadImages($partnerName: String!, $files: [Upload]) {
    multipleUploadImages(partnerName: $partnerName, files: $files) {
      id
      name
      path
      url
    }
  }
`;
const queryUploadImage = gql`
  mutation SingleUploadImage($partnerName: String!, $file: Upload) {
    singleUploadImage(partnerName: $partnerName, file: $file) {
      id
      name
      path
      url
    }
  }
`;
export { queryListImages, queryUploadImages, queryUploadImage };
