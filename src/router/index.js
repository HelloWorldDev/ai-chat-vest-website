import { createRouter, createWebHistory } from "vue-router";
import routes from "./routes";

const router = createRouter({
    linkActiveClass: "active",
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    next();
});

export default router;
