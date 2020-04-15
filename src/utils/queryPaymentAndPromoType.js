import { gql } from "apollo-boost";

const paymentType = "productPaymentType";
const queryGetPaymentType = gql`
   query{
    __type(name:"${paymentType}"){
        name,
        enumValues{
          name
          description
        }
      }
   }
`;
const getPromotionType = gql`
  query {
    __type(name: "promotionType") {
      enumValues {
        name
        description
      }
    }
  }
`;
const getEventPaymentType = gql`
  query {
    __type(name: "eventPaymentType") {
      name
      enumValues {
        name
        description
      }
    }
  }
`;
export { queryGetPaymentType, getPromotionType, getEventPaymentType };
