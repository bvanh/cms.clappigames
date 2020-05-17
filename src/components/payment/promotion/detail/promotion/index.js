import React, { useState, useEffect } from "react";
import { Button, Row, Col, Icon, Radio, Tabs, Modal } from "antd";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { getDetailPromotion } from "../../../../../utils/query/promotion";
import TypePromo from "./typePromo";
import TimePromo from "../timePromo";
import UpdatePromotion from "../../update/promotion/index";
import { dispatchDetailPromoAndEvent } from "../../../../../redux/actions/index";
import { useQuery } from "react-apollo";
import {alertErrorServer} from '../../../../../utils/alertErrorAll'

const { TabPane } = Tabs;
const { confirm } = Modal;

function DetailPromotion(props) {
  const query = new URLSearchParams(window.location.search);
  const [isShowPromo, setIsShowPromo] = useState("1");
  const [isUpdate, setIsUpdate] = useState(false);
  const promoId = query.get("id");
  const showConfirm = () => {
    confirm({
      title: "Confirm edit promotion ?",
      content: (
        <div>
          <p>
          - System allow to update information of promotion when promotion don't have any purchase 
          </p>
          <p>
          - If in promotion actived and doesn't have any purchase, you can update conditions, name of promotion and timeline, status
          </p>
          <p>
          - Other way, if Promotion have purchase, just update name of promotion, status, timeline
          </p>
        </div>
      ),
      onOk() {
        setIsUpdate(true);
      },
      onCancel() {
        console.log("Cancel");
      }
    });
  };
  const { refetch } = useQuery(getDetailPromotion(promoId), {
    fetchPolicy: "cache-and-network",
    onCompleted: data => {
      console.log(data.listPromotions[0])
      dispatchDetailPromoAndEvent(data.listPromotions[0]);
    },
    onError: (index) =>
      alertErrorServer(index.message)
  });
  const backToDetail = () => {
    setIsUpdate(false);
    refetch();
  }
  const { name, status, eventTime, type, shop } = props.detailPromo;
  return (
    <>
      {isUpdate ? (
        <UpdatePromotion isUpdate={isUpdate} backToDetail={backToDetail} />
      ) : (
          <Row>
            <Link to="/payment/promotion">
              <span>
                <Icon type="arrow-left" style={{ paddingRight: ".2rem" }} />
              Back
            </span>
            </Link>
            <div className="promo-title">
              <div className="promo-title-name">
                <h2>{name}</h2>
                <Button onClick={showConfirm}>Edit</Button>
              </div>
              <div>
                <h3 style={{ margin: "0 1rem 0 0" }}>Status</h3>
                <Radio.Group value={status}>
                  <Radio value="COMPLETE">Active</Radio>
                  <Radio value="INPUT">Plan</Radio>
                </Radio.Group>
              </div>
            </div>
            <Tabs activeKey={isShowPromo} onChange={key => setIsShowPromo(key)}>
              <TabPane tab="Method" key="1">
                <TypePromo />
              </TabPane>
              <TabPane tab="Timeline" key="2">
                <TimePromo />
              </TabPane>
              <TabPane tab="History of purchase in Promotion" key="3"></TabPane>
            </Tabs>
          </Row>
        )}
    </>
  );
}

function mapStateToProps(state) {
  return {
    detailPromo: state.detailPromo
  };
}
export default connect(mapStateToProps, null)(DetailPromotion);
