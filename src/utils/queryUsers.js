import { gql } from "apollo-boost";
const queryGetListUsers = gql`
    query listUsersByType($currentPage: Int!, $pageSize: Int!, $type: Int!, $search: String){
      listUsersByType(currentPage: $currentPage, pageSize: $pageSize, type: $type, search: $search) {
        count
        rows {
          userId
          username
          coin
          email,
          fakeId,
          mobile
          emailStatus
          verifyEmail
          status
        }
      }
    }
  `;

const queryGetDataUserDetail = query => {
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
// const queryHistotyCharges=()=
const queryHistotyChargesByUsers = (currentPage, pageSize, userId) => {
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
        partnerChargeCode
        payload
        status
        partnerProduct{
          partnerProductName
        }
        partner{
          partnerName
        }
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
  queryGetListUsers,
  queryGetDataUserDetail,
  queryLogin,
  queryHistotyChargesByUsers,
  queryHistotyPayment,
  queryHistotyLogin
};
