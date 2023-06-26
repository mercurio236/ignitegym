import { useState, useEffect, useCallback } from 'react'
import { Center, Text, VStack, FlatList, HStack, Heading, useToast } from 'native-base'
import { useNavigation, useFocusEffect } from '@react-navigation/native'

import { AppNavigatorRoutesProps } from '@routes/app.routes'

import { api } from '@services/api'

import { Group } from '@components/Group'
import { HomeHeader } from '@components/HomeHeader'
import { ExerciseCard } from '@components/ExerciseCard'
import { AppError } from '@utils/AppError'
import { ExerciseDTO } from '@dtos/ExerciseDTO'

export function Home() {
    const [groups, setGroups] = useState<string[]>([])
    const [exercises, setExercise] = useState<ExerciseDTO[]>([])
    const [groupSelected, setGroupSelected] = useState('antebraço')

    const toast = useToast()

    const navigation = useNavigation<AppNavigatorRoutesProps>()

    function handleOpenExerciseDetails() {
        navigation.navigate('exercise')
    }

    async function fetchGroups() {
        try {
            const res = await api.get('/groups')
            setGroups(res.data)
        } catch (error) {
            const isAppError = error instanceof AppError;
            const title = isAppError ? error.message : 'Não foi possivel carregar os grupos musculares'
            toast.show({
                title: title,
                placement: 'top',
                bgColor: 'red.500'
            })

        }
    }

    async function fetchExerciseByGroup() {
        try {
            const res = await api.get(`/exercises/bygroup/${groupSelected}`)
            setExercise(res.data)
        } catch (error) {
            const isAppError = error instanceof AppError;
            const title = isAppError ? error.message : 'Não foi possivel carregar os exercicios'
            toast.show({
                title: title,
                placement: 'top',
                bgColor: 'red.500'
            })

        }
    }

    useEffect(() => {
        fetchGroups()
    }, [])

    useFocusEffect(useCallback(() => {
        fetchExerciseByGroup()
    }, [groupSelected]))

    return (
        <VStack flex={1}>
            <HomeHeader />

            <FlatList
                data={groups}
                keyExtractor={item => item}
                renderItem={({ item }) =>
                    <Group
                        name={item}
                        isActive={groupSelected.toLocaleUpperCase() === item.toLocaleUpperCase()}
                        onPress={() => setGroupSelected(item)}
                    />}
                horizontal
                showsHorizontalScrollIndicator={false}
                _contentContainerStyle={{ px: 8 }}
                my={10}
                maxH={10}
                minH={10}
            />

            <VStack flex={1} px={8} mb={5}>
                <HStack justifyContent='space-between'>
                    <Heading color='gray.200' fontSize='md' mb={5} fontFamily='heading'>
                        Exercício
                    </Heading>
                    <Text color='gray.200' fontSize='sm'>
                        {exercises.length}
                    </Text>
                </HStack>

                <FlatList
                    data={exercises}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => (
                        <ExerciseCard
                            onPress={handleOpenExerciseDetails}
                        />
                    )}
                    showsVerticalScrollIndicator={false}
                    _contentContainerStyle={{
                        paddingBottom: 20
                    }}
                />

            </VStack>



        </VStack>
    )
}