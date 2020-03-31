import React, { useState, useEffect } from "react";
import { Row, Col, Icon, Avatar } from "antd";
import { queryGetDataUserDetail } from "../../utils/queryUsers";
import { useQuery, useMutation } from "@apollo/react-hooks";
import UpdateInforUser from "./updateUser";
import HistoryCharges from "./historyCharges/historyCoin";
import "../../static/style/userDetail.css";
import { importImage } from "../../utils/importImg";
import {Link} from 'react-router-dom'
function Detail(props) {
  const query = new URLSearchParams(props.location.search);
  const [isUpdate, switchUpdate] = useState(false);
  const { loading, error, data, refetch } = useQuery(
    queryGetDataUserDetail(query)
  );
  if (loading) return "Loading...";
  if (error) return `Error! ${error.message}`;
  // console.log(data)
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
      <Row className="container-userdetail">
        <Link to='/'>
          <span>
            <Icon type="arrow-left" style={{paddingRight:'.2rem'}}/>
            Back
        </span>
        </Link>
        <h2>Profile user</h2>
        <Col md={17}>
          <Row>
            <Row className='section1'>
              <Col md={8} className="avatar-detail">
                <Avatar
                  size={64}
                  icon="user"
                  theme="filled"
                  style={{ marginBottom: ".5rem" }}
                />
                {/* <img src={importImage['avatar-detail.png']}/> */}
                <b>{username}</b>
                <p>C.coin: {coin}</p>
                <p>UserId: {userId}</p>
              </Col>
              {isUpdate ? (
                <UpdateInforUser
                  data={data.listUsers[0]}
                  statusSocial={statusSocial}
                  userId={query.get("userId")}
                  switchEdit={switchEdit}
                />
              ) : (
                  <Col md={16}>
                    <div className="info-detail">
                      <Row className='info-detail-title'>
                        <h3>Account</h3>
                        <p>Email: <b>{email}</b></p>
                        <div className='mobile-status-detail'>
                          <p>Phone number : <b>{mobile}</b></p>
                          <p>Type connection : <b>{statusSocial}</b></p>
                        </div>
                      </Row>
                      <Row className='info-detail-content'>
                        <h3>User Information</h3>
                        <div>
                          <p>Full name: <span className='detail-user'>{nickname}</span></p>
                          <p>Gender : <span className='detail-user'>{gender}</span></p>
                          <p>Birth : <span className='detail-user'>{dateOfBirth}</span></p>
                        </div>
                        <div>
                          <p>ID card: <span className='detail-user'>{identifyCard}</span></p>
                          <p>Date: <span className='detail-user'>{dateOfIssue}</span></p>
                          <p>Where: <span className='detail-user'>{placeOfIssue}</span></p>
                        </div>
                        <p>Address: <span className='detail-user'>{address}</span></p>
                      </Row>
                      <Icon type="edit" style={{ fontSize: '24px' }} theme="filled" onClick={() => switchEdit(true)} className='edit-user' />
                    </div>
                  </Col>
                )}
            </Row>
            <Row>
              <HistoryCharges userId={userId} />
            </Row>
          </Row>
        </Col>
        <Col md={7} className='user-status'>
          <h3>Acitvity Status</h3>
        </Col>
      </Row>
    </>
  );
}
export default Detail;
