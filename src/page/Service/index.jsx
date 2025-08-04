import {Button, Col,  Row, Typography, Space, Spin} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import ServiceTable from "./ServiceTable";
import {useEffect} from "react";
import {useDispatch} from "react-redux";
import {editIdQuery} from "../../store/slice/querySlice";
import {useNavigate} from "react-router-dom";
import {useDeleteQuery, useGetQuery} from "../../service/query/Queries";

const {Title} = Typography


const Service = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const {mutate,isSuccess,isLoading:deleteLoading}=useDeleteQuery()

    // get
    const {data,isLoading:getBannerLoading,refetch}=useGetQuery(false,'service-get','/service/',false)




    useEffect(() => {
        refetch()
    }, [isSuccess]);
    const deleteHandle = (url, id) => {
        mutate({url, id});

    };


    // add
    const addArticle = () => {
        dispatch(editIdQuery(""));
        navigate('/service/add');
    };


    return (
        <div className={'site-space-compact-wrapper'}>
            <Space direction={'vertical'} size={"large"} style={{width: '100%'}}>
                <Row gutter={20}>
                    <Col span={24}>
                        <Title level={2}>
                            Сервисе
                        </Title>
                    </Col>

                    <Col offset={16} span={8}>
                        <Button
                            disabled={data?.length>3}
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
                    spinning={getBannerLoading }>
                    <ServiceTable
                        data={data}
                        deleteHandle={deleteHandle}
                    />
                </Spin>
            </Space>
        </div>
    );
};

export default Service;

