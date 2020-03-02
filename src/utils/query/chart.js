import { gql } from "apollo-boost";

const getListChartCharges = (fromDate, toDate) => {
  return gql`
  query {
    listCacheChargesByDate(fromDate:"${fromDate}",toDate:"${toDate}"){
      xAxis,
      yAxis
    }
  }
`;
};
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
