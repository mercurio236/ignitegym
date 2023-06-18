import { Center, Icon, Text, VStack } from 'native-base'
import { TouchableOpacity } from 'react-native'
import {Feather} from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { AppNavigatorRoutesProps } from '@routes/app.routes'

export function Exercise() {
    const navigation = useNavigation<AppNavigatorRoutesProps>()

    function handleGoback(){
        navigation.goBack()    
    }

    return (
        <VStack flex={1}>
            <VStack px={8} bg='gray.600' pt={12}>
                <TouchableOpacity onPress={handleGoback}>
                    <Icon
                    as={Feather}
                    name='arrow-left'
                    color='green.500'
                    size={6}
                    />
                </TouchableOpacity>
            </VStack>
        </VStack>
    )
}