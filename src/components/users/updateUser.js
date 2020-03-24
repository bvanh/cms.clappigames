import React, { useState, useEffect } from "react";
import { Row, Col, Input, Button, Icon, Select, DatePicker, Modal } from "antd";
import moment from 'moment';
import { gql } from "apollo-boost";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { Link } from "react-router-dom";
const { Option } = Select;
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
    dateBirth: dateOfBirth,
    identifyCard: identifyCard,
    dateOfIssue: dateOfIssue,
    placeOfIssue: placeOfIssue
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
  const [updateUser] = useMutation(UpdateUser, {
    variables: {
      userId: props.userId,
      req: {
        nickname: userInfor.name,
        gender: userInfor.gender,
        mobile: userInfor.sdt,
        dateOfBirth: userInfor.dateBirth,
        identifyCard: userInfor.identifyCard,
        placeOfIssue: userInfor.placeOfIssue,
        dateOfIssue: userInfor.dateOfIssue
      }
    }
  });
  const dateFormat = 'DD/MM/YYYY';
  function disabledDate(current) {
    // Can not select days before today and today
    return current && current < moment().endOf('day');
  }
  const getInforSelect = (val) => {
    setUserInfor({ ...userInfor, gender: val })
  }
  const handleChangeDateOfIssue = (val) => {
    setUserInfor({ ...userInfor, dateOfIssue: val })
  }
  const handleChangeDateBirth = (val) => {
    setUserInfor({ ...userInfor, dateBirth: val })
  }
  const submitUpdate = () => {
    let data = updateUser();
    data.then(val =>
      success()
    )
  };
  const success = () => {
    Modal.success({
      content: 'Cập nhật thành công !',
      onOk() { props.switchEdit(false) }
    });
  }
  return (
    <Col md={16}>
      <div className="info-detail">
        <Row className='info-detail-title'>
          <h3>Thông tin tài khoản</h3>
          <p>Email: <b>{email}</b></p>
          <div className='mobile-status-detail'>
            <p className='user-mobile'>Sdt:  <input
              className='input-update'
              placeholder=""
              value={userInfor.sdt}
              name="sdt"
              onChange={getInforUser}
            /></p>
            <p>Trang thai liên kết : <b>{props.statusSocial}</b></p>
          </div>
        </Row>
        <Row className='info-detail-content'>
          <h3>Thông tin cá nhân</h3>
          <div>
            <p>Họ và Tên:  <input
              className='input-update'
              placeholder=""
              value={userInfor.name}
              name="name"
              onChange={getInforUser}
            /></p>
            <p>Giới tính : <Select defaultValue={gender} onChange={getInforSelect} className='select-infor' showArrow={false}>
              <Option value="MALE">MALE</Option>
              <Option value="FEMALE">FEMALE</Option>
              <Option value="OHTER">OTHER</Option>
            </Select></p>
            <p>Ngày sinh : <DatePicker defaultValue={moment(userInfor.dateBirth, dateFormat)} format={dateFormat} className='datePicker-user' onChange={(date, dateString) => handleChangeDateBirth(dateString)} /></p>
          </div>
          <div className='input-update-identifyCard'>
            <p>CMND: <input
              className='input-update'
              type='number'
              placeholder=""
              value={userInfor.identifyCard}
              name="identifyCard"
              onChange={getInforUser}
            /></p>
            <p>Ngày cấp:
            <DatePicker defaultValue={moment(userInfor.dateOfIssue, dateFormat)} format={dateFormat} className='datePicker-user' onChange={(date, dateString) => handleChangeDateOfIssue(dateString)} />
            </p>
            <p style={{ width: "33%" }}>Nơi cấp: <input
              className='input-update'
              style={{ width: '100%' }}
              placeholder=""
              value={userInfor.placeOfIssue}
              name="name"
              onChange={getInforUser}
            /></p>
          </div>
          <p>Địa chỉ: <span className='detail-user'>{address}</span></p>
        </Row>
        <div className='btn-update-gr'><Button onClick={submitUpdate} type='link'>Update</Button>
          <Button onClick={() => props.switchEdit(false)} type='link'>Back</Button></div>
        {/* <Icon type="edit" style={{ fontSize: '24px' }} theme="filled" onClick={() => switchEdit(true)} className='edit-user' /> */}
      </div>
    </Col>
    // <Row>
    //   <Col md={16}>
    //     <p>thông tin tài khoản</p>
    //     <p>Email: {email}</p>
    //     <span>
    //       số điện thoại{" "}
    //       <Input
    //         placeholder=""
    //         value={userInfor.sdt}
    //         name="sdt"
    //         onChange={getInforUser}
    //       />
    //     </span>

    //     <p>Trang thai: {status}</p>
    //     <p>Thông tin cá nhân</p>
    //     <span>
    //       userName{" "}
    //       <Input
    //         placeholder=""
    //         value={userInfor.name}
    //         name="name"
    //         onChange={getInforUser}
    //       />
    //     </span>

    //     <span>
    //       gender
    //       <Input
    //         placeholder=""
    //         value={userInfor.gender}
    //         name="gender"
    //         onChange={getInforUser}
    //       />
    //     </span>
    //     <span>
    //       ngày sinh
    //       <Input
    //         placeholder=""
    //         value={userInfor.dateBirth}
    //         name="dateBirth"
    //         onChange={getInforUser}
    //       />
    //     </span>
    //     <p>cmnd: {identifyCard}</p>
    //     <p>ngày cấp:{dateOfIssue}</p>
    //     <p>noi cap:{placeOfIssue}</p>
    //     <Button onClick={submitUpdate}>Update</Button>
    //     <Button onClick={() => props.switchEdit(false)}>Back</Button>
    //   </Col>
    // </Row>
  );
}
export default UpdateInforUser;
