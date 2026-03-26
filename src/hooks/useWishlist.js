import { useCart } from './useCart'

export function useWishlist() {
    const { wishlistItems, wishlistCount, toggleWishlist } = useCart()

    return {
        wishlistItems,
        wishlistCount,
        toggleWishlist,
    }
}
