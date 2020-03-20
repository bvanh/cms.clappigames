import { gql } from "apollo-boost";

const getListChartCharges = gql`
  query listCacheChargesByDate($fromDate: String!, $toDate: String!) {
    listCacheChargesByDate(fromDate: $fromDate, toDate: $toDate) {
      xAxis
      yAxis
    }
  }
`;
const getListPartnerCharges = gql`
  query listCachePartnerChargesByDate(
    $fromDate: String!
    $toDate: String!
    $partnerId: String!
  ) {
    listCachePartnerChargesByDate(
      fromDate: $fromDate
      toDate: $toDate
      partnerId: $partnerId
    ) {
      xAxis
      yAxis
    }
  }
`;

export { getListChartCharges, getListPartnerCharges };
