import React, { useState, useEffect } from "react";
import { Row, Col, Input, Button } from "antd";
import { gql } from "apollo-boost";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { Link } from "react-router-dom";
function UpdateInforUser(props) {
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
    mobile
  } = props.data;
  const [userInfor, setUserInfor] = useState({
    sdt: mobile,
    name: nickname,
    gender: gender,
    dateBirth: dateOfBirth
  });
  const getInforUser = e => {
    setUserInfor({ ...userInfor, [e.target.name]: e.target.value });
  };
  const UpdateUser = gql`
    mutation UpdateUserInfo($userId: String!, $req: UserInfoRequest!) {
      updateUserInfo(userId: $userId, req: $req) {
        nickname
        gender
        mobile
        dateOfBirth
      }
    }
  `;
  const [updateUser, { loading, error, data }] = useMutation(UpdateUser, {
    variables: {
      userId: props.userId,
      req: {
        nickname: userInfor.name,
        gender: userInfor.gender,
        mobile: userInfor.sdt,
        dateOfBirth: userInfor.dateBirth
      }
    }
  });
  const submitUpdate = () => {
    let data = updateUser();
    console.log(data);
  };
  return (
    <Row>
      <Col md={8}>
        <p>Tên user {username}</p>
        <p>C.coin {coin}</p>
        <p>UserId: {userId}</p>
      </Col>
      <Col md={16}>
        <p>thông tin tài khoản</p>
        <p>Email: {email}</p>
        <span>
          số điện thoại{" "}
          <Input
            placeholder=""
            value={userInfor.sdt}
            name="sdt"
            onChange={getInforUser}
          />
        </span>

        <p>Trang thai: {status}</p>
        <p>Thông tin cá nhân</p>
        <span>
          userName{" "}
          <Input
            placeholder=""
            value={userInfor.name}
            name="name"
            onChange={getInforUser}
          />
        </span>

        <span>
          gender
          <Input
            placeholder=""
            value={userInfor.gender}
            name="gender"
            onChange={getInforUser}
          />
        </span>
        <span>
          ngày sinh
          <Input
            placeholder=""
            value={userInfor.dateBirth}
            name="dateBirth"
            onChange={getInforUser}
          />
        </span>
        <p>cmnd: {identifyCard}</p>
        <p>ngày cấp:{dateOfIssue}</p>
        <p>noi cap:{placeOfIssue}</p>
        <Button onClick={submitUpdate}>Update</Button>
        <Button onClick={() => props.switchEdit(false)}>Back</Button>
      </Col>
    </Row>
  );
}
export default UpdateInforUser;
