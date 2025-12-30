const { Province, Regency, District, Village } = require('../models');
const { createSuccessResponse, AppError } = require('./helperFunction');

const getVillages = async (districtId, group) => {
    const whereClause = { district_id: districtId, isActive: true };

    const villages = await Village.findAll({
        where: whereClause,
        include: [{
            model: District,
            as: 'district',
            attributes: ['id', 'name'],
            include: [{
                model: Regency,
                as: 'regency',
                attributes: ['id', 'name'],
                include: [{
                    model: Province,
                    as: 'province',
                    attributes: ['id', 'name']
                }]
            }]
        }],
        attributes: ['id', 'name']
    });

    if (villages.length === 0) {
        throw new AppError("Data desa/kelurahan tidak ditemukan", 404);
    }

    const responseData = group
        ? { data: villages.map(v => v.toJSON()) }
        : { villages };

    return createSuccessResponse("Data desa/kelurahan berhasil didapat", responseData);
};


const getDistricts = async (regencyId, group) => {
    const whereClause = { regency_id: regencyId, isActive: true };

    const districts = await District.findAll({
        where: whereClause,
        include: [{
            model: Regency,
            as: 'regency',
            attributes: ['id', 'name'],
            include: [{
                model: Province,
                as: 'province',
                attributes: ['id', 'name']
            }]
        }],
        attributes: ['id', 'name']
    });

    if (districts.length === 0) {
        throw new AppError("Data kecamatan tidak ditemukan", 404);
    }

    const responseData = group
        ? { data: districts.map(d => d.toJSON()) }
        : { districts };

    return createSuccessResponse("Data kecamatan berhasil didapat", responseData);
};

const getRegencies = async (provinceId, group) => {
    const whereClause = { province_id: provinceId, isActive: true };

    const regencies = await Regency.findAll({
        where: whereClause,
        include: [{
            model: Province,
            as: 'province',
            attributes: ['id', 'name']
        }],
        attributes: ['id', 'name']
    });

    if (regencies.length === 0) {
        throw new AppError("Data kabupaten tidak ditemukan", 404);
    }

    const responseData = group
        ? { data: regencies.map(r => r.toJSON()) }
        : { regencies };

    return createSuccessResponse("Data kabupaten berhasil didapat", responseData);
};


const getProvinces = async () => {
    const provinces = await Province.findAll({
        where: { isActive: true },
        attributes: ['id', 'name']
    });

    if (provinces.length === 0) {
        throw new AppError("Data provinsi tidak ditemukan", 404);
    }

    return createSuccessResponse("Data provinsi ditemukan", { provinces });
};


module.exports = {
    getVillages,
    getDistricts,
    getRegencies,
    getProvinces
};