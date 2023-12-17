import { ISize } from '@/interfaces';
import { Box, Button } from '@mui/material';
import { FC } from 'react';
interface Props {
    selectedSize?: ISize;
    sizes: ISize[];

    // Method
    onSelectedSize: (size: ISize) => void;
}

export const SizeSelector: FC<Props> = ({ selectedSize, sizes, onSelectedSize }) => {
    return (
        <Box>
            {sizes.map((size) => (
                <Button
                    sx={{
                        '&:focus': { background: '#000 !important' },
                        '&:hover': { background: '#001 !important', color: 'white' },
                    }}
                    key={size}
                    size="small"
                    color={selectedSize === size ? 'primary' : 'info'}
                    onClick={() => onSelectedSize(size)}
                >
                    {size}
                </Button>
            ))}
        </Box>
    );
};
