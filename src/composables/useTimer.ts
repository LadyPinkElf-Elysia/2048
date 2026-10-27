import { computed, onBeforeUnmount, ref } from "vue"

export const useTimer = () => {
    const seconds = ref(0)
    let timerId: number | null = null
    let startTime = 0

    const formattedTime = computed(() => {
        const m = Math.floor(seconds.value / 60).toString().padStart(2, '0')
        const s = (seconds.value % 60).toString().padStart(2, '0')
        return `${m}:${s}`
    })

    const start = () => {
        if (timerId) return
        startTime = Date.now() - seconds.value * 1000
        timerId = window.setInterval(() => {
            seconds.value = Math.floor((Date.now() - startTime) / 1000)
        }, 500)
    }

    const pause = () => {
        if (timerId) {
            clearInterval(timerId)
            timerId = null
        }
    }

    const reset = () => {
        pause()
        seconds.value = 0
    }

    onBeforeUnmount(() => {
        pause()
    })

    return {
        formattedTime,
        start,
        pause,
        reset
    }
}