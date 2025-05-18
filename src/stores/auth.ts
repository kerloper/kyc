import {defineStore} from 'pinia'
import {ref} from 'vue'

export const useAuthStore = defineStore('auth', () => {
    const utn = ref(null) // User Token

    // Method to set the token (call this after successful login)
    const setToken = (token) => {
        utn.value = token
        // You might also want to store it in localStorage
        localStorage.setItem('user_token', token)
    }

    // Method to set the token (call this after successful login)
    const getToken = () => {
        return  localStorage.getItem('user_token')

    }

    // Method to clear the token (logout)
    const clearToken = () => {
        utn.value = null
        localStorage.removeItem('user_token')
    }

    // Initialize token from localStorage if available
    const initialize = () => {
        const token = localStorage.getItem('user_token')
        if (token) {
            utn.value = token
        }
    }

    return {utn, setToken, clearToken, initialize,getToken}
})