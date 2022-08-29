export const formatNum = (num: number, digits: number) => {
    return Intl.NumberFormat('en-US', {
        notation: 'compact',
        maximumFractionDigits: digits
    }).format(num)
}
