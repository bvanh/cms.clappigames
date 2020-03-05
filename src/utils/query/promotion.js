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
const getListPromotionByType = gql`
  query listPromotionsByType(
    $currentPage: Int!
    $pageSize: Int!
    $type: String
    $game: String
    $server: Int
    $status: String
    $name: String
  ) {
    listPromotionsByType(
      currentPage: $currentPage
      pageSize: $pageSize
      status: $status
      type: $type
      game: $game
      server: $server
      name: $name
    ) {
      count
      rows {
        name
        type
        status
        eventTime
        id
      }
    }
  }
`;

const getListEventsByType = gql`
  query listEventsByType(
    $currentPage: Int!
    $pageSize: Int!
    $paymentType: String
    $status: String
    $name: String
  ) {
    listEventsByType(
      currentPage: $currentPage
      pageSize: $pageSize
      paymentType: $paymentType
      status: $status
      name: $name
    ) {
      count
      rows {
        name
        paymentType
        status
        eventTime
        config
        id
      }
    }
  }
`;
const getDetailPromotion = (promoId) => {
  return gql`
query {
  listPromotions(id:${promoId}){
    name
    game
    status
    eventTime
    server
    type
    shop
  }
}
`}
export {
  getListServer,
  getListItemsForEvent,
  getListPromotionByType,
  getListEventsByType,
  getDetailPromotion
};
