import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Stack,
    IconButton,
    Tooltip,
    Box,
    Typography
} from '@mui/material';
import { HiPencil, HiReply, HiTrash } from "react-icons/hi";
import PropTypes from 'prop-types'

export default function UserTable({
    data,
    page,
    rowsPerPage,
    totalRows,
    handleChangePage,
    handleChangeRowsPerPage,
    handleDelete,
    handleRestore,
    handleOpenDrawer,
    handleDetail,
}) {

    return (
        <Box sx={{ width: '100%', overflow: 'hidden', fontFamily: "poppins" }}>
            <TableContainer sx={{ maxHeight: 450 }}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            <TableCell>No</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Phone</TableCell>
                            <TableCell>Role</TableCell>
                            <TableCell>Delete Date</TableCell>
                            <TableCell align="center">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.length > 0 ? (
                            data.map((row, index) => (
                                <TableRow hover key={row.id} >
                                    <TableCell>{index + 1 + (page * rowsPerPage)}</TableCell>
                                    <TableCell >
                                        <Tooltip title="Detail" onClick={() => { handleDetail(row.id) }}>
                                            <Typography
                                                variant='body2'
                                                className='hover:text-kahf-green text-blue-400 hover:cursor-pointer underline-offset-2 underline'
                                                component="button"
                                            >
                                                {row.name}
                                            </Typography>
                                        </Tooltip>
                                    </TableCell>
                                    <TableCell>{row.email}</TableCell>
                                    <TableCell>{row.phone || '-'}</TableCell>
                                    <TableCell>{row.role?.name || '-'}</TableCell>
                                    <TableCell>{row.formattedDeletedAt || '-'}</TableCell>
                                    <TableCell align="center">
                                        <Stack direction="row" spacing={1} justifyContent="center">
                                            {!row.deletedAt ? (
                                                <Tooltip title="Edit">
                                                    <IconButton size="small" color="primary" onClick={() => handleOpenDrawer("edit", row)}>
                                                        <HiPencil size={20} />
                                                    </IconButton>
                                                </Tooltip>
                                            ) : (
                                                <Tooltip title="Restore" onClick={() => { handleRestore(row) }}>
                                                    <IconButton size="small" color="warning">
                                                        <HiReply size={20} />
                                                    </IconButton>
                                                </Tooltip>
                                            )}
                                            <Tooltip title="Delete">
                                                <IconButton size="small" color="error" onClick={() => { handleDelete(row) }}>
                                                    <HiTrash size={20} />
                                                </IconButton>
                                            </Tooltip>
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} align="center">
                                    Tidak ada data tersedia.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={totalRows}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Box>
    );
}

UserTable.propUserTypes = {
    data: PropTypes.any,
    page: PropTypes.number,
    rowsPerPage: PropTypes.number,
    totalRows: PropTypes.number,
    handleChangePage: PropTypes.func.isRequired,
    handleChangeRowsPerPage: PropTypes.func.isRequired,
    handleDelete: PropTypes.func.isRequired,
}
