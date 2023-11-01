import NextLink from 'next/link';
import {
    AppBar,
    Box,
    Button,
    IconButton,
    Toolbar,
    Typography,
    Badge,
} from '@mui/material';
import { SearchOutlined, ShoppingCartOutlined } from '@mui/icons-material';

export const Navbar = () => {
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

                <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                    <NextLink href="/category/men" passHref>
                        <Button>Hombres</Button>
                    </NextLink>
                    <NextLink href="/category/women" passHref>
                        <Button>Mujeres</Button>
                    </NextLink>
                    <NextLink href="/category/kid" passHref>
                        <Button>Niños</Button>
                    </NextLink>
                    <NextLink href="/category/unisex" passHref>
                        <Button>Unisex</Button>
                    </NextLink>
                </Box>

                <Box flex={1} />

                <IconButton>
                    <SearchOutlined />
                </IconButton>
                <NextLink href="/cart" passHref>
                    <IconButton>
                        <Badge badgeContent={2} color="secondary">
                            <ShoppingCartOutlined />
                        </Badge>
                    </IconButton>
                </NextLink>

                <Button>Menu</Button>
            </Toolbar>
        </AppBar>
    );
};
