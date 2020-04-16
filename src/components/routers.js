import React from "react";
import Danhsach from "./users/listUsers";
import Detail from "./users/userDetail";
import NewsEditor from "./news/newsEdit";
import ListNews from "./news/index";
import AddNews from "./news/addnews";
import ListImages from "./media/index";
import Album from "./media/album/album";
import UpdateAlbum from "./media/album/update";
import CoinsContainer from "./payment/coin/index";
import ItemsContainer from "./payment/item/index";
import EditProductCoin from "./payment/coin/listCoin/editCoin";
import EditPartnerProductItem from "./payment/item/listPartnerProduct/editItems";
import CreatePromotion from "./payment/promotion/create/index";
import Stats from "./stats/index";
import Partner from "./partner/index";
import ListPromoAndEvent from "./payment/promotion/list/index";
import DetailPromotion from "./payment/promotion/detail/promotion/index";
import DetailEvent from "./payment/promotion/detail/event/index";
import ListChargesDetail from "./payment/coin/listCharges/detail";
import ListPartnerChargesDetail from "./payment/item/partnerCharges/detail";
import DetailListCoin from "./payment/coin/listCoin/detailListCoin";

const routers = [
    {
        path: "/",
        exact: true,
        main: (props) => <Danhsach {...props} />,
    },
    {
        path: "/users/detail",
        exact: true,
        main: (props) => <Detail {...props} />,
    },
    {
        path: "/news",
        exact: true,
        main: () => <ListNews />,
    },
    {
        path: "/news/edit",
        exact: true,
        main: (props) => <NewsEditor {...props} />,
    },
    {
        path: "/news/addnews",
        exact: true,
        main: () => <AddNews />,
    },
    {
        path: "/media",
        exact: true,
        main: () => <ListImages />,
    },
    {
        path: "/media/album",
        exact: true,
        main: () => <Album />,
    },
    {
        path: "/media/album/edit",
        exact: true,
        main: () => <UpdateAlbum />,
    },
    {
        path: "/payment/items",
        exact: true,
        main: () => <ItemsContainer />,
    },
    {
        path: "/payment/items/edit",
        exact: true,
        main: () => <EditPartnerProductItem />,
    },
    {
        path: "/payment/item/charges/detail",
        exact: true,
        main: () => <ListPartnerChargesDetail />,
    },
    {
        path: "/payment/coin",
        exact: true,
        main: () => <CoinsContainer />,
    },
    {
        path: "/payment/coin/detail",
        exact: true,
        main: () => <DetailListCoin />,
    },
    {
        path: "/payment/coin/edit",
        exact: true,
        main: () => <EditProductCoin />,
    },
    {
        path: "/payment/coin/charges/detail",
        exact: true,
        main: () => <ListChargesDetail />,
    },
    {
        path: "/payment/promotion",
        exact: true,
        main: () => <ListPromoAndEvent />,
    },
    {
        path: "/payment/promotion/create",
        exact: false,
        main: () => <CreatePromotion />,
    },
    {
        path: "/payment/promotion/detail/promotion",
        exact: false,
        main: () => <DetailPromotion />,
    },
    {
        path: "/payment/promotion/detail/event",
        exact: false,
        main: () => <DetailEvent />,
    },
    {
        path: "/stats",
        exact: false,
        main: () => <Stats />,
    },
    {
        path: "/partner",
        exact: false,
        main: () => <Partner />,
    },
];

export default routers;
