import {
    Contact,
    ContactPostEdit,
    NewsPostEdit,
    TgBot,
    TgBotPostEdit,
    News,
    AboutPostEdit,
    About,
    Service,
    ServicePostEdit,
    CarPostEdit,
    Banner,
    BannerPostEdit,
    PositionPostEdit,
    Position,
    Exterior,
    ExteriorPostEdit, InteriorPostEdit, Interior, Questions, MapPostEdit, Map, Counter, CounterPostEdit
} from "./index";
import {BiNews} from "react-icons/bi";
import {TiContacts} from "react-icons/ti";
import {RiLockPasswordFill, RiMapPinLine} from "react-icons/ri";
import {IoMdInformationCircle} from "react-icons/io";
import {FaCar, FaImages, FaShoppingCart} from "react-icons/fa";
import Car from "./Car";

import {FaCarOn, FaCarTunnel} from "react-icons/fa6";
import {MdOutlineFormatListBulleted, MdOutlineMiscellaneousServices} from "react-icons/md";
import {CiSquareQuestion} from "react-icons/ci";
import {HiOutlineChartBar} from "react-icons/hi";
import Order from "./Order";


// export const authRole = {
//     admin: 'admin',
//     boss: 'boss',
//     user: 'user'
// }




export const samplePagesConfigs = [
    {
        key: 1,
        label: 'Car',
        icon: <FaCar className={'icon'} style={{fontSize: 22, height: '100%'}}/>,
        path: '/car',
        element: Car,
        permittedRole: ["admin"],
        isBackground: true
    },
    {
        path: '/car/add',
        element: CarPostEdit,
        permittedRole: ["admin"],
        isBackground: true,
        noIndex: true
    },

    {
        key: 3,
        label: 'Наши показатели',
        icon: <HiOutlineChartBar className={'icon'} style={{fontSize: 22, height: '100%'}}/>,
        path: '/counter',
        element: Counter,
        permittedRole: ["admin"],
        isBackground: true
    },
    {
        path: '/counter/add',
        element: CounterPostEdit,
        permittedRole: ["admin"],
        isBackground: true,
        noIndex: true
    },
    {
        key: 4,
        label: 'Дилерский центр',
        icon: <RiMapPinLine className={'icon'} style={{fontSize: 22, height: '100%'}}/>,
        path: '/map',
        element: Map,
        permittedRole: ["admin"],
        isBackground: true
    },
    {
        path: '/map/add',
        element: MapPostEdit,
        permittedRole: ["admin"],
        isBackground: true,
        noIndex: true
    },
    {
        key: 5,
        label: 'Новости',
        icon: <BiNews className={'icon'} style={{fontSize: 22, height: '100%'}}/>,
        path: '/news',
        element: News,
        permittedRole: ["admin"],
        isBackground: true
    },
    {
        path: '/news/add',
        element: NewsPostEdit,
        permittedRole: ["admin"],
        isBackground: true,
        noIndex: true
    },
    {
        key: 6,
        label: 'Сервисе',
        icon: <MdOutlineMiscellaneousServices className={'icon'} style={{fontSize: 22, height: '100%'}}/>,
        path: '/service',
        element: Service,
        permittedRole: ["admin"],
        isBackground: true
    },
    {
        path: '/service/add',
        element: ServicePostEdit,
        permittedRole: ["admin"],
        isBackground: true,
        noIndex: true
    },
    {
        key: 7,
        label: 'Баннер',
        icon: <FaImages className={'icon'} style={{fontSize: 22, height: '100%'}}/>,
        path: '/banner',
        element: Banner,
        permittedRole: ["admin"],
        isBackground: true
    },
    {
        path: '/banner/add',
        element: BannerPostEdit,
        permittedRole: ["admin"],
        isBackground: true,
        noIndex: true
    },
    {
        key: 8,
        label: 'Контакт',
        icon: <TiContacts className={'icon'} style={{fontSize: 22, height: '100%'}}/>,
        path: '/contact',
        element: Contact,
        permittedRole: ["admin"],
        isBackground: true
    },
    {
        path: '/contact/add',
        element: ContactPostEdit,
        permittedRole: ["admin"],
        isBackground: true,
        noIndex: true
    },
    {
        key: 9,
        label: 'About',
        icon: <IoMdInformationCircle className={'icon'} style={{fontSize: 22, height: '100%'}}/>,
        path: '/about',
        element: About,
        permittedRole: ["admin"],
        isBackground: true
    },
    {
        path: '/about/add',
        element: AboutPostEdit,
        permittedRole: ["admin"],
        isBackground: true,
        noIndex: true
    },
    {
        key: 10,
        label: 'Разрешение Telegram-бота',
        icon: <RiLockPasswordFill className={'icon'} style={{fontSize: 22, height: '100%'}}/>,
        path: '/tg-bot',
        element: TgBot,
        permittedRole: ["admin"],
        isBackground: true
    },
    {
        path: '/tg-bot/add',
        element: TgBotPostEdit,
        permittedRole: ["admin"],
        isBackground: true,
        noIndex: true
    },
    {
        key: 12,
        label: 'Заказ',
        icon: <FaShoppingCart className={'icon'} style={{fontSize: 22, height: '100%'}}/>,
        path: '/order',
        element: Order,
        permittedRole: ["admin"],
        isBackground: true
    },


];