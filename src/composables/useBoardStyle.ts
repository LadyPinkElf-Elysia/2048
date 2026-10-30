export const useBoardStyle = () => {
    const getCellStyle = (val: number) => {
        if (val === 0) return {}
        const exponent = Math.log2(val)
        if (val === 2) return { background: '#eee4da', color: '#776e65' }
        if (val === 4) return { background: '#ede0c8', color: '#776e65' }

        const hue = 30 + (exponent - 3) * 25
        return {
            background: `hsl(${hue}, 70%, 55%)`,
            color: '#fff',
            boxShadow: val >= 2048 ? `0 0 15px hsla(${hue}, 80%, 60%, 0.5)` : 'none'
        }
    }

    const getFontScale = (val: number) => {
        if (val === 0) return '100%'
        const len = val.toString().length

        // 🔑 位数越高，比例缩小得越平滑
        if (len === 1) return '100%' // 2, 4, 8：占格子 50% (0.5 * 100%)
        if (len === 2) return '80%'  // 16, 32...：占格子 40% (0.5 * 80%)
        if (len === 3) return '60%'  // 128, 256..：占格子 30% (0.5 * 60%)
        if (len === 4) return '45%'  // 1024, 2048：占格子 22.5% (0.5 * 45%)

        return '35%'                 // 更大的数（如 4096+），避免溢出
    }

    return { getCellStyle, getFontScale }
}