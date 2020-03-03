import { gql } from "apollo-boost";
const queryGetListPartnerProducts = (currentPage, pageSize, partnerId, partnerProductName) => {
  return gql`
    query {
      listPartnerProductsByPartner(currentPage: ${currentPage},pageSize: ${pageSize},partnerId: "${partnerId}",partnerProductName:"${partnerProductName}") {
        count
        rows {
          partnerProductId
          partnerId
          productName
          promotion {
            type
          }
          coin
          createAt
        }
      }
    }`;
};
// get productId
const queryGetRefPartnerProducts = partnerId => {
  return gql`
  query{
 listRefPartnerProducts(partnerId:"${partnerId}"){
    productId
    productName
  }
}
  `;
};
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
        partnerChargeId
        user {
          username
          nickname
        }
        coin
        partner {
          partnerName
        }
        createAt
      }
    }
  }
`;
const queryGetPartnerProductById = gql`
  query listPartnerProducts($partnerProductId: String) {
    listPartnerProducts(partnerProductId: $partnerProductId) {
      productName
      partnerId
      partnerProductName
      promotionId
      coin
      productId
    }
  }
`;
const getListPartnerProducts = partnerId => {
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
export {
  queryGetListPartnerProducts,
  queryGetListPartnerCharges,
  queryGetPartnerProductById,
  queryGetRefPartnerProducts,
  getListPartnerProducts
};
