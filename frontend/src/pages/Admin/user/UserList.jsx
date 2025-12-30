import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

// MUI components
import {
    Box,
    Card,
    CardContent,
    Grid,
    Typography,
    Stack,
    Button,
    debounce,
} from '@mui/material';


// Custom hooks
import useAlert from '../../../hooks/useAlert';
import { useLoading } from '../../../hooks/useLoading';
import { useConfirm } from '../../../hooks/useConfirm';

// Hero Icons
import { HiPlus } from 'react-icons/hi';

// Components
import UserTable from '../../../components/Admin/user/UserTable';
import UserFilterTable from '../../../components/Admin/user/UserFilterTable';
import UserCount from '../../../components/Admin/user/UserCount';
import UserDrawer from '../../../components/Admin/user/drawer/UserDrawer';
import userService from '../../../services/userService';
import roleService from '../../../services/roleService';



export default function UserList() {
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [selectedRoleId, setSelectedRoleId] = useState("");
    const [countByRole, setCountByRole] = useState([])
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [totalRows, setTotalRows] = useState(0);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("all");
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const { showAlert } = useAlert();
    const { showLoading, hideLoading } = useLoading();
    const confirm = useConfirm();
    const navigate = useNavigate();


    const fetchUsers = async () => {
        try {
            showLoading();
            const response = await userService.getUsers({
                page: page + 1,
                limit: rowsPerPage,
                search,
                status,
                roleId: selectedRoleId
            });
            if (response.success) {
                setUsers(response.users);
                setTotalRows(response.meta.total);
                setCountByRole(response.countByRole)
            } else {
                setUsers([]);
                setTotalRows(0);
            }
        } catch (error) {
            showAlert(error.message, 'error');
        } finally {
            hideLoading();
        }
    };

    const fetchRoles = async () => {
        try {
            showLoading();
            const response = await roleService.getRoles();
            if (response.success) {
                setRoles(response.roles);
                setTotalRows(response.meta.total);
            } else {
                setUsers([]);
                setTotalRows(0);
            }
        } catch (error) {
            showAlert(error.message, 'error');
        } finally {
            hideLoading();

        }
    }

    useEffect(() => {
        fetchUsers();
        fetchRoles();
    }, [page, rowsPerPage, search, status, selectedRoleId]);


    // Funxtion filter data
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Add search handler with debounce
    const handleSearch = debounce((value) => {
        setSearch(value);
        setPage(0);
    }, 500);

    // Add status change handler
    const handleStatusChange = (event) => {
        setStatus(event.target.value);
        setPage(0);
    };

    const handleRoleChange = (event) => {
        setSelectedRoleId(event.target.value);
        setPage(0);
    };

    const handleOpenDrawer = (mode, user) => {
        if (mode === "edit" && user) {
            setSelectedUser(user);
            setEditMode(true);
        } else {
            setSelectedUser(null);
            setEditMode(false);
        }
        setDrawerOpen(true);
    };

    const handleCloseDrawer = () => {
        setDrawerOpen(false);
        setSelectedUser(null);
    };


    // Function data user
    const handleDelete = async (user) => {
        const confirmed = await confirm({
            title: `Hapus Data Pengguna`,
            message: !user.deletedAt ? `Hapus data pengguna (softDelete) ${user.name}` : `Hapus data pengguna permanen ${user.name}`,
            confirmText: 'Delete',
            cancelText: 'Cancel',
            type: 'error'
        });

        if (confirmed) {
            showLoading();
            try {
                const response = await userService.deleteUser(user.id);
                if (response.success) {
                    showAlert(response.message, 'success');
                    fetchUsers();
                }
            } catch (error) {
                showAlert(error.message || "Failed to delete user", 'error');
            } finally {
                hideLoading();
            }
        }
    };

    const handleRestore = async (user) => {
        const confirmed = await confirm({
            title: `Pulihkan Data Pengguna`,
            message: `Are you sure to restore ${user.name}`,
            confirmText: 'Restore',
            cancelText: 'Cancel',
            type: 'warning'
        });

        if (confirmed) {
            showLoading();
            try {
                const response = await userService.restoreUser(user.id);
                if (response.success) {
                    showAlert(response.message, 'success');
                    fetchUsers();
                }
            } catch (error) {
                showAlert(error.message || "Failed to delete user", 'error');
            } finally {
                hideLoading();
            }
        }
    };

    const handleDetail = (id) => {
        navigate(`/admin/user/detail?userId=${id}`)
    };

    const totalUsers = useMemo(() => (
        countByRole.reduce((acc, curr) => acc + curr.total, 0)
    ), [countByRole]);


    return (
        <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 9 }}>
                <Card>
                    <CardContent>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                            <Box>
                                <Typography variant="h6" fontWeight="bold">
                                    Data Pengguna
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Export Data pengguna ke CSV, Excel
                                </Typography>
                            </Box>
                            <Stack direction="row" spacing={2}>
                                <Button
                                    variant="contained"
                                    startIcon={<HiPlus />}
                                    sx={{
                                        bgcolor: '#1B986E',
                                        '&:hover': {
                                            bgcolor: '#157A58'
                                        }
                                    }}
                                    onClick={() => handleOpenDrawer("add")}
                                >
                                    Add User
                                </Button>
                            </Stack>
                        </Box>

                        <UserFilterTable
                            roles={roles}
                            status={status}
                            selectedRoleId={selectedRoleId}
                            handleStatusChange={handleStatusChange}
                            handleRoleChange={handleRoleChange}
                            handleSearch={handleSearch}
                        />

                        <UserTable
                            data={users}
                            page={page}
                            rowsPerPage={rowsPerPage}
                            totalRows={totalRows}
                            handleChangePage={handleChangePage}
                            handleChangeRowsPerPage={handleChangeRowsPerPage}
                            handleDelete={handleDelete}
                            handleRestore={handleRestore}
                            handleOpenDrawer={handleOpenDrawer}
                            handleDetail={handleDetail}
                        />
                    </CardContent>
                </Card>
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
                <UserCount
                    countByRole={countByRole}
                    totalUsers={totalUsers}
                />
            </Grid>

            <UserDrawer
                open={drawerOpen}
                onClose={handleCloseDrawer}
                editMode={editMode}
                user={selectedUser}
                roles={roles}
                onSuccess={() => {
                    handleCloseDrawer();
                    fetchUsers();
                }}
            />
        </Grid>
    );
}