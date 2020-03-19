import { gql } from "apollo-boost";
const UPLOAD_IMAGE = gql`
  mutation($partnerName: String!, $file: Upload) {
    singleUploadImage(partnerName: $partnerName, file: $file) {
      id
      name
      path
      url
      status
    }
  }
`;
const DELETE_IMAGE = gql`
  mutation($ids: [Int]!) {
    deleteUploadImages(ids: $ids) {
      name
    }
  }
`;
const DELETE_ALBUM = gql`
  mutation($ids: [Int]!) {
    deleteAdminAlbums(ids: $ids) {
      name
    }
  }
`;
const CREATE_ALBUM = gql`
  mutation($req: AdminAlbumRequest!) {
    createAdminAlbum(req: $req) {
      data
      name
      id
    }
  }
`;
const UPDATE_ALBUM = gql`
  mutation($id: Int!, $req: AdminAlbumRequest!) {
    updateAdminAlbum(id: $id, req: $req) {
      data
      name
    }
  }
`;
export { UPLOAD_IMAGE, DELETE_IMAGE, DELETE_ALBUM, CREATE_ALBUM, UPDATE_ALBUM };
