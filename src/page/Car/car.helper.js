import {useEffect} from "react";

export const changeFieldValue = (form, name, value, index) => {
    if (name === 'bannerWeb') {
        form.setFieldsValue({bannerWeb: [value]});
    } else if (name === 'bannerRes') {
        form.setFieldsValue({bannerRes: value});
    } else if (name === 'exteriorReviewBanner') {

        const getValueBrand = form.getFieldValue('exteriorReview')
        getValueBrand.bannerImage = value
        form.setFieldsValue({
            exteriorReview: {
                ...getValueBrand,
            }
        });
    } else if (name === 'exteriorReviewListImage') {

        const getValueBrand = form.getFieldValue('exteriorReview')
        getValueBrand.list[index].image = value
        form.setFieldsValue({
            exteriorReview: {
                ...getValueBrand,
            }
        });
    } else if (name === 'interiorReviewBanner') {

        const getValueBrand = form.getFieldValue('interiorReview')
        getValueBrand.bannerImage = value
        form.setFieldsValue({
            interiorReview: {
                ...getValueBrand,
            }
        });
    } else if (name === 'interiorReviewListImage') {

        const getValueBrand = form.getFieldValue('interiorReview')
        if (!getValueBrand.list.length){
            getValueBrand.list=[]
        }
        getValueBrand.list.push(value)
        form.setFieldsValue({
            interiorReview: {
                ...getValueBrand,
            }
        });
    } else if (name === 'technicalCharacterImage') {

        const getValueBrand = form.getFieldValue('technicalCharacter')
        getValueBrand[index].image = value
        form.setFieldsValue({
            technicalCharacter: [
                ...getValueBrand,
            ]
        });
    } else if (name === 'imageHome') {
        form.setFieldsValue({imageHome: value});
    } else if (name === 'gallery') {
        let getValueBrand = form.getFieldValue('gallery')
        if (!getValueBrand.length){
            getValueBrand=[]
        }
        getValueBrand.push(value)
        form.setFieldsValue({
            gallery: getValueBrand,
        });
    }
}

export const EditCar = (form, setFileListProps, editCarData, editCarSuccess) => {
    useEffect(() => {
        if (editCarSuccess) {
            const bannerWeb = [{
                uid: editCarData?.bannerWeb?._id,
                name: editCarData?.bannerWeb?.name,
                status: "done",
                url: `${process.env.REACT_APP_API_URL}/${editCarData?.bannerWeb?.path}`
            }];
            const bannerRes = [{
                uid: editCarData?.bannerRes?._id,
                name: editCarData?.bannerRes?.name,
                status: "done",
                url: `${process.env.REACT_APP_API_URL}/${editCarData.bannerRes?.path}`
            }];


            const exteriorReviewBanner = [{
                uid: editCarData?.exteriorReview?.bannerImage?._id,
                name: editCarData?.exteriorReview?.bannerImage?.name,
                status: "done",
                url: `${process.env.REACT_APP_API_URL}/${editCarData?.exteriorReview?.bannerImage?.path}`
            }];

            const exteriorReviewListImage = editCarData.exteriorReview.list.map(item => [{
                uid: item?.image?._id,
                name: item?.image?.name,
                status: "done",
                url: `${process.env.REACT_APP_API_URL}/${item?.image?.path}`
            }]);

            const interiorReviewBanner = [{
                uid: editCarData?.interiorReview?.bannerImage?._id,
                name: editCarData?.interiorReview?.bannerImage?.name,
                status: "done",
                url: `${process.env.REACT_APP_API_URL}/${editCarData?.interiorReview?.bannerImage?.path}`
            }];

            const interiorReviewListImage = editCarData.interiorReview.list.map(item => ({
                uid: item?._id,
                name: item?.name,
                status: "done",
                url: `${process.env.REACT_APP_API_URL}/${item?.path}`
            }));

            const gallery = editCarData.gallery.map(item => ({
                uid: item?._id,
                name: item?.name,
                status: "done",
                url: `${process.env.REACT_APP_API_URL}/${item?.path}`
            }));

            const technicalCharacterImage = editCarData.technicalCharacter.map(item => [{
                uid: item?.image?._id,
                name: item?.image?.name,
                status: "done",
                url: `${process.env.REACT_APP_API_URL}/${item?.image?.path}`
            }]);

            const imageHome = [{
                uid: editCarData?.imageHome?._id,
                name: editCarData?.imageHome?.name,
                status: "done",
                url: `${process.env.REACT_APP_API_URL}/${editCarData?.imageHome?.path}`
            }];

            console.log(gallery)

            const edit = {
                name: editCarData?.name,
                bannerWeb,
                bannerRes,
                character: editCarData?.character.map((item) => ({
                    keyRu: item.keyRu,
                    valueRu: item.valueRu,
                })),
                exteriorReview: {
                    textRu: editCarData?.exteriorReview.textRu,
                    bannerImage: exteriorReviewBanner,
                    list: editCarData?.exteriorReview.list.map((item, index) => ({
                        titleRu: item.titleRu,
                        textRu: item.textRu,
                        image: exteriorReviewListImage[index]
                    }))
                },
                interiorReview: {
                    titleRu: editCarData?.interiorReview.titleRu,
                    textRu: editCarData?.interiorReview.textRu,
                    bannerImage: interiorReviewBanner,
                    list:interiorReviewListImage
                },
                equipment: editCarData?.equipment.map(item => ({
                        textRu: item.textRu,
                })),
                technicalCharacter:editCarData?.technicalCharacter.map((item,index)=>{
                   return {
                       image:technicalCharacterImage[index],
                       titleRu: item.titleRu,
                       textRu:item.textRu,
                   }
                }),
                imageHome,
                gallery

            };
            setFileListProps({
                    bannerWeb,
                    bannerRes,
                    exteriorReviewBanner,
                    exteriorReviewListImage,
                    interiorReviewBanner,
                    interiorReviewListImage,
                    technicalCharacterImage,
                    imageHome,
                    gallery
                }
            );

            form.setFieldsValue(edit);
        }

    }, [editCarData])
}