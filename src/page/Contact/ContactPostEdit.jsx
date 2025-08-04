import React, {useEffect, useState} from 'react';
import {Button, Card, Col, Form, Row} from "antd";
import {AppLoader, FormInput, FormInputEmail, FormInputNumber} from "../../components";
import {useSelector} from "react-redux";
import {EditGetById, SetInitialValue, SuccessCreateAndEdit} from "../../hooks";
import {useEditQuery, useGetByIdQuery, usePostQuery} from "../../service/query/Queries";
import {LuMinusCircle} from "react-icons/lu";
import {MapContainer, Marker, TileLayer, useMap, useMapEvents} from "react-leaflet";
import {Icon} from "leaflet";

const cardStye = {border: 1, borderStyle: "dashed", borderColor: "black"}

const initialValueForm = {
    facebook: "",
    telegram: "",
    instagram: "",
    youtube: "",
    tel: [
        ""
    ],
    address: "",
    email: "",
    latlng:[],
}

function SetViewOnClick({ coords }) {
    const map = useMap();
    map.setView(coords, map.getZoom());

    return null;
}

const ContactPostEdit = () => {
    const [form] = Form.useForm();
    const {editId} = useSelector(state => state.query)
    const [position, setPosition] = useState([])
    const LocationMarker = () => {
        useMapEvents({
            click(e) {
                const latlng=[e.latlng.lat,e.latlng.lng]
                form.setFieldsValue({latlng})
                setPosition(latlng)
            },
        });

        return null;
    };
    const customIcon=new Icon({
        iconUrl:'/admin/location.png',
        iconSize:[25,25]
    })

    // query-contact-home
    const {
        mutate: postContactMutate,
        isLoading: postContactLoading,
        isSuccess: postContactSuccess
    } = usePostQuery()
    // query-edit
    const {
        isLoading: editContactLoading,
        data: editContactData,
        refetch: editContactRefetch,
        isSuccess: editContactSuccess
    } = useGetByIdQuery(false, "edit-contact", editId, '/contact')
    // put-query
    const {
        mutate: putContactHome,
        isLoading: putContactHomeLoading,
        isSuccess: putContactHomeSuccess
    } = useEditQuery()


    // ================================ useEffect =============================

    // contact-home success
    SuccessCreateAndEdit(postContactSuccess, putContactHomeSuccess, '/contact')
    // if edit contact-home
    EditGetById(editContactRefetch)
    // if no edit contact-home
    SetInitialValue(form, initialValueForm)


    //edit contact-home
    useEffect(() => {
        if (editContactSuccess) {

        const telNumber=editContactData.tel.map(item=>Number(item))

            const edit = {
                tel: telNumber,
                address: editContactData?.address,
                email: editContactData?.email,
                latlng:[editContactData.lat,editContactData.lng],
                instagram: editContactData.instagram.split('//')[1],
                youtube: editContactData.youtube.split('//')[1],
                facebook: editContactData.facebook.split('//')[1],
                telegram: editContactData.telegram.split('//')[1],
            }

            setPosition([Number(editContactData.lat),Number(editContactData.lng)])
            form.setFieldsValue(edit)
        }

    }, [editContactData])

    const onFinish = (value) => {
        const telString=value.tel.map(item=>`${item}`)
        const data={
            tel:telString,
            instagram:`https://${value.instagram}`,
            youtube:`https://${value.youtube}`,
            facebook:`https://${value.facebook}`,
            telegram:`https://${value.telegram}`,
            address:value.address,
            email:`${value?.email}`,
            lat:`${value.latlng[0]}`,
            lng:`${value.latlng[1]}`,
            location:value.location
        }


        if (editContactData) {
            putContactHome({url: '/contact', data, id: editId})
        } else {
            postContactMutate({url: "/contact", data});
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
        {(postContactLoading || editContactLoading || putContactHomeLoading) ?
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
                        <FormInput
                            required={true}
                            addonBefore={'https://'}

                            required_text={'Необходимо ввести учетную запись Facebook'}
                            label={'Аккаунт в Фэйсбуке'}
                            name={'facebook'}
                        />
                    </Col>
                    <Col span={12}>
                        <FormInput
                            required={true}
                            required_text={'Необходимо ввести учетную запись Youtube'}
                            label={'Аккаунт в Youtube'}
                            name={'youtube'}
                            addonBefore={'https://'}

                        />
                    </Col>
                    <Col span={12}>
                        <FormInput
                            required={true}
                            required_text={'Необходимо ввести учетную запись Instagram'}
                            label={'Аккаунт в Instagram'}
                            name={'instagram'}
                            addonBefore={'https://'}

                        />
                    </Col>
                    <Col span={12}>
                        <FormInput
                            required={true}
                            required_text={'Необходимо ввести учетную запись Telegram'}
                            label={'Аккаунт в Telegram'}
                            name={'telegram'}
                            addonBefore={'https://'}

                        />
                    </Col>

                    <Col span={12}>
                        <FormInput
                            required={true}
                            required_text={'Необходимо ввести адрес'}
                            label={'Введите адрес '}
                            name={'address'}
                        />
                    </Col>
                    <Col span={12}>

                        <FormInputEmail
                            required={true}
                            required_text={'Вам необходимо ввести электронную почту'}
                            label={'Электронная почта'}
                            name={'email'}
                        />
                    </Col>
                    <Col span={24}>

                    <Card bordered={true} style={cardStye}>
                        <Form.List name="tel">
                            {(fields, {add, remove}) => (
                                <>
                                    {fields.map((field,index) => (
                                        <Row gutter={16} key={field.key}>
                                            <Col span={24}>
                                                <FormInputNumber
                                                    required={true}
                                                    required_text={'Номер телефона вводить не обязательно'}
                                                    label="Введите номер телефона"
                                                    name={[field.name]}

                                                />

                                            </Col>
                                            {
                                                index> 0 && <Col span={24}>
                                                    <Button type="danger" onClick={() => remove(field.name)}>
                                                        <LuMinusCircle/> Remove List Item
                                                    </Button>
                                                </Col>
                                            }
                                        </Row>
                                    ))}

                                    <Form.Item>
                                        <Button type="dashed" block onClick={() => add()}>
                                            Add List Item
                                        </Button>
                                    </Form.Item>
                                </>
                            )}
                        </Form.List>
                    </Card>
                    </Col>
                    <Col span={24} style={{marginTop:20}}>
                        <MapContainer center={position.length>0 ? position:[41.315820, 69.244905]} zoom={5} scrollWheelZoom={true} className={"custom-cursor"}>
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <LocationMarker/>
                            <SetViewOnClick coords={position.length>0 ? position:[41.315820, 69.244905]}/>
                            {
                                position.length>0 && <Marker position={position} icon={customIcon}></Marker>
                            }


                        </MapContainer>
                        <Form.Item
                            label=""
                            name="latlng"
                            rules={[
                                {
                                    required: true,
                                    message: "Разметка карты обязательна"
                                }
                            ]}
                        >



                        </Form.Item>
                    </Col>

                </Row>


                <Button type="primary" htmlType="submit" style={{width: "100%", marginTop: "20px"}}>
                    {editContactSuccess ? 'Изменить' : 'Создать'}
                </Button>
            </Form>}
    </div>);
};

export default ContactPostEdit;