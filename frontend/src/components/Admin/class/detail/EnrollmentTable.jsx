import {
    Box,
    Card,
    CardContent,
    Chip,
    LinearProgress,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Tooltip,
    Typography,
    TablePagination
} from "@mui/material";
import { useState } from "react";
import { capitalizeFirst } from "../../../../utils/formatedFont";

export default function EnrollmentTable({ enrollments = [], navigate }) {

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const paginatedEnrollments = enrollments.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    return (
        <Card sx={{ mb: 2 }}>
            <CardContent>
                <Typography variant="h6" fontWeight="bold" mb={1}>
                    Daftar Siswa
                </Typography>
                <Table stickyHeader aria-label="Enrollment Table">
                    <TableHead>
                        <TableRow>
                            <TableCell>No</TableCell>
                            <TableCell>Nama</TableCell>
                            <TableCell>Gender</TableCell>
                            <TableCell>Orang Tua</TableCell>
                            <TableCell>Hubungan</TableCell>
                            <TableCell>Progress</TableCell>
                            <TableCell>Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedEnrollments.length > 0 ? (
                            paginatedEnrollments.map((row, index) => {
                                const student = row.student;
                                const child = row.child;

                                const name = student?.name || child?.name || "-";
                                const gender = student?.gender || child?.gender || "-";
                                const parentName = child?.parent?.name || "-";
                                const progress = row.progress ?? 0;
                                const statusRaw = row.status?.toLowerCase() || "pending";
                                const relationship = capitalizeFirst(child?.relationship) || "-";

                                let chipColor = "default";
                                switch (statusRaw) {
                                    case "active":
                                        chipColor = "primary";
                                        break;
                                    case "completed":
                                        chipColor = "success";
                                        break;
                                    case "pending":
                                    default:
                                        chipColor = "default";
                                        break;
                                }

                                return (
                                    <TableRow hover key={row.id}>
                                        <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                                        <TableCell>
                                            <Tooltip title="Lihat detail">
                                                <Typography
                                                    variant="body2"
                                                    onClick={() => {
                                                        if (student?.id) {
                                                            navigate(`/admin/user/detail?userId=${student.id}`);
                                                        } else if (child?.id) {
                                                            navigate(`/admin/child/detail?childId=${child.id}`);
                                                        }
                                                    }}
                                                    sx={{
                                                        color: "primary.main",
                                                        cursor: "pointer",
                                                        "&:hover": {
                                                            color: "success.main",
                                                            textDecoration: "underline",
                                                        }
                                                    }}
                                                    component="button"
                                                >
                                                    {name}
                                                </Typography>
                                            </Tooltip>
                                        </TableCell>
                                        <TableCell>{gender}</TableCell>
                                        <TableCell>
                                            {student ? (
                                                "-"
                                            ) : (
                                                <Tooltip title="Lihat detail">
                                                    <Typography
                                                        variant="body2"
                                                        onClick={() => {
                                                            if (child?.parent?.id) {
                                                                navigate(`/admin/user/detail?userId=${child.parent.id}`);
                                                            }
                                                        }}
                                                        sx={{
                                                            color: "primary.main",
                                                            cursor: "pointer",
                                                            "&:hover": {
                                                                color: "success.main",
                                                                textDecoration: "underline",
                                                            }
                                                        }}
                                                        component="button"
                                                    >
                                                        {parentName}
                                                    </Typography>
                                                </Tooltip>
                                            )}
                                        </TableCell>
                                        <TableCell>{student ? "-" : relationship}</TableCell>
                                        <TableCell>
                                            <Box>
                                                <Typography variant="caption" fontWeight="bold">
                                                    {progress}%
                                                </Typography>
                                                <LinearProgress
                                                    variant="determinate"
                                                    value={progress}
                                                    sx={{ height: 6, borderRadius: 4, mt: 0.5 }}
                                                />
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={capitalizeFirst(statusRaw)}
                                                color={chipColor}
                                                size="small"
                                            />
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        ) : (
                            <TableRow>
                                <TableCell colSpan={7} align="center">
                                    Tidak ada data tersedia.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>

                <TablePagination
                    component="div"
                    count={enrollments.length}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    rowsPerPageOptions={[5, 10, 25, 50]}
                />
            </CardContent>
        </Card>
    );
}
