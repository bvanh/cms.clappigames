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
        console.log(newShop)
        // setIndexShop([indexShop[i]:]);
    };
    const reduceReward = async (val, numberItem) => {
        const newShop = [...indexShop];
        await newShop[numberItem].reward.filter(
            (itemRW, index) => itemRW.rewardIndex !== val
        );
        console.log(val,numberItem)
    };
    const childrenDates = [];
    for (let i = 1; i <= 31; i++) {
        childrenDates.push(<Option key={i}>{i < 10 ? "0" + i : i}</Option>);
    }
    const childrenDaily = daily.map((val, index) => (
        <Option key={index}>{val}</Option>
    ));
    const printItem = indexShop.map(function (val, index1) {
        const printReward = val.reward.map((valReward, index2) => (
            <div key={index2}>
                <Input
                    //   value={coin}
                    type="number"
                    max="10"
                    name="pucharseTimes"
                    //   onChange={getNewInfoItem}
                    style={{ width: "10%" }}
                ></Input>
                <Select
                    defaultValue="jack"
                    style={{ width: "60%" }}
                    onChange={handleChangeType}
                >
                    <Option value="jack">Item1</Option>
                    <Option value="lucy">COIN</Option>
                </Select>{" "}
                <span onClick={() => reduceReward(valReward.rewardIndex, index1)}>Delete</span>
            </div>
        ));
        return (
            <>
                <Col md={12}>
                    <Input
                        //   value={coin}
                        type="number"
                        max="10"
                        name="pucharseTimes"
                        //   onChange={getNewInfoItem}
                        style={{ width: "10%" }}
                    ></Input>
                    <Select
                        defaultValue="jack"
                        style={{ width: "90%" }}
                        onChange={handleChangeType}
                    >
                        <Option value="jack">Item1</Option>
                        <Option value="lucy">COIN</Option>
                    </Select>{" "}
                    <span onClick={() => reduceItem(val.purchaseIndex)}>xóa item</span>
                </Col>
                <Col md={12}>
                    {printReward}
                    <Button onClick={() => addReward(indexShop[index1].reward.length, index1)}>
                        Thêm quà
          </Button>
                </Col>
            </>
        );
    });
    return (
        <Row>
            <Col md={12}>
                <div>
                    <p>Tên chương trình khuyến mãi</p>
                    <Input placeholder="Vd: Chương trìn khuyến mãi mở server"></Input>
                    <div className="status-promotion">
                        Trạng thái
            <Radio.Group onChange={getStatus} value={1}>
                            <Radio value={1}>Kích hoạt</Radio>
                            <Radio value={2}>Chưa áp dụng</Radio>
                        </Radio.Group>
                    </div>
                    <p>Hình thức khuyến mãi</p>
                    <Radio.Group defaultValue="a" buttonStyle="solid">
                        <Radio.Button value="a">Khuyến mãi theo hóa đơn</Radio.Button>
                        <Radio.Button value="b">
                            Khuyến mãi theo hàng hóa (item){" "}
                        </Radio.Button>
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
            </Col>
            <Col md={12}>
                <div>
                    <p>Thời gian áp dụng </p>
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

                    <Row>
                        {printItem}
                        <Button onClick={() => addItem(indexShop.length)}>
                            Thêm điều kiện
            </Button>
                    </Row>
                </Col>
            </Row>
        </Row>
    );
}
export default CreatePromotion;
