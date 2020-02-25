import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Pagination,
  Input,
  Row,
  Col,
  Radio,
  DatePicker,
  Select,
  TimePicker
} from "antd";
import { useLazyQuery, useMutation, useQuery } from "@apollo/react-hooks";
import "../../../../static/style/promotion.css";
import EventByItems from "./byItem";
import { getPromotionType } from "../../../../utils/queryPaymentAndPromoType";
import { queryGetPlatform } from '../../../../utils/queryPlatform'
import { getListPartnerProducts } from "../../../../utils/queryPartnerProducts";
import { getListServer } from '../../../../utils/query/promotion'
const { Option } = Select;
const { RangePicker } = DatePicker;
const daily = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday"
];
function CreatePromotion() {
  const [indexPromo, setIndexPromo] = useState({
    namePromo: null,
    platformPromoId: "",
    server: '-Chọn server-',
    statusPromo: "COMPLETE",
    datesPromo: [],
    dailyPromo: null,
    startTime: "",
    endTime: "",
    time: [indexPromo.startTimte, indexPromo.endTime]
  });
  const [typePromo, setTypePromo] = useState({
    isTypePromo: 'ITEMS',
    promoType: [{ name: "" }],
    gamePromo: [{}],
    listServer: [{
      server: 0,
      serverName: "All server"
    }],
    listItems: [{
      productId: "",
      productName: ""
    }],
    byItems: {
      gamePromo: "",
      typePromo: "",
      serverPromo: ""
    },
    byEvent: {
      name: ""
    }
  });
  const { platformPromoId, statusPromo, datesPromo, dailyPromo, hourPromo, server } = indexPromo;
  const { isTypePromo, promoType, gamePromo, listItems, listServer } = typePromo;
  const [getPromoType,] = useLazyQuery(getPromotionType, {
    onCompleted: data => {
      setTypePromo({ ...typePromo, promoType: data.__type.enumValues })
    }
  });
  const [getPlatform] = useLazyQuery(queryGetPlatform, {
    onCompleted: data => {
      setTypePromo({ ...typePromo, gamePromo: data.listPartners })
    }
  })
  const { data } = useQuery(getListPartnerProducts(platformPromoId), {
    onCompleted: data => setTypePromo({ ...typePromo, listItems: data.listPartnerProducts })
  })
  const { data2 } = useQuery(getListServer(platformPromoId), {
    onCompleted: data => {
      setTypePromo({ ...typePromo, listServer: [...listServer, ...data.listPartnerServers] })
    }
  })
  useEffect(() => {
    getPromoType();
    getPlatform();
  }, [])
  const switchPromoAndEvent = (e) => {
    setTypePromo({ ...typePromo, isTypePromo: e.target.value })
    if (e.target.value === 'ITEMS') {
      getPromoType();
    } else if (e.target.value === 'EVENT') {
      console.log('demo')
    }

  }
  const handleChangePlatform = (e) => {
    setIndexPromo({ ...indexPromo, platformPromoId: e })
  }
  const setInfoPromo = e => {
    setIndexPromo({ ...indexPromo, [e.target.name]: e.target.value });
  };
  const handleChangeServer = e => {
    setIndexPromo({ ...indexPromo, server: e })
  };
  const onChangeDatePicker = (value, dateString) => {
    console.log("Selected Time: ", value);
    console.log("Formatted Selected Time: ", dateString);
  };
  const setTimePromo = (timeString, val) => {
    if (val === 'startTime') {
      console.log(timeString)
    } else {
      console.log(timeString, 'd')
    }
  }
  const onOkDatePicker = value => {
    console.log("onOk: ", value);
  };
  const handleChangeDaily = value => {
    setIndexPromo({ ...indexPromo, datesPromo: value })
  };
  const handleChangeDates = value => {
    setIndexPromo({ ...indexPromo, datesPromo: value })
  };
  const childrenDates = [];
  for (let i = 1; i <= 31; i++) {
    childrenDates.push(<Option key={i}>{i < 10 ? "0" + i : i}</Option>);
  }
  const childrenDaily = daily.map((val, index) => (
    <Option key={index}>{val}</Option>
  ));
  const printPromoType = typePromo.promoType.map((val, index) => (
    <Option value={val.name} key={index}>{val.name}</Option>
  ))
  const printPlatform = gamePromo.map((val, i) => (
    <Option value={val.partnerId} key={i}>{val.partnerName}</Option>
  ))
  const printListServer = listServer.map((val, index) => (
    <Option value={val.server} key={index}>{val.serverName}</Option>
  ))
  return (
    <Row className="container-promotion">
      <div className="title">
        <div>
          <span>quay lai</span>
          <h3>Thêm mới khuyến mãi</h3>
        </div>
      </div>
      <Col md={12} className="section1-promotion">
        <div>
          <div>
            <p className="promotion-title-field">Tên chương trình khuyến mãi</p>
            <Input
              placeholder="Vd: Chương trìn khuyến mãi mở server"
              onChange={setInfoPromo}
              name="namePromo"
            ></Input>
            <p
              className="promotion-title-field"
              style={{ paddingRight: ".5rem" }}
            >
              Trạng thái
            </p>
            <Radio.Group
              onChange={setInfoPromo}
              value={statusPromo}
              name="statusPromo"
            >
              <Radio value="COMPLETE">Kích hoạt</Radio>
              <Radio value="INPPUT">Chưa áp dụng</Radio>
            </Radio.Group>
            <p className="promotion-title-field">Hình thức khuyến mãi</p>
            <Radio.Group
              value={typePromo.isTypePromo}
              buttonStyle="solid"
              className="choose-promo"
              onChange={switchPromoAndEvent}
            >
              <Radio.Button value='EVENT' style={{ marginRight: "1%" }}>
                Khuyến mãi theo hóa đơn
              </Radio.Button>
              <Radio.Button value='ITEMS' style={{ marginLeft: "1%" }}>
                Khuyến mãi theo item
              </Radio.Button>
            </Radio.Group>
          </div>
          <div>
            <div>
              <p className="promotion-title-field">Chọn game</p>
              <Select
                style={{ width: 120 }}
                onChange={handleChangePlatform}
                placeholder="-Chọn game-"
              >
                {printPlatform}
              </Select>{" "}
              <span>Hình thức</span>
              <Select style={{ width: 120 }} >
                {printPromoType}
              </Select>{" "}
              <span>Server</span>
              <Select
                placeholder="-Chọn server-"
                style={{ width: 120 }}
                onChange={handleChangeServer}
                name="server"
                value={server}
              >
                {printListServer}
              </Select>{" "}
            </div>
          </div>
        </div>
      </Col>
      <Col md={12} className="section2-promotion">
        <div>
          <p className="promotion-title-field">Thời gian áp dụng </p>
          <div>
            Thời gian:{" "}
            <RangePicker
              showTime={{ format: "HH:mm" }}
              format="YYYY-MM-DD HH:mm"
              placeholder={["-Thời gian bắt đầu", "- Thời gian kết thúc"]}
              onChange={onChangeDatePicker}
              onOk={onOkDatePicker}
            />
          </div>
          <div>
            Theo ngày:{" "}
            <Select
              mode="multiple"
              style={{ width: "100%" }}
              placeholder="- Chọn ngày trong tháng diễn ra khuyến mãi"
              onChange={handleChangeDates}
            >
              {childrenDates}
            </Select>
          </div>
          <div>
            Theo thứ:{" "}
            <Select
              mode="multiple"
              style={{ width: "100%" }}
              placeholder="- Chọn thứ trong tuần diễn ra khuyến mãi"
              onChange={handleChangeDaily}
            >
              {childrenDaily}
            </Select>
          </div>
          <div>
            Theo giờ:
            <TimePicker format={"HH:mm"} placeholder="- Giờ bắt đầu" onChange={(timeString) => setTimePromo(timeString, 'startTime')} />
            <TimePicker format={"HH:mm"} placeholder="- Giờ kết thúc" onChange={(timeString) => setTimePromo(timeString, "endTime")} />
          </div>
        </div>
        <div>Khuyến mãi diễn ra từ ngày ... đến ngày ...</div>
      </Col>
      <Col md={24}>
        <Row>
          <Col md={12}>
            <span>Số lần</span>
            <span>Item mua</span>
          </Col>
          <Col md={12}>
            <span>Số lượng</span>
            <span>Tặng quà</span>
          </Col>
        </Row>
        <EventByItems listItems={listItems} />
      </Col>
    </Row>
  );
}
export default CreatePromotion;
