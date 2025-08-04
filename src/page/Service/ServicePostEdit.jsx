import React, {useEffect, useState} from 'react';
import {Button, Card, Col, Form, Row, Typography, Upload} from "antd";
import {AppLoader, FormInput, FormTextArea} from "../../components";
import {useSelector} from "react-redux";
import {EditGetById, onPreviewImage, SetInitialValue, SuccessCreateAndEdit} from "../../hooks";
import {useDeleteImagesQuery, useEditQuery, useGetByIdQuery, usePostQuery} from "../../service/query/Queries";
import {PlusOutlined} from "@ant-design/icons";

const {Title} = Typography

const initialValueForm = {
    icon: [],
    titleRu: "",
    textRu: "",

}


const imageInitial = {
    icon: [],
}


const ServicePostEdit = () => {
    const [form] = Form.useForm();
    const {editId} = useSelector(state => state.query)

    const [fileListProps, setFileListProps] = useState(imageInitial);
    const [isUpload, setIsUpload] = useState("")
    const [mainIndex, setMainIndex] = useState(null)
    // query-service
    const {
        mutate: postServiceMutate,
        isLoading: postServiceLoading,
        isSuccess: postServiceSuccess
    } = usePostQuery()
    // query-edit
    const {
        isLoading: editServiceLoading,
        data: editServiceData,
        refetch: editServiceRefetch,
        isSuccess: editServiceSuccess
    } = useGetByIdQuery(false, "edit-service", editId, '/service')
    // put-query
    const {
        mutate: putService,
        isLoading: putServiceLoading,
        isSuccess: putServiceSuccess
    } = useEditQuery()
    // post image
    const {
        mutate: imagesUploadMutate,
        isSuccess: imagesUploadSuccess,
        data: imagesUpload
    } = usePostQuery()

    //delete image
    const {mutate: imagesDeleteMutate} = useDeleteImagesQuery()
    // ================================ useEffect =============================

    // service success
    SuccessCreateAndEdit(postServiceSuccess, putServiceSuccess, '/service')
    // if edit service
    EditGetById(editServiceRefetch)
    // if no edit service
    SetInitialValue(form, initialValueForm)


    //edit service
    useEffect(() => {
        if (editServiceSuccess) {
            const icon = [{
                uid: editServiceData?.icon?._id,
                name: editServiceData?.icon?.name,
                status: "done",
                url: `${process.env.REACT_APP_API_URL}/${editServiceData.icon.path}`
            }];




            const edit = {
                icon,
                titleRu: editServiceData.titleRu,
                textRu: editServiceData.textRu,

            }

            setFileListProps({
                icon
            })
            form.setFieldsValue(edit)
        }

    }, [editServiceData])

    const onFinish = (value) => {
        const getFileUid = (file) => (Array.isArray(file) ? file[0]?.uid : file?.uid);



        const data = {
            ...value,
            icon: getFileUid(fileListProps.icon)
        }

        if (editServiceData) {
            putService({url: '/service', data, id: editId})
        } else {
            postServiceMutate({url: "/service", data});
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
        if (name === 'icon') {
            form.setFieldValue({icon: value});
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


            if (mainIndex !== null) {
                initialImage[isUpload][mainIndex] = [uploadImg]
            } else {
                initialImage[isUpload].push(uploadImg)
            }
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
            if (index === null) {
                changeFieldValue(name, [])
                id = {
                    ids: [fileListProps[name][0]?.uid]
                };
                deleteImageFileProps[name] = []

            } else {
                changeFieldValue(name, [], index)

                id = {
                    ids: [fileListProps[name][index][0]?.uid]
                };
                deleteImageFileProps[name][index] = []
            }

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
        {(postServiceLoading || editServiceLoading || putServiceLoading) ?
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
                        <Form.Item
                            label='Изображение Icon '
                            name={'icon'}
                            rules={[{required: true, message: 'Требуется изображение'}]}>
                            <Upload
                                maxCount={1}
                                fileList={fileListProps?.icon}
                                listType='picture-card'
                                onChange={(file) => onChangeImage(file, 'icon', null)}
                                onPreview={onPreviewImage}
                                beforeUpload={() => false}
                            >
                                {fileListProps?.icon?.length > 0 ? "" : "Upload"}
                            </Upload>
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <FormInput
                            required={true}
                            required_text={'Требуется сервисе'}
                            label={'Название сервисе '}
                            name={'titleRu'}
                        />
                    </Col>

                    <Col span={24}>
                        <FormTextArea
                            required={true}
                            required_text={'Требуется описание'}
                            label={'Краткое описание'}
                            name={'textRu'}
                        />
                    </Col>


                </Row>





                <Button type="primary" htmlType="submit" style={{width: "100%", marginTop: "20px"}}>
                    {editServiceSuccess ? 'Изменить' : 'Создать'}
                </Button>
            </Form>}
    </div>);
};

export default ServicePostEdit;