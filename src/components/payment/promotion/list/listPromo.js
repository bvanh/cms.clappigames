import React, { useState, useEffect } from "react";
import { Table, Button, Pagination, Input } from "antd";
import { getListEventByType, getListPromotionByType } from "../../../../utils/query/promotion";
import { useLazyQuery, useQuery } from "@apollo/react-hooks";
import { Link } from "react-router-dom";


function ListPromo() {
    const [pageIndex, setPageIndex] = useState({
        currentPage: 1,
        pageSize: 10,
        status: "",
        type: "",
        game: "",
        server: 0,
        name: ""
    });
    const [dataListPromo, setData] = useState(null);
    const { currentPage, pageSize, status, type, game, server, name } = pageIndex;
    const [getData, { loading, data }] = useLazyQuery(getListPromotionByType, {
        onCompleted: data => {
            // setData(data);
            console.log(data)
        }
    });
    useEffect(() => {
        getData({
            variables: {
                currentPage: currentPage,
                pageSize: pageSize,
                status: status,
                type: type,
                game: game,
                server: server,
                name: name
            }
        });
    }, []);
    const columns = [
        {
            title: "Chi tiết",
            dataIndex: "name"
        },
        {
            title: "Hình thức",
            dataIndex: "type"
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            render: index => <span>{index === 'INPUT' ? 'Ngừng hoạt động' : 'Hoạt động'}</span>
        },
        {
            title: "Total",
            dataIndex: ""
        },
        {
            title: "Bắt đầu",
            dataIndex: "eventTime",
            render: index => <span>{JSON.parse(index).startTime}</span>
        }
        ,
        {
            title: "Kết thức",
            dataIndex: "eventTime",
            render: index => <span>{JSON.parse(index).endTime}</span>
        }
    ];
    // const goPage = pageNumber => {
    //     setPageIndex({ ...pageIndex, currentPage: pageNumber });
    //     getData({
    //         variables: {
    //             currentPage: pageNumber,
    //             type: type,
    //             pageSize: pageSize,
    //             search: search
    //         }
    //     });
    // };
    // const getValueSearch = e => {
    //     setPageIndex({ ...pageIndex, search: e.target.value });
    // };
    // const onSearch = () => {
    //     getData({
    //         variables: {
    //             currentPage: currentPage,
    //             type: type,
    //             pageSize: pageSize,
    //             search: search
    //         }
    //     });
    // };
    if (loading) return "Loading...";
    return (
        <div>
            {dataListPromo && (
                <>
                    <Table
                        columns={columns}
                        dataSource={dataListPromo.listPromotionByType.rows}
                        pagination={false}
                    />
                    {/* <Pagination
                        current={pageIndex.currentPage}
                        total={dataUsers.listUsersByType.count}
                        pageSize={10}
                        onChange={goPage}
                        className="pagination-listUser"
                    /> */}
                </>
            )}
        </div>
    );
}

export default ListPromo;
