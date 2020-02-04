import React, { useState, useEffect } from "react";
import { Row, Col } from "antd";
import { gql } from "apollo-boost";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { Link } from "react-router-dom";
function Detail(props) {
  const query = new URLSearchParams(props.location.search);
  const AppQuery = gql`
      query {
        listUsers(fakeId:${query.get("id")}) {
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
            placeOfIssue
        }
      }
    `;
  const { loading, error, data } = useQuery(AppQuery);
  if (loading) return "Loading...";
  if (error) return `Error! ${error.message}`;
  let inforUser = data.listUsers[0];
  return (
    <Row>
      <Col md={8}>
        <p>Tên user {inforUser.username}</p>
        <p>C.coin {inforUser.coin}</p>
      </Col>
      <Col md={16}>
        <p>thông tin</p>
        <Link to={`/users/detail/update?id=${query.get("id")}`}>Edit</Link>
      </Col>
    </Row>
  );
}
export default Detail;
