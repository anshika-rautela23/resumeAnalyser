import { createContext, useEffect, useRef, useState } from "react";
import { getme, login, logout, register } from "./services/auth.api";

export const AuthContext=createContext()

export const AuthProvider=({children})=>{
    const [user,setuser]=useState(null)
    const [loading,setloading]=useState(true)
    const [authError,setAuthError]=useState("")
    const authRequestId = useRef(0)

    useEffect(() => {
        const restoreSession = async () => {
            const requestId = authRequestId.current
            try {
                const data = await getme()
                if (requestId === authRequestId.current) {
                    setuser(data.user)
                }
            } catch {
                if (requestId === authRequestId.current) {
                    setuser(null)
                }
            } finally {
                setloading(false)
            }
        }

        restoreSession()
    }, [])

    const handleLogin = async (credentials) => {
        authRequestId.current += 1
        setloading(true)
        setAuthError("")
        try {
            const data = await login(credentials)
            setuser(data.user)
            return true
        } catch (error) {
            setuser(null)
            setAuthError(error.response?.data?.message || "Unable to log in")
            return false
        } finally {
            setloading(false)
        }
    }

    const handleRegister = async (credentials) => {
        authRequestId.current += 1
        setloading(true)
        setAuthError("")
        try {
            const data = await register(credentials)
            setuser(data.user)
            return true
        } catch (error) {
            setuser(null)
            setAuthError(error.response?.data?.message || "Unable to register")
            return false
        } finally {
            setloading(false)
        }
    }

    const handlelogout = async () => {
        authRequestId.current += 1
        setloading(true)
        try {
            await logout()
        } finally {
            setuser(null)
            setloading(false)
        }
    }

    return (
        <AuthContext.Provider value={{user, loading, authError, handleLogin, handleRegister, handlelogout}}>
            {children}
        </AuthContext.Provider>
    )
}