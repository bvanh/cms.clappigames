import React, { useState, useEffect } from "react";
import { Button, Row, Col, Icon, Radio, Tabs } from "antd";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { getDetailPromotion } from "../../../../utils/query/promotion";
import TypePromo from "./typePromo";
import TimePromo from "./timePromo";
import {
  dispatchDeatilPromo,
  dispatchDetailPromo
} from "../../../../redux/actions/index";
import { useQuery } from "react-apollo";

const { TabPane } = Tabs;
function DetailPromotion(props) {
  const query = new URLSearchParams(window.location.search);
  const promoId = query.get("id");
  useQuery(getDetailPromotion(promoId), {
    onCompleted: data => {
      dispatchDetailPromo(data.listPromotions[0]);
    }
  });
  const { name, status, eventTime, type, shop } = props.detailPromo;
  return (
    <Row>
      <Link to="/payment/promotion">
        <span>
          <Icon type="arrow-left" style={{ paddingRight: ".2rem" }} />
          Quay lại
        </span>
      </Link>
      <div className="promo-title">
        <h2>{name}</h2>
        <div>
          <h3 style={{ margin: "0 1rem 0 0" }}>Trạng thái</h3>
          <Radio.Group value={status}>
            <Radio value="COMPLETE">Kích hoạt</Radio>
            <Radio value="INPUT">Chưa áp dụng</Radio>
          </Radio.Group>
        </div>
      </div>
      <Tabs activeKey="2">
        <TabPane tab="Hình thức khuyến mãi" key="1">
          <TypePromo />
        </TabPane>
        <TabPane tab="Thời gian áp dụng" key="2">
          <TimePromo />
        </TabPane>
        <TabPane tab="Lịch sử khuyến mãi" key="3"></TabPane>
      </Tabs>
    </Row>
  );
}

function mapStateToProps(state) {
  return {
    detailPromo: state.detailPromo
  };
}
export default connect(mapStateToProps, null)(DetailPromotion);
