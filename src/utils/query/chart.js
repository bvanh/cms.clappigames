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

export { getListChartCharges }