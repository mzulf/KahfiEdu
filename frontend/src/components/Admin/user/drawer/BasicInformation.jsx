import { Box, Grid, IconButton, InputAdornment, MenuItem, Stack, TextField, Typography } from "@mui/material";
import { Controller } from "react-hook-form";
import AvatarUpload from "./AvatarUpload";
import { useState } from "react";
import { HiEye, HiEyeOff } from "react-icons/hi";

export default function BasicInformation({ control, errors, submitting, roles, editMode, user, onAvatarSelect }) {
    const [showPassword, setShowPassword] = useState(false);
    return (
        <Stack spacing={2}>
            <Box>
                <Typography variant="body2" mb={1}>
                    Avatar max 2MB
                </Typography>
                <AvatarUpload
                    onFileSelect={onAvatarSelect}
                    initialAvatarUrl={editMode && user ? user.avatar : null}
                />
            </Box>
            <Typography variant="body2" mb={1}>
                Basic Informaion
            </Typography>
            <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: !editMode ? 6 : 12 }}>
                    <Controller
                        name="name"
                        control={control}
                        rules={{ required: "Name is required" }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Name"
                                fullWidth
                                disabled={submitting}
                                error={!!errors.name}
                                helperText={errors.name?.message}
                            />
                        )}
                    />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Controller
                        name="email"
                        control={control}
                        rules={{
                            required: "Email is required",
                            pattern: {
                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                message: "Invalid email address"
                            }
                        }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Email"
                                fullWidth
                                disabled={submitting}
                                error={!!errors.email}
                                helperText={errors.email?.message}
                            />
                        )}
                    />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                    <Controller
                        name="roleId"
                        control={control}
                        rules={{
                            required: "Role is required"
                        }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                select
                                label="Role"
                                fullWidth
                                disabled={submitting}
                            >
                                <MenuItem value=""><em>None</em></MenuItem>
                                {roles.map((role) => (
                                    <MenuItem key={role.id} value={role.id}>
                                        {role.name.replace(/\b\w/g, (char) => char.toUpperCase())}
                                    </MenuItem>
                                ))}
                            </TextField>
                        )}
                    />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                    {!editMode && (
                        <Controller
                            name="password"
                            control={control}
                            rules={{
                                required: "Password is required",
                                minLength: {
                                    value: 8,
                                    message: "Password minimal 8 karakter"
                                }
                            }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Password"
                                    type={showPassword ? "text" : "password"}
                                    fullWidth
                                    disabled={submitting}
                                    error={!!errors.password}
                                    helperText={errors.password?.message}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    edge="end"
                                                >
                                                    {showPassword ? <HiEyeOff size={20} /> : <HiEye size={20} />}
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }}
                                />
                            )}
                        />
                    )}
                </Grid>
            </Grid>
        </Stack>
    );
}
