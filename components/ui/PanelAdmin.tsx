import {
    AdminPanelSettings,
    ConfirmationNumberOutlined,
    DashboardOutlined,
} from '@mui/icons-material';
import {
    Divider,
    ListItem,
    ListItemIcon,
    ListItemText,
    ListSubheader,
} from '@mui/material';
import React, { FC } from 'react';

interface Props {
    navigateTo: (url: string) => void;
}

export const PanelAdmin: FC<Props> = ({ navigateTo }) => {
    return (
        <>
            <Divider />
            <ListSubheader>Panel Administrador</ListSubheader>

            <ListItem button onClick={() => navigateTo('/admin')}>
                <ListItemIcon>
                    <DashboardOutlined />
                </ListItemIcon>
                <ListItemText primary={'Dashboard'} />
            </ListItem>
            <ListItem button>
                <ListItemIcon>
                    <ConfirmationNumberOutlined />
                </ListItemIcon>
                <ListItemText primary={'Ordenes'} />
            </ListItem>

            <ListItem button onClick={() => navigateTo('/admin/users')}>
                <ListItemIcon>
                    <AdminPanelSettings />
                </ListItemIcon>
                <ListItemText primary={'Usuarios'} />
            </ListItem>
        </>
    );
};
