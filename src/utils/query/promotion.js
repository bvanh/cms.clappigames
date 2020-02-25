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
export { getListServer };
