import { gql } from "apollo-boost";

const createPromotion = gql`
  mutation createPromotion($req: PromotionRequest!) {
    createPromotion(req: $req) {
      id
      shop
      name
      eventTime
      linkUrl
      imageUrl
      prefix
      startedAt
      endedAt
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
      id
      name
      paymentType
      linkUrl
      imageUrl
      prefix
      config
      eventTime
      startedAt
      endedAt
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
const deletePromotion = gql`
  mutation deletePromotions($ids: [Int]!) {
    deletePromotions(ids: $ids) {
      name
    }
  }
`;

const deleteEvents = gql`
  mutation deleteEvents($ids: [Int]!) {
    deleteEvents(ids: $ids) {
      name
    }
  }
`;
export {
  createPromotion,
  createItemEvent,
  createEvent,
  updateEvent,
  updatePromotion,
  deletePromotion,
  deleteEvents
};
