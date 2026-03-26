import { useCallback, useEffect, useState } from 'react'
import { getCategories, getProducts } from '../services/api'

export function useProducts() {
    const [products, setProducts] = useState([])
    const [categories, setCategories] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState('')

    const fetchProducts = useCallback(async () => {
        try {
            setIsLoading(true)
            setError('')
            const [productsData, categoriesData] = await Promise.all([
                getProducts(),
                getCategories(),
            ])
            setProducts(productsData)
            setCategories(categoriesData)
        } catch {
            setError('Failed to load products. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchProducts()
    }, [fetchProducts])

    return {
        products,
        categories,
        isLoading,
        error,
        refetch: fetchProducts,
    }
}
