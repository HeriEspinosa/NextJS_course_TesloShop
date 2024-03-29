import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import Cookies from 'js-cookie';
import {
    Box,
    Button,
    FormControl,
    Grid,
    MenuItem,
    TextField,
    Typography,
} from '@mui/material';

import { CartContext } from '@/context';
import { ShopLayout } from '@/components/layouts';
import { countries, jwt } from '@/utils';

type FormData = {
    firstName: string;
    lastName: string;
    address: string;
    address2?: string;
    zip: string;
    city: string;
    country: string;
    phone: string;
};

const getAddressFromCookies = (): FormData => {
    return {
        firstName: Cookies.get('firstName') || '',
        lastName: Cookies.get('lastName') || '',
        address: Cookies.get('address') || '',
        address2: Cookies.get('address2') || '',
        zip: Cookies.get('zip') || '',
        city: Cookies.get('city') || '',
        country: Cookies.get('country') || '',
        phone: Cookies.get('phone') || '',
    };
};

const AddressPage = () => {
    const { updateAddress, shippingAddress } = useContext(CartContext);
    const [country, setCountry] = useState('');
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        defaultValues: getAddressFromCookies(),
    });
    const router = useRouter();

    useEffect(() => {
        if (shippingAddress?.country) {
            setCountry(shippingAddress.country);
        }
    }, [shippingAddress]);

    const onSubmitAddress = (data: FormData) => {
        updateAddress(data);
        router.push('/checkout/summary');
    };
    return (
        <ShopLayout
            title={'Direccion'}
            pageDescription={'Confirmar la direccion del destino'}
        >
            <Typography variant="h1" component="h1" sx={{ mt: 1 }}>
                Direccion
            </Typography>

            <form onSubmit={handleSubmit(onSubmitAddress)}>
                <Grid container spacing={2} sx={{ mt: 2 }}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Nombre"
                            variant="filled"
                            fullWidth
                            {...register('firstName', {
                                required: 'Este campo es requerido',
                                minLength: { value: 2, message: 'Minimo 2 caracteres' },
                            })}
                            error={!!errors.firstName}
                            helperText={errors.firstName?.message}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Apellido"
                            variant="filled"
                            fullWidth
                            {...register('lastName', {
                                required: 'Este campo es requerido',
                                minLength: { value: 2, message: 'Minimo 2 caracteres' },
                            })}
                            error={!!errors.lastName}
                            helperText={errors.lastName?.message}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Direccion"
                            variant="filled"
                            fullWidth
                            {...register('address', {
                                required: 'Este campo es requerido',
                            })}
                            error={!!errors.address}
                            helperText={errors.address?.message}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Direccion2 (opcional)"
                            variant="filled"
                            fullWidth
                            {...register('address2')}
                            error={!!errors.address2}
                            helperText={errors.address2?.message}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Ciudad"
                            variant="filled"
                            fullWidth
                            {...register('city', { required: 'Este campo es requerido' })}
                            error={!!errors.city}
                            helperText={errors.city?.message}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Codigo Postal"
                            variant="filled"
                            fullWidth
                            {...register('zip', { required: 'Este campo es requerido' })}
                            error={!!errors.zip}
                            helperText={errors.zip?.message}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                            <TextField
                                select
                                variant="filled"
                                label="pais"
                                {...register('country', {
                                    required: 'Este campo es requerido',
                                })}
                                value={country}
                                onChange={(e) => setCountry(e.target.value)}
                                error={!!errors.country}
                                // helperText={errors.country?.message} //TODO
                            >
                                {countries.map((country) => (
                                    <MenuItem key={country.code} value={country.code}>
                                        {country.name}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Telefono"
                            variant="filled"
                            fullWidth
                            {...register('phone', {
                                required: 'Este campo es requerido',
                            })}
                            error={!!errors.phone}
                            helperText={errors.phone?.message}
                        />
                    </Grid>
                </Grid>

                <Box sx={{ mt: 5 }} display="flex" justifyContent="center">
                    <Button
                        color="secondary"
                        className="circular-btn"
                        size="large"
                        type="submit"
                    >
                        Revisar pedido
                    </Button>
                </Box>
            </form>
        </ShopLayout>
    );
};

// export const getServerSideProps: GetServerSideProps = async ({ req }) => {
//     const { token = '' } = req.cookies;
//     let isValidToken = false;

//     try {
//         await jwt.isValidToken(token);
//         isValidToken = true;
//     } catch (error) {
//         isValidToken = false;
//     }

//     if (!isValidToken) {
//         return {
//             redirect: {
//                 destination: '/auth/login?p=/checkout/address',
//                 permanent: false,
//             },
//         };
//     }

//     return {
//         props: {},
//     };
// };

export default AddressPage;
