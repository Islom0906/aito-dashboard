import React from 'react';
import {Button, Image, Popconfirm, Space, Table} from "antd";
import {DeleteOutlined, EditOutlined} from "@ant-design/icons";
import {editIdQuery} from "../../store/slice/querySlice";
import {useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";

const OrderTable = ({data}) => {





    const columns = [
        {
            title: 'Имя клиента',
            dataIndex: 'userName',
            id: 'userName',
            render: (text) => <p>{text}</p>,
        },


        {
            title: 'Телефон клиента',
            dataIndex: 'phone',
            id: 'phone',
            render: (text) => <p>{text}</p>,
        },
        {
            title: 'Модель автомобиля',
            dataIndex: 'model',
            id: 'model',
            render: (text) => <p>{text}</p>,
        },

    ];
    return <Table
        columns={columns}
        dataSource={data}
        rowKey={(record) => record._id}
    />

};

export default OrderTable;