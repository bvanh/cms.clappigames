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
  query chartCachePartnerChargeByDates(
    $fromDate: String!
    $toDate: String!
  ) {
    chartCachePartnerChargeByDates(
      fromDate: $fromDate
      toDate: $toDate
    ) {
      xAxis
      yAxis
    }
  }
`;

export { getListChartCharges, getListPartnerCharges };
