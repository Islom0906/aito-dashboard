import React, {useEffect, useState} from 'react';
import {Button, Card, Col, Form, Row, Typography, Upload} from "antd";
import {AppLoader, FormInput, FormTextArea} from "../../components";
import {useSelector} from "react-redux";
import {EditGetById, onPreviewImage, SetInitialValue, SuccessCreateAndEdit} from "../../hooks";
import {useDeleteImagesQuery, useEditQuery, useGetByIdQuery, usePostQuery} from "../../service/query/Queries";
import {PlusOutlined} from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";

const {Title} = Typography

const initialValueForm = {
    image: [],
    bannerRes: [],
    textRu: "",
    values: [
        {
            value: "",

        }
    ],
    missionRu: "",

}


const imageInitial = {
    image: [],
}


const AboutPostEdit = () => {
    const [form] = Form.useForm();
    const {editId} = useSelector(state => state.query)

    const [fileListProps, setFileListProps] = useState(imageInitial);
    const [isUpload, setIsUpload] = useState("")
    const [mainIndex, setMainIndex] = useState(null)
    // query-about
    const {
        mutate: postAboutMutate,
        isLoading: postAboutLoading,
        isSuccess: postAboutSuccess
    } = usePostQuery()
    // query-edit
    const {
        isLoading: editAboutLoading,
        data: editAboutData,
        refetch: editAboutRefetch,
        isSuccess: editAboutSuccess
    } = useGetByIdQuery(false, "edit-about", editId, '/about')
    // put-query
    const {
        mutate: putAbout,
        isLoading: putAboutLoading,
        isSuccess: putAboutSuccess
    } = useEditQuery()
    // post image
    const {
        mutate: imagesUploadMutate,
        isSuccess: imagesUploadSuccess,
        isLoading: imagesUploadLoading,
        data: imagesUpload
    } = usePostQuery()

    //delete image
    const {mutate: imagesDeleteMutate} = useDeleteImagesQuery()
    // ================================ useEffect =============================

    // about success
    SuccessCreateAndEdit(postAboutSuccess, putAboutSuccess, '/about')
    // if edit about
    EditGetById(editAboutRefetch)
    // if no edit about
    SetInitialValue(form, initialValueForm)


    //edit about
    useEffect(() => {
        if (editAboutSuccess) {
            const image = [{
                uid: editAboutData?.image?._id,
                name: editAboutData?.image?.name,
                status: "done",
                url: `${process.env.REACT_APP_API_URL}/${editAboutData.image.path}`
            }];

            const values=editAboutData?.values?.map(item=>{
                return{
                    value: item.value,

                }
            })



            const edit = {
                image,
                textRu: editAboutData.textRu,
                values,
                missionRu: editAboutData.missionRu,

            }

            setFileListProps({
                image,

            })
            form.setFieldsValue(edit)
        }

    }, [editAboutData])

    const onFinish = (value) => {

        const data = {
            image: fileListProps['image'][0]?.uid,
            textRu: value.textRu,
            values:value.values,
            missionRu:value.missionRu,

        }

        if (editAboutData) {
            putAbout({url: '/about', data, id: editId})
        } else {
            postAboutMutate({url: "/about", data});
        }
    }


    // refresh page again get data
    useEffect(() => {


        const handleBeforeUnload = (event) => {
            event.preventDefault()

        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            localStorage.removeItem('editDataId')
            window.removeEventListener('beforeunload', handleBeforeUnload);
        }
    }, []);
    // image

    const changeFieldValue = (name, value, index) => {
        if (name === 'image') {
            form.setFieldValue({image: value});
        }
    }
    useEffect(() => {
        // images
        if (imagesUploadSuccess && isUpload) {
            const initialImage = {...fileListProps}
            const uploadImg = {
                uid: imagesUpload[0]?._id,
                name: imagesUpload[0]?._id,
                status: "done",
                url: `${process.env.REACT_APP_API_URL}/${imagesUpload[0]?.path}`
            }


                initialImage[isUpload].push(uploadImg)
            changeFieldValue(isUpload, [uploadImg], mainIndex)
            setFileListProps(initialImage);
            setIsUpload("")
            setMainIndex(null)
        }
    }, [imagesUpload]);

    const onChangeImage = ({fileList: newFileList}, name, index) => {
        const formData = new FormData();
        let id = {}
        const checkFileProps = index === null ? fileListProps[name]?.length : fileListProps[name][index]?.length
        if (checkFileProps || newFileList.length === 0) {
            const deleteImageFileProps = {...fileListProps}
                changeFieldValue(name, [])
                id = {
                    ids: [fileListProps[name][0]?.uid]
                };
                deleteImageFileProps[name] = []



            imagesDeleteMutate({url: "/medias", id});
            setFileListProps(deleteImageFileProps)
        } else if (newFileList.length !== 0) {
            formData.append("media", newFileList[0].originFileObj);
            imagesUploadMutate({url: "/medias", data: formData});
            setIsUpload(name)
            setMainIndex(index)
        }

    };



    return (<div>
        {(postAboutLoading || editAboutLoading || putAboutLoading) ?
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
                    <Col span={24}>

                    <Title level={3}>О Баннере</Title>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label='Изображение баннера на вебе'
                            name={'image'}
                            rules={[{required: true, message: 'Требуется изображение'}]}>
                            <Upload
                                maxCount={1}
                                fileList={fileListProps?.image}
                                listType='picture-card'
                                onChange={(file) => onChangeImage(file, 'image', null)}
                                onPreview={onPreviewImage}
                                beforeUpload={() => false}
                            >
                                {fileListProps?.image?.length > 0 ? "" : "Upload"}
                            </Upload>
                        </Form.Item>
                    </Col>

                    <Col span={24}>
                        <FormTextArea
                            required={true}
                            required_text={'Требуется описание'}
                            label={'Краткое описание '}
                            name={'textRu'}
                        />
                    </Col>

                    <Col span={24}>
                        <Card bordered={true} style={{border: 1, borderStyle: "dashed", borderColor: "black"}}>
                            <Form.List name="values">
                                {(fields, {add, remove}) => (
                                    <>
                                        {fields.map((field, index) => (
                                            <Row key={field.key} gutter={20}>

                                                <Col span={24}>
                                                    <FormInput
                                                        required={true}
                                                        required_text={'Требуется результат'}
                                                        label={`Результат ${index + 1} `}
                                                        name={[field.name, 'value']}
                                                    />
                                                </Col>

                                                <Col span={24}>
                                                    {index > 0 && (
                                                        <Button type="danger"
                                                                onClick={() => remove(field.name)}>
                                                            Удалить
                                                        </Button>
                                                    )}
                                                </Col>
                                            </Row>
                                        ))}
                                        <Form.Item>
                                            <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined/>}>
                                                Добавить значение бренда
                                            </Button>
                                        </Form.Item>
                                    </>
                                )}
                            </Form.List>
                        </Card>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={24} style={{marginTop:20}}>

                        <Title level={3}>Преимущества и подробности</Title>
                    </Col>
                    <Col span={24}>
                        <FormTextArea
                            required={true}
                            required_text={'Требуется'}
                            label={'Миссия '}
                            name={'missionRu'}
                        />
                    </Col>

                </Row>




                <Button type="primary" htmlType="submit" style={{width: "100%", marginTop: "20px"}}>
                    {editAboutSuccess ? 'Изменить' : 'Создать'}
                </Button>
            </Form>}
    </div>);
};

export default AboutPostEdit;