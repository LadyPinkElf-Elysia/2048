export const useBoardStyle = () => {
    // 🌟 颜色算法：从 8(3次方) 开始，色相 30，每升一级 +25
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

    // 🌟 字号算法：200 / 位数
    const getFontScale = (val: number) => {
        if (val === 0) return '100%'
        const len = val.toString().length
        return `${Math.max(25, 200 / len)}%`
    }

    return { getCellStyle, getFontScale }
}