import { gql } from "apollo-boost";
const queryGetListPartnerProducts = gql`
  query listPartnerProductsByPartner(
    $currentPage: Int!
    $pageSize: Int!
    $partnerId: String!
    $partnerProductName: String!
    $productName: String!
  ) {
    listPartnerProductsByPartner(
      currentPage: $currentPage
      pageSize: $pageSize
      partnerId: $partnerId
      partnerProductName: $partnerProductName
      productName: $productName
    ) {
      count
      rows {
        partnerProductId
        partnerId
        productName
        partnerProductName
        coin
        createAt
        partner {
          partnerName
        }
        image
        status
      }
    }
  }
`;
// get productId
const queryGetRefPartnerProducts = gql`
  query listRefPartnerProducts($partnerId: String!) {
    listRefPartnerProducts(partnerId: $partnerId) {
      productId
      productName
    }
  }
`;
// lịch sử giao dịch theo items
const queryGetListPartnerCharges = gql`
  query listPartnerChargesByType(
    $currentPage: Int!
    $pageSize: Int!
    $type: Int!
    $partnerId: String
    $os: String
    $userType: String
    $search: String
    $status: String
    $fromDate: String!
    $toDate: String!
  ) {
    listPartnerChargesByType(
      currentPage: $currentPage
      pageSize: $pageSize
      type: $type
      fromDate: $fromDate
      search: $search
      status: $status
      toDate: $toDate
      partnerId: $partnerId
      os: $os
      userType: $userType
    ) {
      count
      rows {
        partnerChargeCode
        payload
        user {
          username
          nickname
        }
        coin
        partner {
          partnerName
        }
        partnerProduct {
          productName
        }
        promotionRef
        createAt
        status
      }
    }
  }
`;
const queryGetPartnerProductById = gql`
  query listPartnerProducts($partnerProductId: String) {
    listPartnerProducts(partnerProductId: $partnerProductId) {
      status
      productName
      partnerId
      partnerProductName
      coin
      productId
      image
      prefix
      appleId
      googleId
    }
  }
`;
const getListPartnerProducts = (partnerId) => {
  return gql`
  query{
    listPartnerProducts(partnerId:"${partnerId}"){
      productName
      productId
      partnerProductId
    }
  }
`;
};
const getListPartnerProducts2 = gql`
  query listPartnerProducts($partnerId: String) {
    listPartnerProducts(partnerId: $partnerId) {
      productName
      partnerProductId
    }
  }
`;
export {
  queryGetListPartnerProducts,
  queryGetListPartnerCharges,
  queryGetPartnerProductById,
  queryGetRefPartnerProducts,
  getListPartnerProducts,
  getListPartnerProducts2,
};
