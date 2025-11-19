import { Box, Typography } from "@mui/material";

export default function FeatureCard({ icon: Icon, title, desc }) {
    return (
        <Box className="text-black p-4 space-y-4 bg-white rounded h-full">
            <Icon size={48} className="bg-kahf-green p-2 rounded-full" color="#fff" />
            <Typography variant="h6" fontWeight="bold">{title}</Typography>
            <Typography variant="body2">{desc}</Typography>
        </Box>
    );
}
