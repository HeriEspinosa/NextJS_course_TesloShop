import NextLink from 'next/link';
import { AppBar, IconButton, Toolbar } from '@mui/material';
import { HomeOutlined } from '@mui/icons-material';

export const NavbarAuth = () => {
    return (
        <AppBar sx={{ maxWidth: 1440 }}>
            <Toolbar>
                <NextLink href="/" passHref>
                    <IconButton>
                        <HomeOutlined />
                    </IconButton>
                </NextLink>
            </Toolbar>
        </AppBar>
    );
};
