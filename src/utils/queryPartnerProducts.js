import { gql } from "apollo-boost";
const queryGetListProducts = gql`
  query listProductsByPaymentType(
    $currentPage: Int!
    $pageSize: Int!
    $type: String
  ) {
    listProductsByPaymentType(
      currentPage: $currentPage
      pageSize: $pageSize
      type: $type
    ) {
      count
      rows {
        productName
        baseCoin
        type
        discount
        productId
      }
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
        partnerChargeId
      user {
        username
        nickname
      }
      coin
      partner {
        partnerName
      }
      status
      createAt
      }
    }
  }
`;
export { queryGetListProducts, queryGetListPartnerCharges };
