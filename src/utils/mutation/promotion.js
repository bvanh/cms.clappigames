import { gql } from "apollo-boost";

const createPromotion = gql`
  mutation createPromotion($req: PromotionRequest!) {
    createPromotion(req: $req) {
      shop
      name
    }
  }
`;
export { createPromotion };
