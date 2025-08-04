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
            title: 'Тип автомобиля',
            dataIndex: 'typeCar',
            id: 'typeCar',
            render: (text) => <p>{text}</p>,
        },
        {
            title: 'Проданный автомобиль',
            dataIndex: 'soldCar',
            id: 'soldCar',
            render: (text) => <p>{text}</p>,
        },
        {
            title: 'Количество автомобилей',
            dataIndex: 'countCar',
            id: 'countCar',
            render: (text) => <p>{text}</p>,
        },
        {
            title: 'Опыт работы',
            dataIndex: 'experience',
            id: 'experience',
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