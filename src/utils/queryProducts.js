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
const queryGetListCharges = gql`
  query listProductsByPaymentType(
    $currentPage: Int!
    $pageSize: Int!
    $type: Int!
    $search: String
    $status: String
    $fromDate: String!
    $toDate: String!
  ) {
    listChargesByType(
      currentPage: $currentPage
      pageSize: $pageSize
      type: $type
      fromDate: $fromDate
      search: $search
      status: $status
      toDate: $toDate
    ) {
      count
      rows {
        paymentType
        productName
        payload
        baseCoin
        status
        createAt
      }
    }
  }
`;
export { queryGetListProducts,queryGetListCharges };
