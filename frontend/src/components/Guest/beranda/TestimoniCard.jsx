import { Box, Typography, Card, CardContent, Avatar } from "@mui/material";

export default function TestimoniCard({ name, job, message, avatar }) {
    return (
        <Card
            sx={{
                height: "100%",
                bgcolor: "white",
                boxShadow: 3,
                borderRadius: 2,
            }}
        >
            <CardContent
                sx={{
                    p: { xs: 2, md: 3 },
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                    }}
                >
                    <Avatar
                        src={avatar}
                        alt={name}
                        sx={{
                            width: { xs: 40, md: 48 },
                            height: { xs: 40, md: 48 },
                        }}
                    />

                    <Box>
                        <Typography
                            fontWeight="bold"
                            sx={{ fontSize: { xs: 14, md: 16 } }}
                        >
                            {name}
                        </Typography>
                        <Typography
                            fontWeight={300}
                            sx={{ fontSize: { xs: 12, md: 14 } }}
                        >
                            {job}
                        </Typography>
                    </Box>
                </Box>

                <Typography
                    sx={{
                        mt: 2,
                        fontStyle: "italic",
                        fontSize: { xs: 14, md: 16 },
                    }}
                >
                    “{message}”
                </Typography>
            </CardContent>
        </Card>
    );
}
