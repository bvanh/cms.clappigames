// update product
import { gql } from "apollo-boost";
const updatePartnerProductItem = gql`
  mutation updatePartnerProduct($partnerProductId: String!, $req: PartnerProductRequest!) {
    updatePartnerProduct(partnerProductId: $partnerProductId, req: $req) {
      partnerProductId
      partnerId
      productName
      coin
      createAt
      status
      partnerProductName
      productId
    }
  }
`;
const createPartnerProduct = gql`
  mutation createPartnerProduct($req: PartnerProductRequest!) {
    createPartnerProduct(req: $req) {
      partnerProductId
      partnerId
      productName
      coin
      createAt
      status
      partnerProductName
      productId
      image
    }
  }
`;
const deletePartnerProducts = gql`
mutation deletePartnerProducts($ids:[String]!){
    deletePartnerProducts(ids:$ids){
        productName
        status
    }
}
`;
export { updatePartnerProductItem, createPartnerProduct,deletePartnerProducts };
