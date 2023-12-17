import { Box, CircularProgress, Typography } from '@mui/material';

export const ScreenLoading = () => {
    return (
        <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            height="calc(100vh - 200px)"
        >
            <Typography
                sx={{ mb: 2, letterSpacing: '2px' }}
                variant="h2"
                fontWeight={200}
                fontSize={20}
            >
                Cargando...
            </Typography>
            <CircularProgress thickness={1} />
        </Box>
    );
};
