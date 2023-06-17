import { ScreenHeader } from '@components/ScreenHeader'
import { Center, Text, VStack } from 'native-base'

export function Profile() {
    return (
        <VStack flex={1}>
           <ScreenHeader title='Perfil'/>
        </VStack>
    )
}