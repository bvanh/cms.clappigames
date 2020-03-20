import { gql } from "apollo-boost";

const queryGetListCoin = gql`
  query listProductsByPaymentType(
    $currentPage: Int!
    $pageSize: Int!
    $type: String
    $productName: String
  ) {
    listProductsByPaymentType(
      currentPage: $currentPage
      pageSize: $pageSize
      type: $type
      productName: $productName
    ) {
      count
      rows {
        baseCoin
        type
        discount
        productId
        productName
        price
      }
    }
  }
`;
// list product theo id
const queryGetProductById = gql`
query listProducts( $productId: String){
  listProducts(productId:$productId){
    productName
    type
    sort
    price
  }
}
`;

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
        userId
        baseCoin
        price
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
export { queryGetListCoin, queryGetListCharges, queryGetProductById };
