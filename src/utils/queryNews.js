import { gql } from "apollo-boost";
const queryGetNews = (currentPage, pageSize, searchValue, fromDate, toDate) => {
  return gql`
    query{
        listNewsByType(currentPage: ${currentPage}, pageSize: ${pageSize}, search: "${searchValue}",fromDate:"${fromDate}",toDate:"${toDate}") {
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
};
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
        content
        createAt
        type
        status
        platform
      }
    }
  `;
};
const UpdateNews = gql`
  mutation UpdateNews($newsId: Int!, $req: NewsRequest!) {
    updateNews(newsId: $newsId, req: $req) {
      title
      content
      platform
      type
      status
    }
  }
`;
const createNews = gql`
  mutation CreateNews($req: NewsRequest!) {
    createNews(req: $req) {
      title
      content
      status
      type
      platform
    }
  }
`;
const queryDeleteNews = gql`
  mutation DeleteNews($newsId: Int!) {
    deleteNews(newsId: $newsId) {
      status
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
