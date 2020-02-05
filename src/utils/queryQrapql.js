import { gql } from "apollo-boost";
const AppQuery = query => {
  return gql`
    query {
      listUsers(userId:"${query.get("userId")}") {
          userId,
          username,
          fakeId,
          type,
          nickname,
          coin,
          email,
          identifyCard,
          address,
          status,
          gender,
          dateOfBirth,
          dateOfIssue,
          placeOfIssue,
          appleId,
          facebook,
          google,
          guest,
          mobile
      }
    }
    `;
};
const queryLogin = query => {
  return gql`
    query {
        listLoginUsers(userId:"${query.get("userId")}") {
            userId,
            os,
            partner {
              partnerId,
              partnerName
            },
            createAt,
            lastLogin
      }
    }
    `;
};
export { AppQuery, queryLogin };
