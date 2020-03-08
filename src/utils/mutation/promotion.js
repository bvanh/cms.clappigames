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
`;
const updatePromotion = gql`
  mutation updatePromotion($id: Int!, $req: PromotionRequest!) {
    updatePromotion(id: $id, req: $req) {
      name
      status
      shop
      eventTime
    }
  }
`;
const updateEvent = gql`
  mutation updateEvent($id: Int!, $req: EventRequest!) {
    updateEvent(id: $id, req: $req) {
      name
      status
      config
      eventTime
    }
  }
`;
export {
  createPromotion,
  createItemEvent,
  createEvent,
  updateEvent,
  updatePromotion
};
