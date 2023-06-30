import { createContext, ReactNode, useState, useEffect } from "react";

import { storageAuthTokenSave, storageAuthTokenGet, storageAuthTokenRemove } from '@storage/storageAuthToken'
import { storageUserSave, storageUserGet, storageUserRemove } from "@storage/storageUser";

import { api } from "@services/api";
import { UserDTO } from "@dtos/UserDTO";

export type AuthContextDataProps = {
    user: UserDTO;
    SignIn: (email: string, password: string) => Promise<void>;
    updateUserProfile: (serUpdated: UserDTO) => Promise<void>;
    isLoadingUserStorageData: boolean;
    signOut: () => Promise<void>
}

type AuthContextProviderProps = {
    children: ReactNode;
}

export const AuthContext = createContext<AuthContextDataProps>({} as AuthContextDataProps);

export function AuthContextProvider({ children }: AuthContextProviderProps) {
    const [user, setUser] = useState<UserDTO>({} as UserDTO)
    const [isLoadingUserStorageData, setIsLoadingUserStorageData] = useState(true)

    async function userAndTokenUpdate(userData: UserDTO, token: string) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`
        setUser(userData)
    }

    async function storageUserAndTokenSave(userData: UserDTO, token: string, refresh_token: string) {
        try {
            setIsLoadingUserStorageData(true)

            await storageUserSave(userData)
            await storageAuthTokenSave({ token, refresh_token })

        } catch (error) {
            throw error
        } finally {
            setIsLoadingUserStorageData(false)
        }
    }

    async function SignIn(email: string, password: string) {
        try {

            const { data } = await api.post('/sessions', { email, password })

            if (data.user && data.token && data.refresh_token) {
                setIsLoadingUserStorageData(true)
                await storageUserAndTokenSave(data.user, data.token, data.refresh_token)

                userAndTokenUpdate(data.user, data.token)
            }
        } catch (error) {
            throw error;
        } finally {
            setIsLoadingUserStorageData(false)
        }
    }

    async function signOut() {
        try {
            setIsLoadingUserStorageData(true)
            setUser({} as UserDTO)

            await storageUserRemove()
            await storageAuthTokenRemove()

        } catch (error) {
            throw error
        } finally {
            setIsLoadingUserStorageData(false)
        }
    }

    async function updateUserProfile(userUpdated: UserDTO) {
        try {
            setUser(userUpdated)
            await storageUserSave(userUpdated)
        } catch (error) {
            throw error
        }
    }

    async function loadUserData() {
        try {
            setIsLoadingUserStorageData(true)

            const userLogged = await storageUserGet()
            const { token } = await storageAuthTokenGet()

            if (token && userLogged) {
                userAndTokenUpdate(userLogged, token)

            }
        } catch (error) {
            throw error
        } finally {
            setIsLoadingUserStorageData(false)
        }
    }

    useEffect(() => {
        loadUserData()
    }, [])

    useEffect(() => {
        const subScribe = api.registerInterceptTokenManager(signOut)

        return () => {
            subScribe()
        }
    }, [signOut])

    return (
        <AuthContext.Provider value={{ user, SignIn, isLoadingUserStorageData, signOut, updateUserProfile }}>
            {children}
        </AuthContext.Provider>
    )
}