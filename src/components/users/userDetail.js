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
            Danh sách người dùng
        </span>
        </Link>
        <h2>Thông tin chi tiết</h2>
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
                        <h3>Thông tin tài khoản</h3>
                        <p>Email: <b>{email}</b></p>
                        <div className='mobile-status-detail'>
                          <p>Sdt : <b>{mobile}</b></p>
                          <p>Trang thai liên kết : <b>{statusSocial}</b></p>
                        </div>
                      </Row>
                      <Row className='info-detail-content'>
                        <h3>Thông tin cá nhân</h3>
                        <div>
                          <p>Họ và Tên: <span className='detail-user'>{nickname}</span></p>
                          <p>Giới tính : <span className='detail-user'>{gender}</span></p>
                          <p>Ngày sinh : <span className='detail-user'>{dateOfBirth}</span></p>
                        </div>
                        <div>
                          <p>CMND: <span className='detail-user'>{identifyCard}</span></p>
                          <p>Ngày cấp: <span className='detail-user'>{dateOfIssue}</span></p>
                          <p>Nơi cấp: <span className='detail-user'>{placeOfIssue}</span></p>
                        </div>
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
          <h3>Trạng thái hoạt động</h3>
        </Col>
      </Row>
    </>
  );
}
export default Detail;
