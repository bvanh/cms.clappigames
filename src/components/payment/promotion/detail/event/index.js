import React, { useState, useEffect } from "react";
import { Button, Row, Col, Icon, Radio, Tabs, Modal } from "antd";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { getDetailEvent } from "../../../../../utils/query/promotion";
import{ alertErrorServer} from '../../../../../utils/alertErrorAll'
import TypeEvent from "./typeEvent";
import TimePromo from "../timePromo";
import UpdateEvent from "../../update/event/index";
import { dispatchDetailPromoAndEvent } from "../../../../../redux/actions/index";
import { useQuery } from "react-apollo";
const { TabPane } = Tabs;
const { confirm } = Modal;

function DetailEvent(props) {
  const query = new URLSearchParams(window.location.search);
  const [isShowPromo, setIsShowPromo] = useState("1");
  const [isUpdate, setIsUpdate] = useState(false);
  const [dataDetail, setDataDetail] = useState("");
  const promoId = query.get("id");
  const showConfirm = () => {
    confirm({
      title: "Promotion edit?",
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
  const { refetch } = useQuery(getDetailEvent(promoId), {
    fetchPolicy:"cache-and-network",
    onCompleted: data => {
      dispatchDetailPromoAndEvent(data.listEvents[0]);
      setDataDetail(JSON.parse(data.listEvents[0].config));
    },
    onError: (index) =>
      alertErrorServer(index.message)
  });
  const backToDetail = () => {
    setIsUpdate(false);
    refetch();
  }
  const { name, status, eventTime, config } = props.detailPromo;
  return (
    <>
      {isUpdate ? (
        <UpdateEvent isUpdate={isUpdate} backToDetail={backToDetail} />
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
                <TypeEvent dataDetail={dataDetail} />
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
export default connect(mapStateToProps, null)(DetailEvent);
