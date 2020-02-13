import { gql } from "apollo-boost";

const queryGetListCoin = gql`
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
        baseCoin
        type
        discount
        productId
        price
      }
    }
  }
`;
// tạo product

// lịc sử giao dịch
const queryGetListCharges = gql`
  query listChargesByType(
    $currentPage: Int!
    $pageSize: Int!
    $type: Int!
    $search: String
    $fromDate: String!
    $toDate: String!
  ) {
    listChargesByType(
      currentPage: $currentPage
      pageSize: $pageSize
      type: $type
      search: $search
      fromDate: $fromDate
      toDate: $toDate
    ) {
      count
      rows {
        createAt
        chargeId
        baseCoin
        paymentType
        status
        user {
          username
          nickname
        }
      }
    }
  }
`;
export { queryGetListCoin, queryGetListCharges };
