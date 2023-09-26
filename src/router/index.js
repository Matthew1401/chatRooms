// DEFINE OUR ROUTING RULES //
import {createRouter, createWebHistory} from "vue-router"
import HomeView from "../views/HomeView.vue"
import RoomsView from "../views/RoomsView.vue"

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            name: "home",
            component: RoomsView
        },
        {
            path: "/home",
            redirect: "/"
        }
    ]
})

export default router
