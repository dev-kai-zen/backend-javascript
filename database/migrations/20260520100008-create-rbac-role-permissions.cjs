"use strict";

/** @see src/modules/rbac/role-permissions/rbac-role-permissions.model.js */
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "rbac_role_permissions",
      {
        id: {
          type: Sequelize.INTEGER.UNSIGNED,
          autoIncrement: true,
          primaryKey: true,
        },
        role_id: {
          type: Sequelize.INTEGER.UNSIGNED,
          allowNull: false,
          references: { model: "rbac_roles", key: "id" },
          onDelete: "CASCADE",
          onUpdate: "CASCADE",
        },
        permission_id: {
          type: Sequelize.INTEGER.UNSIGNED,
          allowNull: false,
          references: { model: "rbac_permissions", key: "id" },
          onDelete: "CASCADE",
          onUpdate: "CASCADE",
        },
        created_at: {
          type: Sequelize.DATE(3),
          allowNull: false,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP(3)"),
        },
        updated_at: {
          type: Sequelize.DATE(3),
          allowNull: false,
          defaultValue: Sequelize.literal(
            "CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)",
          ),
        },
        deleted_at: {
          type: Sequelize.DATE(3),
          allowNull: true,
        },
      },
      {
        charset: "utf8mb4",
        collate: "utf8mb4_unicode_ci",
        indexes: [
          {
            unique: true,
            fields: ["role_id", "permission_id"],
          },
        ],
      },
    );
  },

  async down(queryInterface) {
    await queryInterface.dropTable("rbac_role_permissions");
  },
};
