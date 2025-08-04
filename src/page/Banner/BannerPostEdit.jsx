import React, {useEffect, useMemo, useState} from 'react';
import {Button, Col, Form, message, Row, Select, Upload} from "antd";
import {AppLoader, FormInput} from "../../components";
import {useSelector} from "react-redux";
import {EditGetById, onPreviewImage, SetInitialValue, SuccessCreateAndEdit} from "../../hooks";
import {useDeleteImagesQuery, useEditQuery, useGetByIdQuery, usePostQuery} from "../../service/query/Queries";


const initialValueForm = {
    bannerWeb: [],
    bannerRes: [],
    video: [],

    isVideo:false
};

const BannerHomePostEdit = () => {
    const [form] = Form.useForm();
    const {editId} = useSelector(state => state.query)
    const [fileListPropsWeb, setFileListPropsWeb] = useState([]);
    const [fileListPropsRes, setFileListPropsRes] = useState([]);
    const [fileListPropsVideo, setFileListPropsVideo] = useState([]);
    const [isUpload, setIsUpload] = useState("")
    const [isVideo, setIsVideo] = useState(false)
    // query-banner-home
    const {
        mutate: postBannerHomeMutate,
        isLoading: postBannerHomeLoading,
        isSuccess: postBannerHomeSuccess
    } = usePostQuery()
    // query-edit
    const {
        isLoading: editBannerHomeLoading,
        data: editBannerHomeData,
        refetch: editBannerHomeRefetch,
        isSuccess: editBannerHomeSuccess
    } = useGetByIdQuery(false, "edit-banner-home", editId, '/bannerHome')
    // put-query
    const {
        mutate: putBannerHome,
        isLoading: putBannerHomeLoading,
        isSuccess: putBannerHomeSuccess
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

    // banner-home success
    SuccessCreateAndEdit(postBannerHomeSuccess, putBannerHomeSuccess, '/banner-home')
    // if edit banner-home
    EditGetById(editBannerHomeRefetch)
    // if no edit banner-home
    SetInitialValue(form, initialValueForm)


    //edit banner-home
    useEffect(() => {
        if (editBannerHomeSuccess) {
            const isVideoEdit = editBannerHomeData?.video ? true : false
            const bannerWeb = [{
                uid: editBannerHomeData?.bannerWeb?._id,
                name: editBannerHomeData?.bannerWeb?.name,
                status: "done",
                url: `${process.env.REACT_APP_API_URL}/${editBannerHomeData?.bannerWeb?.path}`
            }];
            const bannerRes = [{
                uid: editBannerHomeData?.bannerRes?._id,
                name: editBannerHomeData?.bannerRes?.name,
                status: "done",
                url: `${process.env.REACT_APP_API_URL}/${editBannerHomeData?.bannerRes?.path}`
            }];
            const video = [{
                uid: editBannerHomeData?.video?._id,
                name: editBannerHomeData?.video?.name,
                status: "done",
                url: `${process.env.REACT_APP_API_URL}/${editBannerHomeData?.video?.path}`
            }];

            if (isVideoEdit) {
                setIsVideo(true)
            }

            const edit = {
                bannerWeb: isVideoEdit ? [] : bannerWeb,
                bannerRes: isVideoEdit ? [] : bannerRes,
                video: isVideoEdit ? video : [],
            }


            setFileListPropsWeb(bannerWeb)
            setFileListPropsRes(bannerRes)
            setFileListPropsVideo(video)

            form.setFieldsValue(edit)
        }

    }, [editBannerHomeData])

    const onFinish = (value) => {

        const data={
            bannerWeb: isVideo ? null : fileListPropsWeb[0]?.uid,
            bannerRes: isVideo ? null : fileListPropsRes[0]?.uid,
            video: isVideo ? fileListPropsVideo[0]?.uid : null
        }


        if (editBannerHomeData) {
            putBannerHome({url: '/bannerHome', data, id: editId})
        } else {
            postBannerHomeMutate({url: "/bannerHome", data});
        }


    }


    // refresh page again get data
    useEffect(() => {
        const storedValues = JSON.parse(localStorage.getItem('myFormValues'));
        if (storedValues) {
            setFileListPropsWeb(storedValues.bannerWeb)
            setFileListPropsRes(storedValues.bannerRes)
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

    // image
    useEffect(() => {
        // images
        if (imagesUploadSuccess&&isUpload==='Web') {
            const initialImage = [...fileListPropsWeb]
            const uploadImg = {
                uid: imagesUpload[0]?._id,
                name: imagesUpload[0]?._id,
                status: "done",
                url: `${process.env.REACT_APP_API_URL}/${imagesUpload[0]?.path}`
            }
            initialImage.push(uploadImg)
            form.setFieldsValue({bannerWeb: [uploadImg]});
            setFileListPropsWeb(initialImage);
            setIsUpload("")
        }
        // main image
        if (imagesUploadSuccess&& isUpload==="Res") {
            const initialImage = [...fileListPropsRes]
            const uploadImg = {
                uid: imagesUpload[0]?._id,
                name: imagesUpload[0]?._id,
                status: "done",
                url: `${process.env.REACT_APP_API_URL}/${imagesUpload[0]?.path}`
            }
            initialImage.push(uploadImg)
            form.setFieldsValue({bannerRes: [uploadImg]});
            setFileListPropsRes(initialImage);
            setIsUpload("")
        }
        // video
        if (imagesUploadSuccess && isUpload === "video") {
            const initialImage = [...fileListPropsVideo]
            const uploadImg = {
                uid: imagesUpload[0]?._id,
                name: imagesUpload[0]?._id,
                status: "done",
                url: `${process.env.REACT_APP_API_URL}/${imagesUpload[0]?.path}`
            }
            initialImage.push(uploadImg)
            form.setFieldsValue({video: [uploadImg]});
            setFileListPropsVideo(initialImage);
            setIsUpload("")
        }
    }, [imagesUpload]);

    const onChangeImageWeb = ({fileList: newFileList}) => {
        const formData = new FormData();
        if (fileListPropsWeb.length !== 0 || newFileList.length === 0) {
            form.setFieldsValue({bannerWeb: []});
            const id = {
                ids:[fileListPropsWeb[0]?.uid]
            };

            imagesDeleteMutate({url: "/medias", id});
            setFileListPropsWeb([])
        } else if (newFileList.length !== 0) {
            formData.append("media", newFileList[0].originFileObj);
            imagesUploadMutate({url: "/medias", data: formData});
            setIsUpload("Web")
        }

    };
    const checkFormat = (file) => {
        const isValidFormat = [
            'image/jpeg',
            'image/png',
            'image/jpg',
            'image/svg+xml',
            'video/mp4',
            'application/pdf'
        ].includes(file.type);

        if (!isValidFormat) {
            message.error(` Iltimos faqat shu formatdagi fayl yuklang jpg, jpeg, png, or mp4 files.`);
            return Upload.LIST_IGNORE;
        }

        return true;  // Allow the file to be uploaded if valid
    }




    // res image
    const onChangeImageRes = ({fileList: newFileList}) => {
        const formData = new FormData();
        if (fileListPropsRes.length !== 0 || newFileList.length === 0) {
            form.setFieldsValue({bannerRes: []});
            const id = {
                ids:[fileListPropsRes[0]?.uid]
            };
            imagesDeleteMutate({url: "/medias", id});
            setFileListPropsRes([])
        } else if (newFileList.length !== 0) {
            formData.append("media", newFileList[0].originFileObj);
            imagesUploadMutate({url: "/medias", data: formData});
            setIsUpload("Res")
        }

    };

    // res image
    const onChangeImageVideo = ({fileList: newFileList}) => {
        const formData = new FormData();
        if (fileListPropsVideo.length !== 0 || newFileList.length === 0) {
            form.setFieldsValue({video: []});
            const id = {
                ids: [fileListPropsVideo[0]?.uid]
            };
            imagesDeleteMutate({url: "/medias", id});
            setFileListPropsVideo([])
        } else if (newFileList.length !== 0) {
            formData.append("media", newFileList[0].originFileObj);
            imagesUploadMutate({url: "/medias", data: formData});
            setIsUpload("video")
        }

    };

    const onChangeIsVideo = (value) => {
        setIsVideo(value)
    }


    const optionsIsVideo = useMemo(() => {

        return [
            {
                value: true,
                label: 'Видео',
            },
            {
                value: false,
                label: 'Изображение',
            },

        ]


    }, []);


    return (<div>
        {(postBannerHomeLoading || editBannerHomeLoading || putBannerHomeLoading) ?
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

                        <Form.Item
                            label={'Выберите медиафайл, который хотите загрузить.'}
                            name={'isVideo'}

                            rules={[{
                                required: true, message: 'Вы должны выбрать'
                            }]}
                            wrapperCol={{
                                span: 24,
                            }}
                        >
                            <Select
                                style={{
                                    width: '100%',
                                }}
                                placeholder='Выберите одну топливо'
                                optionLabelProp='label'
                                onChange={onChangeIsVideo}
                                options={optionsIsVideo}
                            />
                        </Form.Item>

                    </Col>
                    {
                        isVideo ?
                            <Col span={8}>
                                <Form.Item
                                    label='Видео'
                                    name={'video'}
                                    rules={[{required: true, message: 'Требуется видео'}]}>
                                    {/*<ImgCrop>*/}
                                    <Upload
                                        maxCount={1}
                                        fileList={fileListPropsVideo}
                                        listType='picture-card'
                                        onChange={onChangeImageVideo}
                                        onPreview={onPreviewImage}
                                        beforeUpload={(file) => checkFormat(file)}
                                    >
                                        {fileListPropsVideo.length > 0 ? "" : "Upload"}
                                    </Upload>
                                    {/*</ImgCrop>*/}
                                </Form.Item>
                            </Col>
                            :
                            <>
                                <Col span={8}>
                                    <Form.Item
                                        label='Изображение Web'
                                        name={'bannerWeb'}
                                        rules={[{required: true, message: 'Требуется изображение'}]}>
                                        {/*<ImgCrop>*/}
                                        <Upload
                                            maxCount={1}
                                            fileList={fileListPropsWeb}
                                            listType='picture-card'
                                            onChange={onChangeImageWeb}
                                            onPreview={onPreviewImage}
                                            beforeUpload={(file) => checkFormat(file)}
                                        >
                                            {fileListPropsWeb.length > 0 ? "" : "Upload"}
                                        </Upload>
                                        {/*</ImgCrop>*/}
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item
                                        label='Изображение Мобильный'
                                        name={'bannerRes'}
                                        rules={[{required: true, message: 'Требуется изображение'}]}>
                                        {/*<ImgCrop>*/}
                                        <Upload
                                            maxCount={1}
                                            fileList={fileListPropsRes}
                                            listType='picture-card'
                                            onChange={onChangeImageRes}
                                            onPreview={onPreviewImage}
                                            beforeUpload={(file) => checkFormat(file)}
                                        >
                                            {fileListPropsRes.length > 0 ? "" : "Upload"}
                                        </Upload>
                                        {/*</ImgCrop>*/}
                                    </Form.Item>
                                </Col>
                            </>
                    }


                </Row>


                <Button type="primary" htmlType="submit" style={{width: "100%", marginTop: "20px"}}>
                    {editBannerHomeSuccess ? 'Изменить' : 'Создать'}
                </Button>
            </Form>}
    </div>);
};

export default BannerHomePostEdit;