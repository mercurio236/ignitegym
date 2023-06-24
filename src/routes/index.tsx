import { useContext } from 'react'
import { Box, useTheme } from 'native-base'
import { NavigationContainer, DefaultTheme } from '@react-navigation/native'

import { AuthRoutes } from './auth.routes'

import { AuthContext } from '@contexts/AuthContext'



export function Routes() {
    const { colors } = useTheme()
    
    const contextData = useContext(AuthContext)

    const theme = DefaultTheme;
    theme.colors.background = colors.gray[700];

    return (
        <Box flex={1} bg='gray700'>
            <NavigationContainer theme={theme}>
                <AuthRoutes />
            </NavigationContainer>
        </Box>
    )
}