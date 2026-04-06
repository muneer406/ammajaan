/** Fake Store API prices are in USD; display in INR for the demo UI. */
export const USD_TO_INR = 96

export const TAX_RATE = 0.18

export const usdToInr = (usd) => {
    const n = Number(usd)
    if (!Number.isFinite(n) || n < 0) return 0
    return n * USD_TO_INR
}

export const formatCurrency = (value) => {
    const n = Number(value)
    const safe = Number.isFinite(n) ? n : 0
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    }).format(safe)
}

export function getCartTotals(cartItems) {
    if (!Array.isArray(cartItems)) {
        return { subtotal: 0, tax: 0, total: 0 }
    }

    const subtotal = cartItems.reduce((sum, item) => {
        const qty = Number(item?.quantity)
        if (!Number.isFinite(qty) || qty < 1) return sum
        return sum + usdToInr(item?.price) * qty
    }, 0)
    const tax = subtotal * TAX_RATE
    return {
        subtotal,
        tax,
        total: subtotal + tax,
    }
}
