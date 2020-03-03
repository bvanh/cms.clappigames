import React, { useState, useEffect } from "react";
import { Table, Button, Pagination, Input } from "antd";
import { getListEventByType, getListPromotionByType } from "../../../../utils/query/promotion";
import { useLazyQuery, useQuery } from "@apollo/react-hooks";
import ListPromo from './listPromo'
import { Link } from "react-router-dom";
import "../../../../static/style/listUsers.css";

function ListPromoAndEvent() {

  return (
    <div className="container-listUser">
      <div className="title">
        <h2>Quản lý khuyến mãi</h2>
        <div className="btn-search-users">
          {/* <Input onChange={e => getValueSearch(e)} />
          <Button onClick={onSearch}>Search</Button> */}
        </div>
      </div>
      <>
        <ListPromo />
      </>
    </div>
  );
}

export default ListPromoAndEvent;
