import { createContext, ReactNode, useState, useEffect } from "react";

import { storageUserSave, storageUserGet, storageUserRemove } from "@storage/storageUser";

import { api } from "@services/api";
import { UserDTO } from "@dtos/UserDTO";

export type AuthContextDataProps = {
    user: UserDTO;
    SignIn: (email: string, password: string) => Promise<void>;
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

    async function SignIn(email: string, password: string) {
        try {

            const { data } = await api.post('/sessions', { email, password })

            if (data.user) {
                setUser(data.user)
                storageUserSave(data.user)
            }

        } catch (error) {
            throw error;
        }
    }

    async function signOut() {
        try {
            setIsLoadingUserStorageData(true)
            setUser({} as UserDTO)
            await storageUserRemove()
        } catch (error) {
            throw error
        } finally {
            setIsLoadingUserStorageData(false)
        }
    }

    async function loadUserData() {
        try {

            const userLogged = await storageUserGet()
            if (userLogged) {
                setUser(userLogged)
                setIsLoadingUserStorageData(false)
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

    return (
        <AuthContext.Provider value={{ user, SignIn, isLoadingUserStorageData, signOut }}>
            {children}
        </AuthContext.Provider>
    )
}