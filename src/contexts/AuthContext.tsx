import { createContext, ReactNode, useState, useEffect } from "react";

import { storageUserSave, storageUserGet } from "@storage/storageUser";

import { api } from "@services/api";
import { UserDTO } from "@dtos/UserDTO";

export type AuthContextDataProps = {
    user: UserDTO;
    SignIn: (email: string, password: string) => Promise<void>
}

type AuthContextProviderProps = {
    children: ReactNode;
}

export const AuthContext = createContext<AuthContextDataProps>({} as AuthContextDataProps);

export function AuthContextProvider({ children }: AuthContextProviderProps) {
    const [user, setUser] = useState<UserDTO>({} as UserDTO)

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

    async function loadUserData() {
        const userLogged = await storageUserGet()
        if (userLogged) {
            setUser(userLogged)
        }
    }

    useEffect(() => {
        loadUserData()
    }, [])

    return (
        <AuthContext.Provider value={{ user, SignIn }}>
            {children}
        </AuthContext.Provider>
    )
}