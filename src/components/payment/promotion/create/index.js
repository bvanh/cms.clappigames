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
import "../../../../static/style/promotion.css";
import EventByItems from "./byItem";
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
  const [indexShop, setIndexShop] = useState([
    {
      purchaseNumber: 1,
      purchaseItemId: null,
      purchaseIndex: 0,
      reward: [
        {
          rewardNumb: 1,
          rewardItemId: null,
          rewardIndex: 0
        }
      ]
    }
  ]);
  const { purchaseIndex, purchaseItemId, purchaseNumber } = indexShop;
  // const { rewardIndex, rewardItemId, rewardNumb } = indexReward;
  const getStatus = e => {
    console.log("radio checked", e.target.value);
    this.setState({
      value: e.target.value
    });
  };
  const handleChangeType = e => {
    console.log(e);
  };
  const onChangeDatePicker = (value, dateString) => {
    console.log("Selected Time: ", value);
    console.log("Formatted Selected Time: ", dateString);
  };

  const onOkDatePicker = value => {
    console.log("onOk: ", value);
  };
  const handleChangeDaily = value => {
    console.log(`selected ${value}`);
  };
  const handleChangeDates = value => {
    console.log(`selected ${value}`);
  };
  const addItem = val => {
    const newItem = {
      purchaseNumber: 1,
      purchaseItemId: null,
      purchaseIndex: val,
      reward: [
        {
          rewardNumb: 1,
          rewardItemId: null,
          rewardIndex: 0
        }
      ]
    };
    setIndexShop([...indexShop, newItem]);
  };
  const reduceItem = async val => {
    if (val !== 0) {
      const newItem = await indexShop.filter(
        (value, index) => value.purchaseIndex !== val
      );
      setIndexShop(newItem);
    }
  };
  const addReward = async (val, i) => {
    const newReward = {
      rewardNumb: 1,
      rewardItemId: null,
      rewardIndex: val
    };
    const newShop = [...indexShop];
    newShop[i].reward = [...newShop[i].reward, newReward];
    setIndexShop(newShop);
  };
  const reduceReward = async (val, numberItem) => {
    const newShop = [...indexShop];
    const newReward = await indexShop[numberItem].reward.filter(
      (value, i) => value.rewardIndex !== val
    );
    newShop[numberItem].reward = newReward;
    setIndexShop(newShop);
  };
  const handleChooseReward = (positionItem, positionReward, val) => {
    const newItem = [...indexShop];
    newItem[positionItem].reward[positionReward].rewardItemId = val;
    setIndexShop(newItem);
  };
  const handleChooseNumbReward = (positionItem, positionReward, e) => {
    const newItem = [...indexShop];
    newItem[positionItem].reward[positionReward].rewardNumb = e.target.value;
    setIndexShop(newItem);
  };
  const handleChooseItem = (positionItem, value) => {
    const newItem = [...indexShop];
    newItem[positionItem].purchaseItemId = value;
    setIndexShop(newItem);
  };
  const handleChooseNumbItem = (positionItem, e) => {
    const newItem = [...indexShop];
    newItem[positionItem].purchaseNumber = e.target.value;
    setIndexShop(newItem);
  };
  const childrenDates = [];
  for (let i = 1; i <= 31; i++) {
    childrenDates.push(<Option key={i}>{i < 10 ? "0" + i : i}</Option>);
  }
  const childrenDaily = daily.map((val, index) => (
    <Option key={index}>{val}</Option>
  ));
  return (
    <Row className="container-promotion">
      <div className="title">
        <div>
          <span>quay lai</span>
          <h3>Thêm mới khuyến mãi</h3>
        </div>
        <div>
          <Button>Hủy</Button>
          <Button>Tạo khuyến mãi</Button>
        </div>
      </div>
      <Col md={12} className="section1-promotion">
        <div>
          <div>
            <p className="promotion-title-field">Tên chương trình khuyến mãi</p>
            <Input placeholder="Vd: Chương trìn khuyến mãi mở server"></Input>
            <p className="promotion-title-field">
              <span style={{paddingRight:'.5rem'}}>Trạng thái</span>
              <Radio.Group onChange={getStatus} value={1}>
                <Radio value={1}>Kích hoạt</Radio>
                <Radio value={2}>Chưa áp dụng</Radio>
              </Radio.Group>
            </p>
            <p className="promotion-title-field">Hình thức khuyến mãi</p>
            <Radio.Group defaultValue="a" buttonStyle="solid" className='choose-promo'>
              <Radio.Button value="a" style={{marginRight:"1%"}}>Khuyến mãi theo hóa đơn</Radio.Button>
              <Radio.Button value="b" style={{marginLeft:"1%"}}>Khuyến mãi theo item</Radio.Button>
            </Radio.Group>
          </div>
          <div>
            <div>
              <span>Chọn loại hóa đơn</span>
              <Select
                defaultValue="lucy"
                style={{ width: 120 }}
                onChange={handleChangeType}
              >
                <Option value="jack">VNĐ</Option>
                <Option value="lucy">COIN</Option>
              </Select>{" "}
              <span>Hình thức</span>
              <Select
                defaultValue="lucy"
                style={{ width: 120 }}
                onChange={handleChangeType}
              >
                <Option value="jack">Tặng C.coin</Option>
                <Option value="lucy">COIN</Option>
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
            <TimePicker format={"HH:mm"} placeholder="- Giờ bắt đầu" />
            <TimePicker format={"HH:mm"} placeholder="- Giờ kết thúc" />
          </div>
        </div>
        <div>Khuyến mãi diễn ra từ ngày ... đến ngày ...</div>
      </Col>

      <Row>
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

          <EventByItems
            indexShop={indexShop}
            handleChooseItem={handleChooseItem}
            handleChooseNumbItem={handleChooseNumbItem}
            handleChooseReward={handleChooseReward}
            handleChooseNumbReward={handleChooseNumbReward}
            addItem={addItem}
            reduceItem={reduceItem}
            addReward={addReward}
            reduceReward={reduceReward}
          />
        </Col>
      </Row>
    </Row>
  );
}
export default CreatePromotion;
