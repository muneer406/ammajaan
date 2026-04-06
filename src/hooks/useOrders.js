import { useContext } from 'react'
import { OrdersContext } from '../context/ordersContextInstance'

export function useOrders() {
    const context = useContext(OrdersContext)

    if (!context) {
        throw new Error('useOrders must be used inside OrdersProvider')
    }

    return context
}
