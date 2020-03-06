import React, { useState, useEffect } from "react";
import { Table, Button, Pagination, Input, Radio } from "antd";
import { useLazyQuery, useQuery } from "@apollo/react-hooks";
import ListPromo from "./listPromo";
import ListEvents from "./listEvents";
import { Link } from "react-router-dom";
import {connect} from 'react-redux'
import CreatePromotion from "../create/index";
import {dispatchSwitchCreatePromo} from '../../../../redux/actions/index'
import "../../../../static/style/listUsers.css";

function ListPromoAndEvent(props) {
  const [isTypePromo, setisTypePromo] = useState("promo");
  // const [isCreatePromo, setIsCreatePromo] = useState(false);
  const switchPromoAndEvent = e => {
    setisTypePromo(e.target.value);
  };
  // const [getPlatform] = useLazyQuery(queryGetPlatform, {
  //   onCompleted: data => {
  //     setTypePromo({ ...typePromo, listGame: data.listPartners });
  //   }
  // });
  return (
    <>
      {props.isCreatePromo ? (
        <div className="container-listPromo">
          <div className="title">
            <h2>
              Quản lý khuyến mãi{" "}
              <Button size="small" onClick={() => dispatchSwitchCreatePromo(false)}>
                Tạo mới
              </Button>
            </h2>
          </div>
          <div>
            <Radio.Group
              value={isTypePromo}
              buttonStyle="solid"
              onChange={switchPromoAndEvent}
            >
              <Radio.Button
                value="promo"
                className="btn-switch-listPromo"
                style={{ marginRight: ".5rem" }}
              >
                Khuyến mãi theo hàng hóa (Item)
              </Radio.Button>
              <Radio.Button value="event" className="btn-switch-listPromo">
                Khuyến mãi theo hóa đơn (VNĐ)
              </Radio.Button>
            </Radio.Group>
          </div>
          {isTypePromo === "promo" ? (
            <ListPromo />
          ) : (
            <ListEvents isPromo={isTypePromo} />
          )}
        </div>
      ) : (
        <CreatePromotion />
      )}
    </>
  );
}
function mapStateToProps(state) {
  return {
    isCreatePromo:state.isCreatePromo
  };
}
export default connect(mapStateToProps, null)(ListPromoAndEvent);
