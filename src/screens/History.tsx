import { useCallback, useState } from 'react'

import { HistoryCard } from '@components/HistoryCard'
import { ScreenHeader } from '@components/ScreenHeader'
import { Center, Heading, Text, VStack, SectionList, useToast } from 'native-base'
import { AppError } from '@utils/AppError'
import { api } from '@services/api'
import { useFocusEffect } from '@react-navigation/native'
import { HistoryByDayDTO } from '@dtos/HistoryByDayDTO'

export function History() {
    const [isLoading, setIsLoading] = useState(true)
    const [exercises, setExercises] = useState<HistoryByDayDTO[]>([])

    const toast = useToast()

    async function fetchHistory() {
        try {
            setIsLoading(true)
            const res = await api.get('/history')
            setExercises(res.data)

        } catch (error) {
            const isAppError = error instanceof AppError;
            const title = isAppError ? error.message : 'Não foi possivel carregar historico'
            toast.show({
                title: title,
                placement: 'top',
                bgColor: 'red.500'
            })

        } finally {
            setIsLoading(false)
        }
    }

    useFocusEffect(useCallback(() => {
        fetchHistory()
    }, []))

    return (
        <VStack flex={1}>
            <ScreenHeader title='Historico de Exercícios' />

            <SectionList
                sections={exercises}
                keyExtractor={item => item.id}
                renderItem={({ item }) => <HistoryCard data={item} />}
                renderSectionHeader={({ section }) => (
                    <Heading color='gray.200' fontSize='md' mt={10} mb={3} fontFamily='heading'>
                        {section.title}
                    </Heading>
                )}
                px={8}
                contentContainerStyle={exercises.length === 0 && { flex: 1, justifyContent: 'center' }}
                ListEmptyComponent={() => (
                    <Text color='gray.100' textAlign='center'>
                        Não há registrados ainda.
                        Vamos fazer exercícios hoje?
                    </Text>
                )}
            />

        </VStack>
    )
}