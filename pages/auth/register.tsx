import { useContext, useState } from 'react';
import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { getSession, signIn } from 'next-auth/react';
import NextLink from 'next/link';

import { Box, Button, Chip, Grid, TextField, Typography } from '@mui/material';
import { ErrorOutline } from '@mui/icons-material';
import { useForm } from 'react-hook-form';

import { AuthContext } from '@/context';
import { AuthLayout } from '@/components/layouts';
import { validations } from '@/utils';

type FormData = {
    name: string;
    email: string;
    password: string;
    passwordMatch: string;
};

const RegisterPage: NextPage = () => {
    const { registerUser } = useContext(AuthContext);
    const [showError, setShowError] = useState<boolean>(false);
    const [showErrorMsj, setShowErrorMsj] = useState<string>('');
    const router = useRouter();

    const {
        register,
        handleSubmit,
        getValues,
        formState: { errors },
    } = useForm<FormData>();

    const onRegisterForm = async ({ name, email, password }: FormData) => {
        setShowError(false);

        const { bool, error } = await registerUser(name, email, password);

        if (!bool) {
            setShowError(true);
            setShowErrorMsj(error!);

            setTimeout(() => setShowError(false), 4000);
            return;
        }

        // navegar a la pantalla que el usuario estaba
        // const destination = router.query.p?.toString() || '/';
        // router.replace(destination);

        await signIn('credentials', { email, password });
    };

    return (
        <AuthLayout title="Ingresar">
            <form onSubmit={handleSubmit(onRegisterForm)}>
                <Box sx={{ width: 350, padding: '10px 20px' }}>
                    <Grid container spacing={1.5}>
                        <Grid item xs={12}>
                            <Typography variant="h1" component="h1">
                                Crear cuenta
                            </Typography>
                            <Chip
                                label={showErrorMsj}
                                color="error"
                                icon={<ErrorOutline />}
                                className="fadeIn"
                                sx={{ display: showError ? 'flex' : 'none' }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Nombre completo"
                                variant="filled"
                                fullWidth
                                {...register('name', {
                                    required: 'Este campo es requerido',
                                    minLength: {
                                        value: 2,
                                        message: 'Minimo 2 caracteres',
                                    },
                                })}
                                error={!!errors.name}
                                helperText={errors.name?.message}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                type="email"
                                label="Correo"
                                variant="filled"
                                fullWidth
                                {...register('email', {
                                    required: 'Este campo es requerido',
                                    validate: validations.isEmail,
                                })}
                                error={!!errors.email}
                                helperText={errors.email?.message}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                type="password"
                                label="Contraseña"
                                variant="filled"
                                fullWidth
                                {...register('password', {
                                    required: 'Este campo es requerido',
                                    minLength: {
                                        value: 6,
                                        message: 'Minimo 6 caracteres',
                                    },
                                })}
                                error={!!errors.password}
                                helperText={errors.password?.message}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                type="password"
                                label="Repetir contraseña"
                                variant="filled"
                                fullWidth
                                {...register('passwordMatch', {
                                    required: 'Este campo es requerido',
                                    minLength: {
                                        value: 6,
                                        message: 'Minimo 6 caracteres',
                                    },
                                    validate: (value) =>
                                        validations.passwordMatch(
                                            value,
                                            getValues('password')
                                        ),
                                })}
                                error={!!errors.passwordMatch}
                                helperText={errors.passwordMatch?.message}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                type="submit"
                                color="secondary"
                                className="circular-btn"
                                size="large"
                                fullWidth
                            >
                                Registrar
                            </Button>
                        </Grid>
                        <Grid item xs={12} display="flex" justifyContent="end">
                            <NextLink
                                href={`/auth/login?p=${
                                    router.query.p ? router.query.p : '/auth/login'
                                }`}
                                passHref
                            >
                                <Typography
                                    variant="body2"
                                    borderBottom="1px dashed #3A64D8"
                                >
                                    Ya tienes cuenta?
                                </Typography>
                            </NextLink>
                        </Grid>
                    </Grid>
                </Box>
            </form>
        </AuthLayout>
    );
};

export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
    const session = await getSession({ req });

    const { p = '/' } = query;

    if (session) {
        return {
            redirect: {
                destination: p.toString(),
                permanent: false,
            },
        };
    }

    return {
        props: {},
    };
};

export default RegisterPage;
