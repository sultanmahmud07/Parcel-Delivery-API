import { Router } from "express"
import { AuthRoutes } from "../modules/auth/auth.route"
import { UserRoutes } from "../modules/user/user.route"
import { ParcelRoutes } from "../modules/parcel/parcel.route"
import { StatsRoutes } from "../modules/stats/stats.route"

export const router = Router()

const moduleRoutes = [
    {
        path: "/user",
        route: UserRoutes
    },
    {
        path: "/auth",
        route: AuthRoutes
    },
    {
        path: "/parcel",
        route: ParcelRoutes
    },
    {
        path: "/stats",
        route: StatsRoutes
    },
]

moduleRoutes.forEach((route) => {
    router.use(route.path, route.route)
})
