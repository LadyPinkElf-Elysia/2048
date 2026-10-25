import { ref } from 'vue'

export const useTooltip = () => {
    const canHover = ref(typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches)
    return { canHover }
}