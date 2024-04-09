import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { Grid, MenuItem, Select } from '@mui/material';
import { PeopleOutline } from '@mui/icons-material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';

import { AdminLayout } from '../../components/layouts';
import { IUser } from '@/interfaces';
import { tesloApi } from '@/api';

interface IUserList {
    users: IUser[] | undefined;
}

const UsersPage = () => {
    const [users, setUsers] = useState<IUser[]>([]);
    const { data, error } = useSWR<IUserList>('/api/admin/users');

    useEffect(() => {
        if (data?.users) {
            setUsers(data.users);
        }
    }, [data?.users]);

    if (!data?.users && !error) return <></>;

    const columns: GridColDef[] = [
        { field: 'email', headerName: 'Correo', width: 250 },
        { field: 'name', headerName: 'Nombre completo', width: 250 },
        {
            field: 'role',
            headerName: 'Rol',
            width: 300,
            renderCell: ({ row }: GridRenderCellParams) => {
                return (
                    <Select
                        value={row.role}
                        label="Role"
                        onChange={({ target }) => onRoleUpdate(row.id, target.value)}
                        sx={{ width: '300px' }}
                    >
                        <MenuItem value="admin">Admin</MenuItem>
                        <MenuItem value="client">Client</MenuItem>
                        <MenuItem value="SEO">SEO</MenuItem>
                    </Select>
                );
            },
        },
    ];

    const rows = users.map((user: IUser) => ({
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
    }));

    const onRoleUpdate = async (userId: string, newRole: string) => {
        const previosUsers = users.map((user) => ({ ...user }));
        const updatedUsers = users.map((user) => ({
            ...user,
            role: userId === user._id ? newRole : user.role,
        }));

        setUsers(updatedUsers);

        try {
            await tesloApi.put('/admin/users', { userId, role: newRole });
        } catch (error) {
            setUsers(previosUsers);
            console.log(error);
            alert('Failed to update user');
        }
    };

    return (
        <AdminLayout
            title={'Usuarios'}
            subTitle={'Mantenimiento de usuarios'}
            icon={<PeopleOutline />}
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

export default UsersPage;
