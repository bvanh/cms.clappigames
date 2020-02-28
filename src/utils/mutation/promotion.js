import { gql } from "apollo-boost";

const createPromotion = gql`
  mutation createPromotion($req: PromotionRequest!) {
    createPromotion(req: $req) {
      shop
      name
    }
  }
`;
const createItemEvent = gql`
  mutation createProduct($req: ProductRequest!) {
    createProduct(req: $req) {
      productName
      productId
    }
  }
`;
const createEvent = gql`
mutation createEvent($req: EventRequest!) {
  createEvent(req: $req) {
    name
    paymentType
  }
}
`
export { createPromotion, createItemEvent, createEvent };
