import { gql } from "apollo-boost";

// const getListChartCharges = (fromDate, toDate) => {
//     return gql`
//   query {
//     listCacheChargesByDate(fromDate:"${fromDate}",toDate:"${toDate}"){
//       xAxis,
//       yAxis
//     }
//   }
// `;
// };
const getDataDAU = gql`
  query chartDau(
    $fromDate: String!
    $toDate: String!
    $game: String!
  ) {
    chartDau(
      fromDate: $fromDate
      toDate: $toDate
      game: $game
    ) {
      xAxis
      yAxis
    }
  }
`;
const getDataMAU = gql`
  query chartMau(
    $fromMonth: String!
    $toMonth: String!
    $game: String!
  ) {
    chartMau(
      fromMonth: $fromMonth
      toMonth: $toMonth
      game: $game
    ) {
      xAxis
      yAxis
    }
  }
`;
const getListPartnerByGame = gql`
  query {
    listPartnersByGame {
      partnerId
      partnerName
      fullName
    }
  }
`;

export { getListPartnerByGame, getDataDAU, getDataMAU };
