import { ChangeEvent, FC, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import { useForm } from 'react-hook-form';
import {
    DriveFileRenameOutline,
    SaveOutlined,
    UploadOutlined,
} from '@mui/icons-material';
import {
    Box,
    Button,
    capitalize,
    Card,
    CardActions,
    CardMedia,
    Checkbox,
    Chip,
    Divider,
    FormControl,
    FormControlLabel,
    FormGroup,
    FormLabel,
    Grid,
    ListItem,
    Paper,
    Radio,
    RadioGroup,
    TextField,
} from '@mui/material';

import { tesloApi } from '@/api';
import { AdminLayout } from '../../../components/layouts';
import { IProduct } from '../../../interfaces';
import { dbProducts } from '../../../database';
import { initialData } from '../../../database/seed-data';
import { Product } from '@/models';

const validTypes = ['shirts', 'pants', 'hoodies', 'hats'];
const validGender = ['men', 'women', 'kid', 'unisex'];
const validSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];

type Data = { status: string; results?: string };

interface FormData {
    _id?: string;
    description: string;
    images: string[];
    inStock: number;
    price: number;
    sizes: string[];
    slug: string;
    tags: string[];
    title: string;
    type: string;
    gender: string;
}

interface Props {
    product: IProduct;
}

const ProductAdminPage: FC<Props> = ({ product }) => {
    const [newTagValue, setNewTagValue] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
        getValues,
        setValue,
        watch,
    } = useForm<FormData>({
        defaultValues: product,
    });

    useEffect(() => {
        const subscription = watch((value, { name, type }) => {
            if (name === 'title') {
                const newSlug =
                    value.title
                        ?.trim()
                        .replaceAll(' ', '_')
                        .replaceAll("'", '')
                        .toLocaleLowerCase() || '';

                setValue('slug', newSlug);
            }
        });

        return () => subscription.unsubscribe();
    }, [watch, setValue]);

    const onChangeSize = (size: string) => {
        const currentSizes = getValues('sizes');

        if (currentSizes.includes(size)) {
            return setValue(
                'sizes',
                currentSizes.filter((s) => s !== size),
                { shouldValidate: true }
            );
        }

        setValue('sizes', [...currentSizes, size], { shouldValidate: true });
    };

    const onNewTag = () => {
        const newTag = newTagValue.trim().toLocaleLowerCase();
        setNewTagValue('');
        const currrentTags = getValues('tags');

        if (currrentTags.includes(newTag)) return;

        currrentTags.push(newTag);
    };

    const onDeleteTag = (tag: string) => {
        const updateTags = getValues('tags').filter((itemTag) => itemTag !== tag);
        setValue('tags', updateTags, { shouldValidate: true });
    };

    const onFileSelected = async ({ target }: ChangeEvent<HTMLInputElement>) => {
        if (!target.files || target.files.length === 0) return;

        try {
            for (const file of target.files) {
                const formData = new FormData();
                formData.append('file', file);

                const { data } = await tesloApi.post<Data>('/admin/upload', formData);

                if (data?.results) {
                    setValue('images', [...getValues('images'), data?.results], {
                        shouldValidate: true,
                    });
                }
            }
        } catch (error) {
            console.log({ error });
        }
    };

    const onDeleteImage = (img: string) => {
        setValue(
            'images',
            getValues('images').filter((image) => image !== img),
            { shouldValidate: true }
        );
    };

    const onSumit = async (form: FormData) => {
        if (form.images.length < 2) return alert('At lease two images are needed');

        setIsSaving(true);

        try {
            const { data } = await tesloApi({
                url: '/admin/products',
                method: form._id ? 'PUT' : 'POST', // Si tenemos un _id, entonces actualizar, si no crear
                data: form,
            });

            if (!form._id) {
                router.replace(`/admin/products/${form.slug}`); // recargar el navegador y llevarlo al producto creado.
            } else {
                setIsSaving(false);
            }
        } catch (error) {
            console.log(error);
            setIsSaving(false);
        }
    };

    return (
        <AdminLayout
            title={'Producto'}
            subTitle={`Editando: ${product.title}`}
            icon={<DriveFileRenameOutline />}
        >
            <form onSubmit={handleSubmit(onSumit)}>
                <Box display="flex" justifyContent="end" sx={{ mb: 1 }}>
                    <Button
                        color="secondary"
                        startIcon={<SaveOutlined />}
                        sx={{ width: '150px' }}
                        type="submit"
                        disabled={isSaving}
                    >
                        Guardar
                    </Button>
                </Box>

                <Grid container spacing={2}>
                    {/* Data */}
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Título"
                            variant="filled"
                            fullWidth
                            sx={{ mb: 1 }}
                            {...register('title', {
                                required: 'Este campo es requerido',
                                minLength: { value: 2, message: 'Mínimo 2 caracteres' },
                            })}
                            error={!!errors.title}
                            helperText={errors.title?.message}
                        />

                        <TextField
                            label="Descripción"
                            variant="filled"
                            fullWidth
                            multiline
                            sx={{ mb: 1 }}
                            {...register('description', {
                                required: 'Este campo es requerido',
                            })}
                            error={!!errors.description}
                            helperText={errors.description?.message}
                        />

                        <TextField
                            label="Inventario"
                            type="number"
                            variant="filled"
                            fullWidth
                            sx={{ mb: 1 }}
                            {...register('inStock', {
                                required: 'Este campo es requerido',
                                min: { value: 0, message: 'El valor minimo es 0' },
                            })}
                            error={!!errors.inStock}
                            helperText={errors.inStock?.message}
                        />

                        <TextField
                            label="Precio"
                            type="number"
                            variant="filled"
                            fullWidth
                            sx={{ mb: 1 }}
                            {...register('price', {
                                required: 'Este campo es requerido',
                                min: { value: 0, message: 'El valor minimo es 0' },
                            })}
                            error={!!errors.price}
                            helperText={errors.price?.message}
                        />

                        <Divider sx={{ my: 1 }} />

                        <FormControl sx={{ mb: 1 }}>
                            <FormLabel>Tipo</FormLabel>
                            <RadioGroup
                                row
                                value={getValues('type')}
                                onChange={({ target }) =>
                                    setValue('type', target.value, {
                                        shouldValidate: true,
                                    })
                                }
                            >
                                {validTypes.map((option) => (
                                    <FormControlLabel
                                        key={option}
                                        value={option}
                                        control={<Radio color="secondary" />}
                                        label={capitalize(option)}
                                    />
                                ))}
                            </RadioGroup>
                        </FormControl>

                        <FormControl sx={{ mb: 1 }}>
                            <FormLabel>Género</FormLabel>
                            <RadioGroup
                                row
                                value={getValues('gender')}
                                onChange={({ target }) => {
                                    setValue('gender', target.value, {
                                        shouldValidate: true,
                                    });
                                }}
                            >
                                {validGender.map((option) => (
                                    <FormControlLabel
                                        key={option}
                                        value={option}
                                        control={<Radio color="secondary" />}
                                        label={capitalize(option)}
                                    />
                                ))}
                            </RadioGroup>
                        </FormControl>

                        <FormGroup>
                            <FormLabel>Tallas</FormLabel>
                            {validSizes.map((size) => (
                                <FormControlLabel
                                    key={size}
                                    control={
                                        <Checkbox
                                            checked={getValues('sizes').includes(size)}
                                        />
                                    }
                                    label={size}
                                    onChange={() => onChangeSize(size)}
                                />
                            ))}
                        </FormGroup>
                    </Grid>

                    {/* Tags e imagenes */}
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Slug - URL"
                            variant="filled"
                            fullWidth
                            sx={{ mb: 1 }}
                            {...register('slug', {
                                required: 'Este campo es requerido',
                                validate: (val) =>
                                    val.trim().includes(' ')
                                        ? 'No puede tener espacios en blanco'
                                        : undefined,
                            })}
                            error={!!errors.slug}
                            helperText={errors.slug?.message}
                        />

                        <TextField
                            label="Etiquetas"
                            variant="filled"
                            fullWidth
                            sx={{ mb: 1 }}
                            helperText="Presiona [spacebar] para agregar"
                            value={newTagValue}
                            onChange={({ target }) => setNewTagValue(target.value)}
                            onKeyUp={({ code }) =>
                                code === 'Space' ? onNewTag() : undefined
                            }
                        />

                        <Box
                            sx={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                listStyle: 'none',
                                p: 0,
                                m: 0,
                            }}
                            component="ul"
                        >
                            {getValues('tags').map((tag) => {
                                return (
                                    <Chip
                                        key={tag}
                                        label={tag}
                                        onDelete={() => onDeleteTag(tag)}
                                        color="primary"
                                        size="small"
                                        sx={{ ml: 1, mt: 1 }}
                                    />
                                );
                            })}
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        <Box display="flex" flexDirection="column">
                            <FormLabel sx={{ mb: 1 }}>Imágenes</FormLabel>
                            <Button
                                color="secondary"
                                fullWidth
                                startIcon={<UploadOutlined />}
                                sx={{ mb: 3 }}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                Cargar imagen
                            </Button>

                            <input
                                ref={fileInputRef}
                                type="file"
                                multiple
                                accept="image/png, image/gif, imagen/jpeg, imagen/jpg"
                                style={{ display: 'none' }}
                                onChange={onFileSelected}
                            />

                            <Chip
                                label="Es necesario al 2 imagenes"
                                color="error"
                                variant="outlined"
                                sx={{
                                    display:
                                        getValues('images').length < 2 ? 'flex' : 'none',
                                }}
                            />

                            <Grid container spacing={2}>
                                {getValues('images').map((img) => (
                                    <Grid item xs={4} sm={3} key={img}>
                                        <Card>
                                            <CardMedia
                                                component="img"
                                                className="fadeIn"
                                                image={`/products/${img}`}
                                                alt={img}
                                            />
                                            <CardActions>
                                                <Button
                                                    fullWidth
                                                    color="error"
                                                    onClick={() => onDeleteImage(img)}
                                                >
                                                    Borrar
                                                </Button>
                                            </CardActions>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                    </Grid>
                </Grid>
            </form>
        </AdminLayout>
    );
};

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
    const { slug = '' } = query;

    let product: IProduct | null;

    if (slug === 'new') {
        // crear un producto
        const tempProduct = JSON.parse(JSON.stringify(new Product()));
        delete tempProduct._id;
        tempProduct.images = [];
        product = tempProduct;
    } else {
        product = await dbProducts.getProductBySlug(slug.toString());
    }

    if (!product) {
        return {
            redirect: {
                destination: '/admin/products',
                permanent: false,
            },
        };
    }

    return {
        props: {
            product,
        },
    };
};

export default ProductAdminPage;
