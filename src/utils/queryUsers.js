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
// lịch sử hoạt động
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
const queryHistotyCharges = (currentPage, pageSize, userId) => {
  return gql`
  query{
    listChargesByUser(currentPage: ${currentPage}, pageSize: ${pageSize}, userId:"${userId}"){
      count
      rows {
        baseCoin,
        price,
        payload
        paymentType,
        chargeId,
        price,
        createAt,
        status
      }
    }
  }
  `;
};
const queryHistotyPayment = (currentPage, pageSize, userId) => {
  return gql`
  query{
    listPartnerChargesByUser(currentPage: ${currentPage}, pageSize: ${pageSize}, userId:"${userId}"){
      count
      rows {
        payload
        status
      }
    }
  }
  `;
};
const queryHistotyLogin = (currentPage, pageSize, userId) => {
  return gql`
  query{
    listLoginUsersByUser(currentPage: ${currentPage}, pageSize: ${pageSize}, userId:"${userId}"){
      count
      rows {
        lastLogin
         partner{
          partnerName
          partnerId
        }
        os
        gameId  
      }
    }
  }
  `;
};
export {
  AppQuery,
  queryLogin,
  queryHistotyCharges,
  queryHistotyPayment,
  queryHistotyLogin
};
