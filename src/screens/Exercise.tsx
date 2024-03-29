import { useEffect, useState } from 'react'
import { HStack, Heading, Icon, Text, VStack, Image, Box, ScrollView, useToast } from 'native-base'
import { TouchableOpacity } from 'react-native'
import { Feather } from '@expo/vector-icons'
import { useNavigation, useRoute } from '@react-navigation/native'

import { AppNavigatorRoutesProps } from '@routes/app.routes'

import BodySvg from '@assets/body.svg';
import SeriesSvg from '@assets/series.svg';
import RepetitionsSvg from '@assets/repetitions.svg';

import { Button } from '@components/Button'
import { AppError } from '@utils/AppError'
import { api } from '@services/api'
import { ExerciseDTO } from '@dtos/ExerciseDTO'
import { Loading } from '@components/Loading'

type RouteParamsProps = {
    exerciseId: string;
}


export function Exercise() {
    const [sendRegister, setSendRegister] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [exercise, setExercise] = useState<ExerciseDTO>({} as ExerciseDTO)

    const navigation = useNavigation<AppNavigatorRoutesProps>()

    const route = useRoute()
    const toast = useToast()
    const { exerciseId } = route.params as RouteParamsProps

    function handleGoback() {
        navigation.goBack()
    }

    async function fetchExerciseDetails() {
        try {
            setIsLoading(true)
            const res = await api.get(`/exercises/${exerciseId}`)
            setExercise(res.data)
        } catch (error) {
            const isAppError = error instanceof AppError;
            const title = isAppError ? error.message : 'Não foi possivel carregar os detalhes dos exercicios'
            toast.show({
                title: title,
                placement: 'top',
                bgColor: 'red.500'
            })

        } finally {
            setIsLoading(false)
        }
    }

    async function handleExerciseHistoryRegister() {
        try {
            setSendRegister(true)

            await api.post('/history', { exercise_id: exerciseId })

            toast.show({
                title: 'Parabéns! Exercício registrado no seu histórico',
                placement: 'top',
                bgColor: 'green.700'
            })

            navigation.navigate('history')

        } catch (error) {
            const isAppError = error instanceof AppError;
            const title = isAppError ? error.message : 'Não foi possivel o exercicio'
            toast.show({
                title: title,
                placement: 'top',
                bgColor: 'red.500'
            })

        } finally {
            setSendRegister(false)
        }
    }

    useEffect(() => {
        fetchExerciseDetails()
    }, [exerciseId])

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

                <HStack justifyContent='space-between' mt={4} mb={8} alignItems='center' >
                    <Heading color='gray.100' fontSize='lg' flexShrink={1} fontFamily='heading'>
                        {exercise.name}
                    </Heading>

                    <HStack alignItems='center'>
                        <BodySvg />
                        <Text color='gray.200' ml={1} textTransform='capitalize'>
                            {exercise.group}
                        </Text>
                    </HStack>
                </HStack>
            </VStack>
            <ScrollView>
                {
                    isLoading ? <Loading /> :
                        <VStack p={8}>
                            <Box mb={3} rounded='lg' overflow='hidden'>
                                <Image
                                    w='full'
                                    h={80}
                                    source={{ uri: `${api.defaults.baseURL}/exercise/demo/${exercise.demo}` }}
                                    alt='Nome do exercício'
                                    resizeMode='cover'
                                    rounded='lg'
                                />
                            </Box>

                            <Box bg='gray.600' pb={4} px={4}>
                                <HStack alignItems='center' justifyContent='space-around' mb={6} mt={5}>
                                    <HStack>
                                        <SeriesSvg />
                                        <Text color='gray.200' ml='2'>
                                            {exercise.series} séries
                                        </Text>
                                    </HStack>
                                    <HStack>
                                        <RepetitionsSvg />
                                        <Text color='gray.200' ml='2'>
                                            {exercise.repetitions} repetições
                                        </Text>
                                    </HStack>
                                </HStack>

                                <Button
                                    onPress={handleExerciseHistoryRegister}
                                    isLoading={sendRegister}
                                    title='Marcar como realizado'
                                />
                            </Box>
                        </VStack>
                }
            </ScrollView>
        </VStack>
    )
}