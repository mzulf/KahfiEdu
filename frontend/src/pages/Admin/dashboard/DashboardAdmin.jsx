import { Box, Button, Grid, Typography } from "@mui/material"
import { HiDotsHorizontal } from "react-icons/hi"
import CardCourseDashboard from "../../../components/Admin/dashboard/CardCourseDashboard"
import CardTodayClass from "../../../components/Admin/dashboard/CardTodayClass"
import CardClassCount from "../../../components/Admin/dashboard/CardClassCount"
import CardPaymentCount from "../../../components/Admin/dashboard/CardPaymentCount"

function DashboardAdmin() {
    return (
        <div>
            <div className="space-y-6">
                <Typography mb={2} fontWeight={500} fontSize="20px" ml={1}>Program</Typography>
                <Grid container spacing={4}>
                    <Grid size={{ xs: 12, md: 3 }}>
                        <CardCourseDashboard />
                    </Grid>
                    <Grid size={{ xs: 12, md: 3 }}>
                        <CardCourseDashboard />
                    </Grid>
                    <Grid size={{ xs: 12, md: 3 }}>
                        <CardCourseDashboard />
                    </Grid>
                    <Grid size={{ xs: 12, md: 3 }}>
                        <CardCourseDashboard />
                    </Grid>
                </Grid>
                <Grid container spacing={4}>
                    <Grid size={{ xs: 12, md: 4 }} sx={{ height: '100%' }}>
                        <CardTodayClass />
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <CardClassCount />
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <CardPaymentCount />
                    </Grid>
                </Grid>
            </div>
        </div>
    )
}

export default DashboardAdmin
