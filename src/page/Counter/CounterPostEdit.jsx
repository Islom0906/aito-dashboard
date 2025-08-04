import React, {useEffect} from 'react';
import {Button, Col, Form, Row} from "antd";
import {AppLoader, FormInput, FormInputNumber} from "../../components";
import {useSelector} from "react-redux";
import {EditGetById, SetInitialValue, SuccessCreateAndEdit} from "../../hooks";
import {
    useEditQuery,
    useGetByIdQuery,
    usePostQuery
} from "../../service/query/Queries";


const initialValueForm = {
    saleYear: "",
    serviceCount: "",
    countCar: "",
    client: "",
};

const CounterPostEdit = () => {
    const [form] = Form.useForm();
    const {editId} = useSelector(state => state.query)
    // query-counter-home
    const {
        mutate: postCounterMutate,
        isLoading: postCounterLoading,
        isSuccess: postCounterSuccess
    } = usePostQuery()
    // query-edit
    const {
        isLoading: editCounterLoading,
        data: editCounterData,
        refetch: editCounterRefetch,
        isSuccess: editCounterSuccess
    } = useGetByIdQuery(false, "edit-counter", editId, '/counter')
    // put-query
    const {
        mutate: putCounterHome,
        isLoading: putCounterHomeLoading,
        isSuccess: putCounterHomeSuccess
    } = useEditQuery()


    // ================================ useEffect =============================

    // counter-home success
    SuccessCreateAndEdit(postCounterSuccess, putCounterHomeSuccess, '/counter')
    // if edit counter-home
    EditGetById(editCounterRefetch)
    // if no edit counter-home
    SetInitialValue(form, initialValueForm)


    //edit counter-home
    useEffect(() => {
        if (editCounterSuccess) {



            const edit = {
                saleYear: editCounterData?.saleYear,
                client: editCounterData.client,
                countCar: editCounterData.countCar,
                serviceCount: editCounterData.serviceCount
            }


            form.setFieldsValue(edit)
        }

    }, [editCounterData])

    const onFinish = (value) => {
        const data={
            saleYear:value?.saleYear,
            client:value.client,
            countCar:value.countCar,
            serviceCount:value.serviceCount
        }


        if (editCounterData) {
            putCounterHome({url: '/counter', data, id: editId})
        } else {
            postCounterMutate({url: "/counter", data});
        }


    }


    // refresh page again get data
    useEffect(() => {
        const storedValues = JSON.parse(localStorage.getItem('myFormValues'));
        if (storedValues) {
            form.setFieldsValue(storedValues);
        }

        const handleBeforeUnload = () => {

            localStorage.setItem(
                'myFormValues',
                JSON.stringify(form.getFieldsValue()),
            );
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            localStorage.removeItem('editDataId')
            localStorage.removeItem('myFormValues')
            window.removeEventListener('beforeunload', handleBeforeUnload);
        }
    }, []);










    return (<div>
        {(postCounterLoading || editCounterLoading || putCounterHomeLoading) ?
            <AppLoader/> :
            <Form
                form={form}
                name="basic"
                labelCol={{
                    span: 24
                }}
                wrapperCol={{
                    span: 24
                }}
                style={{
                    maxWidth: "100%"
                }}
                initialValues={initialValueForm}
                onFinish={onFinish}
                autoComplete="off"
            >
                <Row gutter={20}>
                    <Col span={12}>
                        <FormInputNumber
                            required={true}
                            required_text={'Вам необходимо ввести год продажи'}
                            label={'Год продажи'}
                            name={'saleYear'}
                        />
                    </Col>
                    <Col span={12}>
                        <FormInputNumber
                            required={true}
                            required_text={'Вам необходимо ввести количество обслуженных автомобилей'}
                            label={'Количество обслуженных автомобилей'}
                            name={'serviceCount'}
                        />
                    </Col>
                    <Col span={12}>
                        <FormInputNumber
                            required={true}
                            required_text={'Вам необходимо ввести количество автомобилей'}
                            label={'Количество автомобилей'}
                            name={'countCar'}
                        />
                    </Col>
                    <Col span={12}>
                        <FormInputNumber
                            required={true}
                            required_text={'Вам необходимо ввести количество клиентов'}
                            label={'Количество клиентов'}
                            name={'client'}
                        />
                    </Col>
                </Row>
                <Button type="primary" htmlType="submit" style={{width: "100%", marginTop: "20px"}}>
                    {editCounterSuccess ? 'Изменить' : 'Создать'}
                </Button>
            </Form>}
    </div>);
};

export default CounterPostEdit;