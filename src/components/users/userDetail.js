import React, { useState, useEffect } from "react";
import { Row, Col } from "antd";
import { AppQuery } from "../../utils/queryUsers";
import { useQuery, useMutation } from "@apollo/react-hooks";
import UpdateInforUser from "./updateUser";
import HistoryCharges from "./historyCharges/historyCoin";
function Detail(props) {
  const query = new URLSearchParams(props.location.search);
  const [isUpdate, switchUpdate] = useState(false);
  const { loading, error, data, refetch } = useQuery(AppQuery(query));
  if (loading) return "Loading...";
  if (error) return `Error! ${error.message}`;
  const {
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
    mobile,
    appleId,
    facebook,
    google,
    guest
  } = data.listUsers[0];
  let statusSocial = "";
  if (guest === 1) {
    statusSocial = "Tài khoản khách";
  } else if (facebook !== null) {
    statusSocial = "Liên kết Facebook";
  } else if (google !== null) {
    statusSocial = "Liên kết Google";
  } else {
    statusSocial = "Tài khoản Clappigames";
  }
  const switchEdit = val => {
    switchUpdate(val);
    refetch();
  };
  return (
    <>
      <Row>
        {isUpdate ? (
          <UpdateInforUser
            data={data.listUsers[0]}
            userId={query.get("userId")}
            switchEdit={switchEdit}
          />
        ) : (
          <>
            <Col md={8}>
              <p>Tên user {username}</p>
              <p>C.coin {coin}</p>
              <p>UserId: {userId}</p>
            </Col>
            <Col md={16}>
              <p>thông tin tài khoản</p>
              <p>Email: {email}</p>
              <p>Sdt : {mobile}</p>
              <p>Trang thai liên kết :{statusSocial}</p>
              <b>Thông tin cá nhân</b>
              <p>họ tên: {nickname}</p>
              <p>gioi tinh :{gender}</p>
              <p>ngay sinh :{dateOfBirth}</p>
              <p>cmnd: {identifyCard}</p>
              <p>ngày cấp:{dateOfIssue}</p>
              <p>noi cap:{placeOfIssue}</p>
              <a onClick={() => switchEdit(true)}>Edit</a>
            </Col>
          </>
        )}
        <p>Lịch sử nạp C.coin</p>
        <HistoryCharges userId={userId} />
      </Row>
      {/* <Row>
        <b>Trang thai hoat dong</b>
      </Row> */}
    </>
  );
}
export default Detail;
