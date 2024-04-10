const Home = () => import("@/views/Home");
const Recharge = () => import("@/views/Recharge");
const Detailslist = () => import("@/views/DetailsList");
const Buyvip = () => import("@/views/Buyvip");
const SelectBuyType = () => import("@/views/SelectbuyType");
const ChatList = () => import("@/views/ChatList");
const Chat = () => import("@/views/Chat");
const TaskCenter = () => import("@/views/TaskCenter");
const Exchange = () => import("@/views/Exchange");
const ExchangeList = () => import("@/views/ExDetailsList");
const AigfWallet = () => import("@/views/AigfWallet");
const Withdraw = () => import("@/views/Withdraw");
const routes = [
    {
        path: "/",
        redirect: {
            name: "chatList",
        },
    },
    {
        path: "/home",
        name: "home",
        component: Home,
    },
    {
        path: "/recharge",
        name: "recharge",
        component: Recharge,
    },
    {
        path: "/details-list",
        name: "details-list",
        component: Detailslist,
    },
    {
        path: "/buy-vip",
        name: "buy-vip",
        component: Buyvip,
    },
    {
        path: "/select-buytype",
        name: "select-buytype",
        component: SelectBuyType,
    },
    {
        path: "/chatList",
        name: "chatList",
        component: ChatList,
    },
    {
        path: "/chat",
        name: "chat",
        component: Chat,
    },
    {
        path: "/taskCenter",
        name: "taskCenter",
        component: TaskCenter,
    },
    {
        path: "/exchange",
        name: "exchange",
        component: Exchange,
    },
    {
        path: "/exchangeList",
        name: "exchangeList",
        component: ExchangeList,
    },
    {
        path: "/aigfWallet",
        name: "aigfWallet",
        component: AigfWallet,
    },
    {
        path: "/withdraw",
        name: "withdraw",
        component: Withdraw,
    },
];
export default routes;
