import { gql } from "apollo-boost";

const getListServer = partnerId => {
  return gql`
query{
    listPartnerServers(partnerId:"${partnerId}"){
      server
      serverName
      status
    }
  }
`;
};
const getListItemsForEvent = gql`
  query {
    listProducts(type: EVENT) {
      productName
      productId
    }
  }
`;
const getListPromotionByType = (
  currentPage,
  pageSize,
  status,
  type,
  game,
  server,
  name
) => {
  return gql`
  query {
    listPromotionsByType(
      currentPage: "${currentPage}",
      pageSize: ${pageSize},
      status: "${status}",
      type: "${type}",
      game: "${game}",
      server: ${server},
      name: "${name}",
    ) {
      count
      rows {
      name
      type
      status
      eventTime
      }
    }
 }
`;
};
const getListEventByType = (
  currentPage,
  pageSize,
  paymentType,
  status,
  name
) => {
  return gql`
  query{
    listEventsByType(currentPage:"${currentPage}",pageSize:${pageSize},name:${name},paymentType:"${paymentType}",status:"${status}"){
     count
     rows{
       name
       paymentType
       status
     }
   }
   }`;
};
export {
  getListServer,
  getListItemsForEvent,
  getListPromotionByType,
  getListEventByType
};
