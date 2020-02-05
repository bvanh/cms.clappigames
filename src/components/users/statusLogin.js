import React from "react";
import { queryLogin } from "../../utils/queryQrapql";
import { useQuery, useMutation } from "@apollo/react-hooks";

function LoginStatus() {
  const { loading, error, data, refetch } = useQuery(queryLogin(props.query));
  return <>
  <div>
      <p>{data.listLoginUsers[0]}</p>
  </div>
  </>;
}
