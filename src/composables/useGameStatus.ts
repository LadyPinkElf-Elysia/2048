import { watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessageBox } from 'element-plus'
import { PAGES } from '../constents/2048'
import type { use2048 } from '../stores/use2048'
import type { useTimer } from './useTimer'

export const useGameStatus = (
    store: ReturnType<typeof use2048>,
    timer: ReturnType<typeof useTimer>
) => {
    const router = useRouter()

    // 监听胜利
    watch(() => store.hasWon, (won) => {
        if (!won) return
        timer.pause()

        if (store.isLost) {
            ElMessageBox.alert(
                `太神了！你不仅合成了 ${store.gameForm.target}，还填满了整个棋盘！完美通关！`,
                '绝杀通关',
                { confirmButtonText: '返回设置', type: 'success', center: true }
            ).then(() => {
                store.init()
                router.push({ name: PAGES.Config })
            })
            return
        }

        ElMessageBox.confirm(
            `恭喜！你成功合成了 ${store.gameForm.target}！`,
            '挑战成功',
            { confirmButtonText: '继续挑战极限', cancelButtonText: '结束并返回', type: 'success', center: true, showClose: false }
        ).then(() => {
            store.keepPlaying()
            timer.start()
        }).catch(() => {
            store.init()
            router.push({ name: PAGES.Config })
        })
    })

    // 监听失败
    watch(() => store.isLost, (lost) => {
        if (!lost || store.hasWon) return
        timer.pause()

        ElMessageBox.alert(
            '棋盘已经填满了，没有可以合并的数字了。',
            'Game Over',
            { confirmButtonText: '返回设置', type: 'error', center: true, showClose: false, closeOnPressEscape: false }
        ).then(() => {
            store.init()
            router.push({ name: PAGES.Config })
        })
    })
}