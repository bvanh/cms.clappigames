import { gql } from "apollo-boost";
const queryListImages = gql`
  query {
    listUploadedImages {
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
export { queryListImages, queryGetListAlbumByAdmin };
