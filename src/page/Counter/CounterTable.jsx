import React from 'react';
import {Button, Image, Popconfirm, Space, Table} from "antd";
import {DeleteOutlined, EditOutlined} from "@ant-design/icons";
import {editIdQuery} from "../../store/slice/querySlice";
import {useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";

const CounterTable = ({data}) => {
    const navigate=useNavigate()
    const dispatch=useDispatch()



    const Edit = (id) => {
        localStorage.setItem('editDataId',id)
        dispatch(editIdQuery(id))
        navigate('/counter/add')
    };



    const columns = [
        {
            title: 'Год продажи',
            dataIndex: 'saleYear',
            id: 'saleYear',
            render: (text) => <p>{text}</p>,
        },
        {
            title: 'Количество обслуженных авто',
            dataIndex: 'serviceCount',
            id: 'serviceCount',
            render: (text) => <p>{text}</p>,
        },
        {
            title: 'Количество автомобилей',
            dataIndex: 'countCar',
            id: 'countCar',
            render: (text) => <p>{text}</p>,
        },
        {
            title: 'Количество разрешений',
            dataIndex: 'client',
            id: 'client',
            render: (text) => <p>{text}</p>,
        },
        {
            title: 'Событие',
            id: 'action',
            render: (_, record) => (
                <Space size={20}>
                    <Button
                        onClick={() => Edit(record._id)}
                        type='dashed'
                        out
                        icon={<EditOutlined />}/>

                </Space>
            ),
        },
    ];
    return <Table
            columns={columns}
            dataSource={data}
            rowKey={(record) => record._id}
        />

};

export default CounterTable;