import React, { useState, useEffect } from "react";
import { Button, Row, Col, Icon, Radio, Tabs, Modal } from "antd";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { getDetailEvent } from "../../../../../utils/query/promotion";
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
  const [demo, setDemo] = useState("");
  const promoId = query.get("id");
  const showConfirm = () => {
    confirm({
      title: "Chỉnh sửa khuyến mãi",
      content: (
        <div>
          <p> - Hệ thống chỉ cho phép cập nhật khuyến mãi khi chưa phát sinh giao
          dịch có khuyến mãi
          </p>
          <p>
            - Nếu chương trình khuyến mãi chưa phát sinh giao dịch nào có thể
            sửa được toàn bộ
          </p>
          <p>
            - Nếu chương trình khuyến mãi đã phát sinh giao dịch thì có thể sửa
            1 số thông tin nhưng không thay đổi được hình thưc khuyến mãi
          </p>
            <p>+ Các tt có thể sửa: Tên chương trình, trạng thái, thời gian áp dụng</p>
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
  useQuery(getDetailEvent(promoId), {
    onCompleted: data => {
      dispatchDetailPromoAndEvent(data.listEvents[0]);
      setDemo(JSON.parse(data.listEvents[0].config));
    }
  });
  const { name, status, eventTime, config } = props.detailPromo;
  return (
    <>
      {isUpdate ? (
        <UpdateEvent isUpdate={isUpdate}/>
      ) : (
          <Row>
            <Link to="/payment/promotion">
              <span>
                <Icon type="arrow-left" style={{ paddingRight: ".2rem" }} />
              Quay lại
            </span>
            </Link>
            <div className="promo-title">
              <div className="promo-title-name">
                <h2>{name}</h2>
                <Button onClick={showConfirm}>Edit</Button>
              </div>
              <div>
                <h3 style={{ margin: "0 1rem 0 0" }}>Trạng thái</h3>
                <Radio.Group value={status}>
                  <Radio value="COMPLETE">Kích hoạt</Radio>
                  <Radio value="INPUT">Chưa áp dụng</Radio>
                </Radio.Group>
              </div>
            </div>
            <Tabs activeKey={isShowPromo} onChange={key => setIsShowPromo(key)}>
              <TabPane tab="Hình thức khuyến mãi" key="1">
                <TypeEvent demo={demo} />
              </TabPane>
              <TabPane tab="Thời gian áp dụng" key="2">
                <TimePromo />
              </TabPane>
              <TabPane tab="Lịch sử khuyến mãi" key="3"></TabPane>
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
