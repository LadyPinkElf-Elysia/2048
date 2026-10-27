import { createRouter, createWebHashHistory } from "vue-router";
import { PAGES } from "../constents/2048.ts";
import { use2048 } from "../stores/use2048.ts";

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        { path: '/', name: PAGES.Config, component: () => import('../pages/ConfigPage.vue') },
        { path: '/game', name: PAGES.Game, component: () => import('../pages/GamePage.vue') },
        { path: '/:pathMatch(.*)*', redirect: { name: PAGES.Config } },
    ]
})

router.beforeEach((to) => {
    if (to.name === PAGES.Game) {
        const store = use2048()
        if (store.matrix.length === 0) {
            return { name: PAGES.Config }
        }
    }
})

export default router