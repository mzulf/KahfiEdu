'use strict';
const fs = require('fs');
const path = require('path');

module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      // Read JSON files
      const provincesData = JSON.parse(
        fs.readFileSync(path.join(__dirname, '../data/provinsi/provinsi.json'), 'utf-8')
      );

      // Transform provinces data to array of objects
      const provinces = Object.entries(provincesData).map(([id, name]) => ({
        id: parseInt(id),
        name,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }));

      // Insert provinces
      console.log('Seeding provinces...');
      await queryInterface.bulkInsert('provinces', provinces);

      // Read and insert regencies for each province
      console.log('Seeding regencies...');
      for (const province of provinces) {
        // Format province ID to 2 digits
        const formattedProvinceId = province.id.toString().padStart(2, '0');
        const regencyPath = path.join(__dirname, `../data/kabupaten_kota/kab-${formattedProvinceId}.json`);

        if (fs.existsSync(regencyPath)) {
          const regenciesData = JSON.parse(fs.readFileSync(regencyPath, 'utf-8'));

          const regencies = Object.entries(regenciesData).map(([id, name]) => ({
            // Format ID by combining province ID and regency ID
            id: parseInt(`${formattedProvinceId}${id.padStart(2, '0')}`),
            province_id: province.id,
            name,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
          }));

          await queryInterface.bulkInsert('regencies', regencies);
          console.log(`Seeded regencies for province ${province.name} (${formattedProvinceId})`);
        } else {
          console.warn(`No regency data found for province ${province.name} (${formattedProvinceId})`);
        }
      }

      // Read and insert districts
      console.log('Seeding districts...');
      const districtFiles = fs.readdirSync(path.join(__dirname, '../data/kecamatan/'));
      for (const file of districtFiles) {
        if (file.startsWith('kec-') && file.endsWith('.json')) {
          const districtsData = JSON.parse(
            fs.readFileSync(path.join(__dirname, `../data/kecamatan/${file}`), 'utf-8')
          );

          // Extract province and regency IDs from filename (kec-11-01.json)
          const [provinceId, regencyId] = file.replace('kec-', '').split('.')[0].split('-');
          const fullRegencyId = parseInt(`${provinceId}${regencyId}`);

          const districts = Object.entries(districtsData).map(([id, name]) => ({
            // Format ID by combining province ID, regency ID and district ID
            id: parseInt(`${provinceId}${regencyId}${id}`),
            regency_id: fullRegencyId,
            name,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
          }));

          await queryInterface.bulkInsert('districts', districts);
          console.log(`Seeded districts for regency ${fullRegencyId}`);
        }
      }

      // Read and insert villages in chunks
      console.log('Seeding villages...');
      const villageFiles = fs.readdirSync(path.join(__dirname, '../data/kelurahan_desa/'));
      for (const file of villageFiles) {
        if (file.startsWith('keldesa-') && file.endsWith('.json')) {
          const villagesData = JSON.parse(
            fs.readFileSync(path.join(__dirname, `../data/kelurahan_desa/${file}`), 'utf-8')
          );

          // Extract IDs from filename (keldesa-11-01-010.json)
          const [provinceId, regencyId, districtId] = file
            .replace('keldesa-', '')
            .split('.')[0]
            .split('-');

          const fullDistrictId = parseInt(`${provinceId}${regencyId}${districtId}`);

          const villages = Object.entries(villagesData).map(([id, name]) => ({
            // Format ID by combining all IDs (province + regency + district + village)
            id: parseInt(`${provinceId}${regencyId}${districtId}${id}`),
            district_id: fullDistrictId,
            name,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
          }));

          // Insert villages in chunks to handle large datasets
          for (let i = 0; i < villages.length; i += 1000) {
            const chunk = villages.slice(i, i + 1000);
            await queryInterface.bulkInsert('villages', chunk);
          }
          console.log(`Seeded villages for district ${fullDistrictId}`);
        }
      }

      console.log('Regional data seeding completed successfully!');

    } catch (error) {
      console.error('Seeder error:', error);
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    try {
      console.log('Rolling back regional data...');
      // Remove all data in reverse order
      await queryInterface.bulkDelete('villages', null, {});
      await queryInterface.bulkDelete('districts', null, {});
      await queryInterface.bulkDelete('regencies', null, {});
      await queryInterface.bulkDelete('provinces', null, {});
      console.log('Rollback completed successfully!');
    } catch (error) {
      console.error('Rollback error:', error);
      throw error;
    }
  }
};