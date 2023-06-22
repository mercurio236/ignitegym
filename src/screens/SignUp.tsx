import { VStack, Image, Text, Center, Heading, ScrollView, useToast } from 'native-base'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import { useNavigation } from '@react-navigation/native'

import { AuthNavigationRoutesProps } from '@routes/auth.routes'

import BackgroundImgs from '@assets/background.png'
import LogoSvg from '@assets/logo.svg'

import { Input } from '@components/Input'
import { Button } from '@components/Button'

import axios from 'axios'
import { api } from '@services/api'
import { AppError } from '@utils/AppError'

type FormDataProps = {
    name: string;
    email: string;
    password: string;
    password_confirm: string;
}

const signUpSchema = yup.object({
    name: yup.string().required('Informa o nome'),
    email: yup.string().required('Informa o e-mail').email('E-mail invalido.'),
    password: yup.string().required('Informa a senha').min(6, 'A senha deve ter pelo menos 6 dígitos'),
    password_confirm: yup.string().required('Confirme a senha.').oneOf([yup.ref('password')], 'A confirmação da senha não confere')
})

export function SignUp() {
    const toast = useToast()

    const { control, handleSubmit, formState: { errors } } = useForm<FormDataProps>({
        defaultValues: {
            name: '',
            email: '',
            password: '',
            password_confirm: ''
        },
        resolver: yupResolver(signUpSchema)
    })

    const navigation = useNavigation()
    function handleGoBack() {
        navigation.goBack()
    }

    async function handleSignUp({ name, email, password }: FormDataProps) {
        try {
            const res = await api.post('/users', { name, email, password })
        } catch (error) {
            const isAppError = error instanceof AppError;
            const title = isAppError ? error.message : 'Não foi possivel criar a conta. Tente novamente mais tarde.'
            
            toast.show({
                title,
                placement: 'top',
                bgColor: 'red.500'
            })

        }
    }

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
            <VStack flex={1} px={10} pb={16}>
                <Image
                    source={BackgroundImgs}
                    defaultSource={BackgroundImgs}
                    alt='Pessoas treinando'
                    resizeMode='contain'
                    position='absolute'
                />

                <Center my={24}>
                    <LogoSvg />
                    <Text color='gray.100' fontSize='sm'>Treine sua mente e o seu corpo</Text>
                </Center>

                <Center>
                    <Heading color='gray.100' fontSize='xl' mb={6} fontFamily='heading'>
                        Crie sua conta
                    </Heading>

                    <Controller
                        control={control}
                        name='name'
                        render={({ field: { onChange, value } }) => (
                            <Input
                                placeholder='Nome'
                                onChangeText={onChange}
                                value={value}
                                errorMessage={errors.name?.message}
                            />
                        )}
                    />

                    <Controller
                        control={control}
                        name='email'
                        render={({ field: { onChange, value } }) => (
                            <Input
                                placeholder='E-mail'
                                keyboardType='email-address'
                                autoCapitalize='none'
                                onChangeText={onChange}
                                value={value}
                                errorMessage={errors.email?.message}
                            />
                        )}
                    />


                    <Controller
                        control={control}
                        name='password'
                        render={({ field: { onChange, value } }) => (
                            <Input
                                placeholder='Senha'
                                secureTextEntry
                                onChangeText={onChange}
                                value={value}
                                errorMessage={errors.password?.message}
                            />
                        )}
                    />

                    <Controller
                        control={control}
                        name='password_confirm'
                        render={({ field: { onChange, value } }) => (
                            <Input
                                placeholder='Confirme a senha'
                                secureTextEntry
                                onChangeText={onChange}
                                value={value}
                                onSubmitEditing={handleSubmit(handleSignUp)}
                                returnKeyType='send'
                                errorMessage={errors.password_confirm?.message}
                            />
                        )}
                    />



                    <Button
                        title='Criar e acessar'
                        onPress={handleSubmit(handleSignUp)}
                    />
                </Center>


                <Button
                    title='Voltar para o login'
                    variant='outlined'
                    mt={12}
                    onPress={handleGoBack}
                />

            </VStack>
        </ScrollView>
    )
}