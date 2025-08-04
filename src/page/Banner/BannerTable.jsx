import React from 'react';
import {Button, Image, Popconfirm, Space, Table} from "antd";
import {DeleteOutlined, EditOutlined} from "@ant-design/icons";
import {editIdQuery} from "../../store/slice/querySlice";
import {useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";

const BannerHomeTable = ({data,deleteHandle}) => {
    const navigate=useNavigate()
    const dispatch=useDispatch()
    const Delete = async (id) => {
        deleteHandle('/bannerHome',id)
    };


    const Edit = (id) => {
        localStorage.setItem('editDataId',id)
        dispatch(editIdQuery(id))
        navigate('/banner-home/add')
    };



    const columns = [

        {
            title: 'Изображение рабочего стола',
            dataIndex: 'bannerWeb',
            id: 'bannerWeb',
            render: (image) => {
                return image ? (
                    <Image
                        width={50}
                        height={50}
                        src={`${process.env.REACT_APP_API_URL}/${image.path}`}
                    />
                ) : (
                    <p>No Image</p>
                );
            },
        },
        {
            title: 'Изображение мобильное',
            dataIndex: 'bannerRes',
            id: 'bannerRes',
            render: (image) => {
                return image ? (
                    <Image
                        width={50}
                        height={50}
                        src={`${process.env.REACT_APP_API_URL}/${image.path}`}
                    />
                ) : (
                    <p>No Image</p>
                );
            },
        },
        {
            title: 'Видео',
            dataIndex: 'video',
            id: 'video',
            render: (video) => {
                return video ? (
                    <video width={100} controls>
                        <source
                            src={`${process.env.REACT_APP_API_URL}/${video.path}`}
                            type="video/mp4"
                        />
                        Your browser does not support the video tag.
                    </video>
                ) : (
                    <p>No Video</p>
                );
            },
        },
        {
            title: 'Событие',
            id: 'action',
            render: (_, record) => (
                <Space size={20}>
                    <Button
                        onClick={() => Edit(record._id)}
                        type='dashed'
                        icon={<EditOutlined />}
                    />
                    <Popconfirm
                        title={'Вы уверены, что хотите удалить это?'}
                        description={'Удалить'}
                        onConfirm={() => Delete(record._id)}>
                        <Button type='primary' danger icon={<DeleteOutlined />} />
                    </Popconfirm>
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

export default BannerHomeTable;