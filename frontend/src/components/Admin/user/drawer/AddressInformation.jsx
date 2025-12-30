import { FormControl, Grid, InputLabel, MenuItem, Select, Stack, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import useAlert from "../../../../hooks/useAlert";
import regionService from "../../../../services/regionService";
import { getIdByName } from "../../../../utils/regionUtils";

export default function AddressInformation({ control, submitting, watch, setValue }) {
    const [provinces, setProvinces] = useState([]);
    const [regencies, setRegencies] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [villages, setVillages] = useState([]);
    const { showAlert } = useAlert()

    const provinceId = watch("province");
    const regencyId = watch("regency");
    const districtId = watch("district");

    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                const data = await regionService.getRegions(); // tanpa params
                setProvinces(data.provinces || []);
            } catch (error) {
                showAlert(error.message, "error");
            }
        };
        fetchProvinces();
    }, []);

    useEffect(() => {
        const fetchRegencies = async () => {
            const provinceName = watch("province");
            const provinceId = getIdByName(provinces, provinceName);
            if (!provinceId) return;

            try {
                setValue("regency", "");
                setValue("district", "");
                setValue("village", "");
                const data = await regionService.getRegions({ provinceId });
                setRegencies(data.regencies || []);
            } catch (error) {
                showAlert(error.message, "error");
            }
        };
        fetchRegencies();
    }, [watch("province")]);

    useEffect(() => {
        const fetchDistricts = async () => {
            const regencyName = watch("regency");
            const regencyId = getIdByName(regencies, regencyName);
            if (!regencyId) return;

            try {
                setValue("district", "");
                setValue("village", "");
                const data = await regionService.getRegions({ regencyId });
                setDistricts(data.districts || []);
            } catch (error) {
                showAlert(error.message, "error");
            }
        };
        fetchDistricts();
    }, [watch("regency")]);

    useEffect(() => {
        const fetchVillages = async () => {
            const districtName = watch("district");
            const districtId = getIdByName(districts, districtName);
            if (!districtId) return;

            try {
                setValue("village", "");
                const data = await regionService.getRegions({ districtId });
                setVillages(data.villages || []);
            } catch (error) {
                showAlert(error.message, "error");
            }
        };
        fetchVillages();
    }, [watch("district")]);


    return (
        <Stack spacing={2} mt={2}>
            <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Controller
                        name="phone"
                        control={control}
                        render={({ field }) => (
                            <TextField {...field} label="Phone" fullWidth disabled={submitting} />
                        )}
                    />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Controller
                        name="gender"
                        control={control}
                        render={({ field }) => (
                            <FormControl fullWidth disabled={submitting}>
                                <InputLabel>Gender</InputLabel>
                                <Select {...field} label="Gender">
                                    <MenuItem value="laki-laki">Laki-laki</MenuItem>
                                    <MenuItem value="perempuan">Perempuan</MenuItem>
                                </Select>
                            </FormControl>
                        )}
                    />
                </Grid>
            </Grid>
            <Typography variant="body2" mb={1}>
                Address Informaion
            </Typography>
            <Controller
                name="alamat"
                control={control}
                render={({ field }) => (
                    <TextField {...field} label="Alamat" fullWidth disabled={submitting} />
                )}
            />

            <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Controller
                        name="province"
                        control={control}
                        render={({ field }) => (
                            <FormControl fullWidth disabled={submitting}>
                                <InputLabel>Provinsi</InputLabel>
                                <Select {...field} label="Provinsi">
                                    {provinces.map((prov) => (
                                        <MenuItem key={prov.id} value={prov.name}>
                                            {prov.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        )}
                    />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                    <Controller
                        name="regency"
                        control={control}
                        render={({ field }) => (
                            <FormControl fullWidth disabled={submitting || !provinceId}>
                                <InputLabel>Kabupaten</InputLabel>
                                <Select {...field} label="Kabupaten">
                                    {regencies.length === 0 ? (
                                        <MenuItem value="" disabled>
                                            Tidak ada data kabupaten
                                        </MenuItem>
                                    ) : (
                                        regencies.map((reg) => (
                                            <MenuItem key={reg.id} value={reg.name}>
                                                {reg.name}
                                            </MenuItem>
                                        ))
                                    )}
                                </Select>
                            </FormControl>
                        )}
                    />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                    <Controller
                        name="district"
                        control={control}
                        render={({ field }) => (
                            <FormControl fullWidth disabled={submitting || !regencyId}>
                                <InputLabel>Kecamatan</InputLabel>
                                <Select {...field} label="Kecamatan">
                                    {districts.map((dist) => (
                                        <MenuItem key={dist.id} value={dist.name}>
                                            {dist.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        )}
                    />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                    <Controller
                        name="village"
                        control={control}
                        render={({ field }) => (
                            <FormControl fullWidth disabled={submitting || !districtId}>
                                <InputLabel>Desa</InputLabel>
                                <Select {...field} label="Desa">
                                    {villages.map((vill) => (
                                        <MenuItem key={vill.id} value={vill.name}>
                                            {vill.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        )}
                    />
                </Grid>
            </Grid>

        </Stack>
    );
}
