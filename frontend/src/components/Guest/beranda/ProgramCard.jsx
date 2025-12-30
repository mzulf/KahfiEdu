import { Typography } from "@mui/material";

export default function ProgramCard({ image, title, desc, isOdd }) {
    return (
        <div className={`flex flex-col justify-center space-y-6 ${isOdd ? 'mt-20' : ''}`}>
            <img src={image} alt={title} className="mx-auto" />
            <Typography
                variant="h4"
                component="p"
                fontSize={20}
                fontWeight="bold"
                textAlign="center"
            >
                {title}
            </Typography>
            <Typography
                fontSize={16}
                fontWeight={300}
                textAlign="center"
            >
                {desc}
            </Typography>
        </div>
    );
}
