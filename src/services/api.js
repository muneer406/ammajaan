import axios from 'axios'

export const api = axios.create({
    baseURL: 'https://fakestoreapi.com',
    timeout: 10000,
})

export async function getProducts() {
    const { data } = await api.get('/products')
    return data
}

export async function getProductById(id) {
    const { data } = await api.get(`/products/${id}`)
    return data
}

export async function getCategories() {
    const { data } = await api.get('/products/categories')
    return data
}
