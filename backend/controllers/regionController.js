
const { createSuccessResponse, AppError, handleError } = require('../helpers/helperFunction');
const { getVillages, getDistricts, getRegencies, getProvinces } = require('../helpers/regionDataHelper');
const { Province, Regency, District, Village } = require('../models');
const { isAdmin } = require('../helpers/validationRole');

const getRegions = async (req, res) => {
    try {
        const { provinceId, regencyId, districtId, group = false } = req.query;

        let result;
        if (districtId) {
            result = await getVillages(districtId, group);
        } else if (regencyId) {
            result = await getDistricts(regencyId, group);
        } else if (provinceId) {
            result = await getRegencies(provinceId, group);
        } else {
            result = await getProvinces();
        }

        return res.status(200).json(result);
    } catch (error) {
        return handleError(error, res);
    }
};

const createRegion = async (req, res) => {
    try {
        const { type, name, provinceId, regencyId, districtId } = req.body;

        const validation = isAdmin(req.userRole, req.userId);
        if (!validation.isValid) {
            throw new AppError(validation.error.message, validation.error.status);
        }

        const userId = validation.userId

        if (!['province', 'regency', 'district', 'village'].includes(type)) {
            throw new AppError("Type harus province, regency, district atau village", 400);
        }

        if (!type || !name) {
            throw new AppError("Type dan name harus diisi", 400);
        }


        let newRegion;
        switch (type) {
            case 'province':
                newRegion = await Province.create({ name }, {
                    userId
                });
                break;
            case 'regency':
                if (!provinceId) {
                    throw new AppError("Province ID diperlukan", 400);
                }

                const existingProvince = await Province.findByPk(provinceId);
                if (!existingProvince) {
                    throw new AppError("Data province tidak ditemukan", 404);
                }

                const lastRegency = await Regency.findOne({
                    where: { province_id: provinceId },
                    order: [['id', 'DESC']]
                });

                const newRegencyId = lastRegency
                    ? parseInt(`${provinceId}${(parseInt(lastRegency.id.toString().slice(-2)) + 1).toString().padStart(2, '0')}`)
                    : parseInt(`${provinceId}01`);

                newRegion = await Regency.create({
                    id: newRegencyId,
                    name,
                    province_id: provinceId
                }, { userId });
                break;
            case 'district':
                if (!regencyId) {
                    throw new AppError("Regency ID diperlukan", 400)
                }

                const existingRegency = await Regency.findByPk(regencyId);
                if (!existingRegency) {
                    throw new AppError("Regency id tidak ditemukan", 404)
                }

                // Find the highest district ID for this regency
                const lastDistrict = await District.findOne({
                    where: {
                        regency_id: regencyId
                    },
                    order: [['id', 'DESC']]
                });

                let newDistrictId;
                if (lastDistrict) {
                    // If there are existing districts, increment the last ID
                    const lastId = lastDistrict.id.toString();
                    const sequence = parseInt(lastId.slice(-3)) + 1;
                    newDistrictId = parseInt(`${regencyId}${sequence.toString().padStart(3, '0')}`);
                } else {
                    // If this is the first district, start with 001
                    newDistrictId = parseInt(`${regencyId}001`);
                }

                newRegion = await District.create({
                    id: newDistrictId,
                    name,
                    regency_id: regencyId
                }, { userId: userId });
                break;

            case 'village':
                if (!districtId) {
                    throw new AppError("District id diperlukan", 400)
                }

                const existingDistrict = await District.findByPk(districtId);
                if (!existingDistrict) {
                    throw new AppError("District id tidak ditemukan", 404)
                }

                // Find the highest village ID for this district
                const lastVillage = await Village.findOne({
                    where: {
                        district_id: districtId
                    },
                    order: [['id', 'DESC']]
                });

                let newVillageId;
                if (lastVillage) {
                    // If there are existing villages, increment the last ID
                    const lastId = lastVillage.id.toString();
                    const sequence = parseInt(lastId.slice(-3)) + 1;
                    newVillageId = parseInt(`${districtId}${sequence.toString().padStart(3, '0')}`);
                } else {
                    // If this is the first village, start with 001
                    newVillageId = parseInt(`${districtId}001`);
                }

                newRegion = await Village.create({
                    id: newVillageId,
                    name,
                    district_id: districtId
                }, { userId: userId });
                break;
            default:
                throw new AppError("Tipe wilayah tidak valid", 400)
        }

        return res.status(201).json(createSuccessResponse(
            "Data wilayah berhasil dibuat",
            { region: newRegion }
        ));

    } catch (error) {
        return handleError(error, res)
    };
}

