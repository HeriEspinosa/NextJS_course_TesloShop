import { NextPage } from 'next';
import NextLink from 'next/link';
import { Box, Button, Grid, TextField, Typography } from '@mui/material';
import { AuthLayout } from '@/components/layouts';

const LoginPage: NextPage = () => {
    return (
        <AuthLayout title="Ingresar">
            <Box sx={{ width: 350, padding: '10px 20px' }}>
                <Grid container spacing={1.5}>
                    <Grid item xs={12}>
                        <Typography variant="h1" component="h1">
                            Inicial Sesion
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField label="Correo" variant="filled" fullWidth />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField label="Contraseña" type="password" variant="filled" fullWidth />
                    </Grid>
                    <Grid item xs={12}>
                        <Button color="secondary" className="circular-btn" size="large" fullWidth>
                            Ingresar
                        </Button>
                    </Grid>
                    <Grid item xs={12} display="flex" justifyContent="end">
                        <NextLink href="/auth/register" passHref>
                            <Typography variant="body2" borderBottom="1px dashed #3A64D8">
                                No tienes cuenta?
                            </Typography>
                        </NextLink>
                    </Grid>
                </Grid>
            </Box>
        </AuthLayout>
    );
};

export default LoginPage;
