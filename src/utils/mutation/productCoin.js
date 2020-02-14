// update product
import { gql } from "apollo-boost";
const UpdateProduct = gql`
  mutation UpdateProduct($productId: String!, $req: ProductRequest!) {
    updateProduct(productId: $productId, req: $req) {
      productName
    }
  }
`;
const createProduct = gql`
  mutation createProduct($req: ProductRequest!) {
    createProduct(req: $req) {
      productName
      type
      sort
      price
      status
    }
  }
`;
const deleteCoinProduct = gql`
mutation deleteProducts($ids:[String]!){
    deleteProducts(ids:$ids){
        productName
        status
    }
}
`;
export { UpdateProduct, createProduct,deleteCoinProduct };
