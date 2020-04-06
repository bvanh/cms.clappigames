import { gql } from "apollo-boost";
const queryListImages = gql`
  query {
    listUploadedImages(status:"AVAILABLE") {
      url
      id
      name
      partnerName
      status
    }
  }
`;
const queryGetListAlbumByAdmin = (currentPage, pageSize, userAdmin) => {
  return gql`
    query {
      listAdminAlbumsByUser(currentPage: ${currentPage}, pageSize: ${pageSize}, user: "${userAdmin}") {
        count
        rows {
          id
          user
          name
          status
          data
        }
      }
    }
  `;
};
const queryGetImagesFromAlbumByType = (id, userAdmin) => {
  return gql`
  query {
    listAdminAlbums(id:${id},user:"${userAdmin}"){
      name
      data
      user
      status
    }
  }
  `;
};
export {
  queryListImages,
  queryGetListAlbumByAdmin,
  queryGetImagesFromAlbumByType
};
