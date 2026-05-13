"use strict";

/** @see src/modules/rbac/user-roles/rbac-user-roles.model.js */
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "rbac_user_roles",
      {
        id: {
          type: Sequelize.INTEGER.UNSIGNED,
          autoIncrement: true,
          primaryKey: true,
        },
        user_id: {
          type: Sequelize.INTEGER.UNSIGNED,
          allowNull: false,
          references: { model: "users", key: "id" },
          onDelete: "CASCADE",
          onUpdate: "CASCADE",
        },
        role_id: {
          type: Sequelize.INTEGER.UNSIGNED,
          allowNull: false,
          references: { model: "rbac_roles", key: "id" },
          onDelete: "CASCADE",
          onUpdate: "CASCADE",
        },
        assigned_by: {
          type: Sequelize.INTEGER.UNSIGNED,
          allowNull: false,
          references: { model: "users", key: "id" },
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
            fields: ["user_id", "role_id"],
          },
        ],
      },
    );
  },

  async down(queryInterface) {
    await queryInterface.dropTable("rbac_user_roles");
  },
};
