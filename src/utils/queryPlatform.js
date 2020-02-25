import { gql } from "apollo-boost";
const queryGetPlatform =
    gql`
      query {
        listPartners {
          partnerId
          partnerName
        }
      }
    `;

export { queryGetPlatform }