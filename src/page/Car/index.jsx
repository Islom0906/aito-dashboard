import {Button, Col, Row, Typography, Space, Spin, Input} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {editIdQuery} from "../../store/slice/querySlice";
import {useNavigate} from "react-router-dom";
import {useDeleteQuery, useGetQuery} from "../../service/query/Queries";
import CarTable from "./CarTable";

const {Title} = Typography


const Index = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    // delete
    const {mutate,isSuccess,isLoading:deleteLoading}=useDeleteQuery()
    // get
    const {data,isLoading:getBannerLoading,refetch}=useGetQuery(false,'car-get','/car/',false)


    const [search, setSearch] = useState([]);

    const [isSearch, setIsSearch] = useState(false);

    useEffect(() => {
        refetch()
    }, [isSuccess]);

    // delete
    const deleteHandle = (url, id) => {
        mutate({url, id});

    };

    // add
    const addArticle = () => {
        dispatch(editIdQuery(""));
        navigate('/car/add');
    };
    const searchFunc = (value) => {
        if (value === '') {
            setIsSearch(false);
        } else {
            setIsSearch(true);
        }
        const filterData = data?.filter(
            (data) => data.name.toLowerCase().includes(value.toLowerCase()));
        setSearch(filterData);
    };


    return (
        <div className={'site-space-compact-wrapper'}>
            <Space direction={'vertical'} size={"large"} style={{width: '100%'}}>
                <Row gutter={20}>
                    <Col span={24}>
                        <Title level={2}>
                            Машина
                        </Title>
                    </Col>
                    <Col span={16}>
                        <Input placeholder="Поиск" onChange={(e) => searchFunc(e.target.value)}/>
                    </Col>

                    <Col  span={8}>
                        <Button
                            type='primary'
                            icon={<PlusOutlined/>}
                            style={{width: '100%'}}
                            onClick={addArticle}>
                            Добавить
                        </Button>
                    </Col>

                </Row>
                <Spin
                    size='medium'
                    spinning={getBannerLoading || deleteLoading}>
                    <CarTable
                        data={isSearch ? search : data}
                        deleteHandle={deleteHandle}
                    />
                </Spin>
            </Space>
        </div>
    );
};

export default Index;

