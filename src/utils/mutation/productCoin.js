// update product
import { gql } from "apollo-boost";
const updateProduct = gql`
  mutation updateProduct($productId: String!, $req: ProductRequest!) {
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
      baseCoin
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
export { updateProduct, createProduct,deleteCoinProduct };
