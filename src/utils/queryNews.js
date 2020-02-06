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
      }
    }
  `;
};
const queryUpdateNews = () => {
  return gql`
  mutation UpdateNews($newsId: Int!, $req: NewsRequest!!) {
    updateNews(newsId: $newsId, req: $req) {
      title
      platform
      type
      status
    }
  }
  `;
};
export { queryGetNews, queryNewsDetail,queryUpdateNews };
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