const updateRegion = async (req, res) => {
    try {
        const { id } = req.params;
        const { type, name, isActive } = req.body;

        const validation = isAdmin(req.userRole, req.userId);
        if (!validation.isValid) {
            throw new AppError(validation.error.message, validation.error.status);
        }

        if (!['province', 'regency', 'district', 'village'].includes(type)) {
            throw new AppError("Type harus province, regency, district atau village", 400);
        }

        const Model = {
            province: Province,
            regency: Regency,
            district: District,
            village: Village
        }[type];

        const region = await Model.findByPk(id);
        if (!region) {
            throw new AppError("Data wilayah tidak ditemukan", 404);
        }

        const updateData = {};
        if (name !== undefined) updateData.name = name;
        if (isActive !== undefined) updateData.isActive = isActive;

        await region.update(updateData, { userId: validation.userId });

        return res.status(200).json({
            success: true,
            message: "Data wilayah berhasil diperbarui",
            region
        });

    } catch (error) {
        return handleError(error, res);
    }
};

const deleteRegion = async (req, res) => {
    const { id } = req.params;
    const { type } = req.body;

    const validation = isAdmin(req.userRole, req.userId);
    if (!validation.isValid) {
        throw new AppError(validation.error.message, validation.error.status);
    }


    if (!['province', 'regency', 'district', 'village'].includes(type)) {
        throw new AppError("Type harus province, regency, district atau village", 400);
    }

    try {
        let Model;
        switch (type) {
            case 'province': Model = Province; break;
            case 'regency': Model = Regency; break;
            case 'district': Model = District; break;
            case 'village': Model = Village; break;
            default:
                throw new AppError("Tipe wilayah tidak valid", 400);
        }

        const region = await Model.findByPk(id, {
            paranoid: false,
        });

        if (!region) {
            throw new AppError("Data wilayah tidak ditemukan", 404)
        }

        if (region.deletedAt) {
            await region.destroy({
                force: true,
                userId: validation.userId
            })
            return res.status(200).json(
                createSuccessResponse(
                    "Data wilayah berhasil dihapus permanen")
            )
        }

        await region.destroy({
            userId: validation.userId
        }); // Soft delete karena paranoid: true

        return res.status(200).json(createSuccessResponse(
            "Data wilayah berhasil dihapus"
        ));

    } catch (error) {
        return handleError(error, res)
    }
};

const restoreRegion = async (req, res) => {
    const { id } = req.params;
    const { type } = req.body;

    const validation = isAdmin(req.userRole, req.userId);
    if (!validation.isValid) {
        throw new AppError(validation.error.message, validation.error.status);
    }

    if (!['province', 'regency', 'district', 'village'].includes(type)) {
        throw new AppError("Type harus province, regency, district atau village", 400);
    }

    try {
        let Model;
        switch (type) {
            case 'province': Model = Province; break;
            case 'regency': Model = Regency; break;
            case 'district': Model = District; break;
            case 'village': Model = Village; break;
            default:
                throw new AppError("Tipe wilayah tidak valid", 400);
        }

        const restored = await Model.restore({
            where: { id }
        }, {
            userId: validation.userId
        });

        if (!restored) {
            throw new AppError("Data wilayah tidak ditemukan", 404);
        }

        const region = await Model.findByPk(id);

        return res.status(200).json(createSuccessResponse(
            "Data wilayah berhasil dipulihkan",
            { region }
        ));

    } catch (error) {
        return handleError(error, res)
    }
};

module.exports = {
    getRegions,
    createRegion,
    updateRegion,
    deleteRegion,
    restoreRegion
};