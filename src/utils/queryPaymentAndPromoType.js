import { gql } from "apollo-boost";

const paymentType = "productPaymentType"
const queryGetPaymentType = gql`
   query{
    __type(name:"${paymentType}"){
        name,
        enumValues{
          name
        }
      }
   }
`;
const getPromotionType = gql`
query{
  __type(name:"promotionType"){
      name,
      enumValues{
        name
      }
    }
 }
`
export { queryGetPaymentType, getPromotionType }