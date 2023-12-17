import NextLink from 'next/link';
import { ShopLayout } from '@/components/layouts';
import { Typography, Grid, Chip } from '@mui/material';
import {
    DataGrid,
    GridColDef,
    GridRowsProp,
    GridRenderCellParams,
} from '@mui/x-data-grid';

const rows: GridRowsProp = [
    { id: 1, paid: true, fullname: 'Heri Espinosa' },
    { id: 2, paid: false, fullname: 'Logan Espinosa' },
    { id: 3, paid: true, fullname: 'Loriel Salvador' },
    { id: 4, paid: false, fullname: 'Witneisy Espinosa' },
    { id: 5, paid: false, fullname: 'Edward Reyes' },
];

const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'fullname', headerName: 'Nombre Completo', width: 300 },
    {
        field: 'paid',
        headerName: 'Pagada',
        description: 'Muestra informacion si la orden esta pagada o no',
        width: 200,
        renderCell: (params: GridRenderCellParams) =>
            params.row.paid ? (
                <Chip color="success" label="Pagada" variant="outlined" />
            ) : (
                <Chip color="warning" label="No Pagada" variant="outlined" />
            ),
    },
    {
        field: 'linkOrder',
        headerName: 'Enlace a la orden',
        width: 200,
        sortable: false,

        renderCell: (params: GridRenderCellParams) => (
            <NextLink href={`/orders/${params.row.id}`} passHref>
                <Typography borderBottom="1px dashed #3A64D8">Ver orden</Typography>
            </NextLink>
        ),
    },
];

const history = () => {
    return (
        <ShopLayout
            title="Historial de ordenes"
            pageDescription="Historial de ordenes del cliente"
        >
            <Typography variant="h1" component="h1">
                Historial de ordenes
            </Typography>

            <Grid container>
                <Grid item xs={12} sx={{ height: 650, width: '100%' }}>
                    <DataGrid
                        sx={{
                            '&.MuiDataGrid-root .MuiDataGrid-cell:focus-within': {
                                outline: 'none !important',
                            },
                            '&.MuiDataGrid-root .MuiDataGrid-columnHeader:focus': {
                                outline: 'none !important',
                            },
                        }}
                        rows={rows}
                        columns={columns}
                        pageSizeOptions={[10, 20, 30]}
                        autoPageSize
                    />
                </Grid>
            </Grid>
        </ShopLayout>
    );
};

export default history;
