import { gql } from "apollo-boost";

const getListServer = partnerId => {
  return gql`
query{
    listPartnerServers(partnerId:"${partnerId}"){
      server
      serverName
    }
  }
`;
};
const getListServerByPartner=gql`
query listPartnerServersByPartner($partnerId:String!){
  listPartnerServersByPartner(partnerId:$partnerId){
    id
    status
    server
    serverName
    createdDate
  }
}
`
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
    $gameId: String
    $server: Int
    $status: String
    $name: String
  ) {
    listPromotionsByType(
      currentPage: $currentPage
      pageSize: $pageSize
      status: $status
      type: $type
      gameId: $gameId
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
    id
    name
    gameId
    status
    eventTime
    server
    type
    shop
    linkUrl
    imageUrl
    prefix
  }
}
`}
const getDetailEvent = (eventId) => {
  return gql`
query {
  listEvents(id:${eventId}){
    name
    id
    eventTime
    paymentType
    config
    status
    linkUrl
    imageUrl
    prefix
  }
}
`}
export {
  getListServer,
  getListItemsForEvent,
  getListPromotionByType,
  getListEventsByType,
  getDetailPromotion,
  getDetailEvent,
  getListServerByPartner
};
