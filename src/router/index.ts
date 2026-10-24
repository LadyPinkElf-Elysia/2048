import { createRouter,createWebHashHistory } from "vue-router";
import { PAGES } from "../constents/2048.ts";
import { use2048 } from "../stores/use2048.ts";

const router=createRouter({
    history:createWebHashHistory(),
    routes:[
        {path:'/',name:PAGES.Config,component:()=>import('../pages/ConfigPage.vue')},
        {path:'/game',name:PAGES.Game,component:()=>import('../pages/GamePage.vue')},
        { path: '/:pathMatch(.*)*', redirect: { name: PAGES.Config } },
    ]
})

router.beforeEach((to) => {
    // 如果要去游戏页
    if (to.name === PAGES.Game) {
        const store = use2048()
        // 如果矩阵为空，返回重定向的目标
        if (store.matrix.length === 0) {
            return { name: PAGES.Config }
        }
    }
    // 其他情况默认放行（返回 undefined 或 true）
})

export default router