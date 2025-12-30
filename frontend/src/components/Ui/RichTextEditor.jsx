import { InputLabel, Typography } from "@mui/material";
import { Controller } from "react-hook-form";

export default function RichTextEditor({ name, control, label, requiredMessage, errors, disabled = false }) {
    return (
        <div>
            {label && (
                <InputLabel shrink>
                    <Typography variant="body1" fontWeight={500} gutterBottom>
                        {label}
                    </Typography>
                </InputLabel>
            )}
        </div>
    );
}
