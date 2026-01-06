import { Typography, Box } from "@mui/material";

export default function ProgramCard({ image, title, desc, isOdd }) {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                gap: { xs: 3, md: 6 },
                mt: { xs: 0, md: isOdd ? 10 : 0 },
            }}
        >
            <Box
                component="img"
                src={image}
                alt={title}
                sx={{
                    mx: "auto",
                    maxWidth: "100%",
                    height: "auto",
                }}
            />

            <Typography
                component="p"
                fontWeight="bold"
                textAlign="center"
                sx={{
                    fontSize: { xs: 18, md: 20 },
                }}
            >
                {title}
            </Typography>

            <Typography
                fontWeight={300}
                textAlign="center"
                sx={{
                    fontSize: { xs: 14, md: 16 },
                }}
            >
                {desc}
            </Typography>
        </Box>
    );
}
