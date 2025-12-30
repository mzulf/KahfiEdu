import { Box, IconButton, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Tooltip, Typography } from "@mui/material"
import { HiPencil, HiReply, HiTrash } from "react-icons/hi";
import { useNavigate } from "react-router-dom";


export default function ClassTable({ data, page, rowsPerPage, totalRows, handleChangePage, handleChangeRowsPerPage, handleDeleteClass, handleRestoreClass, handleOpenDrawer }) {
    const navigate = useNavigate();

    const handleDetail = (id) => {
        navigate(`/admin/class/detail?classId=${id}`);
    };

    return (
        <Box sx={{ width: '100%', overflow: 'hidden', fontFamily: "poppins" }}>
            <TableContainer sx={{ maxHeight: 450 }}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            <TableCell>No</TableCell>
                            <TableCell>Nama Kelas</TableCell>
                            <TableCell>Guru</TableCell>
                            <TableCell>Kursus</TableCell>
                            <TableCell>Jadwal</TableCell>
                            <TableCell>Mulai</TableCell>
                            <TableCell>Berakhir</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell align="center">Aksi</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.length > 0 ? (
                            data.map((row, index) => (
                                <TableRow hover key={row.id}>
                                    <TableCell>{index + 1 + (page * rowsPerPage)}</TableCell>
                                    <TableCell>
                                        <Tooltip title="Detail" onClick={() => handleDetail(row.id)}>
                                            <Typography
                                                variant='body2'
                                                className='hover:text-kahf-green text-blue-400 hover:cursor-pointer underline-offset-2 underline'
                                                component="button"
                                            >
                                                {row.name}
                                            </Typography>
                                        </Tooltip>
                                    </TableCell>
                                    <TableCell>{row.teacher?.name || '-'}</TableCell>
                                    <TableCell>{row.course?.title || '-'}</TableCell>
                                    <TableCell>{row.schedule || '-'}</TableCell>
                                    <TableCell>
                                        {row.startDate ? `${row.formattedStart}` : '-'}
                                    </TableCell>
                                    <TableCell>
                                        {row.endDate ? `${row.formattedEnd}` : '-'}
                                    </TableCell>
                                    <TableCell>{row.status}</TableCell>
                                    <TableCell align="center">
                                        <Stack direction="row" spacing={1} justifyContent="center">
                                            {!row.deletedAt ? (
                                                <Tooltip title="Edit">
                                                    <IconButton size="small" color="primary" onClick={() => handleOpenDrawer("edit", row)}>
                                                        <HiPencil size={20} />
                                                    </IconButton>
                                                </Tooltip>
                                            ) : (
                                                <Tooltip title="Pulihkan" onClick={() => handleRestoreClass(row)}>
                                                    <IconButton size="small" color="warning">
                                                        <HiReply size={20} />
                                                    </IconButton>
                                                </Tooltip>
                                            )}
                                            <Tooltip title="Hapus">
                                                <IconButton size="small" color="error" onClick={() => handleDeleteClass(row)}>
                                                    <HiTrash size={20} />
                                                </IconButton>
                                            </Tooltip>
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={8} align="center">
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
    )
}
