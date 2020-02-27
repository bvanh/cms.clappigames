import { gql } from "apollo-boost";

const getListServer = partnerId => {
  return gql`
query{
    listPartnerServers(partnerId:"${partnerId}"){
      server
      serverName
      status
    }
  }
`;
};
const getListItemsForEvent = gql`
query{
  listProducts(type:EVENT){
   productName
   productId
 }
 }
`
export { getListServer, getListItemsForEvent };
