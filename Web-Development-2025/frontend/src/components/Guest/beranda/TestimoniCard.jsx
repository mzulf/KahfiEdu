import { Box, Typography, Card, CardContent, Avatar } from "@mui/material";

export default function TestimoniCard({ name, job, message, avatar }) {
    return (
        <Card className="h-full bg-white shadow-md rounded-md">
            <CardContent>
                <Box display="flex" alignItems="center" gap={2}>
                    <Avatar src={avatar} alt={name} />
                    <Box display="flex" flexDirection="column">
                        <Typography variant="subtitle1" fontWeight="bold">
                            {name}
                        </Typography>
                        <Typography variant="subtitle2" fontWeight={300}>
                            {job}
                        </Typography>
                    </Box>
                </Box>
                <Typography mt={2} variant="body1" fontStyle="italic" gutterBottom>
                    “{message}”
                </Typography>
            </CardContent>
        </Card>
    );
}
