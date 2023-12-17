import { useContext, useState } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import {
    AppBar,
    Box,
    Button,
    IconButton,
    Toolbar,
    Typography,
    Badge,
    Input,
    InputAdornment,
} from '@mui/material';
import { ClearOutlined, SearchOutlined, ShoppingCartOutlined } from '@mui/icons-material';
import { CartContext, UiContext } from '@/context';

export const Navbar = () => {
    const { asPath, push } = useRouter();
    const { toggleSideMenu } = useContext(UiContext);
    const { numbersOfItems } = useContext(CartContext);

    const [searchTerm, setSearchTerm] = useState('');
    const [isSearchVisible, setIsSearchVisible] = useState(false);

    const onSearchTerm = () => {
        if (searchTerm.trim().length === 0) return;
        push(`/search/${searchTerm}`);
    };

    return (
        <AppBar>
            <Toolbar>
                <NextLink href="/" passHref>
                    <Box display="flex" alignItems="center">
                        <Typography variant="h6">Teslo |</Typography>
                        <Typography sx={{ ml: 0.5 }}>Shop</Typography>
                    </Box>
                </NextLink>

                <Box flex={1} />
                <Box
                    className="fadeIn"
                    sx={{
                        display: isSearchVisible ? 'none' : { xs: 'none', sm: 'flex' },
                        gap: '10px',
                    }}
                >
                    <NextLink href="/category/men" passHref>
                        <Button
                            disableRipple
                            sx={{
                                borderBottom: `1px solid ${
                                    asPath === '/category/men' && '#274494'
                                }`,
                                borderTop: `1px solid ${
                                    asPath === '/category/men' && '#274494'
                                }`,
                            }}
                        >
                            Hombres
                        </Button>
                    </NextLink>

                    <NextLink href="/category/women" passHref>
                        <Button
                            disableRipple
                            sx={{
                                borderBottom: `1px solid ${
                                    asPath === '/category/women' && '#274494'
                                }`,
                                borderTop: `1px solid ${
                                    asPath === '/category/women' && '#274494'
                                }`,
                            }}
                        >
                            Mujeres
                        </Button>
                    </NextLink>

                    <NextLink href="/category/kid" passHref>
                        <Button
                            disableRipple
                            sx={{
                                borderBottom: `1px solid ${
                                    asPath === '/category/kid' && '#274494'
                                }`,
                                borderTop: `1px solid ${
                                    asPath === '/category/kid' && '#274494'
                                }`,
                            }}
                        >
                            Niños
                        </Button>
                    </NextLink>
                </Box>

                <Box flex={1} />

                {/* Pantallas pequeñas */}

                {isSearchVisible ? (
                    <Input
                        sx={{
                            display: { xs: 'none', sm: 'flex' },
                        }}
                        className="fadeIn"
                        value={searchTerm}
                        autoFocus
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyUp={(e) => (e.key === 'Enter' ? onSearchTerm() : null)}
                        type="text"
                        placeholder="Buscar..."
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton onClick={() => setIsSearchVisible(false)}>
                                    <ClearOutlined />
                                </IconButton>
                            </InputAdornment>
                        }
                    />
                ) : (
                    <IconButton
                        sx={{ display: { xs: 'none', sm: 'flex' } }}
                        className="fadeIn"
                        onClick={() => setIsSearchVisible(true)}
                    >
                        <SearchOutlined />
                    </IconButton>
                )}

                {/* Pantallas pequeñas */}
                <IconButton
                    sx={{ display: { xs: 'flex', sm: 'none' } }}
                    onClick={toggleSideMenu}
                >
                    <SearchOutlined />
                </IconButton>

                <NextLink href="/cart" passHref>
                    <IconButton>
                        <Badge
                            badgeContent={numbersOfItems > 9 ? '+9' : numbersOfItems}
                            color="secondary"
                        >
                            <ShoppingCartOutlined />
                        </Badge>
                    </IconButton>
                </NextLink>

                <Button onClick={toggleSideMenu}>Menu</Button>
            </Toolbar>
        </AppBar>
    );
};
