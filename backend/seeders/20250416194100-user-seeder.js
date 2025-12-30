'use strict';
const bcrypt = require("bcryptjs");
const { sequelize } = require("../models");
const { v4: uuidv4 } = require("uuid");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    const hashedPassword = await bcrypt.hash("12345678", 10);

    const [rolesAdmin] = await queryInterface.sequelize.query(
      `SELECT id FROM roles WHERE name = 'admin' LIMIT 1;`
    );
    const [rolesTeacher] = await queryInterface.sequelize.query(
      `SELECT id FROM roles WHERE name = 'teacher' LIMIT 1;`
    );
    const [rolesParent] = await queryInterface.sequelize.query(
      `SELECT id FROM roles WHERE name = 'parent' LIMIT 1;`
    );
    const [rolesStudent] = await queryInterface.sequelize.query(
      `SELECT id FROM roles WHERE name = 'student' LIMIT 1;`
    );

    const adminRoleId = rolesAdmin.length ? rolesAdmin[0].id : null;
    const studentRoleId = rolesStudent.length ? rolesStudent[0].id : null;
    const teacherRoleId = rolesTeacher.length ? rolesTeacher[0].id : null;
    const parentRoleId = rolesParent.length ? rolesParent[0].id : null;

    if (!adminRoleId || !studentRoleId || !teacherRoleId || !parentRoleId) {
      throw new Error("Role tidak ditemukan. Pastikan seed roles sudah dijalankan.");
    }
    // Insert a demo user into the users table
    await queryInterface.bulkInsert('users', [
      {
        id: uuidv4(),
        name: "Admin",
        email: "admin@example.com",
        alamat: "Jl. Merpati No. 03, Tanjung Jabung Barat, Jambi, Indonesia",
        password: hashedPassword,
        emailVerified: new Date(),
        roleId: adminRoleId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        name: "Student",
        email: "student@example.com",
        alamat: "Jl. Merpati No. 03, Tanjung Jabung Barat, Jambi, Indonesia",
        password: hashedPassword,
        emailVerified: new Date(),
        roleId: studentRoleId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        name: "Parent",
        email: "parent@example.com",
        alamat: "Jl. Merpati No. 03, Tanjung Jabung Barat, Jambi, Indonesia",
        password: hashedPassword,
        emailVerified: new Date(),
        roleId: parentRoleId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        name: "Teacher",
        email: "teacher@example.com",
        alamat: "Jl. Merpati No. 03, Tanjung Jabung Barat, Jambi, Indonesia",
        password: hashedPassword,
        emailVerified: new Date(),
        roleId: teacherRoleId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    // Remove the demo user from the users table
    await queryInterface.bulkDelete('users', null, {});
  }
};
