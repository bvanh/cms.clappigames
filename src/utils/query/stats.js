import { gql } from "apollo-boost";
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
const getDataNRU = gql`
query chartNruByOs(
  $fromDate: String!
  $toDate: String!
  $game: String!
){
  chartNruByOs(
    fromDate: $fromDate
    toDate: $toDate
    game: $game
  ){
    xAxis
    yAxis
  }
}
`
const getDataPaidUsers = gql`
query chartPaidUserByDate(
  $fromDate: String!
  $toDate: String!
  $game: String!
){
  chartPaidUserByDate(
    fromDate: $fromDate
    toDate: $toDate
    game: $game
  ){
    xAxis
    yAxis
  }
}
`
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

export { getListPartnerByGame, getDataDAU, getDataMAU, getDataNRU, getDataPaidUsers };
