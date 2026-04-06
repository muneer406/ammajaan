import { useContext } from 'react'
import { AddressesContext } from '../context/addressesContextInstance'

export function useAddresses() {
    const context = useContext(AddressesContext)

    if (!context) {
        throw new Error('useAddresses must be used inside AddressesProvider')
    }

    return context
}
