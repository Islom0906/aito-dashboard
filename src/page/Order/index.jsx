import {Button, Col, Row, Typography, Space, Spin, Input} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {editIdQuery} from "../../store/slice/querySlice";
import {useNavigate} from "react-router-dom";
import {useDeleteQuery, useGetQuery} from "../../service/query/Queries";
import OrderTable from "./OrderTable";

const {Title} = Typography


const Index = () => {
    // get
    const {data,isLoading:getBannerLoading,refetch}=useGetQuery(false,'order-get','/order',false)


    const [search, setSearch] = useState([]);

    const [isSearch, setIsSearch] = useState(false);
    useEffect(() => {
        refetch()
    }, []);






    const searchFunc = (value) => {
        if (value === '') {
            setIsSearch(false);
        } else {
            setIsSearch(true);
        }
        const filterData = data?.filter(
            (data) => data.userName.toLowerCase().includes(value.toLowerCase()));
        setSearch(filterData);
    };


    return (
        <div className={'site-space-compact-wrapper'}>
            <Space direction={'vertical'} size={"large"} style={{width: '100%'}}>
                <Row gutter={20}>
                    <Col span={24}>
                        <Title level={2}>
                            Заказы
                        </Title>
                    </Col>
                    <Col span={24}>
                        <Input placeholder="Поиск" onChange={(e) => searchFunc(e.target.value)}/>
                    </Col>



                </Row>
                <Spin
                    size='medium'
                    spinning={getBannerLoading }>
                    <OrderTable
                        data={isSearch ? search : data}
                    />
                </Spin>
            </Space>
        </div>
    );
};

export default Index;

