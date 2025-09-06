"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const auth_route_1 = require("../modules/auth/auth.route");
const user_route_1 = require("../modules/user/user.route");
const parcel_route_1 = require("../modules/parcel/parcel.route");
const stats_route_1 = require("../modules/stats/stats.route");
const contact_route_1 = require("../modules/contact/contact.route");
exports.router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: "/user",
        route: user_route_1.UserRoutes
    },
    {
        path: "/auth",
        route: auth_route_1.AuthRoutes
    },
    {
        path: "/parcel",
        route: parcel_route_1.ParcelRoutes
    },
    {
        path: "/stats",
        route: stats_route_1.StatsRoutes
    },
    {
        path: "/contact",
        route: contact_route_1.ContactRoutes
    },
];
moduleRoutes.forEach((route) => {
    exports.router.use(route.path, route.route);
});
