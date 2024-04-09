import { ConfirmationNumberOutlined } from '@mui/icons-material';
import { Chip, Grid } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';

import { AdminLayout } from '../../../components/layouts';
import useSWR from 'swr';
import { IOrder, IUser } from '@/interfaces';

interface IOrdenList {
    orders: IOrder[] | undefined;
}

const columns: GridColDef[] = [
    { field: 'id', headerName: 'Orden ID', width: 280 },
    { field: 'email', headerName: 'Correo', width: 250 },
    { field: 'name', headerName: 'Nombre completo', width: 250 },
    { field: 'total', headerName: 'Monto total', width: 150 },

    {
        field: 'isPaid',
        headerName: 'Pagada',
        renderCell: ({ row }: GridRenderCellParams) => {
            return row.isPaid ? (
                <Chip variant="outlined" label="Pagada" color="success" />
            ) : (
                <Chip variant="outlined" label="Pendiente" color="warning" />
            );
        },
        width: 130,
    },
    { field: 'noProducts', headerName: 'No.Productos', align: 'center', width: 130 },
    {
        field: 'check',
        headerName: 'Ver orden',
        renderCell: ({ row }: GridRenderCellParams) => {
            return (
                <a href={`/admin/orders/${row.id}`} target="_blank">
                    Ver orden
                </a>
            );
        },
    },
    { field: 'createAt', headerName: 'Creada', width: 100 },
];

const OrdersPage = () => {
    const { data, error } = useSWR<IOrdenList>('/api/admin/orders');

    if (!data?.orders && !error) return <></>;

    const rows = data!.orders!.map((order: IOrder) => ({
        id: order._id,
        email: (order.user as IUser).email,
        name: (order.user as IUser).name,
        total: order.total,
        isPaid: order.isPaid,
        noProducts: order.numbersOfItems,
        createAt: order.createdAt ? order.createdAt.slice(0, 10) : '',
    }));

    return (
        <AdminLayout
            title={'Ordenes'}
            subTitle={'Mantenimiento de ordenes'}
            icon={<ConfirmationNumberOutlined />}
        >
            <Grid container className="fadeIn">
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
        </AdminLayout>
    );
};

export default OrdersPage;
