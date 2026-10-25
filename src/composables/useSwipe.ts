import { onBeforeUnmount, onMounted, type Ref } from "vue";
import type { Direction, EventListenerItem, SwipeOptions } from "../types/2048";

export const useSwipe=(handleMove: (direction: Direction) => void,target: Ref<HTMLElement | null>,options: SwipeOptions = {})=>{
    const { threshold = 30 } = options

    let startX=0
    let startY=0
    
    const handleTouchStart=(e:Event)=>{
        const touchEvent=e as TouchEvent
        startX=touchEvent.touches[0].clientX
        startY=touchEvent.touches[0].clientY
    }

    const handleTouchEnd = (e: Event) => {
        const touchEvent = e as TouchEvent
        const dx = touchEvent.changedTouches[0].clientX - startX
        const dy = touchEvent.changedTouches[0].clientY - startY

        if (Math.abs(dx) < threshold && Math.abs(dy) < threshold) return

        if (Math.abs(dx) > Math.abs(dy)) {
            handleMove(dx > 0 ? 'right' : 'left')
        } else {
            handleMove(dy > 0 ? 'down' : 'up')
        }
    }

    const handleTouchMove=(e:Event)=>{
        const touchEvent=e as TouchEvent
        if(touchEvent.cancelable) touchEvent.preventDefault()
    }

    const listeners:EventListenerItem[] = [
        { type: 'touchstart', handler: handleTouchStart, options: { passive: false } },
        { type: 'touchmove', handler: handleTouchMove, options: { passive: false } },
        { type: 'touchend', handler: handleTouchEnd }
    ]

    onMounted(() => {
        if (!target) return
        listeners.forEach((item) => {
            target.value!.addEventListener(item.type, item.handler, item.options)
        })
    })

    onBeforeUnmount(() => {
        if (!target) return
        listeners.forEach((item) => {
            target.value!.removeEventListener(item.type, item.handler, item.options)
        })
    })
}

