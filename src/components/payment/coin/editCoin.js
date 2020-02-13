import React, { useState, useEffect } from "react";
import { Table, Button, Pagination, Input, Row, Col, Select } from "antd";
import { queryGetListCoin } from "../../../utils/queryCoin";
import { useLazyQuery } from "@apollo/react-hooks";
import { Link } from "react-router-dom";
import "../../../static/style/listProducts.css";

const { Option } = Select
function ListCoin() {
    const [dataProducts, setData] = useState(null);
    const getValueSearch = e => {
        setPageIndex({ ...pageIndex, search: e.target.value });
    };
    const onSearch = () => {
        getData({
            variables: {
                currentPage: currentPage,
                type: type,
                pageSize: pageSize
                // search: search
            }
        });
    };
    if (loading) return "Loading...";
    return (
        <Row>
            <div className="products-title">
                <div>
                    <h2>Update C.coin</h2>
                    <div>
                        <p>
                            <Button>Hủy</Button>
                            <Button>Lưu mới C.coin</Button>
                        </p>
                    </div>
                </div>
            </div>
        </Row>
    )
}

export default ListCoin;
