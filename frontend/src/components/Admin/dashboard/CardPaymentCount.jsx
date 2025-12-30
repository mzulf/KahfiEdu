import { Box, Card, CardContent, Typography } from "@mui/material";
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
    { name: 'Di terima', value: 50 },
    { name: 'Di tolak', value: 20 },
    { name: 'Di proses', value: 6 },
];

const COLORS = ['#1B986E', '#F44336', '#FFB300'];

export default function CardPaymentCount() {
    return (
        <>
            <Typography mb={2} fontWeight={500} fontSize="20px" ml={1}>
                Jumlah Pembayaran
            </Typography>
            <Card>
                <CardContent>
                    <Box height={300}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </Box>
                </CardContent>
            </Card>
        </>
    )
}
