import { gql } from "apollo-boost";
const queryGetNews = gql`
  query listNewsByType($currentPage: Int!, $pageSize: Int!, $search: String) {
    listNewsByType(
      currentPage: $currentPage
      pageSize: $pageSize
      search: $search
    ) {
      count
      rows {
        newsId
        title
        createAt
        type
        platform
        status
        partner {
          partnerName
        }
      }
    }
  }
`;
const queryGetPlatform = () => {
  return gql`
    query {
      listPartners {
        partnerId
        partnerName
      }
    }
  `;
};
const queryNewsDetail = newsId => {
  return gql`
    query {
      listNews(newsId: ${newsId}) {
        newsId
        title
        status
        content
        shortContent
        image
        createAt
        type
        platform
        startPost
      }
    }
  `;
};
const UpdateNews = gql`
  mutation UpdateNews($newsId: Int!, $req: NewsRequest!) {
    updateNews(newsId: $newsId, req: $req) {
      newsId
      title
      content
      platform
      type
      shortContent
      image
      startPost
    }
  }
`;
const createNews = gql`
  mutation CreateNews($req: NewsRequest!) {
    createNews(req: $req) {
      title
      content
      type
      platform
      shortContent
      image
      startPost
    }
  }
`;
const queryDeleteNews = gql`
  mutation DeleteNews($ids: [Int]!) {
    deleteNews(ids: $ids) {
      title
    }
  }
`;
export {
  queryGetNews,
  queryNewsDetail,
  // queryUpdateNews,
  queryGetPlatform,
  UpdateNews,
  createNews,
  queryDeleteNews
};
// mutation {
//   updateNews(
//     newsId: 77
//     req: {
//       title: "aaa"
//       type: NEWS
//       content: "<p>gnsjngsjgnsjgsgsngsgjs</p>"
//       status: COMPLETE
//       platform: "469D8A83-2F3D-48DF-927B-7F40B602FCA3"
//       unity: 0
//     }
//   ) {
//     title
//     platform
//   }
// }
